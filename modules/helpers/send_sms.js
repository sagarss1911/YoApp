const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
let sms = async (message, phone) => {   
  let msgbody  ="Thanks for using Alcophony, Your OTP is "+message+". Please do not share your OTP with anyone else. Have a great day."
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: phone 
       });
  return sentmessage.sid
};
let paymentSuccessSMS = async (amount, phone) => {   
  let msgbody  ="Thanks for using Alcophony, Your Transaction with Amount "+amount+" D is Successfully Done. Have a great day."
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: phone 
       });
  return sentmessage.sid
};
let paymentFailedSMS = async (amount, phone) => {   
  let msgbody  ="Thanks for using Alcophony, Your Transaction with Amount "+amount+" D is Failed."
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: phone 
       });
  return sentmessage.sid
};
let paymentCancelledSMS = async (amount, phone) => {   
  let msgbody  ="Thanks for using Alcophony, Your Transaction with Amount "+amount+" D is Cancelled."
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: phone 
       });
  return sentmessage.sid
};
let paymentReceivedWithoutAccount = async (amount, phone,reference_id) => {   
  let msgbody = "Someone Sent Money To Your Alcophony Account. Your Transaction with Amount "+amount+" D is Successfully Done. Have a great day. Please use reference id: "+reference_id+" While Creating Account. Download the app from:"  
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: phone 
       });
  return sentmessage.sid
};
let paymentSentSMS = async (amount, senderPhone,reeceiverPhone) => {   
  let msgbody  ="You have successfully sent money to "+reeceiverPhone+" with amount "+amount+" D."
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: senderPhone
       });
  return sentmessage.sid
};
let paymentReceivedSMS = async (amount, senderPhone,receiverPhone) => {   
  let msgbody  ="you have received money to your Wallet  from "+senderPhone+" with amount "+amount+" D."
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: receiverPhone
       });       
  return sentmessage.sid
};
let paymentCashPickUpSenderSMS = async (amount, senderPhone,receiverPhone,trans_id) => {   
  let msgbody  ="Cash Pickup Request Received for " + receiverPhone + " with amount: "+amount + " D. Use Transaction ID: "+ trans_id + " Please Do Not Share With Anyone."
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: senderPhone
       });       
  return sentmessage.sid
};
let paymentCashPickUpReceiverSMS = async (amount, senderPhone,receiverPhone,trans_id) => {   
  let msgbody  ="You have received Cash Pickup Request from " + senderPhone + " with amount: "+amount + " D. Use Transaction ID: "+ trans_id+ " Please Do Not Share With Anyone."
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: receiverPhone
       });       
  return sentmessage.sid
};

let paymentBankTransferSenderSMS = async (amount, senderPhone,receiverPhone,trans_id) => {   
  let msgbody  ="Bank Transfer Request Generated for " + receiverPhone + " with amount: "+amount + " D. Use Transaction ID: "+ trans_id + " Amount will be credited in 3-5 Working Days Please Do Not Share With Anyone."
  
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: senderPhone
       });       
  return sentmessage.sid
};
let paymentBankTransferReceiverSMS = async (amount, senderPhone,receiverPhone,trans_id) => {   
  let msgbody  ="You have received Bank Transfer Request from " + senderPhone + " with amount: "+amount + " D. Use Transaction ID: "+ trans_id+" Amount will be credited in 3-5 Working Days Please Do Not Share With Anyone."
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: receiverPhone
       });       
  return sentmessage.sid
};
let paymentMobileRechargeRequestSubmittedSMS = async (amount, senderPhone,receiverPhone,trans_id) => {   
  let msgbody  ="Recharge Request Successfully Submitted for " + receiverPhone + " With Amount D"+amount + ". Use Reference ID: "+ trans_id
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: senderPhone
       });       
  return sentmessage.sid
};
module.exports = {
    sms: sms,
    paymentSuccessSMS:paymentSuccessSMS,
    paymentFailedSMS:paymentFailedSMS,
    paymentCancelledSMS:paymentCancelledSMS,
    paymentReceivedWithoutAccount:paymentReceivedWithoutAccount,
    paymentSentSMS:paymentSentSMS,
    paymentReceivedSMS:paymentReceivedSMS,
    paymentCashPickUpSenderSMS:paymentCashPickUpSenderSMS,
    paymentCashPickUpReceiverSMS:paymentCashPickUpReceiverSMS,
    paymentBankTransferSenderSMS:paymentBankTransferSenderSMS,
    paymentBankTransferReceiverSMS:paymentBankTransferReceiverSMS,
    paymentMobileRechargeRequestSubmittedSMS:paymentMobileRechargeRequestSubmittedSMS

}
