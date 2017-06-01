var jexl = require('Jexl');
var _ = require('lodash');
var JSONPath = require('jsonpath-plus');

var inputJson = {
  "commercialHierarchy": "G76DM",
  "transactionId": "1706fae7-5f0c-4f37-8630-5fc92edd8232",
  "isOwnLabel": "true",
  "brand": "FINEST ORGANIC",
  "crossItemReference": {
    "vendorPartNumber": "Oil008",
    "supplierNumber": "12345"
  },
  "gtinInfo": {
    "gtin": null,
    "gtinType": "EAN-13",
    "gtinStart": null,
    "gtinEnd": null
  },
  "descriptionList": [
    {
      "descType": "product",
      "descValue": "Tesco Finest Roasted Chilli Peanuts 450g \" ® ® "
    },
    {
      "descType": "sel1",
      "descValue": "Tesco"
    },
    {
      "descType": "sel2",
      "descValue": "Chocolate Cereal $"
    },
    {
      "descType": "sel3",
      "descValue": "750g"
    },
    {
      "descType": "till",
      "descValue": "Roast Chilli"
    },
    {
      "descType": "scales1",
      "descValue": null
    },
    {
      "descType": "scales2",
      "descValue": null
    },
    {
      "descType": "scales3",
      "descValue": null
    },
    {
      "descType": "scales4",
      "descValue": null
    },
    {
      "descType": "suffix",
      "descValue": null
    }
  ],
  "soldInCountriesList": [
    {
      "countryCode": "GB"
    }
  ],
  "dateList": [
    {
      "name": "targetLaunch",
      "date": "2017-04-16"
    }
  ],
  "sellByType": "Item",
  "promotionType": "Standard",
  "tradeItemType": {
    "isSellable": true,
    "isOrderable": true
  },
  "productAttributes": [
    {
      "groupName": "productContents",
      "internalNames": [
        {
          "internalName": "hasDrainedWeight",
          "value": "N"
        }
      ]
    },
    {
      "groupName": "productPackaging",
      "internalNames": [
        {
          "internalName": "packagingType",
          "value": "Box"
        }
      ]
    },
    {
      "groupName": "productOrigin",
      "internalNames": [
        {
          "internalName": "countryOfOriginCode",
          "value": "GB"
        },
        {
          "internalName": "countryOfOriginName",
          "value": "United Kingdom"
        }
      ]
    },
    {
      "groupName": "productCare",
      "internalNames": [
        {
          "internalName": "hasShelfLife",
          "value": "Y"
        },
        {
          "internalName": "shelfLifeDays",
          "value": "70"
        },
        {
          "internalName": "minLifeDepotDays",
          "value": "90"
        },
        {
          "internalName": "maxCustStorageDays",
          "value": null
        }
      ]
    },
    {
      "groupName": "productContents",
      "internalNames": [
        {
          "internalName": "drainedWeight",
          "value": null
        },
        {
          "internalName": "netContents",
          "value": "50.0"
        },
        {
          "internalName": "contentsUom",
          "value": "kg"
        }
      ]
    },
    {
      "groupName": "generalAlcohol",
      "internalNames": [
        {
          "internalName": "exciseProductType",
          "value": null
        },
        {
          "internalName": "exciseProductCode",
          "value": null
        },
        {
          "internalName": "fiscalCode",
          "value": null
        },
        {
          "internalName": "alcoholVolumePercent",
          "value": null
        },
        {
          "internalName": "tariffCode",
          "value": null
        }
      ]
    },
    {
      "groupName": "episel",
      "internalNames": [
        {
          "internalName": "episelDesc1",
          "value": null
        },
        {
          "internalName": "episelDesc2",
          "value": null
        },
        {
          "internalName": "episelDesc3",
          "value": null
        },
        {
          "internalName": "episelDesc4",
          "value": null
        },
        {
          "internalName": "episelDesc5",
          "value": null
        }
      ]
    }
  ]
};

const V_POPULATION_CHECK = "Population Check";
const V_MAX_LENGTH_CHECK = "Max Length Check";
const V_REGEX_CHECK = "Regex Check";

