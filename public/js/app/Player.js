define(['app/Timestamp', 'app/events'], function (Timestamp, bindCustomEvents) {
	function Player(target) {
		this.title = 'VRBL Audio Player';
		this.thumbnail = 'http://placehold.it/50x50';
		this.duration = 0;
		this.position = 0;
		this.state = 'initial';
		this.DOMElement = render(target);

		this.hide = function () {
			this.DOMElement.classList.remove('is-visible');
		};

		this.show = function () {
			this.DOMElement.classList.add('is-visible');
		};

		this.setState = function (state) {
			var stateButton = document.getElementById('play') ||
				document.getElementById('pause');

			if (state === 'loading') {
				this.state = 'loading';

				if (stateButton.classList.contains('is-playing'))
					stateButton.classList.remove('is-playing');

				stateButton.classList.add('is-loading');
			} else if (state === 'playing') {
				this.state = 'playing';

				if (stateButton.classList.contains('is-loading'))
					stateButton.classList.remove('is-loading');

				stateButton.classList.add('is-playing');
				stateButton.id = 'pause';
			} else if (state === 'paused') {
				this.state = 'paused';

				stateButton.classList.remove('is-playing');
				stateButton.classList.remove('is-loading');
				stateButton.id = 'play';
			}
		};

		this.setTimer = function (miliseconds) {
			var timerElement = document.getElementById('timer');
			timerElement.innerText = new Timestamp(miliseconds);
		};

		this.setProgress = function (position) {
			var progressElement = document.getElementById('progress');
			progressElement.style.width = position + '%';
			// progressElement.style.width = position * 100 / this.duration + '%';
		};

		this.setDuration = function (duration) {
			var durationElement = document.getElementById('duration');
			durationElement.innerText = new Timestamp(duration);
			this.duration = duration;
		};

		this.setTitle = function (title) {
			var titleElement = document.getElementById('title');

			this.title = title || this.title;
			titleElement.innerText = this.title;
		};

		this.setThumbnail = function (url) {
			var thumbnailElement = document.getElementById('thumbnail');
			
			this.thumbnail = url || this.thumbnail;
			thumbnail.src = this.thumbnail;
		};

		function render(target) {
			var player = document.createElement('div');
			player.id = 'player';
			player.className = 'player';

			player.innerHTML = [
				'<div class="container">',
				'	<img id="thumbnail" class="player-thumbnail" src="http://placehold.it/50x50" alt="Title of the song">',
				'	<a id="play" class="play-btn" href="#" data-state="initial">Play</a>',
				'	<div class="player-info">',
				'		<h2 id="title" class="player-title">VRBL Audio Player</h2>',
				'		<div id="timeline" class="player-progress clearfix">',
				'			<div id="progress-container" class="player-bar-container">',
				'				<div id="progress" class="player-bar"></div>',
				'			</div>',
				'			<div id="timer" class="player-timer">',
				'				00:00',
				'			</div>',
				'			<div id="duration" class="player-duration">',
				'				00:00',
				'			</div>',
				'		</div>',
				'	</div>',
				'	<a id="close" class="player-close" href="#">×</a>',
				'</div>',
			].join('\n');

			return target.appendChild(player);
		};

		bindCustomEvents.call(this);
	}

	return Player;
});