let axios = require('axios');
let sms = async (message, phone) => {   
  var msgbody  ="Thanks for using YoApp! Your OTP is "+message+". Please do not share your OTP with anyone else. Have a great day."
  let url = process.env.OTP_BASE_URL +"&username="+process.env.OTP_USERNAME+"&password="+process.env.OTP_PASSWORD+"&recipient="+phone+"&messagetype="+process.env.OTP_MESSAGETYPE+"&messagedata="+msgbody
  return await axios.get(url);
};

module.exports = {
  
    sms             : sms
}
