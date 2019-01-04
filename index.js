'use strict';

const http = require(`http`);
const net = require(`net`);
const url = require(`url`);

// Create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': `text/plain`});
  res.end(`okay`);
});
proxy.on(`connect`, (req, cltSocket, head) => {
  // connect to an origin server
  const srvUrl = url.parse(`https://${req.url}`);
  const srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
    cltSocket.write(`HTTP/1.1 200 Connection Established\r\n` +
      `Proxy-agent: Node.js-Proxy\r\n` +
      `\r\n`);
    srvSocket.write(head);
    srvSocket.pipe(cltSocket);
    cltSocket.pipe(srvSocket);
  });
});

const PORT_NUMBER = 1337;
// now that proxy is running
proxy.listen(PORT_NUMBER, () => {
  console.log(`Started proxy @ port ${PORT_NUMBER}`);
});


