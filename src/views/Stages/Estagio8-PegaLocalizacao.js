// exemplo api cep nodejs native
var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
  'method': 'GET',
  'hostname': 'example.api.findcep.com',
  'path': '/v1/cep/01234000.json',
  'headers': {
    'Referer': 'example.com'
  },
  'maxRedirects': 20
};

var req = https.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

req.end();

// exemplo api cep nodejs usando axios

var axios = require('axios');

var config = {
  method: 'get',
  url: 'https://example.api.findcep.com/v1/cep/01234000.json',
  headers: {
    'Referer': 'example.com'
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

// exemplo api cep nodejs usando request

var request = require('request');
var options = {
  'method': 'GET',
  'url': 'https://example.api.findcep.com/v1/cep/01234000.json',
  'headers': {
    'Referer': 'example.com'
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

// exemplo api cep nodejs usando unirest

var unirest = require('unirest');
var req = unirest('GET', 'https://example.api.findcep.com/v1/cep/01234000.json')
  .headers({
    'Referer': 'example.com'
  })
  .end(function (res) {
    if (res.error) throw new Error(res.error);
    console.log(res.raw_body);
  });
 