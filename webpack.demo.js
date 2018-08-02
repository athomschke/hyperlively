const path = require('path');

const config = require('./webpack.test.js');

config.output.path = path.resolve(__dirname, 'demo');

module.exports = config;
