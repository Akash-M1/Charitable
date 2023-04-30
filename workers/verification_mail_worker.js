const queue = require('../config/kue');
const authMailer = require('../mailer/auth_mailer');

queue.process('verify-email',function(job,done){
    authMailer.createMail(job.data);
    done();
});