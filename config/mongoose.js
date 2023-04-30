const mongoose = require('mongoose');

mongoose.connect(process.env.Mongoose_URL);

const db = mongoose.connection;

db.once('open',()=>{
    console.log("Connection successfull");
});

db.on('error',console.error.bind(console,'Error in connection'));

module.exports=mongoose