import test from 'ava';
import path from 'path';
import webpack from 'webpack';
import dirHelper from './utils/dirHelper.js';

const loader = path.join(__dirname, '../lib/index.js');
const baseConfig = {
	entry: path.join(__dirname, 'fixtures/default.js'),
	module: {
		loaders: [
			{
				test: /\.jsx?/,
				loader: loader,
				exclude: /node_modules/
			}
		]
	}
};

test.cb.before('setup', t => {
	dirHelper.create(__dirname, 'output/dest', (err, dir) => {
		if (err) {
			return t.end(err);
		}

		t.end();
	});
});

test.cb('errors if options.dest is null', t => {
	const config = Object.assign({}, baseConfig, {
		output: {
			path: path.join(__dirname, 'output/dest')
		},
		module: {
			loaders: [
				{
					test: /\.jsx?/,
					loader: loader,
					exclude: /node_modules/,
					options: {
						dest: null
					}
				}
			]
		}
	});

	webpack(config, (err, stats) => {
		if (err) {
			t.end(err);
		}

		t.true(stats.hasErrors(), 'by throwing errors to the stats object');
		t.is(
			stats.compilation.errors[0].error.name,
			'F2ManifestsLoaderError',
			'by throwing am F2ManifestsLoaderError'
		);
		t.is(
			stats.compilation.errors[0].error.message,
			'Output destination required but not defined',
			'by throwing a useful error message'
		);
		t.end();
	});
});

test.cb.after('cleanup', t => {
	dirHelper.remove(__dirname, 'output/dest', () => {
		t.end();
	});
});
