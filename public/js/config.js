require.config({
	baseUrl: '/js/lib',
	paths: {
		app: '../app',
		soundcloudApi: 'https://w.soundcloud.com/player/api',
		config: '../config'
	},
	shim: {
		'soundcloudApi': {
			exports: 'SC'
		}
	}
});