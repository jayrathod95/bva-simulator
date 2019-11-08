var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/bva',function (req, res) {

  var uuid1 = Math.floor(Math.random()*100000000);
  var uuid2 = Math.floor(Math.random()*100000000);
  var uuid3 = Math.floor(Math.random()*100000000);
  var uuid4 = Math.floor(Math.random()*100000000);
  var uuid5 = Math.floor(Math.random()*100000000);

  var clientId = '3MVG9qwrtt_SGpCvjWgjr6iTlzasfEXKEX4CpJH697tmvMKY_REcAosImBkFzgWdcPlPrh2WpNZt6sT51CMzi';
  var clientSecret = '6B910DEF3E10F6CCE4D976A6E9FA94BFA5182C2048B0EC16EAAE51BCA562B3E5';
  var username = 'integration.user@abbvie.com.pap.rhfd';
  var password = 'newuser@123456';
  //authenticate with sf
  var data = `grant_type=password&client_id=${clientId}&client_secret=${clientSecret}&username=${username}&password=${password}`;
  axios.post('https://test.salesforce.com/services/oauth2/token',data).then(response => {
    console.info(response.data);
    //console.info(response.data.access_token);

    //call bva-inbound
    var data = {
      "Patient": {
        "transactionType": "BVS",
        "transactionMessage": "Eligibility and Benefits Found",
        "subscriber": "PPM",
        "puslisherRequestId": req.body.Referral.PublisherReferralId,
        "publisher": "BVA",
        "dateSent": req.body.Referral.DateSent,
        "publisherId": req.body.Referral.Patient.PublisherPatientId,
        "patientDiagnosisAndTreatments": [{
          "publisherId": ""+uuid5,
          "ndc": req.body.Referral.Diagnosis.Prescriptions.Prescription.Drug.NDC,
          "drugName": req.body.Referral.Diagnosis.Prescriptions.Prescription.Drug.DrugName,
        }],
        "memberPlans": [{
          "publisherId": `${uuid1}`,
          "rxPCN": "73732887",
          "rxGroupNumber": "73732887",
          "rxBIN": "73732887",
          "relationshipToCardholder": "Cardholder",
          "planType": "Commercial",
          "planSubType": "Employer",
          "insuranceType": "Pharmacy Plan",
          "insuranceRank": 1,
          "insurancePlanPhone": 9878786511,
          "insuranceName": "Rose R",
          "endDate": "2019-07-28",
          "employerName": "AbbVie",
          "effectiveDate": "2018-07-10",
          "disadvantagePlan": true,
          "cardholderOrPolicyID": "MID809",
          "cardHolderName": "Rose R",
          "disadvantageAccessReason": "Affordability"
        }		],
        "priorAuthorizations": [{
          "publisherId": ""+uuid2,
          "statusforVariableParagraph": "Approved with Expiration",
          "statusDate": "2019-03-29",
          "status": "PA Approved",
          "planPhoneNumber": "9898989892",
          "planName": "PA for Bridge 4",
          "planFaxNumber": "9898989898",
          "patientInsuranceId": ""+uuid1,
          "formURL": "https://master-api.integration.covermymeds.com/forms/pdf/thumbs/270/pseudo_4part_28520.jpg",
          "formName": "pseudo_4part"
        }],
        "memberBenefits": [{
          "publisherId": ""+uuid3,
          "specialtyPharmacyOptions": "One Mandated Pharmacy 10",
          "publisherMemberPlanId": ""+uuid1,
          "priorAuthorizationRequired": "Yes",
          "pharmacyMedicalAnnualOOPMetToDate": 1250.0,
          "pharmacyMedicalAnnualOOP": 13030.0,
          "pharmacyCopay": 1210.0,
          "pharmacyAnnualDeductibleMetToDate": 1451.0,
          "pharmacyAnnualDeductible": 1510.0,
          "patientResponsibility": "Copayment",
          "patientPharmacies": [{
            "publisherId":""+uuid4,
            "transactionType": "BVS",
            "publisherMemberPlanId": ""+uuid1,
            "pharmacyZipCode": "70185",
            "pharmacyState": "IL",
            "pharmacyPhone": "8898985419",
            "pharmacyName": "June Patient Pharmacy 3",
            "pharmacyFax": "4490105419",
            "pharmacyCity": "Waukegan",
            "pharmacyAddressLine2": "Suite 01",
            "pharmacyAddressLine1": "2 lake street"
          }],
          "coverageStatus": "Not Covered",
          "benefitsSource": "New"
        }]
      }
    };

    setTimeout(()=>{
      axios.put(`${response.data.instance_url}/services/apexrest/dataexchange/v1/bvs`,data,{headers: {'Content-Type':'application/json','Authorization':`Bearer ${response.data.access_token}`}}).then(response => {
        console.log(response.data);
      },reason => {
        console.error(reason);
      })
    },10000);

  },reason => {
    console.error(reason);
  });
  res.send(req.body);

/*  axios.post('https://reqres.in/api/users',{
    "name": "morpheus",
    "job": "leader"
  }).then(function (value) {
    req.send(value);
  })*/

});

module.exports = router;
