const mkdirp = require('mkdirp');
const loaderUtils = require('loader-utils');

/**
 * Custom error that gets passed to webpack
 * @param {[type]} message [description]
 * @param {[type]} error   [description]
 */
function F2ManifestsLoaderError(message, error) {
	Error.call(this);

	this.name = "F2ManifestsLoaderError";
	this.message = message;
	this.error = error;

	Error.captureStackTrace(this, F2ManifestsLoaderError);
}

F2ManifestsLoaderError.prototype = Object.create(Error.prototype);
F2ManifestsLoaderError.prototype.constructor = LoaderError;

module.exports = function(source) {
	const loaderOptions = loaderUtils.getOptions(this) || {};

	// Check for output destination for the manifests
	if (!loaderOptions.dest) {
		throw new F2ManifestsLoaderError(
			'Output destination required but not defined'
		);

		return content;
	}

	// Check for F2 app id
	let appid = null;
	const regex = /F2.Apps\['(.*?)'\]/g;
	const match = regex.exec(content);

	if(!match || match.length) {
		return content;
	}

	const defaultManifest = {
		output: loaderOptions.dest
	}
}