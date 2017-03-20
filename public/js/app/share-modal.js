define(['jquery'], function ($) {
	var playerBox = $('.js-player-box');
	var shareModal = $('.js-share-modal');

	playerBox.click(function (e) {
		e.preventDefault();
			
		if (e.target.id == 'share') {
			shareModal.fadeToggle('fast');
		} else if (e.target.id !== 'share-modal') {
			shareModal.fadeOut('fast');
		}
	});
});