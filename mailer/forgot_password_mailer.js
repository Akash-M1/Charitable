const nodeMailer = require('../config/nodeMailer');

exports.createmail = (data)=>{
    const htmlStr = nodeMailer.renderFile({data:data},'/authentication/forgot_password.ejs');
    nodeMailer.transporter.sendMail({
        from:"akashmalasetty@gmail.com",
        to:data.user.email,
        subject:"Password Reset Link",
        html:htmlStr
    },function(err,info){
        if(err){
            console.log("Error in sending the mail");
            return;
        }
    })
}


exports.confirmMail = (data)=>{
    const htmlString = nodeMailer.renderFile({data:data},"/authentication/confirm_change.ejs")
    nodeMailer.transporter.sendMail({
        from:"akashmalasetty@gmail.com",
        to:data.email,
        subject:"Password Changed",
        html:htmlString
    },function(err,info){
        if(err){
            console.log("Error in sending mail");
            return;
        }
    })
}