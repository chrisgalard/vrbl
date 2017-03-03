var soundCloudPlayer = function() {

	function Timestamp(milliseconds) {
		var type = typeof milliseconds;

		if (type !== 'string' && type !== 'number')
			throw new TypeError('You need to pass a number or string');

		var addPadding = function (time) {
			var string = String(time);
			if (string.length < 2) string = '0' + string;
			return string;
		};

		this.milliseconds = milliseconds;

		this.toSeconds = function () {
			return this.milliseconds / 1000;
		};

		this.toMinutes = function () {
			return this.toSeconds(this.milliseconds) / 60; 
		};

		this.toHours = function () {
			return this.toMinutes(this.milliseconds) / 60;
		};

		this.toString = function () {
			var hours, minutes, seconds, milliseconds;

			hours = addPadding(Math.trunc(this.toHours()));
			milliseconds -= hours * 3600000;
			minutes = addPadding(Math.trunc(this.toMinutes()) % 60);
			milliseconds -= minutes * 60000;
			seconds = addPadding(Math.trunc(this.toSeconds()) % 60);

			return (hours !== '00' ? hours + ':' : '') + minutes + ':' + seconds;
		}
	}

	function loadWidget(target) {
		var iframe = document.createElement('iframe');
		iframe.src = 'http://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2';
		iframe.frameborder = '0';
		iframe.scrolling = 'no';
		iframe.style.visibility = 'hidden';
		target.appendChild(iframe);
		return SC.Widget(iframe);
	}

	function loadNewTrack(widget, url, callback) {
		widget.load(url, {
			callback: callback,
		});
	}

	var widget = loadWidget(document.body);
	var data = {};
	var interval;
	var soundCloudURL = null;
	var activeButton = null;

	soundCloudEvents(widget);

	var components = {
		player: document.getElementById('player'),
		play: document.getElementsByClassName('js-play'),
		duration: document.getElementById('duration'),
		elapsed: document.getElementById('elapsed-container'),
		elapsedNumber: document.getElementById('elapsed-number'),
		elapsedBar: document.getElementById('elapsed-bar'),
	};

	var playerActions = {
		updateTimer: function (position) {
			// In the first second of PLAY, position is undefined
			if (position != null) {
				components.elapsedNumber.innerText = new Timestamp(position).toString();
			}
		},

		updateScrubber: function (position, duration) {
			components.elapsedBar.style.width = position * 100 / duration + '%';
		},

		togglePlayButton: function (button) {
			button.classList.toggle('play-btn');
			button.classList.toggle('pause-btn');
		},
	};

	// Binding all the play buttons to the click event
	for (i = 0; i < components.play.length; i++) {
		components.play[i].addEventListener('click', function (event) {
			event.preventDefault();

			var self = this;
			var newSoundCloudURL = self.href;

			if (soundCloudURL !== newSoundCloudURL) {
				if (activeButton)
					playerActions.togglePlayButton(activeButton);

				loadNewTrack(widget, newSoundCloudURL, function () {
					soundCloudURL = newSoundCloudURL;
					playerActions.togglePlayButton(self);
					widget.play();
				});
			} else {
				widget.toggle();
				playerActions.togglePlayButton(self);
			}

			activeButton = self;
		});
	}

	function soundCloudEvents(player) {
		player.bind(SC.Widget.Events.READY, function () {
			/**
				SoundCloud Events
			 */

			player.bind(SC.Widget.Events.PLAY, function (event) {
				player.getDuration(function (duration) {
					data.duration = duration;
					components.duration.innerText = new Timestamp(data.duration).toString();
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
				playerActions.togglePlayButton(activeButton);
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

			components.elapsed.addEventListener('click', function (event) {
				if (data.position == null) return; // The play button has not been clicked/tapped

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

};

soundCloudPlayer({
	preload: true
});