var request = require('request');
var queue = require('queue-async');
var fs = require('fs');

var q = queue();

function getDataFromProviderURL(url, done) {
  request(url, function getBodyFromProviderFetch(error, response, body) {
    // console.log('Fetching from', url);
    if (error) {
      done(error);
    }
    else {
      // console.log('Got body from', url);//, body);
      done(error, body);
    }
  });
}


function queueFetch(url) {
  q.defer(getDataFromProviderURL, url);
}

var providerlistString = fs.readFileSync('providerlist.json');
var providerlist = JSON.parse(providerlistString);

providerlist.forEach(queueFetch);
q.awaitAll(function presentResults(error, results) {
  if (error) {
    process.stderr.write(error);
  }
  else {
    process.stdout.write(JSON.stringify(results, null, '  '));
  }
});
