// @flow
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'src');
var NODE_MODULES_DIR = path.resolve(__dirname, 'node_modules');
var ROOT_DIR = path.resolve(__dirname);

var config = {
	devtool: 'source-map',
	entry: APP_DIR + '/index.js',
	output: {
		path: BUILD_DIR,
		filename: './bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: [
					/node_modules/,
				],
				loader: 'babel-loader',
			},
			{
				test: /\.jsx$/,
				exclude: [
					/node_modules\/react-tree-menu/,
				],
				loader: 'babel-loader',
			}
		],
	},
	resolve: {
		modules: ["node_modules", ROOT_DIR],
		extensions: [
			'.webpack.js', '.web.js', '.js',
			'.jsx',
			'.scss',
		]
	},
};

module.exports = config;
