const config = require('./webpack.config.js');

config.module.rules.push({
	test: /\.(scss|css)$/,
	exclude: [
		/node_modules/,
	],
	loaders: ['style-loader', 'css-loader', 'sass-loader'],
});

module.exports = config;
