const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


let SendPasswordReesetOTP = async (to,otp) => {
let html = "OTP is " + otp;
    let msg = {
        to: to,
        from: process.env.FROM_EMAIL,
        subject: "OTP for Password Reset",
        html: html
    };
    try {
        let result = await sgMail.send(msg);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = {  
    SendPasswordReesetOTP:SendPasswordReesetOTP
}
