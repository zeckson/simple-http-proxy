'use strict';

const http = require('http');
const handler = require('./index');

const proxy = http.createServer(handler);

const PORT_NUMBER = 1337;
// now that proxy is running
proxy.listen(PORT_NUMBER, () => {
  console.log(`Started proxy @ port ${PORT_NUMBER}`);
});
