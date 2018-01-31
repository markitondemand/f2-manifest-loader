'use strict';

var fs = require('fs');
var path = require('path');
var mustache = require('mustache');
var mkdirp = require('mkdirp');
var loaderUtils = require('loader-utils');

/**
 * Custom error that gets passed to webpack.
 * Adapted from <https://github.com/babel/babel-loader>
 */
function F2ManifestsLoaderError(message, error) {
	Error.call(this);

	this.name = 'F2ManifestsLoaderError';
	this.message = message;
	this.error = error;

	Error.captureStackTrace(this, F2ManifestsLoaderError);
}

/**
 * Normalises slashes on paths to forward slashes
 * Adapted from <https://github.com/jonschlinkert/normalize-path>
 * @param  {string} str Input path
 * @return {string}     Path, normalised
 */
function normalizePath(str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected string');
	}

	return str.replace(/[\\\/]/g, '/');
}

F2ManifestsLoaderError.prototype = Object.create(Error.prototype);
F2ManifestsLoaderError.prototype.constructor = F2ManifestsLoaderError;

module.exports = function (source) {
	var ignoreRegex = /f2-manifest-loader-ignore/g;
	if (ignoreRegex.test(source)) {
		return source;
	}

	var loaderOptions = loaderUtils.getOptions(this) || {};

	// Check for output destination for the manifests
	if (!loaderOptions.dest) {
		throw new F2ManifestsLoaderError('Output destination required but not defined');
	}

	// Grab appid from the F2.Apps['APP_ID'] declaration in an appclass
	var regex = /F2.Apps\[('|")(.+?)('|")\]/g;
	var match = regex.exec(source);
	// Abort if file is not an appclass
	if (!match || !match.length) {
		return source;
	}

	var appid = match[2];

	// Build up scripts
	var scripts = [];
	var cacheBuster = Date.now();

	// Load common scripts first
	var commonScripts = loaderOptions.commonScripts;
	if (commonScripts && commonScripts.length) {
		commonScripts.forEach(function (script) {
			scripts.push('"' + normalizePath(script) + '?v=' + cacheBuster + '"');
		});
	}

	// Load appclass script
	// Interpolate name https://github.com/webpack/loader-utils#interpolatename
	var context = this.rootContext || this.options && this.options.context;
	// dont use hash
	var appclass = loaderUtils.interpolateName(this, loaderOptions.appclass || 'dist/[name].js', {
		context: context,
		content: source
	});
	appclass = normalizePath(appclass);
	scripts.push('"' + appclass + '?v=' + cacheBuster + '"');

	// Load styles
	var styles = [];
	var commonStyles = loaderOptions.commonStyles;
	if (commonStyles && commonStyles.length) {
		commonStyles.forEach(function (style) {
			styles.push('"' + normalizePath(style) + '?v=' + cacheBuster + '"');
		});
	}

	// Write out the manifests
	var templateOptions = {
		appid: appid,
		scripts: scripts.join(',\n\t\t'),
		inlineScripts: loaderOptions.inlineScripts || null,
		styles: styles.join(',\n\t\t'),
		html: loaderOptions.html || '<' + appid.trim().replace(/_/g, '-') + ' />'
	};

	if (!fs.existsSync(normalizePath(loaderOptions.dest))) {
		mkdirp.sync(normalizePath(loaderOptions.dest));
	}

	var template = fs.readFileSync(path.join(__dirname, './template.js'), 'utf8');
	var output = mustache.render(template, templateOptions);
	var outputPath = path.join(normalizePath(loaderOptions.dest), appid + '_manifest.js');
	fs.writeFileSync(outputPath, output);

	var templateJson = fs.readFileSync(path.join(__dirname, './templateJson.js'), 'utf8');
	var outputJson = mustache.render(templateJson, templateOptions);
	var outputJsonPath = path.join(normalizePath(loaderOptions.dest), appid + '_manifest.json');
	fs.writeFileSync(outputJsonPath, outputJson);

	return source;
};