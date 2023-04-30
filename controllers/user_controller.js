const User = require('../models/user');
const email_auth = require('../models/email_auth');
const randomstring = require("randomstring");
const queue = require('../config/kue');
const verifyMailWorker = require("../workers/verification_mail_worker");

exports.profile = async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(user){
            if(req.user.id == user.id){
                res.render('profile',{
                    profile_user:user,
                    title:"Profile_Page"
                })
            }
            else{
                req.flash("error","Something Went Wrong!!")
                return res.redirect('/');
            }
        }
        else{
            req.flash("error","Something Went Wrong!!")
            return res.redirect('/');
        }
    }
    catch(err){
        return res.redirect('back');
    }
};

exports.signIn = (req,res)=>{
    res.render('sign_in',{
        title:"Sign In Page",
        signinsignup:true
    })
}

exports.signUp = (req,res)=>{
    res.render('sign_up',{
        title:"Sign Up Page",
        signinsignup:true
    })
}


exports.createUser = async function (req,res){
    try{
        if(req.body.password!=req.body.cpassword){
            req.flash('error','Passwords should match');
            return res.redirect('/user/sign-up');
        }
        const user = await User.findOne({"email":req.body.email});
        if(user){
            req.flash('error','Error!!User Already Exists');
            return res.redirect('/user/sign-in');
        }
        else{
            const bodyObj = req.body;
            bodyObj.avatar = req.file.location;
            bodyObj.verified = false
            const cUser = await User.create(bodyObj);
            let auth_email = await email_auth.create({
                user:cUser._id,
                auth_key:randomstring.generate(15),
                isValid:true
            });

            auth_email = await auth_email.populate('user','name email');
            const job = queue.create('verify-email',auth_email).priority('high').save(function(err){
                if(err){
                    console.log("Error doing in Job",job.id);
                }
            })

            if(cUser){
                req.flash('success','Sign Up Successfull');
                return res.redirect('/user/sign-in')
            }
        }
        console.log(req.body);
    }
    catch(err){
        req.flash('error','Sign Up error');
        return res.redirect('back');
    }
}

exports.verifyUser = async (req,res)=>{
    const auth_key = req.query.auth_key;
    try {
        let auth_user = await email_auth.findOne({auth_key:auth_key});
        if(auth_user){
            if(!auth_user.isValid){
                req.flash('error','Verification Error(Token Error)');
                return res.redirect('/user/sign-in');
            }
            await email_auth.updateOne({auth_key:auth_key},{isValid:false});
            await User.updateOne({_id:auth_user.user},{verified:true});
            req.flash('success','Verification Successfull');
            return res.redirect('/user/sign-in');
        }
        else{
            req.flash('error','Verification Error(Token Error)');
            return res.redirect('/');
        }
    } catch (error) {
        console.log("Error in verifying User",error);
        req.flash('error','Verification error')
        return res.redirect('/');
    }
}

exports.createSession = function (req,res) {
    req.flash('success','Sign in Successfull');
    return res.redirect('/');
}

exports.destroySession = function(req,res){
    return req.logout((err)=>{
        if(err){
            req.flash('error','Sign out error');
            return res.redirect('/');
        }
        req.flash('success','Sign Out Successfull');
        return res.redirect('/');
    })
}