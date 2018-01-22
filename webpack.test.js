let webpack = require('webpack');
let path = require('path');
let rimraf = require('rimraf');
const loader = path.join(__dirname, './lib/index.js');

const config = {
	entry: { default: __dirname + '/tests/fixtures/default.js' },
	output: {
		filename: '[name].js',
		path: __dirname + '/tests/output'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?/,
				loader: loader,
				exclude: /node_modules/,
				options: {
					dest: path.join(__dirname, 'tests/output/manifests'),
					appclass: path.join(__dirname, 'tests/output/[name].js'),
					commonScripts: ['whee/whoo.js', 'la/deedah.js'],
					commonStyles: ['bootshizzle.css', 'heroes/of/magic.css']
				}
			}
		]
	}
};

webpack(config, function(err, stats) {
	if (err) {
		console.error('womp womp webpack err:', err);
	}

	if (stats.hasErrors()) {
		console.error('wub wub loader err:', stats.compilation.errors);
	}
});
