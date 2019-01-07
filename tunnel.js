'use strict';

const https = require(`follow-redirects`).https;
const url = require(`url`);

const GET_TARGET_SERVER_URL = `https://api.telegram.org`;
const POST_TARGET_SERVER_URL = `https://api.telegram.org`;

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
    headers
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
const tunnel = (req, res) => {
  console.log(`Processing ${req.method} ${req.url}`);
  const baseUrl = req.method.toLowerCase() === `get` ? GET_TARGET_SERVER_URL : POST_TARGET_SERVER_URL;
  proxyRequest(url.parse(`${baseUrl}${req.url}`), req, res);
};

module.exports = tunnel;
