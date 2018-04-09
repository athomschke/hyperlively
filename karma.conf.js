var webpackConfig = require('./webpack.config');

module.exports = function (config) {
	webpackConfig.devtool = 'inline-source-map';
	webpackConfig.externals = Object.assign({}, webpackConfig.externals, {
		cheerio: 'window',
		'react/addons': true,
		'react/lib/ExecutionEnvironment': true,
		'react/lib/ReactContext': true,
	});
	config.set({
		browsers: ['chrome_large'],
		customLaunchers: {
			chrome_large: {
				base: 'Chrome',
				flags: [
					'--window-size=1100,600',
					'--window-position=-0,0',
				],
			},
		},
		files: [
			'test/runner.js',
		],
		plugins: [
			'karma-chrome-launcher',
			'karma-chai',
			'karma-dirty-chai',
			'karma-mocha',
			'karma-sourcemap-loader',
			'karma-webpack',
			'karma-mocha-reporter',
			'karma-sinon',
			'karma-sinon-chai',
		],
		frameworks: ['sinon-chai', 'mocha'],
		preprocessors: {
			'test/runner.js': ['webpack'],
		},
		reporters: ['progress'],
		singleRun: false,
		webpack: webpackConfig,
		webpackServer: {
			noInfo: true,
		},
	});
};
