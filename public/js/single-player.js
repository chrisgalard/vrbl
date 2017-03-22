require(['config'], function () {
	require(['app/soundcloud', 'app/share-modal'], function () {
		console.log('Embedded player dependencies loaded');
	});
});