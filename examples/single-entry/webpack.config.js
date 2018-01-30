var path = require('path');
var webpack = require('webpack');

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
					appclass: path.join('http://my-server.com', 'dist/my-precious-bundle.js')
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
