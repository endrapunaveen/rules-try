/*jshint node:true*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as it's web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
//var cfenv = require('cfenv');

// create a new express server
var app = express();


// The bank accounts with their balances.
var bankAccounts = {
  "Carl": 500,
  "Dana": -200,
  "Elmer": -300,
  "Frida": 1000
};

// The users with their information
var users = {
  Adam: {
      role: "Teller",
      branch: "Austin"
    },
  Betty: {
      role: "Teller",
      branch: "Boston"
    },
  Carl: {
      role: "Customer",
      branch: "Austin"
    },
  Dana: {
      role: "Customer",
      branch: "Austin"
    },
  Elmer: {
      role: "Customer",
      branch: "Boston"
    },
  Frida: {
      role: "Customer",
      branch: "Boston"
    }
};

// Object class for authorization request
var AuthzRequest = function(subject, verb, object) {
  this.subject = subject;
  this.verb = verb;
  this.object = object;
};


// Object class for authorization response
var AuthzResponse = function(answer) {
  this.answer = answer;
}


// Object class for functions, so they will be
// usable as "facts" within Nools
var FunObj = function(name, fun) {
  this.name = name;
  this.fun = fun;
}

// Security policy. The policy includes three parameters:
//
// Vars is the variables that make up the policy.
// Constants are the constants that may appear in the policy.
// (note, these are only required for the user interface)
//
// Rules are the actual rules. Each rule contains variables
// (enclosed in quotes to allow for dots within a variable name)
// and the values they need to match. They can be matched against
// constants or other variables. If the value of a variable does
// not matter for the rule, it does not appear in that rule.
//
// The rules are all permits. If a request does not match any rules,
// it is denied.
var secPolicy = {
  vars: ["subject.name", "subject.role", "subject.branch",
          "object.name", "object.role", "object.branch" ],
  constants: ["Teller", "Customer", "Austin", "Boston"],
  rules: [
    {   // The teller rule
      "subject.role": {type: "constant", value: "Teller"},
      "subject.branch": {type: "variable", value: "object.branch"}
    },
    {  // The customer rule
      "subject.role": {type: "constant", value: "Customer"},
      "subject.name": {type: "variable", value: "object.name"}
    }
  ]
};


// Get a value in a request from a rule style variable name
var getRequest = function(request, varName) {
  // The outer and inner variable names in the request
  // The rule has rule["subject.role"],
  // but the AuthorizationRequest has
  // request["subject"]["role"] for that
  reqVarNames = varName.split(".");

  // The value in the request value
  return request[reqVarNames[0]][reqVarNames[1]];
}


// Check if an authorization request matches a rule
var matchRuleRequest = function(ruleNumber, request) {
  var rule = secPolicy.rules[ruleNumber];
  console.log(rule);
  for (variable in rule) {
    console.log(' variable : '+variable);
    // Get the value
    var ruleValue = rule[variable];

    // If it is a constant, check equality to that constant
    if (ruleValue.type == "constant" &&
      ruleValue.value != getRequest(request, variable))
        return false;

    // If it is a variable, get the value in that variable
    // and compare
    if (ruleValue.type == "variable" &&
      getRequest(request, ruleValue.value)
      != getRequest(request, variable))
        return false;
  }

  // If we get here then there are no mismatches.
  return true;
};



// Use the Nools library
var nools = require('nools');

var flow;

// Do/redo the flow (rulebase) based on the current security policy
var redoFlow = function() {
  // If thre is an existing flow, delete it
  if (flow != undefined)
    nools.deleteFlow("authz");

  flow = nools.flow("authz", function(flow) {

    // Create rules from the policy
    for(var i=0; i<secPolicy.rules.length; i++) {
      this.rule("Rule #" + i,   // Rule name
        [
          // Find two facts, each with a pattern. The first fact,
          // match, just makes the matchRuleRequest function available
          // if the context of the matching pattern for the second
          // function, which checks if an rule matches the
          // authorization request.
          [FunObj, "match", "match.name == 'matchRuleRequest'"],
          [AuthzRequest, "req", "match.fun(" + i + ", req)"]
        ],
        function(facts) {
          // If we get here, the rule matches, so allow
          this.assert(new AuthzResponse(true));
        }
      );
    }
  });
};


// Do the flow for the initial security policy
redoFlow();

// The function that actually authorizes a user (subject)
// to do something, such as view the balance (verb)
// of an account (object).
var authorizeAction = function(subject, verb, object) {
  // Get additional information
  var subjectInfo = users[subject];
  var objectInfo = users[object];

  // Add the names to the information to make it easier
  // to use the rule base.
  subjectInfo.name = subject;
  objectInfo.name = object;

  // Create a new session. A session combines
  // a rule base with facts to arrive at a decision.
  var session = flow.getSession();

  console.log("Asking for authorization......");
  console.log("Subject:" + JSON.stringify(subjectInfo));
  console.log("Object:" + JSON.stringify(objectInfo));

  // Add an AuthzRequest fact to the session
  session.assert(new AuthzRequest(subjectInfo, verb, objectInfo));

  // Add a necessary function as a "fact"
  session.assert(new FunObj("matchRuleRequest", matchRuleRequest));

  // Call the flow for a decision
  session.match().then(
    function() {
      console.log("Successfully ran the flow");
    },
    function(err) {
      console.log("Error" + err);
    }
  );

  // Get the decision. session.getFacts(<type>) gets all the
  // facts of that type. In this case, there would be one
  // AuthzResponse.
  var resultList = session.getFacts(AuthzResponse);
  var decision;

  if (resultList.length == 0)
    // There would be no AuthzResponse if no rule triggered.
    // If no rule permits an action, it is denied.
    decision = false;
  else
    decision = resultList[0].answer;

  // Dispose of the session, delete all the facts
  session.dispose();

  return decision;
};

// The body-parser is necessary for creating new entities
// or updating existing ones. In both cases, the entity
// attributes appear as JSON in the HTTP request body.
var bodyParser = require('body-parser');


// Make accounts available through a REST interface to
// the application running on the browser
var restAcctPath = "/rest/acct";


// Provide information about bank accounts that should
// be visible to this user.
//
// Note: This is AMAZINGLY BAD security. Anybody can
// read the information that anybody else is authorized
// for if they just know their user name.
//
// A less silly bank would have had a real log on process,
// which would include a randomly generated temporary identifier
// sent to the authenticated user. Then, instead of the well
// known user ID, use that identifier, communicated securely
// over an SSL channel.
app.get(restAcctPath + "/:user", function(req, res) {
  // Result to send back to the browser
  var result = {};

  for (customer in bankAccounts)
    if (authorizeAction(req.params.user, "viewBalance", customer))
      result[customer] = bankAccounts[customer];

  res.send(result);
});


// Make the security policy available through a REST interface to
// the application running on the browser. On a production system,
// this would be available only to authorized users.
var restPolicyPath = "/rest/policy";


// Provide the security policy.
//
// Note: Terrible security. There is no authentication or
// authorization here.
app.get(restPolicyPath, function(req, res) {
  res.send(secPolicy);
});


// Allow clients to modify the security policy
//
// Note: Even worse security. Anybody with the URL can give
// themselves any permissions they'd like.
app.put(restPolicyPath, bodyParser.json(), function(req, res) {
  secPolicy = req.body;
  redoFlow();
  res.send();
});





// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = {"port": 8080}; // cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, // appEnv.bind, 
  function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
