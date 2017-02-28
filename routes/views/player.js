var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var Audio = keystone.list('Audio');
	var locals = res.locals;

	view.on('init', function (next) {
		Audio.model.findOne({slug: req.params.audio}, function (err, results) {
			if (err) return next(err);
			locals.audio = results;
			next();
		});
	});

	view.render('player');
};