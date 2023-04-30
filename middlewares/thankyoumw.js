exports.transactionSet = (req,res,next)=>{
    if(req.body.transactionDone){
        res.cookie('transactionDone',true);
        return next();
    }
    else{
        res.cookie('transactionDone',false);
        return next();
    }
}

exports.thankYouPage = (req,res,next)=>{
    if(req.cookies.transactionDone && req.cookies.transactionDone == "true"){
        res.clearCookie('transactionDone');
        return next();
    }
    else{
        return res.redirect('/');
    }
}