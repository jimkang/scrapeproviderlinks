var fs = require('fs');
var _ = require('lodash');
var mailer = require('nodemailer');
var config = require('./config');
var queue = require('queue-async');

var jsonString = fs.readFileSync('daycareemails-filtered.json');
var emails = JSON.parse(jsonString);

var smtpTransport = mailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: config.emailAuth
});

var q = queue();

function emailDaycare(email, done) {
  // config.baseEmailOpts should have from, subject, and text fields.
  var mailOpts = _.defaults({to: email}, config.baseEmailOpts);

  smtpTransport.sendMail(mailOpts, function reportResults(error, response) {
    if (error) {
      console.log(error);
      done(error);
    }
    else {
      console.log('Message sent to:', email);
      done(null, true);
    }
  });
}

function queueEmailSend(email) {
  q.defer(emailDaycare, email);
}

emails.forEach(queueEmailSend);

q.awaitAll(function wrapUp(error, statuses) {
  console.log('All done!');
  smtpTransport.close();
});