var checkTypes = [
	{
		"name" : "Population Check",
		"description": "Used to check that a field is not blank. The check will fail if the field does not contain any data."
	},
	{
		"name" : "No Data Check",
		"description": "Used to check that a field is blank. The check will fail if the field contains any data."
	},
	{
		"name" : "Character Check",
		"description": "Used to check that data in a field contains only characters from the specified list.",
	},
	{
		"name" : "Invalid Character Check",
		"description" : "Used to check that data in a field does not contain any characters from the specified list."
	},
	{
		"name" : "Min Length Check",
		"description" : "Used to specify a minimum length for string data in a field"
	},
	{
		"name" : "Max Length Check",
		"description" : "Used to specify a maximum length for string data in a field"
	},
	{
		"name" : "List Check",
		"description" : "Used to check that data in a field contains only values from the specified list."
	},
	{
		"name" : "Invalid List Check",
		"description" : "Used to check that data in a field does not contain any values from the specified list."
	},
	{
		"name" : "Regex Check",
		"description" : "Used to check that data in a field conforms to a regular expression."
	},
	{
		"name" : "Invalid Regex Check",
		"description" : "Used to check that data in a field does not conform to a regular expression."
	},
	{
		"name" : "Script",
		"description" : "Used to specify an external javascript which will perform processing on the data."
	}
];

var checks = [
	{
		"checkName" : "chPopulated",
		"checkType" : "Population Check",
	},
	{
		"checkName" : "chGreaterThan10Char",
		"checkType" : "Max Length Check",
		"option1" : 10
	},
	{
		"checkName" : "chGreaterThan1Char",
		"checkType" : "Min Length Check",
		"option1" : 2
	},
	{
		"checkName" : "chSpecialChars",
		"checkType" : "Regex Check",
		"option1" : "[^a-zA-Z0-9&!%,.()+\\'\\/\\-*\\\"?\\s]"
	}
];

var businessRules = [{
		"ruleName" : "chIfSel1DescPopulated",
		"ruleDesc" : "Check if Description is Populated",
		"disable" : "",
		"applyToAttributes" : ["product", "sel1", "sel2", "sel3", "till", 
			"scales1", "scales2", "scales3", "scales4", "suffix"],
		"errorCode" : "emptyDescError",
		"errorMsg" : "%s Description is Empty",
		"check1" : "chPopulated"
	},
	{
		"ruleName" : "chIfSel1DescPopulated",
		"ruleDesc" : "Check if Description is > 10 char",
		"disable" : "",
		"applyToAttributes" : ["product", "sel1", "sel2", "sel3", "till", 
			"scales1", "scales2", "scales3", "scales4", "suffix"],
		"errorCode" : "maxLengthDescError",
		"errorMsg" : "%s Description is > %s char",
		"check1" : "chGreaterThan10Char"
	},
	{
		"ruleName" : "chIfDescHasSpecialChars",
		"ruleDesc" : "Check if Description has special chars",
		"disable" : "",
		"applyToAttributes" : ["product", "sel1", "sel2", "sel3", "till", 
			"scales1", "scales2", "scales3", "scales4", "suffix"],
		"errorCode" : "specialCharsDescError",
		"errorMsg" : "%s Description has special chars : %s",
		"check1" : "chSpecialChars"
	}
];

/* 	If the inputField contains data return pass
	if the inputField does not contain any data return fail
 */
function populationCheck(inputField){
	if(!inputField || !inputField.replace(/^\s+/g, '').length) {
		return 'fail';
	} else {
		return 'pass';
	}
}


/* 	If inputField data length is > maxSize return fail
	If inputField data length is  <= maxSize return pass
 */
function checkMaxLength(inputField, maxSize){
	if(inputField && inputField.length > maxSize) {
		return 'fail';
	} else {
		return 'pass';
	}
}

/* 	If inputField data length is > maxSize return fail
	If inputField data length is  <= maxSize return pass
 */
function checkRegexValidation(inputField, permittedChars){

	var flags = 'ig';
	var strFilterRegEx = new RegExp(permittedChars, flags);
	
	var res = (populationCheck(inputField) == 'pass') ? inputField.match(strFilterRegEx) : null;
	
	if(res !== null) {
		return {'checkStatus' : 'fail', 'checkResult' : res};
	} else {
		return {'checkStatus' : 'pass', 'checkResult' : res};
	}
};

var businessRulesChecksArray = _.map(businessRules, function(obj) {
    return _.assign(obj, _.find(checks, {
        checkName: obj.check1
    }));
});

