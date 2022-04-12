const path = require('path');

module.exports = {
	mode: 'none',
	entry: {
		app: path.join(__dirname, 'src', '_index.js'),
		auth: path.join(__dirname, 'scr', 'pages', 'auth', 'index.tsx')
	},
	target: 'web',
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: '/node_modules/'
			}
		],
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	}
}
