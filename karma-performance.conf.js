// @flow
var configureDefaultKarma = require('./karma.conf');

module.exports = function (config) {
	configureDefaultKarma(config);

	config.set({
		files: [
			'test/runner.performance.js',
		],
		preprocessors: {
			'test/runner.performance.js': ['webpack'],
		},
		browserNoActivityTimeout: 100000,
	});
};
