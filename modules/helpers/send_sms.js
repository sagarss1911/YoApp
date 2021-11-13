let https = require('https'),
    request = require('request');
    url = require('url');



let sms = (message, phone) => {    
    var msgbody  ="Thanks for using Flocco! Your OTP is "+message+". Please do not share your OTP with anyone else. Have a great day."
    var options = {
      'method': 'POST',
      'url': process.env.SMSURL,
      'headers': {
        'Authorization': process.env.SMSAUTHORIZATION,
        'Content-Type': 'text/plain'
      },
      body: '{\r\n       "from": "Flocco",\r\n       "body": "'+msgbody+'",\r\n       "direct": false,	\r\n       "recipient": [    \r\n            {\r\n                "to": "'+phone+'"\r\n            }\r\n        ],\r\n       "type": "sms",\r\n       "reference": "XOXO",\r\n       "validity": "30",\r\n       "type_details": "",\r\n       "data_coding": "plain",\r\n       "flash_message": false,\r\n       "campaign_id": "43261606",\r\n       "template_id": 757\r\n} '
    
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      return response.body;
    });
};

module.exports = {
  
    sms             : sms
}
