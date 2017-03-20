var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var Audio = keystone.list('Audio');
	var locals = res.locals;

	view.on('init', function (next) {
		Audio.model.findOne({slug: req.params.audio}, function (err, audio) {
			if (err) return next(err);
			locals.audio = audio;
			next();
		});
	});

	view.render('player');
};