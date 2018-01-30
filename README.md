[![npm version](https://badge.fury.io/js/f2-manifest-loader.svg)](https://badge.fury.io/js/f2-manifest-loader) [![Build Status](https://travis-ci.org/markitondemand/f2-manifest-loader.svg?branch=master)](https://travis-ci.org/markitondemand/f2-manifest-loader) [![Coverage Status](https://coveralls.io/repos/github/markitondemand/f2-manifest-loader/badge.svg?branch=master)](https://coveralls.io/github/markitondemand/f2-manifest-loader?branch=master)

# F2 Manifest Loader

This package enables the automatic generation of app manifests using F2 and [webpack](https://github.com/webpack/webpack)

* Produces JS and JSON manifests 
* Scripts and styles automatically have a cachebuster appended

## Usage

```javascript
loaders: [
    // ...
    {
        test: /\.jsx?/,
        loader: 'f2-manifest-loader',
        include: 'src/appclasses',
        options: {
            dest: path.join(__dirname, 'dist/manifests'),
            appclass: path.join(
                'http://my-server.com', 
                'dist/my-app.js'
            ),
            commonScripts: ['http://my-cdn.com/bootstrap.js'],
            commonStyles: ['http://my-cdn.com/nice-styles.css'],
            inlineScripts: ['window.myObject = {hello: "world"}'],
            html: '<my-app class="my-class"></my-app>'
        }
    }
]
```

Produces:

```javascript
// dist/manifests/com_open_f2_app_one_manifest.js
F2_jsonpCallback_com_open_f2_app_one({
    "inlineScripts":[window.myObject = {hello: "world"}],
    "scripts":[
        "http:/my-cdn.com/bootstrap.js?v=1517269612205",
        "http:/my-server.com/dist/my-app.js?v=1517269612205"
    ],
    "styles":[
        "http:/my-cdn.com/nice-styles.css?v=1517269612205"
    ],
    "apps":[{
        "html":"<my-app class="my-class"></my-app>"
    }]
})
```

## `options`

These options are available on top of the standard Webpack loader options:

* `dest`: String (**required**, default: `null`) - path to destination folder for app manifests. All manifests are generated as `<app_id>_manifest.js`
* `appclass`: String (**required**, default: `dist/[name].js`) - path to the built appclass
* `commonScripts`: [String] - array of common scripts to be included before the appclass
* `inlineScripts`: [String] - array of inline scripts to be included
* `html`: String (default: `<app-id />` lower-kebab-cased app id as declared in the appclass) - app HTML

### Ignoring files

Include `f2-manifest-loader-ignore` (case sensitive) in a comment in any source file to have that file ignored by the loader.

```javascript
// f2-manifest-loader-ignore

F2.Apps['com_open_f2_ignored_app'] = class app {
    constructor(appConfig, appContent, root) {
        this.appConfig = appConfig;
        this.appContent = appContent;
        this.root = root;
    }

    init() {
        console.log('This app will not have its manifest generated');
    }
};
```
