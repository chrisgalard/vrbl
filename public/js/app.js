// Load the config first
require(['config'], function () {
	require(['app/navigation', 'app/top-selector', 'app/soundcloud'], function () {
		console.log('All dependencies have been loaded');
	});
});