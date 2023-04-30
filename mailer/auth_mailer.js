const nodeMailer = require('../config/nodeMailer');

exports.createMail = (auth_data)=>{
    const htmlStr = nodeMailer.renderFile({data:auth_data},'/authentication/auth.ejs');
    nodeMailer.transporter.sendMail({
        from:'akashmalasetty@gmail.com',
        to:auth_data.user.email,
        subject:"Verify Your email",
        html:htmlStr
    },function(err,info){
        if(err){
            console.log("Error in sending the mail",err);
            return;
        }
    })
}