const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
let axios = require("axios")
let commonSMS = async (message, phone) => {
  //twillio first and if it fails send sms from alcophony
  try {
    let sentmessage = await client.messages
      .create({
        body: message,
        messagingServiceSid: process.env.MESSAGE_SERVICE_SID,
        to: phone
      });    
    return sentmessage.sid

  }
  catch (e) {
    console.log(e)
    let Url = "https://alchemytelco.com:9443/api?action=sendmessage&originator=alchemy&username=" + process.env.ALCOPHONY_INTERNAL_SMS_USERNAME + "&password=" + process.env.ALCOPHONY_INTERNAL_SMS_PASSWORD + "&recipient=" + phone + "&messagetype=SMS:TEXT&messagedata=" + message
    const headers = {
      'Content-Type': 'application/json',
    };
    await axios.get(Url, { headers: headers })
}
  // //alcophony first and if it fails send sms from twillio
  // let Url = "https://alchemytelco.com:9443/api?action=sendmessage&originator=alchemy&username=" + process.env.ALCOPHONY_INTERNAL_SMS_USERNAME + "&password=" + process.env.ALCOPHONY_INTERNAL_SMS_PASSWORD + "&recipient=" + phone + "&messagetype=SMS:TEXT&messagedata=" + message
  // const headers = {
  //   'Content-Type': 'application/json',
  // };
  // let sentSMSData = await axios.get(Url, { headers: headers })
  // if (sentSMSData.data.response.data.acceptreport.statuscode > 0) {
  //   let sentmessage = await client.messages
  //     .create({
  //       body: message,
  //       messagingServiceSid: process.env.MESSAGE_SERVICE_SID,
  //       to: phone
  //     });
  //   return sentmessage.sid

  // } else {
  //   return sentSMSData.data.response.data.acceptreport.messageid    
  // }

}
let sms = async (message, phone) => {
  let msgbody = "Thanks for using Alcophony, Your OTP is " + message + ". Please do not share your OTP with anyone else. Have a great day."
  return commonSMS(msgbody, phone)
};
let paymentSuccessSMS = async (amount, phone) => {
  let msgbody = "Thanks for using Alcophony, Your Transaction with Amount " + amount + " D is Successfully Completed. Have a great day."
  return commonSMS(msgbody, phone)
};
let paymentFailedSMS = async (amount, phone) => {
  let msgbody = "Thanks for using Alcophony, Your Transaction with Amount " + amount + " D is Failed."
  return commonSMS(msgbody, phone)
};
let paymentCancelledSMS = async (amount, phone) => {
  let msgbody = "Thanks for using Alcophony, Your Transaction with Amount " + amount + " D is Cancelled."
  return commonSMS(msgbody, phone)
};
let paymentReceivedWithoutAccount = async (amount, phone, reference_id) => {
  let msgbody = "Someone Sent Money To Your Alcophony Account. Your Transaction with Amount " + amount + " D is Successfully Completed. Have a great day. Please use reference id: " + reference_id + " While Creating Account. Download the app from:"
  return commonSMS(msgbody, phone)
};
let paymentSentSMS = async (amount, senderPhone, reeceiverPhone) => {
  let msgbody = "You have successfully sent money to " + reeceiverPhone + " with amount " + amount + " D."
  return commonSMS(msgbody, senderPhone)
};
let paymentReceivedSMS = async (amount, senderPhone, receiverPhone) => {
  let msgbody = "you have received money to your Wallet  from " + senderPhone + " with amount " + amount + " D."
  return commonSMS(msgbody, receiverPhone)
};
let paymentCashPickUpSenderSMS = async (amount, senderPhone, receiverPhone, trans_id) => {
  let msgbody = "Cash Pickup Request Generated for " + receiverPhone + " with amount: " + amount + " D. Use Transaction ID: " + trans_id + " Please Do Not Share With Anyone."
  return commonSMS(msgbody, senderPhone)
};
let paymentCashPickUpCompletedMerchantSMS = async (amount, senderPhone, receiverPhone) => {
  let msgbody = "Cash Pickup Request Completed for " + receiverPhone + " with amount: " + amount + " D. Amount is Credited To Your Wallet Successfully."
  return commonSMS(msgbody, senderPhone)
};
let paymentCashPickUpCompletedSenderSMS = async (amount, senderPhone, receiverPhone) => {
  let msgbody = "Cash Pickup Request Completed for " + receiverPhone + " with amount: " + amount + " D. Amount is Given in Cash."
  return commonSMS(msgbody, senderPhone)
};

