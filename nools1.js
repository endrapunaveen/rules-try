// Use the Nools library
var nools = require('nools');


// Object class for authorization request
var AuthzRequest = function(subject, verb, object) {
  this.subect = subject;
  this.verb = verb;
  this.object = object;
};
 
 
// Object class for authorization response
var AuthzResponse = function(answer) {
  this.answer = answer;
}
 

// Create a new flow, a rule base.
// Be permissive
var flow = nools.flow("authz", function(flow) {
 
  this.rule("Permissive", // Rule name
 
  // The facts on which the rule operates. If the list
  // for a fact has two items, the first is the object class
  // and the second is the variable name. If it has three, the
  // the third is a condition that has to evaluate to true for the
  // rule to be applied.
  //
  // When there is only one fact, it can be in an un-nested list,
  // the nested list here is just for illustration of the general
  // case with multiple facts.
    [[AuthzRequest, "req"]],
 
 
    // The function to call if the rule is fulfilled
    function(facts) {
 
      // The parameter contains the facts.
       
      // Prove we got the parameter
      console.log(facts.req.verb);
       
      // Always allow
      this.assert(new AuthzResponse(true));
    }
  );


  this.rule("Teller", // Rule name
 
  // Notice the added third member of the list, to restrict
  // this rule to cases where the subject is a teller.
    [[AuthzRequest, "req", "req.subject.role=='Teller'"]],
 
 
    // The function to call if the rule is fulfilled
    function(facts) {
      // Allow if the subject and object share the
      // same branch.
      this.assert(new AuthzResponse(
        facts.req.subject.branch == facts.req.object.branch));
    }
  );
 
  this.rule("Customer", // Rule name
 
  // Notice the added third member of the list, to restrict
  // this rule to cases where the subject is a customer.
    [[AuthzRequest, "req", "req.subject.role=='Customer'"]],
 
 
    // The function to call if the rule is fulfilled
    function(facts) {
      // Allow if the subject and object have the same name,
      // let the customer see his/her own balance.
      this.assert(new AuthzResponse(
        facts.req.subject.name == facts.req.object.name));
    }
  );

});

// Create a new session. A session combines
// a rule base with facts to arrive at a decision.
		//var session = flow.getSession();
 
// Add facts to the session
//session.assert("Hello");
//session.assert("Goodbye");

// Add an AuthzRequest fact to the session
	//session.assert(new AuthzRequest("subject", "verb", "object"));

 
// Attempt to use the rule base
/*
session.match().then(
  function() {
    console.log("Successfully ran the flow");
  },
  function(err) {
    console.log("Error" + err);
  }
);

console.log(session.getFacts(AuthzResponse));
 
// Dispose of the session, delete all the facts to make it
// usable in the future
session.dispose();
*/