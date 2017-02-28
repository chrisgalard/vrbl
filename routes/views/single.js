var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var Audio = keystone.list('Audio');
	var Sidebar = keystone.list('Sidebar');
	var locals = res.locals;

	view.on('init', function (next) {
		var q = Audio.model.findOne({
			state: 'published',
			slug: req.params.audio,
		}).populate('categories');

		q.exec(function (err, result) {
			if (err) return next(err);
			locals.audio = result;
			next();
		});
	});

	// Related audios
	view.on('init', function (next) {
		var q = Audio.model.find().
				where('categories').in(locals.audio.categories).
				where('slug').ne(locals.audio.slug).limit(3);
		q.exec(function (err, result) {
			if (err) return next(err);
			locals.related = result;
			next();
		});
	});

	// The sidebar contents
	view.on('init', function (next) {
		Sidebar.model.find(function (err, results) {
			locals.sidebar = results;
			next(err);
		});
	});

	// Render the view
	view.render('single');
};