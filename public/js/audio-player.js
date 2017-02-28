(function() {
	var iframe = null;
	var scplayer = null;
	var data = {};
	var interval;
	var firstPlay = true;
	var firstLoad = true;
	var soundCloudURL = null;
	var activePlayer = null;

	var components = {
		player: document.getElementById('player'),
		play: document.getElementsByClassName('js-play'),
		duration: document.getElementById('duration'),
		elapsed: document.getElementById('elapsed-container'),
		elapsedNumber: document.getElementById('elapsed-number'),
		elapsedBar: document.getElementById('elapsed-bar'),
	};

	var utils = {
		toSeconds: function (miliseconds) {
			return miliseconds / 1000;
		},

		toMinutes: function (miliseconds) {
			return this.toSeconds(miliseconds) / 60; 
		},

		toHours: function (miliseconds) {
			return this.toMinutes(miliseconds) / 60;
		},

		addPadding: function (string) {
			if (typeof string !== 'string') string = String(string);
			if (string.length < 2) string = '0' + string;
			return string;
		},
	};

	var playerActions = {
		generateTimestamp: function (ms) {
			var hours, minutes, seconds;

			hours = utils.addPadding(Math.trunc(utils.toHours(ms)));
			ms = ms - hours * 3600000;
			minutes = utils.addPadding(Math.trunc(utils.toMinutes(ms)) % 60);
			ms = ms - minutes * 60000;
			seconds = utils.addPadding(Math.trunc(utils.toSeconds(ms)) % 60);

			return hours !== '00' ? hours + ':' : '' + minutes + ':' + seconds;
		},

		updateTimer: function (position) {
			// In the first second of PLAY, position is undefined
			if (position != null) {
				components.elapsedNumber.innerText = this.generateTimestamp(position);
			}
		},

		updateScrubber: function (position, duration) {
			components.elapsedBar.style.width = position * 100 / duration + '%';
		},

		togglePlayButton: function (button) {
			button.classList.toggle('player__play');
			button.classList.toggle('player__pause');
		},
	};

	for (i = 0; i < components.play.length; i++) {
		components.play[i].addEventListener('click', function (event) {
			event.preventDefault();

			var newSoundCloudURL = this.getAttribute('data-sc-url');

			if (firstLoad) {
				firstLoad = false;
				soundCloudURL = newSoundCloudURL;
				iframe = document.createElement('iframe');
				iframe.src = 'http://w.soundcloud.com/player/?url=' + newSoundCloudURL;
				iframe.frameborder = '0';
				iframe.scrolling = 'no';
				iframe.style.visibility = 'hidden';
				document.body.appendChild(iframe);
				scplayer = SC.Widget(iframe);
				soundCloudEvents(scplayer);
				playerActions.togglePlayButton(this);
			} else if (soundCloudURL !== newSoundCloudURL) {
				scplayer.load(newSoundCloudURL, {
					auto_play: true,
				});
				soundCloudURL = newSoundCloudURL;
				playerActions.togglePlayButton(activePlayer);
				playerActions.togglePlayButton(this);
			} else {
				scplayer.toggle();
				playerActions.togglePlayButton(this);
			}

			activePlayer = this;
		});
	}

	function soundCloudEvents(player) {
		player.bind(SC.Widget.Events.READY, function () {
			/**
				SoundCloud Events
			 */

			player.play();
			// player.play(); // Start preloading to make player.seekTo() work

			player.bind(SC.Widget.Events.PLAY, function (event) {
				// if (firstPlay) {
				// 	firstPlay = false;
				// 	player.pause(); // We pause it as soon as it starts playing
				// }

				player.getDuration(function (duration) {
					data.duration = duration;
					components.duration.innerText = playerActions.generateTimestamp(data.duration);
				});

				components.player.style.display = 'block';
				components.player.style.bottom = '0';

				interval = setInterval(function () {
					playerActions.updateTimer(data.position);
				}, 1000);
			});

			player.bind(SC.Widget.Events.PAUSE, function () {
				clearInterval(interval);
			});

			player.bind(SC.Widget.Events.FINISH, function () {
			});

			player.bind(SC.Widget.Events.PLAY_PROGRESS, function () {
				player.getPosition(function (position) {
					data.position = position;
					playerActions.updateScrubber(data.position, data.duration);
				});
			});

			player.bind(SC.Widget.Events.SEEK, function () {
				player.getPosition(function (position) {
					data.position = position;
				});
			});


			/**
				Custom events
			 */

			// components.play.addEventListener('click', function (event) {
			// 	event.preventDefault();
			// 	player.toggle();
			// });

			components.elapsed.addEventListener('click', function (event) {
				var rect = this.getBoundingClientRect();
				var position = event.clientX - rect.left;
				var totalLength = rect.right - rect.left;
				var percentage = Math.round(position * 100 / totalLength);
				var newPosition = percentage / 100 * data.duration;

				player.seekTo(newPosition);
				playerActions.updateTimer(newPosition);
				playerActions.updateScrubber(newPosition, data.duration);
			});
		});
	}

})();