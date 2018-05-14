// @flow
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');
var NODE_MODULES_DIR = path.resolve(__dirname, 'node_modules');
var CREDENTIALS_DIR = path.resolve(__dirname, 'src/client/app/credentials');
var ROOT_DIR = path.resolve(__dirname);

var config = {
	devtool: 'source-map',
	entry: APP_DIR + '/index.jsx',
	output: {
		path: BUILD_DIR,
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.(jsx|js)$/,
				exclude: [
					/node_modules/,
				],
				loader: 'babel-loader',
			},
			{
				test: /\.(jsx|js)$/,
				include: [
					/node_modules\/react-tree-menu/,
				],
				loader: 'babel-loader',
			},
			{
				test: /\.(scss|css)$/,
				loaders: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.json$/,
				loader: 'json-loader',
			},
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
