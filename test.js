var nools = require("nools");

var _ = require('lodash');

var str = undefined;

console.log(_.isEmpty(str));
console.log(!str || !str.replace(/^\s+/g, '').length);

/*
var Message = function (message) {
    this.text = message;
};


var flow = nools.flow("Hello World", function (flow) {
  this.rule("Hello4", {salience: 7}, [Message, "m", "m.name == 'Hello'"], function (facts) {
  });

  this.rule("Hello3", {salience: 8}, [Message, "m", "m.name == 'Hello'"], function (facts) {
  });

  this.rule("Hello2", {salience: 9}, [Message, "m", "m.name == 'Hello'"], function (facts) {
  });

  this.rule("Hello1", {salience: 10}, [Message, "m", "m.name == 'Hello'"], function (facts) {
  });
}

var fired = [];
flow1
    .getSession(new Message("Hello"))
    .on("fire", function (name) {
        fired.push(name);
    })
    .match()
    .then(function(){
        console.log(fired); //["Hello1", "Hello2", "Hello3", "Hello4"]
    });
*/
