var webpackConfig = require('./webpack.config');
webpackConfig.devtool = 'inline-source-map';

module.exports = function (config) {
  config.set({
  	// basePath: '.',
	browsers: [ 'Chrome' ],
	files: [
		'test/runner.js'
	],
	plugins: [
      'karma-chrome-launcher',
      'karma-chai',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
    ],
	frameworks: [ 'chai', 'mocha' ],
	preprocessors: {
        'test/**/*': ['webpack', 'sourcemap'],
        'src/**/*': ['webpack', 'sourcemap']
	},
	reporters: [ 'progress' ],
	singleRun: false,
	webpack: webpackConfig,
	webpackServer: {
      noInfo: true
    }
  });
};