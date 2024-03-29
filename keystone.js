// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'host': '0.0.0.0',

	'name': 'VRBL',
	'brand': 'VRBL',

	'static': 'public',
	'favicon': 'public/favicon.ico',

	'views': 'templates/views',
	'view engine': 'pug',
	'view cache': false,

	'auto update': true,
	'mongo': process.env.MONGO_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/vrbl',

	'session': true,
	// 'session store': 'mongo',
	'auth': true,
	'user model': 'User',
	'cookie secret': process.env.COOKIE_SECRET || 'secret',

	'wysiwyg images': true,
	'wysiwyg additional buttons': 'embedaudio, undo, redo',
	'wysiwyg additional options': {
		relative_urls: false,
		extended_valid_elements: 'iframe[src|frameborder|scrolling|width|height]',
		external_plugins: {
			'embediframe': '/js/app/tinymce-custom-buttons.js',
		}
	},
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	audios: ['audios', 'audio-categories', 'audio-shows'],
	general: ['pages', 'sidebars', 'users'],
});

keystone.start();