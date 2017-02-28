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
		path: keystone.expandPath('./public/images'),
		publicPath: '/images/',
	},
});

/**
 * Audio Model
 * ==========
 */

var Audio = new keystone.List('Audio', {
	autokey: { path: 'slug', from: 'name', unique: true },
});

Audio.add({
	name: { type: String, required: true },
	author: {type: String, required: true, initial: true },
	soundCloudURL: { type: String },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft' },
	publishedDate: { type: Types.Date, dependsOn: { state: 'published' } },
	image: { 
		type: Types.File,
		storage: vrblStorage,
	},
	content: { type: Types.Html, wysiwyg: true, height: 400 },
	publisher: { type: Types.Relationship, ref: 'User' },
	categories: { type: Types.Relationship, ref: 'AudioCategory', many: true },
	type: { type: Types.Select, options: 'featured, trending, favorites', default: 'featured' },
});

Audio.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Audio.defaultColumns = 'name, state|20%, author|20%, publishedDate|20%';
Audio.register();