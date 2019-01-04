'use strict';

const https = require(`https`);
const url = require(`url`);

const proxyRequest = (target, cltReq, cltRes) => {
  https.get(target, (srvRes) => {
    srvRes.pipe(cltRes);
  });
};

// Create an HTTP tunneling proxy
module.exports = ((req, res) => {
  console.log(`Processing ${req.url}`);
  proxyRequest(url.parse(`https://api.telegram.org${req.url}`), req, res);
});
