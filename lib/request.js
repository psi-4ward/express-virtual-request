var extend = require('util')._extend;
var inherits = require('util').inherits;
var IncomingMessage = require('http').IncomingMessage;

function ExpressVirtualRequest(socket) {
  IncomingMessage.call(this, socket);
};
inherits(ExpressVirtualRequest, IncomingMessage);

/**
 * generate a ExpressVirtualRequest
 *
 * @param {Object} data Object containing url, method, headers, body etc
 * @param {Object} [socket]
 * @returns {ExpressVirtualRequest}
 * @todo Make this a Duplex stream to be able to pipe in the body
 *       but without depending on __proto__ ?
 */
module.exports = function generateExpressVirtualRequest(data, socket) {
  var req = new ExpressVirtualRequest(socket);

  // !! dont depend on __proto__ cause express init middleware resets it to IncomingMessage !!

  // some defaults
  req.httpVersion = '1.1';
  req.url = '';
  req.method = 'GET';
  req.headers = {};
  req.connection = {
    encrypted: false,
    remoteAddress: '127.0.0.1'
  };
  req.protocol = 'http';
  req.body = '';

  req.setTimeout = function(msec, cb) {
    if(callback) this.on('timeout', callback);
    if(this.socket) this.socket.setTimeout(msecs);
  };

  req._read = function(n) {
    stream.push(req.body.splice(0, n));
  };

  extend(req, data);

  // End the stream for body-less requests
  if(req.method === 'GET' || req.method === 'HEAD' || req.method === 'DELETE') {
    req.push(null);
  }

  return req;
}
