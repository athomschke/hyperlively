// @flow
var configureDefaultKarma = require('./karma.conf');

module.exports = function (config) {
	configureDefaultKarma(config);

	config.plugins.push('karma-coverage');
	config.plugins.push('karma-phantomjs-launcher');
	config.reporters.push('coverage');

	config.webpack.devtool = 'inline-source-map';
	config.webpack.module.rules.push({
		enforce: 'pre',
		test: /\.jsx|\.js$/,
		include: /hyperlively/,
		exclude: /(test|libs|node_modules|bower_components|containers)\//,
		loader: 'babel-istanbul-loader',
		query: {
	        cacheDirectory: true
	    }
	});

	config.set({
		browsers: ['PhantomJS'],
		phantomjsLauncher: {
			// Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
			exitOnResourceError: true
		},
		files: [
			'test/runner.coverage.js'
		],
		preprocessors: {
			'test/runner.coverage.js': ['webpack']
		},
		coverageReporter: {
			type : 'html',
			dir : 'coverage/'
		}
	});
};
