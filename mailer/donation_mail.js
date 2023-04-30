const nodeMailer = require('../config/nodeMailer');
const path = require('path');
const fs = require('fs');
let ejs = require("ejs");
let pdf = require("html-pdf");

const createReceipt = (data)=>{
    const htmlStr = nodeMailer.renderFile({data:data},'/receipt/email_receipt.ejs');
    nodeMailer.transporter.sendMail({
        from:"akashmalasetty@gmail.com",
        to:data.user.email,
        subject:`[Receipt-${data.payment}] Thank You For Donation`,
        html:htmlStr,
        attachments: [{
            filename: `receipt-${data.payment}.pdf`,
            path: path.join(__dirname,'../assets/pdfs',`/receipt-${data.payment}.pdf`),
            contentType: 'application/pdf'
        }],
    },function(err,info){
        if(err){
            console.log("Error in sending mail",err);
            return;
        }
        if(info){
            fs.unlink(path.join(__dirname,'../assets/pdfs',`/receipt-${data.payment}.pdf`),function(err){
                if(err){
                    console.log(err);
                }
            })
        }
    })
}

exports.createPDF = (data_rcvd)=>{
    ejs.renderFile(path.join(__dirname, "../views/mailers/receipt/email_receipt.ejs"), {data: data_rcvd}, (err, htmlStr) => {
        if (err) {
            console.log(err);
        } else {
            let options = {
                "height": "11.25in",
                "width": "8.5in",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
            };
            pdf.create(htmlStr, options).toFile(path.join(__dirname,'../assets',`/receipt-${data_rcvd.payment}.pdf`), function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    createReceipt(data_rcvd);
                }
            });
        }
    });
}