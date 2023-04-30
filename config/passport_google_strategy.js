const passport = require('passport');
const GoogleStategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');
const crypto = require('crypto');

passport.use(new GoogleStategy({
        clientID:process.env.Google_Client_ID,
        clientSecret:process.env.Google_Client_Secret,
        callbackURL:"https://charitable.onrender.com/user/auth/google/callback",
    },
    async function(accessToken, refreshToken,profile, done){
        try{
            const user = await User.findOne({"email":profile.emails[0].value});
            if(user){
                return done(null,user);
            }
            else{
                const outFile ={
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString(),
                    username:profile.displayName+crypto.randomBytes(5).toString(),
                    phone:1234567890,
                    avatar:profile.photos[0].value,
                    verified:true
                }
                const cuser = await User.create(outFile);
                if(cuser){
                    return done(null,cuser);
                }else{
                    return done(null,false);
                }
            }
        }
        catch(err){
            return done(err);
        }
    })
);

module.exports = passport;

