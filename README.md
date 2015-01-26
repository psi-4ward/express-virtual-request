# express-virtual-request

Mock `request` and `response` objects to run virtual requests against express.js

```javascript
var app = require('express')();
app.get('/hello', function (req, res) {
  res.send('Hello World!')
});


var VirtualRequest = require('express-virtual-request').request;
var VirtualResponse = require('express-virtual-request').response;

var req = new VirtualRequest({
  method: 'GET',
  url: '/users',
  headers: {
    'Accept': 'application/json'
  }
});

// Response needs the request obj
var res = new VirtualResponse(req);
res.on('finish', function () {
  console.log(res.statusCode, res.statusMessage);
  console.log(res.headers);
  console.log('-------');
  console.log(res.body);
});

// put it into express middleware chain
app.handle(req, res);
```

### Installation

```
npm install psi-4ward/express-virtual-request
```


### ExpressVirtualRequest

```javascript
var req = new VirtualRequest({
  method: 'GET',      // HTTP-Method 
  url: '/users',      // url
  headers: {          // Object with headers 
    'Accept': 'application/json'
  },
  httpVersion: '1.1',
  connection: {
    encrypted: false,
    remoteAddress: '127.0.0.1'
  },
  body: 'content body for POST/PUT requests'
});
```

## License

  [MIT](LICENSE)