'use strict';

const https = require(`https`);
const {inspect} = require(`util`);

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

const proxy = (url, req, res) => {
  const target = new URL(url);
  const options = {
    hostname: target.hostname,
    port: target.port,
    path: req.url,
    method: req.method,
    headers: filterOutBadHeaders(req.headers)
  };
  console.log(`Request [${req.method}]: ${url}`);
  console.log(`Headers:\n${inspect(options, {depth: 1})}`);
  const proxyReq = https.request(options, (proxyRes) => {

    console.log(`Response: ${proxyRes.statusCode}`);
    console.log(`Headers:\n${inspect(proxyRes.headers, {depth: 1})}`);

    res.statusCode = proxyRes.statusCode;
    res.headers = filterOutBadHeaders(proxyRes.headers);

    res.flushHeaders();

    proxyRes.on(`error`, ({message}) => {
      console.error(`Proxy response error: ${message}`);
      res.end(message);
    });
    res.on(`error`, ({message}) => {
      console.error(`Response error: ${message}`);
      res.end(message);
    });

    proxyRes.pipe(res);
  });
  proxyReq.on(`error`, ({message}) => {
    console.error(`Proxy request error: ${message}`);
    res.end(message);
  });
  req.on(`error`, ({message}) => {
    console.error(`Request error: ${message}`);
    res.end(message);
  });

  // write data to request body
  req.pipe(proxyReq);
};

module.exports = proxy;


