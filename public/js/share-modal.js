(function () {

	var player = document.getElementById('player');
	var shareModal = document.getElementById('share-modal');
	var display = 'none';

	player.addEventListener('click', function (event) {
		if (event.target.id == 'share') {
			event.preventDefault();
			display = display == 'block' ? 'none' : 'block';
			shareModal.style.display = display;
		} else if (event.target.id !== 'share-modal') {
			shareModal.style.display = 'none';
			display = 'none';
		}
	});

})();