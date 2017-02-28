var keystone = require('keystone');
var Types = keystone.Field.Types;

var Sidebar = new keystone.List('Sidebar', {
	autokey: {path: 'slug', from: 'name', unique: true},
});

Sidebar.add({
	name: {type: String, required: true},
	content: {type: Types.Html, wysiwyg: true},
});

Sidebar.register();