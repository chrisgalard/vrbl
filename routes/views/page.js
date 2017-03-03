var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	view.on('init', function (next) {
		var q = keystone.list('Page').model.findOne({slug: req.params.page});
		q.exec(function (err, page) {
			if (err) return next(err);
			locals.page = page;
			next(err);
		});
	});

	view.render('page');
};