var queue = require('queue-async');
var fs = require('fs');
// var jsdom = require('jsdom').jsdom;
var cheerio = require('cheerio');

var q = queue();

function getDataFromBody(body, done) {
  $ = cheerio.load(body);
  var rows = $('tr');
  var data = {};
  rows.each(function saveKeyAndValue(i, row) {
    debugger;
    var cols = $('td', row);
    if (cols.length === 2) {
      data[$(cols[0]).text().trim()] = $(cols[1]).text().trim();
    }
  });
  done(null, data);
}

function queueDataExtraction(body) {
  q.defer(getDataFromBody, body);
}

// TODO: Stream.
var bodiesString = fs.readFileSync('providerbodies.json');
var bodylist = JSON.parse(bodiesString);

bodylist.forEach(queueDataExtraction);

q.awaitAll(function presentResults(error, results) {
  if (error) {
    process.stderr.write(error);
  }
  else {
    process.stdout.write(JSON.stringify(results, null, '  '));
  }
});
