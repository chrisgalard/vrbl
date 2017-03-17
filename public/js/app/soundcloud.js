define(['soundcloudApi', 'app/Player'], function (SC, Player) {
	var bottomPlayer = new Player(document.body);
	var widget = loadWidget(document.body);
	var soundCloudURL = null;
	var activeButton = null;

	function loadWidget(target) {
		var iframe = document.createElement('iframe');
		iframe.src = 'http://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2';
		iframe.frameborder = '0';
		iframe.scrolling = 'no';
		iframe.style.visibility = 'hidden';
		iframe.style.opacity = '0';
		target.appendChild(iframe);
		return SC.Widget(iframe);
	}

	function loadNewTrack(url, callback) {
		widget.load(url, {
			callback: callback,
		});
	}

	function initSoundCloud() {
		var playButtons = document.getElementsByClassName('js-play');
		
		for (var i = 0; i < playButtons.length; i++) {
			playButtons[i].addEventListener('click', function (e) {
				e.preventDefault();

				// In case it was closed
				bottomPlayer.show();

				var that = this;
				newSoundCloudURL = this.href;

				if (newSoundCloudURL !== soundCloudURL) {
					widget.pause();
					bottomPlayer.setProgress(0);
					bottomPlayer.setTimer(0);
					bottomPlayer.setState('loading');
					bottomPlayer.setTitle(this.getAttribute('data-title'));
					bottomPlayer.setThumbnail(this.getAttribute('data-thumbnail'));

					if (activeButton)
						activeButton.classList.remove('is-playing');

					loadNewTrack(newSoundCloudURL, function () {
						widget.getDuration(function (duration) {
							bottomPlayer.setDuration(duration);
							bottomPlayer.setState('playing');
							widget.play();
							that.classList.add('is-playing');
						});
					});

					soundCloudURL = newSoundCloudURL;
				} else {
					if (bottomPlayer.state === 'playing') {
						bottomPlayer.setState('paused');
					} else if (bottomPlayer.state === 'paused') {
						bottomPlayer.setState('playing');
					}

					that.classList.toggle('is-playing');
					widget.toggle();
				}

				activeButton = this;
			});
		}

		widget.bind(SC.Widget.Events.PLAY_PROGRESS, function (data) {
			bottomPlayer.position = data.currentPosition;
			bottomPlayer.setProgress(data.currentPosition * 100 / bottomPlayer.duration);
			bottomPlayer.setTimer(data.currentPosition);
		});

		widget.bind(SC.Widget.Events.FINISH, function () {
			bottomPlayer.setState('paused');
		});

		bottomPlayer.on('play', function () {
			widget.play();
			activeButton.classList.add('is-playing');
		});

		bottomPlayer.on('pause', function () {
			widget.pause();
			activeButton.classList.remove('is-playing');
		});

		bottomPlayer.on('seek', function (e) {
			widget.seekTo(e.detail.newPosition);
			this.setProgress(e.detail.newPercentage);
		});

		bottomPlayer.on('close', function () {
			widget.pause();
			this.hide();
			activeButton.classList.remove('is-playing');
		});
	}

	widget.bind(SC.Widget.Events.READY, initSoundCloud);

	window.player = bottomPlayer;
	window.widget = widget;
});