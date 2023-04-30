const User = require('../models/user');
const email_auth = require('../models/email_auth');
var randomstring = require("randomstring");
const queue = require('../config/kue');
const forgotPassEmailWorker = require('../workers/forgot_pass_mail_worker');
const confirmChangeEmailWorker = require('../workers/confirm_change_mail_worker');

exports.forgotPassworEmaildRender = (req,res)=>{
    res.render('forgotpassword/forgot_pass_email',{
        title:"Forgot Password"
    })
}

exports.forgotPasswordAuth = async (req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        if(user){
            let auth_email = await email_auth.create({
                user:user._id,
                auth_key:randomstring.generate(15),
                isValid:true
            });

            auth_email = await auth_email.populate('user','name, email');
            const job = queue.create('forgot-pass-email',auth_email).priority('critical').save(function(err){
                if(err){
                    console.log("Forgot Pass Email Error",job.id,err);
                }
            })
            req.flash('success',"Verification Mail Sent");
            return res.redirect('/');
        }
        else{
            req.flash('error',"User doesn't exist");
            return res.redirect('/');
        }
    } catch (error) {
        console.log("Error",error);
        req.flash('error',"Error in sending mail");
        return res.redirect('/');
    }
}

exports.forgotPasswordVerify = async (req,res)=>{
    const auth_key = req.query.auth_key;
    try {
        const auth_user = await email_auth.findOne({auth_key:auth_key});
        if(auth_user){
            if(!auth_user.isValid){
                req.flash("error","Token Validation Error");
                return res.redirect('/');
            }
            else{
                return res.render('forgotpassword/change-password',{
                    user_pwd_change:auth_user.user,
                    auth_key:auth_user.auth_key,
                    title:"Change Password"
                });
            }
        }
        else{
            req.flash('error','Token Error');
            return res.redirect('/');
        }
    } catch (error) {
        console.log("Error",error);
        return res.redirect('/');
    }
}

exports.forgotPasswordChange = async (req,res)=>{
    try {
        const user = await User.findById(req.body.userId);
        if(user){
            if(req.body.password != req.body.cpassword){
                req.flash('error',"Passwords Should Match");
                return res.redirect('back');
            }
            else{
                user.password = req.body.password
                user.save();
                req.flash('success',"Password Changed");
                await email_auth.updateOne({auth_key:req.body.auth_key},{isValid:false});
                const job = queue.create('confirm-pass-email',user).priority('normal').save(function(err){
                    if(err){
                        console.log('Error in doing job',job.id,err);
                    }
                })
                return res.redirect('/user/sign-in');
            }
        }
        else{
            req.flash('error',"Password Change Error");
            return res.redirect('/');
        }
    } catch (error) {
        console.log("Error",error);
        req.flash('error',"Password Changed Error");
        return res.redirect('/');
    }
}