const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transaction_id:{
        type:String,
        required:true,
    },
    transaction_amount:{
        type:Number,
        required:true
    }
},{
    timestamps:true
});

module.exports = mongoose.model('Transactions',transactionSchema,'transactions');