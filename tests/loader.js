import test from 'ava';
import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import dirHelper from './utils/dirHelper.js';

const loader = path.join(__dirname, '../lib/index.js');
const config = {
	entry: {
		'app-one': path.join(__dirname, 'fixtures/default.js'),
		'app-two': path.join(__dirname, 'fixtures/default-two.js'),
		'app-three': path.join(__dirname, 'fixtures/default-three.js'),
		'ignored-app': path.join(__dirname, 'fixtures/ignored.js')
	},
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
					dest: path.join(__dirname, 'output/loader/manifests'),
					commonScripts: ['s1.js', 's2,js'],
					commonStyles: ['s1.css', 's2.css']
				}
			}
		]
	}
};

let stats = null;
let data = null;

test.cb.before('setup', t => {
	dirHelper.create(__dirname, 'output/loader', (err, dir) => {
		if (err) return t.end(err);

		webpack(config, (err, statsObj) => {
			if (err) return t.end(err);

			if (statsObj.hasErrors()) return t.end('stats error');

			stats = statsObj;
			data = fs.readFileSync(
				path.join(__dirname, 'output/loader/manifests/com_open_f2_test_app_manifest.js'),
				'utf8'
			);

			t.end();
		});
	});
});

test.cb.after('cleanup', t => {
	dirHelper.remove(__dirname, 'output/loader', () => {
		t.end();
	});
});

test.cb('the correct number of manifests are generated', t => {
	fs.readdir(path.join(__dirname, 'output/loader/manifests'), (err, files) => {
		t.is(err, null);
		t.is(files.length, 3);
		t.end();
	});
});

test.cb('manifests are valid', t => {
	const data = fs.readFileSync(
		path.join(__dirname, 'output/loader/manifests/com_open_f2_test_app_manifest.js'),
		'utf8'
	);
	const regex = /F2_jsonpCallback_com_open_f2_test_app\(([\s\S]+)\)/m;
	const match = data.match(regex);
	t.not(match, null);
	try {
		const json = JSON.parse(match[1]);
		t.pass();
	} catch (e) {
		t.fail();
	}
	t.end();
});

test.cb('manifests cachebust', t => {
	const regex = /\.(js|css)\?v=\d+/g;
	t.true(regex.test(data));
	t.end();
});

test.cb('manifests use forwardslashes for paths', t => {
	const regex = /F2_jsonpCallback_com_open_f2_test_app\(([\s\S]+)\)/m;
	const match = data.match(regex);
	t.not(match, null);

	const json = JSON.parse(match[1]);
	const slashRegex = /\\/g;
	for (let i = 0; i < json.scripts.length; i++) {
		t.not(slashRegex.test(json.scripts[i]));
	}
	t.end();
});

test.cb('manifests include the right number of common assets when provided', t => {
	const regex = /F2_jsonpCallback_com_open_f2_test_app\(([\s\S]+)\)/m;
	const match = data.match(regex);
	t.not(match, null);

	const json = JSON.parse(match[1]);
	t.is(json.styles.length, 2, '... for styles');
	t.is(json.scripts.length, 3, '... for scripts');
	t.end();
});

test.cb('appclasses with "f2manifest-loader-ignore" are not processed', t => {
	t.false(
		fs.existsSync(
			path.join(__dirname, 'output/loader/manifests/com_open_f2_ignored_app_manifest.js')
		)
	);
	t.end();
});

test.todo('app.html defaults to a self-closing tag with kebab-cased appid');
test.todo('manifests include the appclass correctly');
