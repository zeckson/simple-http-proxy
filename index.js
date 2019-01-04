'use strict';

const https = require(`https`);
const url = require(`url`);

const proxyRequest = (target, cltReq, cltRes) => {
  const headers = {};

  for (const [key, value] of Object.entries(cltReq.headers)) {
    if (key.toLowerCase() !== `host`) {
      headers[key] = value;
    }
  }

  const options = {
    hostname: target.hostname,
    port: target.port || target.protocol === `http:` ? 80 : 443,
    path: cltReq.path,
    method: cltReq.method,
    headers: headers
  };

  const srvReq = https.request(options, (srvRes) => {
    console.log(`STATUS: ${srvRes.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(srvRes.headers)}`);
    for (const [key, value] of Object.entries(srvRes.headers)) {
      cltRes.setHeader(key, value);
    }
    srvRes.pipe(cltRes);
  });

  cltReq.pipe(srvReq);
};

// Create an HTTP tunneling proxy
module.exports = (req, res) => {
  console.log(`Processing ${req.method} ${req.url}`);
  proxyRequest(url.parse(`https://api.telegram.org${req.url}`), req, res);
};
