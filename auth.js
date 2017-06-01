/*
var authorizeAction = function(subject, verb, object) {
  // Get additional information
  var subjectInfo = users[subject];
  var objectInfo = users[object];
 
  // Let customers see their own balance, and tellers
  // the balances of everybody in their branch.
  if (subjectInfo.role == "Teller")
    return subjectInfo.branch == objectInfo.branch;
  else if (subjectInfo.role == "Customer")
    return subject == object;
 
  // If no rule allows access, deny it.
  return false;
};
*/

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
 
  // Add an AuthzRequest fact to the session
  session.assert(new AuthzRequest(subjectInfo, verb, objectInfo));
 
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
 
  // Dispose of the session, delete all the facts to make it
  // usable in the future
  session.dispose();
 
  return decision;
};