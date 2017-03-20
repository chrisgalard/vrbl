define(function () {
	function bindEvents() {
		var that = this;

		// A hashmap with all the custom events
		var customEvents =  {
			play: function () {
				this.dispatchEvent(new Event('play'));
			},

			pause: function () {
				this.dispatchEvent(new Event('pause'));
			},

			seek: function (newPercentage, newPosition) {
				this.dispatchEvent(new CustomEvent('seek', {
					detail: {
						newPercentage: newPercentage,
						newPosition: newPosition
					}
				}));
			},

			close: function () {
				this.dispatchEvent(new Event('close'));
			}
		};

		// Triggering custom events
		this.DOMElement.addEventListener('click', function (e) {
			e.preventDefault();

			var id = e.target.id;

			if (id === 'progress-container' || id === 'progress') {
				var rect = document.getElementById('progress-container').getBoundingClientRect();
				var position = e.clientX - rect.left;
				var totalLength = rect.right - rect.left;
				var newPercentage = Math.round(position * 100 / totalLength);
				var newPosition = newPercentage / 100 * that.duration;

				customEvents.seek.call(this, newPercentage, newPosition);

				return;
			}

			// I really love hashmaps
			var targetIds = {
				'play': customEvents.play,
				'pause': customEvents.pause,
				'close': customEvents.close
			};

			if (targetIds[id])
				targetIds[id].call(this);
		});

		// A short alias for this.DOMElement.addEventListener
		this.on = function (event, callback) {
			this.DOMElement.addEventListener(event, callback.bind(this));
		};

		// Internal handlers
		this.on('play', function () {
			that.setState('playing');
		});
		
		this.on('pause', function () {
			that.setState('paused');
		});
	}

	return bindEvents;
});