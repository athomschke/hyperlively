var webpack = require('./webpack.integration.js');
var configureDefaultKarma = require('./karma.conf');

module.exports = function (config) {
	configureDefaultKarma(config);

	config.set({
		files: [
			'test/runner.integration.js',
		],
		webpack,
		preprocessors: {
			'test/runner.integration.js': ['webpack'],
		},
	});
};
