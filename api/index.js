'use strict';

const proxy = require(`../tunnel`);

const API_URL = `https://api.telegram.org`;

module.exports = (req, res) => proxy(API_URL, req, res);
