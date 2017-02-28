var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Audio Model
 * ==========
 */
var Page = new keystone.List('Page', {
	autokey: { path: 'slug', from: 'name', unique: true },
})

Page.add({
	name: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, achived', default: 'draft' },
	publishedDate: { type: Types.Date, dependsOn: { state: 'published' } },
	content: { type: Types.Html, wysiwyg: true, height: 400 },
	publisher: { type: Types.Relationship, ref: 'User' },
});

Page.register();