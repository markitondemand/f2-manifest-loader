import fs from 'fs';
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

test.cb.beforeEach('setup', t => {
	dirHelper.create(__dirname, 'output/options', (err, dir) => {
		if (err) {
			return t.end(err);
		}

		t.end();
	});
});

test.cb.afterEach('cleanup', t => {
	dirHelper.remove(__dirname, 'output/options', () => {
		t.end();
	});
});

test.cb('commonScripts does not error when nothing is passed', t => {
	const config = {
		entry: {
			'app-one': path.join(__dirname, 'fixtures/default.js')
		},
		output: {
			path: path.join(__dirname, 'output/options')
		},
		module: {
			loaders: [
				{
					test: /\.jsx?/,
					loader: loader,
					exclude: /node_modules/,
					options: {
						dest: path.join(__dirname, 'output/options/manifests')
					}
				}
			]
		}
	};

	webpack(config, (err, stats) => {
		if (err) {
			t.end(err);
		}

		t.false(stats.hasErrors());

		const data = fs.readFileSync(
			path.join(__dirname, 'output/options/manifests/com_open_f2_test_app_manifest.js'),
			'utf8'
		);
		const regex = /F2_jsonpCallback_com_open_f2_test_app\(([\s\S]+)\)/m;
		const match = data.match(regex);
		try {
			const json = JSON.parse(match[1]);
			t.is(json.scripts.length, 1);
		} catch (e) {
			t.fail();
		}
		t.end();
	});
});

test.cb('dest throws an error if null', t => {
	const config = Object.assign({}, baseConfig, {
		output: {
			path: path.join(__dirname, 'output/options')
		},
		module: {
			loaders: [
				{
					test: /\.jsx?/,
					loader: loader,
					exclude: /node_modules/
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
			'by throwing a F2ManifestsLoaderError'
		);
		t.is(
			stats.compilation.errors[0].error.message,
			'Output destination required but not defined',
			'by throwing a useful error message'
		);
		t.end();
	});
});

test.cb('dest throws an error not a string', t => {
	const config = Object.assign({}, baseConfig, {
		output: {
			path: path.join(__dirname, 'output/options')
		},
		module: {
			loaders: [
				{
					test: /\.jsx?/,
					loader: loader,
					exclude: /node_modules/,
					options: {
						dest: 123
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
		t.is(stats.compilation.errors[0].error.name, 'TypeError', 'by throwing a TypeError');
		t.end();
	});
});

test.todo('appclass interpolation works');

test.todo('app.html matches markup provided');
