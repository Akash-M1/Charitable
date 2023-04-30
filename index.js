const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const cors=require('cors');

const connectFlash = require('connect-flash');

const MongoDBStore = require('connect-mongodb-session')(sessions);
const db = require('./config/mongoose');

const passport = require('passport');
const passportLocalStrategy = require('./config/passport_local_strategy');
const passportGoogleStrategy = require('./config/passport_google_strategy');
const flashMiddleware = require('./middlewares/flashMiddelWare');


const app = express()
const PORT=8000

const store = new MongoDBStore({
    uri:process.env.Mongoose_URL,
    collection:"MySessions"
});

store.on('error',(err)=>{
    console.log('Error using mongo store');
});

app.set('view engine','ejs');
app.set("views",path.join(__dirname,'views'));
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('./assets'))

app.use(sessions({
    name:"Charitable",
    secret:"hdhjhuduihdjwdh",
    cookie:{
        maxAge:(1000*24*60*60)
    },
    resave:false,
    saveUninitialized:false,
    store:store
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(expressLayouts);
app.use(cookieParser());

app.use(connectFlash());
app.use(flashMiddleware.setFlashMiddleWare);


app.use('/',require('./routes'));

app.listen(PORT,(err)=>{
    console.log("Listening on the Port",PORT)
});