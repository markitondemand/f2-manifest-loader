//f2-manifest-loader-ignore

F2.Apps['com_open_f2_ignored_app'] = class app {
	constructor(appConfig, appContent, root) {
		this.appConfig = appConfig;
		this.appContent = appContent;
		this.root = root;
	}

	init() {
		console.log('Hello world');
	}
};
