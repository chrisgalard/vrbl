require.config({
	baseUrl: '/js/lib',
	paths: {
		app: '../app',
		soundcloudApi: 'https://w.soundcloud.com/player/api'
	},
	shim: {
		'soundcloudApi': {
			exports: 'SC'
		}
	}
});

require(['app/navigation', 'app/top-selector', 'app/soundcloud'], function () {
	console.log('All dependencies have been loaded');
});