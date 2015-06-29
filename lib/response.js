var extend = require('util')._extend;
var inherits = require('util').inherits;
var ServerResponse = require('http').ServerResponse;
var STATUS_CODES = require('http').STATUS_CODES;

function ExpressVirtualResponse(req) {
  ServerResponse.call(this, req);
};
inherits(ExpressVirtualResponse, ServerResponse);

/**
 * http.ServerResponse patched
 * to not create a real HTTP-Response
 * but expose it as JSON
 *
 * @emits finish
 * @param {ExpressVirtualRequest|IncommingMessage} req
 * @returns {ExpressVirtualResponse}
 */
module.exports = function generateExpressVirtualResponse(req) {
  var res = new ExpressVirtualResponse(req);

  // !! dont depend on __proto__ cause express init middleware resets it to ServerResponse !!
  var statusCode = 200;
  Object.defineProperty(res, 'statusCode', {
    set: function(code) {
      statusCode = code;
      res.statusMessage = STATUS_CODES[code];
    },
    get: function() {
      return statusCode;
    }
  });
  res.statusMessage = STATUS_CODES[200];
  res.headers = {};
  res.headersSent = false;
  res.sendDate = true;
  res.body = '';
  res.locals = Object.create(null);

  res.write = function(chunk) {
    res.body += chunk.toString();
    res.headersSent = true;
  };
  res.setHeader = function(name, value) {
    res.headers[name] = value;
  };
  res.writeHead = function(statusCode) {
    var headerIndex;
    var statusMessage = STATUS_CODES[statusCode];
    if(typeof arguments[1] == 'string') {
      statusMessage = arguments[1];
      headerIndex = 2;
    } else {
      headerIndex = 1;
    }
    res.statusCode = statusCode;
    res.statusMessage = statusMessage

    extend(res.headers, arguments[headerIndex] || {});
  };
  res.getHeader = function(name) {
    return res.headers[name];
  };
  res.removeHeader = function(name) {
    delete res.headers[name];
  };
  res.addTrailers = function(headers) {
    extend(res.headers, headers);
  };
  res.setTimeout = function() {};
  res.writeContinue = function() {};
  res.end = function(chunk) {
    if(chunk) res.write(chunk);
    res.emit('finish');
  };


  return res;
};
