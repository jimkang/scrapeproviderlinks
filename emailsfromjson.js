var fs = require('fs');
var _ = require('lodash');

var jsonString = fs.readFileSync('providerdata.json');
var data = JSON.parse(jsonString);

var emails = _.compact(_.pluck(data, 'Email:'));
process.stdout.write(JSON.stringify(emails, null , '  '));

