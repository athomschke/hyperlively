var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');
var CREDENTIALS_DIR = path.resolve(__dirname, 'credentials');

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
		extensions: [
			'.webpack.js', '.web.js', '.js',
			'.jsx',
			'.scss',
		],
		alias: {
			actions: APP_DIR + '/actions',
			components: APP_DIR + '/components',
			constants: APP_DIR + '/constants',
			containers: APP_DIR + '/containers',
			reducers: APP_DIR + '/reducers',
			stylesheets: APP_DIR + '/stylesheets',
			helpers: APP_DIR + '/helpers',
			credentials: CREDENTIALS_DIR,
			base: APP_DIR,
		},
	},
};

module.exports = config;
