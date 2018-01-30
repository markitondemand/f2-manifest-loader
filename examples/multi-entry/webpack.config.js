var path = require('path');
var glob = require('glob');
var webpack = require('webpack');

// glob all appclasses
var paths = glob.sync(path.join(__dirname, '/src/entries/*.appclass.js'));

// reduce them to a key/value pairs of name:path
var entries = paths.reduce(function(result, item) {
	var key = item.substring(item.lastIndexOf('/') + 1, item.lastIndexOf('.js'));

	if (key in result) {
		throw new Error(`Duplicate filenames not allowed: ${key}`);
	}

	result[key] = item;

	return result;
}, {});

const config = {
	entry: entries,
	output: {
		filename: '[name].bundle.js',
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
					appclass: path.join('http://my-server.com', 'dist/[name].bundle.js')
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
