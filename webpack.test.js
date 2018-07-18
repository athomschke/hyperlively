const path = require('path');

const nodeExternals = require('webpack-node-externals');

const config = require('./webpack.config.js');

const DIST_DIR = path.resolve(__dirname, 'dist');

config.entry = path.join(__dirname, '/setup.spec.js');
config.output = {
	path: DIST_DIR,
	filename: './bundle.js',
};
config.module.rules.push({
	test: /\.(scss|css)$/,
	exclude: [
		/node_modules/,
	],
	loaders: ['null-loader'],
});
config.target = 'node';
config.externals = [nodeExternals()];

module.exports = config;
