var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Load the current category filter
	view.on('init', function (next) {
		keystone.list('AudioCategory').model.findOne({ slug: req.params.category }).exec(function (err, result) {
			locals.category = result;
			next(err);
		});
	});

	view.on('init', function (next) {
		var q = keystone.list('Audio').model.find();

		q.where('categories').in([locals.category]);

		q.exec(function (err, results) {
			locals.audios = results;
			next(err);
		});
	});

	// Render the view
	view.render('category');
};