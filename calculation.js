'use strict';
 
const nools = require('nools');
var _ = require('lodash');

const flow = nools.compile("./calculations.nools");
 
const Variable = flow.getDefined("Variable");
 
const session = flow.getSession();

var myString = 'Naveen * 123  " \'  ® ® £ ) cool`';


var permittedChars = '^a-zA-Z0-9&!%,.()+\'\/\\-*\"?\\t\\r\\n ';
permittedChars = '[' + permittedChars + ']';

var flags = 'ig';
var strFilterRegEx = new RegExp(permittedChars, flags);
console.log(strFilterRegEx);

// /[^a-zA-Z0-9&!%,.()+%,.()+\/\-*\"?\t\r\n ]/ig
   /[^a-zA-Z0-9&!%,.()+/-\"?\t\r\n ]/
var res = myString.match(strFilterRegEx);
console.log(res);

var inutJson = {
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
      "descValue": "Tesco Finest Roasted Chilli Peanuts 450g ®"
    },
    {
      "descType": "sel1",
      "descValue": "Tesco"
    },
    {
      "descType": "sel2",
      "descValue": "Chocolate Cereal"
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


var regexpList =
[
    {attrName: "product", regExp:  '^a-zA-Z0-9&!%,.()+\'\/\\-*\"?\\t\\r\\n '},
    {attrName: "suffix", regExp:  '^a-zA-Z0-9&!%,.()+\'\/\\-*\"?\\t\\r\\n '},
    {attrName: "sel1", regExp:  '^a-zA-Z0-9&!%,.()+\'\/\\-*\"?\\t\\r\\n '},
    {attrName: "sel2", regExp:  '^a-zA-Z0-9&!%,.()+\'\/\\-*\"?\\t\\r\\n '},
    {attrName: "sel3", regExp:  '^a-zA-Z0-9&!%,.()+\'\/\\-*\"?\\t\\r\\n '},
    {attrName: "till", regExp:  '^a-zA-Z0-9&!%,.()+\'\/\\-*\"?\\t\\r\\n '}
];


var permittedChars = '^a-zA-Z0-9&!%,.()+\'\/\\-*\"?\\t\\r\\n ';
permittedChars = '[' + permittedChars + ']';

var flags = 'ig';
var strFilterRegEx = new RegExp(permittedChars, flags);



console.log(_.find(inutJson.descriptionList, {"descType": "product1"}));
var product = '';
for (var desc in inutJson.descriptionList) {
    product = new Variable(inutJson.descriptionList[desc].descType, inutJson.descriptionList[desc].descValue, '' );
    session.assert(product);
}

 

session.match().then(
    function() {
        session.getFacts().forEach((fact) => {
            console.log("%s: %s", fact.attrName, fact.attrValue);
        });
        session.dispose();
    },
    function(err) {
        session.dispose();
        console.error(err.stack);
    });

/*

var fired2 = [];

flow
    .getSession(new Variable('description', 'Naveen 123'))
    .focus("ag1")
    .on("fire", function (ruleName) {
        fired2.push(ruleName);
    })
    .match(function () {
        console.log("Example 2", fired2); //[ 'Hello World2', 'Hello World' ]
    });
*/