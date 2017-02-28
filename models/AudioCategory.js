var keystone = require('keystone');

/**
 * AudioCategory Model
 * ==================
 */

var AudioCategory = new keystone.List('AudioCategory', {
	autokey: { from: 'name', path: 'slug', unique: true },
});

AudioCategory.add({
	name: { type: String, required: true },
	url: { type: String }
});

AudioCategory.relationship({ ref: 'Audio', path: 'audios', refPath: 'categories' });

AudioCategory.register();