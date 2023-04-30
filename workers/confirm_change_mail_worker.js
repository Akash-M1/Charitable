const queue = require('../config/kue');
const forgotPMailer = require('../mailer/forgot_password_mailer');

queue.process('confirm-pass-email',function(job,done){
    forgotPMailer.confirmMail(job.data);
    done();
});