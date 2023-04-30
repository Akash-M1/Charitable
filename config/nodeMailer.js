const nodeMailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const transporter = nodeMailer.createTransport({
    service:'gmail',
    host:'smpt.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:process.env.gmail_user,
        pass:process.env.gmail_pass
    }
});

const htmlTemplate = (data,relativePath)=>{
    let htmlTemp;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,html){
            if(err){
                console.log('Error in rendering file',err);
                return;
            }
            htmlTemp=html;
        }
    )
    return htmlTemp;
}

const mailExport = {
    transporter:transporter,
    renderFile:htmlTemplate
};

module.exports = mailExport;