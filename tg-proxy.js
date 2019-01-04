'use strict';

const http = require(`http`);
const https = require(`https`);
const url = require(`url`);

const proxyRequest = (target, cltReq, cltRes) => {
  https.get(target, (srvRes) => {
    srvRes.pipe(cltRes);
  });
};

// Create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {
  proxyRequest(url.parse(`https://api.telegram.org${req.url}`), req, res);
});

const PORT_NUMBER = 1337;
// now that proxy is running
proxy.listen(PORT_NUMBER, () => {
  console.log(`Started proxy @ port ${PORT_NUMBER}`);
});


