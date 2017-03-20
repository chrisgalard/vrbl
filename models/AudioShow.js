var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Storage Adapter
 * ==============
 */

var vrblStorage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	schema: {
		url: true,
	},
	fs: {
		path: keystone.expandPath('./public/images/shows'),
		publicPath: '/images/shows/',
	},
});

var AudioShow = new keystone.List('AudioShow', {
	autokey: { from: 'name', path: 'slug', unique: true },
});

AudioShow.add({
	name: { type: String, required: true },
	cover: { type: Types.File, storage: vrblStorage },
	description: { type: String, required: true, initial: true },

});

AudioShow.relationship({ ref: 'Audio', path: 'shows', refPath: 'shows' });

AudioShow.register();