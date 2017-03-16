define(function () {
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

	return Timestamp;
});