//console.log(businessRulesChecksArray);
var res = '';
businessRulesChecksArray.forEach(function (businessRule) {
	//console.log(businessRule.check1);
	res = '';
	switch (businessRule.checkType) {
		case V_POPULATION_CHECK:
			businessRule.applyToAttributes.forEach(function(attr){
				var attrValue = JSONPath({json: inputJson, path: 'descriptionList[?(@.descType=="'+
					attr +'")].descValue'})[0];
				res = populationCheck(attrValue);
				if (res == 'fail') {
					console.log(businessRule.errorMsg, attr);
				}
			});
			break;
		case V_MAX_LENGTH_CHECK:
			businessRule.applyToAttributes.forEach(function(attr){
				var attrValue = JSONPath({json: inputJson, path: 'descriptionList[?(@.descType=="'+
					attr +'")].descValue'})[0];
				res = checkMaxLength(attrValue, businessRule.option1);
				//console.log(businessRule.applyToAttributes + " : " + attrValue + "  ::  "  + businessRule.checkType + "  " + res);
				if (res == 'fail') {
					console.log(businessRule.errorMsg, attr, businessRule.option1);
				}
			});
			break;
		case V_REGEX_CHECK:
			businessRule.applyToAttributes.forEach(function(attr){
				var attrValue = JSONPath({json: inputJson, path: 'descriptionList[?(@.descType=="'+
					attr +'")].descValue'})[0];
				res = checkRegexValidation(attrValue, businessRule.option1);
				//console.log(businessRule.applyToAttributes + " : " + attrValue + "  ::  "  + businessRule.checkType + "  " + res);
				if (res.checkStatus == 'fail') {
					console.log(businessRule.errorMsg, attr, res.checkResult);
				}
			});
	}
});

var rules = [
	{
		"name" : "sel1DescLengthCheck",
		"desc" : "Check if Sel1 Description is greater than 10 chars",
		"type" : "Validation",
		"severity" : "Error",
		"ifExpression" : "",
		"validationCondition" : 'descriptionList[.descType == "sel1"].descValue.length > 10',
		"errorMsg" : "Sel1 Description is > 10 chars"
	},
	{
		"name" : "prodDescLengthCheck",
		"desc" : "Check if prod Description is greater than 10 chars",
		"type" : "Validation",
		"severity" : "Error",
		"ifExpression" : "",
		"validationCondition" : 'descriptionList[.descType == "product"].descValue.length > 10',
		"errorMsg" : "Prod Description is > 10 chars"
	},
	{
		"name" : "DescSpecialCharsCheck",
		"desc" : "Check if Description has special chars",
		"type" : "Function",
		"severity" : "Error",
		"ifExpression" : "",
		"validationCondition" : 'checkForInvalidChars(\'descriptionList[?(@.descType==\"product\")].descValue\', \"^a-zA-Z0-9&!%,.()+\'\\"\/\-?\\\t\\\\r\\\\n \")',
		"errorMsg" : "Prod Description has following special characters : "
	},
	{
		"name" : "DescSpecialCharsCheck",
		"desc" : "Check if Description has special chars",
		"type" : "Function",
		"severity" : "Error",
		"ifExpression" : "",
		"validationCondition" : 'checkForInvalidChars(\'descriptionList[?(@.descType==\"sel1\")].descValue\', \"^a-zA-Z0-9&!%,.()+\'\\"\/\-?\\\t\\\\r\\\\n \")',
		"errorMsg" : "Sel1 Description has following special characters : "
	}
];

function checkForInvalidChars(input, permittedChars) {
	var inputValue = JSONPath({json: inputJson, path: input})[0]
	permittedChars = '[' + permittedChars + ']';
	var flags = 'ig';
	var strFilterRegEx = new RegExp(permittedChars, flags);
	
	var res = inputValue.match(strFilterRegEx);
	
	return res;
}

function executeRule(rule, inputJson) {
	if (rule.type == 'Validation') {
		jexl.eval(rule.validationCondition, inputJson).then(function(res) {
			console.log(res + " :::: "+rule.errorMsg);
		});	
	} else {
		var res = eval(rule.validationCondition);
		if (res !== null) {
			console.log(rule.errorMsg + res);
		}
	}
}

/*
rules.forEach(function(rule) {
	executeRule(rule, inputJson);
});
*/
