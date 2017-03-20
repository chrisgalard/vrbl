var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	view.on('init', function (next) {
		keystone.list('AudioShow').model.findOne({ slug: req.params.show }).exec(function (err, show) {
			locals.show = show;
			next(err);
		});
	});
	
	view.on('init', function (next) {
		var q = keystone.list('Audio').model.find();

		q.where('shows').in([locals.show]);

		q.exec(function (err, results) {
			locals.audios = results;
			next(err);
		});
	});

	view.render('show');

};