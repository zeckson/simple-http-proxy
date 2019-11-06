'use strict';

const httpProxy = require(`http-proxy`);

const DEFAULT_TARGET_URL = `https://telegram.org`;

const proxy = httpProxy.createProxyServer({changeOrigin: true});

const handler = (req, res) => {
  const host = req.headers.host;

  const isLocal = host.includes(`localhost`);
  const isNow = host.includes(`now.sh`);

  console.log(`Host: ${host}`);

  const target = DEFAULT_TARGET_URL;

  proxy.web(req, res, {target});
};

module.exports = handler;
