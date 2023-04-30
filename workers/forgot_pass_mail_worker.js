const queue = require('../config/kue');
const forgotPMailer = require('../mailer/forgot_password_mailer');

queue.process('forgot-pass-email',function(job,done){
    forgotPMailer.createmail(job.data);
    done();
});