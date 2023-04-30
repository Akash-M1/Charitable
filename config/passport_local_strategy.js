const passport = require('passport');
const passportLocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new passportLocalStrategy({
        usernameField:'email',
        passReqToCallback:true
    },
    async function(req,email,password,done){
        const user = await User.findOne({email:email});
        try{
            if(user){
                user.comparePassword(password, function(err, isMatch) {
                    if (err){
                        req.flash('error',"Error in Authentication");
                        return done(err);
                    }
                    if(isMatch==true){
                        return done(null,user);
                    }
                    else{
                        req.flash('error',"Wrong Password");
                        return done(null,false);
                    }
                });
            }
            else{
                req.flash('error',"User doesn't exist");
                return done(null,false);
            }
        }
        catch(err){
            req.flash('error',"Sign In Error")
            return done(err);
        }
    }
));

passport.serializeUser (function(user,done){
    return done(null,user.id);
})

passport.deserializeUser (async function(id,done){
    try{
        const user = await User.findById(id);
        if(!user){
            return done(null,false);
        }
        else{
            return done(null, user);
        }
    }
    catch(err){
        return done(err)
    }
})

passport.checkAuthentication = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/user/sign-in');
}

passport.setAuthenticatedUser = (req,res,next)=>{
    if(req.isAuthenticated()){
        res.locals.user = req.user; 
    }
    return next();
}

passport.signInSignUpAuthentication = (req,res,next)=>{
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return next();
}

module.exports = passport;