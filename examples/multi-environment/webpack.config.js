var path = require('path');
var url = require('url');
var webpack = require('webpack');
// grab environment variable; failsafe to production
var env = process.env.NODE_ENV || 'production';
var basePath;

switch (env) {
	case 'development':
		basePath = 'http://my-dev-server.com';
		break;
	case 'test':
		basePath = 'http://my-qa-server.com';
		break;
	case 'production':
	default:
		basePath = 'http://my-server.com';
		break;
}

const config = {
	entry: path.join(__dirname, 'src/app.appclass.js'),
	output: {
		filename: 'my-precious-bundle.js',
		path: path.join(__dirname, 'dist')
	},
	module: {
		loaders: [
			{
				test: /\.jsx?/,
				loader: 'f2-manifest-loader',
				exclude: /node_modules/,
				options: {
					dest: path.join(__dirname, 'dist/manifests'),
					appclass: url.resolve(basePath, 'dist/my-precious-bundle.js')
				}
			}
		]
	}
};

webpack(config, function(err, stats) {
	if (err) {
		throw err;
	}

	// Output webpack build results
	process.stdout.write(
		stats.toString({
			colors: true,
			modules: false,
			children: true,
			chunks: false,
			chunkModules: false
		}) + '\n'
	);
});
