const queue = require('../config/kue');
const receiptMailer = require('../mailer/donation_mail');

queue.process('confim-email',function(job,done){
    receiptMailer.createPDF(job.data);
    done();
});