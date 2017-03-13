/**
	Namespace definitions.

	- Transfer: Include a dependency from node_modules into the public dir.
	- Build: Concatenate and minify dependencies.
	- Watch: Observe changes and execute specific tasks accordingly.
 */

const gulp = require('gulp');
const shell = require('gulp-shell');
const concat = require('gulp-concat');

const paths = {
	css: {
		normalize: 'node_modules/normalize.css/normalize.css',
		main: 'public/styles/main.css',
	},

	js: {
		jquery: 'node_modules/jquery/dist/jquery.js',
	},
};


// Transfers
gulp.task('transfer:normalize', function () {
	return gulp.src(paths.css.normalize)
		.pipe(gulp.dest('./public/styles'));
});


// Bundlers
gulp.task('bundle:js', function () {
	return gulp.src(paths.js)
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('public/js'));
});


// Watchers
gulp.task('watch:css', function () {
	gulp.watch(['public/styles/main.css'], ['bundle:css']);
});

gulp.task('default', ['watch:css']);