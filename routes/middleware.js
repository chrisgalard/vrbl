var _ = require('lodash');
var keystone = require('keystone');


/**
	Initialises the standard view locals
*/
exports.initLocals = function (req, res, next) {
	var locals = res.locals;
	locals.data = {
		fullUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
	};
	locals.menu = {};
	
	keystone.list('AudioCategory').model.find(function (err, categories) {
		if (err) return next(err);

		locals.menu.categories = categories;
		locals.user = req.user;

		keystone.list('Page').model.find(function (err, pages) {
			if (err) return next(err);

			locals.pages = pages;

			next();
		});
	});
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};
