'use strict';

const proxy = require(`../tg-proxy`);
const {inspect} = require(`util`);

module.exports = (req, res) => {
  console.log(inspect(req.query));
  proxy(req, res);
};
