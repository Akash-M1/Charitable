const kue = require('kue');

const queue = kue.createQueue({
    redis:"redis://red-ch788d82qv26p1bi2f4g:6379"
});

module.exports = queue;