let paymentCashPickUpReceiverSMS = async (amount, senderPhone, receiverPhone, trans_id) => {
  let msgbody = "You have received Cash Pickup Request from " + senderPhone + " with amount: " + amount + " D. Use Transaction ID: " + trans_id + " Please Do Not Share With Anyone."
  return commonSMS(msgbody, receiverPhone)
};

let paymentBankTransferSenderSMS = async (amount, senderPhone, receiverPhone, trans_id) => {
  let msgbody = "Bank Transfer Request Generated for " + receiverPhone + " with amount: " + amount + " D. Use Transaction ID: " + trans_id + " Amount will be credited in 3-5 Working Days Please Do Not Share With Anyone."
  return commonSMS(msgbody, senderPhone)
};
let paymentBankTransferReceiverSMS = async (amount, senderPhone, receiverPhone, trans_id) => {
  let msgbody = "You have received Bank Transfer Request from " + senderPhone + " with amount: " + amount + " D. Use Transaction ID: " + trans_id + " Amount will be credited in 3-5 Working Days Please Do Not Share With Anyone."
  return commonSMS(msgbody, receiverPhone)
};
let paymentMobileRechargeRequestSubmittedSMS = async (amount, senderPhone, receiverPhone, trans_id) => {
  let msgbody = "Recharge Request Successfully Submitted for " + receiverPhone + " With Amount D" + amount + ". Use Reference ID: " + trans_id
  return commonSMS(msgbody, senderPhone)
};
let paymentMobileRechargeRequestFailedSMS = async (amount, senderPhone, receiverPhone, trans_id) => {
  let msgbody = "Recharge Request  Submitted for " + receiverPhone + " With Amount D" + amount + ". is Failed Please Try Later";
  return commonSMS(msgbody, senderPhone)

};
let paymentMobileRechargeRequestFailedWebhookSMS = async (amount, senderPhone, receiverPhone, trans_id) => {
  let msgbody = "Recharge Request  Submitted for " + receiverPhone + " With Amount D" + amount + ". is Failed and Amount is Reveresed into your wallet. Please Use Reference ID: " + trans_id
  return commonSMS(msgbody, senderPhone)

};
let paymentMobileRechargeRequestCompletedSMS = async (amount, senderPhone, receiverPhone, trans_id) => {
  let msgbody = "Recharge Request Successfully Completed for " + receiverPhone + " With Amount D" + amount + ". Use Reference ID: " + trans_id
  return commonSMS(msgbody, senderPhone)
};
let TransactionalOTPForBankTransfer = async (otp, receiverPhone) => {
  let msgbody = "Use OTP: " + otp + " to complete your Bank Transfer Request. Please Do Not Share With Anyone."
  return commonSMS(msgbody, receiverPhone)
};
let TransactionalOTPForCashPickup = async (otp, receiverPhone) => {
  let msgbody = "Use OTP: " + otp + " to complete your Cash Pickup Request. Please Do Not Share With Anyone."
  return commonSMS(msgbody, receiverPhone)
};
let TransactionalOTPForWalletTransfer = async (otp, receiverPhone) => {
  let msgbody = "Use OTP: " + otp + " to complete your wallet top-up transaction. Please Do Not Share With Anyone."
  return commonSMS(msgbody, receiverPhone)
};
let TransactionalOTPForRecharge = async (otp, receiverPhone) => {
  let msgbody = "Use OTP: " + otp + " to complete your Recharge. Please Do Not Share With Anyone."
  return commonSMS(msgbody, receiverPhone)
};
let OTPForCashPickupRequestedByMerchant = async (otp, receiverPhone) => {
  let msgbody = "Use OTP: " + otp + " to complete your CashPickup. Please Share This OTP with Merchant."
  return commonSMS(msgbody, receiverPhone)
};
let cashTopupReceivedSMS = async (amount,  receiverPhone) => {
  let msgbody = "Cash Topup With Amount " + amount + " D."+" is Successfully Completed. Have a great day."
  return commonSMS(msgbody, receiverPhone)
};
let requestMoneyRequestSentForSenderSMS = async (amount,  receiverPhone) => {
  let msgbody = "Request Money With Amount " + amount + " D."+" is Successfully Generated and Sent. Have a great day."
  return commonSMS(msgbody, receiverPhone)
};
let requestMoneyRequestReceivedFromSMS = async (amount,  senderPhone,receiverPhone) => {  
  let msgbody = "Money Request Received From "+senderPhone+"  With Amount D" + amount + "."
  return commonSMS(msgbody, receiverPhone)
};
let requestMoneyRequestDeclinedForSenderSMS = async (amount, senderPhone, receiverPhone) => {
  let msgbody = "Your Money Request with Amount: "+amount +"D from "+receiverPhone+ " is Declined"
  return commonSMS(msgbody, senderPhone)
};
let requestMoneyRequestDeclinedForReceiverSMS = async (amount,  senderPhone,receiverPhone) => {  
  let msgbody = "Money Request with Amount: "+amount +"D from "+ senderPhone+ " is Declined by You."
  return commonSMS(msgbody, receiverPhone)
};
let DummySMS = async (receiverPhone) => {
  let msgbody = "This is test message"
  return commonSMS(msgbody, receiverPhone)
};
module.exports = {
  sms: sms,
  paymentSuccessSMS: paymentSuccessSMS,
  paymentFailedSMS: paymentFailedSMS,
  paymentCancelledSMS: paymentCancelledSMS,
  paymentReceivedWithoutAccount: paymentReceivedWithoutAccount,
  paymentSentSMS: paymentSentSMS,
  paymentReceivedSMS: paymentReceivedSMS,
  paymentCashPickUpSenderSMS: paymentCashPickUpSenderSMS,
  paymentCashPickUpReceiverSMS: paymentCashPickUpReceiverSMS,
  paymentBankTransferSenderSMS: paymentBankTransferSenderSMS,
  paymentBankTransferReceiverSMS: paymentBankTransferReceiverSMS,
  paymentMobileRechargeRequestSubmittedSMS: paymentMobileRechargeRequestSubmittedSMS,
  paymentMobileRechargeRequestFailedSMS: paymentMobileRechargeRequestFailedSMS,
  paymentMobileRechargeRequestFailedWebhookSMS: paymentMobileRechargeRequestFailedWebhookSMS,
  paymentMobileRechargeRequestCompletedSMS: paymentMobileRechargeRequestCompletedSMS,
  TransactionalOTPForBankTransfer: TransactionalOTPForBankTransfer,
  TransactionalOTPForCashPickup: TransactionalOTPForCashPickup,
  TransactionalOTPForWalletTransfer: TransactionalOTPForWalletTransfer,
  TransactionalOTPForRecharge: TransactionalOTPForRecharge,
  OTPForCashPickupRequestedByMerchant:OTPForCashPickupRequestedByMerchant,
  paymentCashPickUpCompletedMerchantSMS:paymentCashPickUpCompletedMerchantSMS,
  paymentCashPickUpCompletedSenderSMS:paymentCashPickUpCompletedSenderSMS,
  requestMoneyRequestReceivedFromSMS:requestMoneyRequestReceivedFromSMS,
  cashTopupReceivedSMS:cashTopupReceivedSMS,
  requestMoneyRequestDeclinedForSenderSMS:requestMoneyRequestDeclinedForSenderSMS,
  requestMoneyRequestDeclinedForReceiverSMS:requestMoneyRequestDeclinedForReceiverSMS,
  requestMoneyRequestSentForSenderSMS:requestMoneyRequestSentForSenderSMS,
  DummySMS: DummySMS
}
