function Timestamp(milliseconds) {
	var type = typeof milliseconds;

	if (type !== 'string' && type !== 'number')
		throw new TypeError('You need to pass a number or string');

	this.milliseconds = milliseconds;
}

Timestamp.prototype.toSeconds = function () {
	return this.milliseconds / 1000;
};

Timestamp.prototype.toMinutes = function () {
	return this.toSeconds(this.milliseconds) / 60; 
};

Timestamp.prototype.toHours = function () {
	return this.toMinutes(this.milliseconds) / 60;
};

Timestamp.prototype.toString = function () {
	var addPadding = function (time) {
		var string = String(time);
		if (string.length < 2) string = '0' + string;
		return string;
	};

	var hours, minutes, seconds, milliseconds;

	hours = addPadding(Math.trunc(this.toHours()));
	milliseconds -= hours * 3600000;
	minutes = addPadding(Math.trunc(this.toMinutes()) % 60);
	milliseconds -= minutes * 60000;
	seconds = addPadding(Math.trunc(this.toSeconds()) % 60);

	return (hours !== '00' ? hours + ':' : '') + minutes + ':' + seconds;
}


var BottomPlayer = function (target) {
	this.DOMElement = render(target);

	this.hide = function () {
		this.DOMElement.classList.remove('is-visible');
	};

	this.show = function () {
		this.DOMElement.classList.add('is-visible');
	};

	this.setState = function (state) {
		var playButton = this.DOMElement.getElementById('play');

		if (state === 'playing') {
			// is-loading class could be active here
			if (playButton.classList.contains('is-loading'))
				playButton.classList.remove('is-loading');

			playButton.classList.add('is-playing');
		} else if (state === 'paused') {
			playButton.classList.remove('is-playing');
		} else {
			playButton.classList.add('is-loading');
		}
	};

	this.setTimer = function (miliseconds) {
		var timer = this.DOMElement.getElementById('timer');
		timer.innerText = new Timestamp(miliseconds);
	};

	function render(target) {
		var player = document.createElement('div');
		player.id = player.className = 'player';

		player.innerHTML = [
			'<div class="container">',
			'	<img class="player-thumbnail" src="#" alt="Title of the song">',
			'	<a id="play" class="js-play play-btn" href="#">Play</a>',
			'	<div id="timeline" class="timeline">',
			'		<div id="timer" class="elapsed-number">',
			'			00:00',
			'		</div>',
			'		<div id="elapsed-container" class="elapsed-container">',
			'			<div id="elapsed-bar" class="elapsed-bar"></div>',
			'		</div>',
			'		<div id="total-duration" class="total-duration">',
			'			00:00',
			'		</div>',
			'	</div>',
			'</div>',
		].join('\n');

		return target.appendChild(player);
	};
};

var player = new BottomPlayer(document.body);
console.log(player);
// player.render();
// player.hide();
// player.show();
// player.setState('paused|playing|loading');
// player.setTimer();
// player.setScrubber();
// player.setDuration();
// player.setTitle();
// player.setThumbnail();

var soundCloudPlayer = function() {

	function renderPlayer(target) {
		var player = document.createElement('div');
		player.id = player.className = 'player';

		player.innerHTML = [
			'<div class="container">',
			'	<img class="player-thumbnail" src="" alt="Title of the song">',
			'	<a class="js-play play-btn" href="#">Play</a>',
			'	<div id="timeline" class="timeline">',
			'		<div id="elapsed-number" class="elapsed-number">',
			'			00:00',
			'		</div>',
			'		<div id="elapsed-container" class="elapsed-container">',
			'			<div id="elapsed-bar" class="elapsed-bar"></div>',
			'		</div>',
			'		<div id="total-duration" class="total-duration">',
			'			00:00',
			'		</div>',
			'	</div>',
			'</div>',
		].join('\n');

		return target.appendChild(player);
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

	var player = renderPlayer(document.body);
	var widget = loadWidget(document.body);
	var data = {};
	var interval;
	var soundCloudURL = null;
	var activeButton = null;

	soundCloudEvents(widget);

	var components = {
		player: document.getElementById('player'),
		play: document.getElementsByClassName('js-play'),
		duration: document.getElementById('total-duration'),
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

		togglePlayButton: function (button, state) {
			button.classList.toggle(state);
		},
	};


	// Binding all the play buttons to the click event
	for (i = 0; i < components.play.length; i++) {
		components.play[i].addEventListener('click', function (event) {
			event.preventDefault();

			var self = this;
			var newSoundCloudURL = self.href;

			if (soundCloudURL !== newSoundCloudURL) {
				if (activeButton && activeButton.classList.contains('is-playing'))
					playerActions.togglePlayButton(activeButton, 'is-playing');

				playerActions.togglePlayButton(self, 'is-loading');

				loadNewTrack(widget, newSoundCloudURL, function () {
					soundCloudURL = newSoundCloudURL;
					playerActions.togglePlayButton(self, 'is-loading');
					playerActions.togglePlayButton(self, 'is-playing');
					widget.play();
				});
			} else {
				widget.toggle();
				playerActions.togglePlayButton(self, 'is-playing');
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

soundCloudPlayer();