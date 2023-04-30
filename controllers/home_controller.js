exports.homeFileRender = (req,res)=>{
    res.render('home',{
        "title":"Home page"
    })
}

exports.allPageRender = (req,res)=>{
    res.render('allpage',{
        "title":"404 Not Found"
    })
}

exports.thankYouRender = (req,res)=>{
    res.render('thankyou',{
        "title":"Thank-You Page"
    })
}