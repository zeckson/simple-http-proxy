'use strict';

const GET_TARGET_SERVER_URL = `https://api.telegram.org`;

const httpProxy = require(`http-proxy`);

const proxy = httpProxy.createProxyServer({
  target: GET_TARGET_SERVER_URL
});

const proxyfy = (req, res) => {
  console.log(`Proxying ${req.method} ${req.url}`);
  proxy.web(req, res, {target: GET_TARGET_SERVER_URL});
  proxy.on(`error`, (e) => console.error(e));
};

module.exports = proxyfy;
