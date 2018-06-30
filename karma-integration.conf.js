var configureDefaultKarma = require('./karma.conf');

module.exports = function (config) {
	configureDefaultKarma(config);

	config.set({
		files: [
			'test/runner.integration.js',
		],
		preprocessors: {
			'test/runner.integration.js': ['webpack'],
		},
	});
};
