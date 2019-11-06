'use strict';

const httpProxy = require(`http-proxy`);

const DEFAULT_TARGET_URL = `https://api.telegram.org`;

const proxy = httpProxy.createProxyServer({changeOrigin: true});

const handler = (req, res) => {
  const host = req.headers.host;

  const isLocal = host.includes(`localhost`);
  const isNow = host.includes(`now.sh`);

  const target = isLocal || isNow ? DEFAULT_TARGET_URL : req.url;

  proxy.web(req, res, {target});
};

module.exports = handler;
