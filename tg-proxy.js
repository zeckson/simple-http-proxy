'use strict';

const https = require(`https`);
const {inspect} = require(`util`);

const API_URL = `https://api.telegram.org`;

const REJECTED_HEADERS = new Set([`host`]);
const filterOutBadHeaders = (headers) => {
  return Object
    .entries(headers)
    .filter(([key]) => !(REJECTED_HEADERS.has(key.toLowerCase())))
    .reduce((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {});
};

const proxy = (req, res) => {
  console.log(`Requesting url`);
  // console.log(inspect(req, {depth: 0}));

  const url = API_URL + req.url;
  console.log(`Requesting url: ${url}`);

  const myUrl = new URL(url);
  const options = {
    hostname: myUrl.hostname,
    port: myUrl.port,
    path: req.url,
    method: req.method,
    headers: filterOutBadHeaders(req.headers)
  };
  // TODO: filter out correct headers
  console.log(inspect(options, {depth: 1}));
  const proxyReq = https.request(options, (proxyRes) => {
    const {statusCode} = proxyRes;
    console.log(`Got response: ${statusCode}`);

    console.log(`STATUS: ${proxyRes.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(proxyRes.headers)}`);

    res.statusCode = proxyRes.statusCode;
    res.headers = filterOutBadHeaders(proxyRes.headers);
    console.log(inspect(proxyRes.headers, {depth: 1}));
    console.log(inspect(res.headers, {depth: 1}));
    res.flushHeaders();


    proxyRes.on(`error`, (e) => {
      console.error(`Proxy res-error: ${e.message}`);
    });
    res.on(`error`, (e) => {
      console.error(`Res-error: ${e.message}`);
    });
    proxyRes.pipe(res);
  });
  proxyReq.on(`error`, (e) => {
    console.error(`Got proxy-error: ${e.message}`);
  });
  req.on(`error`, (e) => {
    console.error(`Got req-error: ${e.message}`);
  });

  // write data to request body
  req.pipe(proxyReq);
};

module.exports = proxy;


