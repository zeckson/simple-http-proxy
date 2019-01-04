'use strict';

const http = require(`http`);
const https = require(`https`);

const proxyRequest = (url, cltReq, cltRes) => {
  https.get(url, (srvRes) => {
    srvRes.pipe(cltRes);
  });
};

// Create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {
  proxyRequest(myUrl.parse(`https://api.telegram.org${req.url}`), req, res);
});

const PORT_NUMBER = 1337;
// now that proxy is running
proxy.listen(PORT_NUMBER, () => {
  console.log(`Started proxy @ port ${PORT_NUMBER}`);
});


