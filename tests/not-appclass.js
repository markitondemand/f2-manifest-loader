import fs from 'fs';
import test from 'ava';
import path from 'path';
import webpack from 'webpack';
import dirHelper from './utils/dirHelper.js';

const loader = path.join(__dirname, '../lib/index.js');

test.cb.before('setup', t => {
	dirHelper.create(__dirname, 'output/not-appclass', (err, dir) => {
		if (err) {
			return t.end(err);
		}

		t.end();
	});
});

test.cb('does nothing if js file is not an identifiable appclass', t => {
	const config = {
		entry: {
			'not-appclass': path.join(__dirname, 'fixtures/not-appclass.js')
		},
		output: {
			path: path.join(__dirname, 'output/not-appclass')
		},
		module: {
			loaders: [
				{
					test: /\.jsx?/,
					loader: loader,
					exclude: /node_modules/,
					options: {
						dest: path.join(__dirname, 'output/not-appclass/manifests')
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
		t.false(
			fs.existsSync(
				path.join(__dirname, 'output/not-appclass/manifests/com_open_f2_ignored_app_manifest.js')
			)
		);
		t.end();
	});
});

test.cb.after('cleanup', t => {
	dirHelper.remove(__dirname, 'output/not-appclass', () => {
		t.end();
	});
});
