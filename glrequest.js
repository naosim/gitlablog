var request = require('request');

var createOptions = (context, url) => {
  var headers = {
    'PRIVATE-TOKEN': context.token
  }
  return {
    url: context.url + url,
    headers: headers,
    json: true
  }
}

var glrequest = (context) => {
  var get = (url, cb) => request(createOptions(context, url), cb);
  return {
    get: get
  }
};

module.exports = glrequest;
