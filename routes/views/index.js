var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var Audio = keystone.list('Audio');
	var Show = keystone.list('AudioShow');
	var locals = res.locals;
	var audioTypes = {};

	view.on('init', function (next) {
		Audio.model.find({type: 'featured'}, function (err, results) {
			audioTypes.featured = results;
			next(err);
		});
	});

	view.on('init', function (next) {
		Audio.model.find({type: 'trending'}, function (err, results) {
			audioTypes.trending = results;
			next(err);
		});
	});

	view.on('init', function (next) {
		Audio.model.find({type: 'favorites'}, function (err, results) {
			audioTypes.favorites = results;
			next(err);
		})
	});

	view.on('init', function (next) {
		Show.model.find(function (err, shows) {
			res.locals.shows = shows;
			next(err);
		});
	});

	view.on('render', function (next) {
		locals.audioTypes = audioTypes;
		next();
	});

	view.render('index');
};