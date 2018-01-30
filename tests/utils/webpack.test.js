let webpack = require('webpack');
let path = require('path');
let rimraf = require('rimraf');
const loader = path.resolve(__dirname, '../../lib/index.js');

const config = {
	entry: { default: path.resolve(__dirname, '../fixtures/default.js') },
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '../output')
	},
	module: {
		loaders: [
			{
				test: /\.jsx?/,
				loader: loader,
				exclude: /node_modules/,
				options: {
					dest: path.resolve(__dirname, '../output'),
					appclass: path.resolve(__dirname, '../output/[name].js'),
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
