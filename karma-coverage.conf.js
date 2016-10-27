var configureDefaultKarma = require('./karma.conf');

module.exports = function (config) {
	configureDefaultKarma(config);
	
	config.plugins.push('karma-coverage');
	config.reporters.push('coverage');
	
	config.webpack.devtool = 'inline-source-map';
	config.webpack.module.postLoaders = [{
		test: /\.jsx|\.js$/,
		exclude: /(test|libs|node_modules|bower_components)\//,
		loader: 'istanbul-instrumenter'
	}];
	
	config.set({
		files: [
			'test/runner.coverage.js'
		],
		preprocessors: {
			'test/runner.coverage.js': ['webpack']
		},
		coverageReporter: {
			type : 'html',
			dir : 'coverage/'
		},
		singleRun: true
	});
};