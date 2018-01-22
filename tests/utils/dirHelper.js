import path from 'path';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';

function create(baseDir, newDir, callback) {
	const dir = path.join(baseDir, newDir);

	rimraf(dir, err => {
		if (err) {
			return callback(err);
		}

		mkdirp(dir, err2 => {
			callback(err2, dir);
		});
	});
}

function remove(baseDir, newDir, callback) {
	const dir = path.join(baseDir, newDir);

	rimraf(dir, () => {
		callback();
	});
}

export default { create, remove };
