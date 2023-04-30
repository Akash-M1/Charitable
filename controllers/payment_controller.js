const Razorpay = require('razorpay');
const shortId = require('shortid');
const crypto = require('crypto');

const Transaction = require('../models/transaction');
const queue = require('../config/kue');
const confirmMailWorker = require('../workers/donation_mail_worker');

var instance = new Razorpay({ key_id: process.env.RazorPay_Key_Id, key_secret: process.env.RazorPay_Key_Secret })

exports.createPayment = function(req,res){
    var options = {
        amount: req.body.amount, 
        currency: "INR",
        receipt: shortId.generate()
    };
    instance.orders.create(options, function(err, order) {
        order.key_id = instance.key_id
        return res.status(200).json(order);
    });
}

exports.saveTransaction = async function(req,res){
    try{
        const generated_signature = crypto.createHmac('sha256',instance.key_secret);
        generated_signature.update(req.body.response.razorpay_order_id+"|"+ req.body.response.razorpay_payment_id)


        if(req.body.response.razorpay_signature==generated_signature.digest('hex')){
            const outObj = {
                transaction_id:req.body.response.razorpay_payment_id,
                transaction_amount:req.body.amount
            }
            await Transaction.create(outObj);
            if(req.user){
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                const data={
                    user:req.user,
                    payment:req.body.response.razorpay_payment_id,
                    amount:req.body.amount,
                    date:`${months[new Date().getMonth()]} ${new Date().getDate()} ${new Date().getFullYear()}`
                };
                const job = queue.create('confim-email',data).priority('normal').save(function(err){
                    if(err){
                        console.log("Error doing in Job",job.id);
                    }
                })
            }

            return res.status(200).json({
                message:"Transaction Successfull"
            });
        }
        else{
            console.log("Transaction Error!!!");
            req.flash('error',"Invalid Transaction!!!");
            return res.status(200).json({
                message:"Transaction Unsuccessfull"
            });
        }
    }
    catch(err){
        console.log("Transaction Error!!!",err);
        req.flash('error',"Something Went Wrong!!!");
        return res.redirect('/');
    }

}