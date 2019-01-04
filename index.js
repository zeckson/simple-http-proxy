'use strict';

const http = require(`http`);
const https = require(`https`);
const net = require(`net`);
const url = require(`url`);

const proxyRequest = (url, cltReq, cltRes) => {
  const requeest = url.protocol === `http:` ? http : https;
  requeest.get(url, (srvRes) => {
    srvRes.pipe(cltRes);
  });
};

const proxyConnectRequest = (srvUrl, cltSocket, head) => {
  const port = srvUrl.port || srvUrl.protocol === `http:` ? 80 : 443;
  const srvSocket = net.connect(port, srvUrl.hostname, () => {
    cltSocket.write(`HTTP/1.1 200 Connection Established\r\n` +
      `Proxy-agent: Node.js-Proxy\r\n` +
      `\r\n`);
    srvSocket.write(head);
    srvSocket.pipe(cltSocket);
    cltSocket.pipe(srvSocket);
  });
};

// Create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {
  const myUrl = url.parse(req.url);
  if (!myUrl.hostname) {
    proxyRequest(myUrl.parse(`https://google.com${req.url}`), req, res);
  } else {
    proxyRequest(myUrl, req, res);
  }
});


proxy.on(`connect`, (req, cltSocket, head) => {
  // connect to an origin server
  proxyConnectRequest(url.parse(`https://${req.url}`), cltSocket, head);
});

const PORT_NUMBER = 1337;
// now that proxy is running
proxy.listen(PORT_NUMBER, () => {
  console.log(`Started proxy @ port ${PORT_NUMBER}`);
});


