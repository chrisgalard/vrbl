var gulp = require('gulp');
var shell = require('gulp-shell');
var concat = require('gulp-concat');


var paths = {
	'src':['./models/**/*.js','./routes/**/*.js', 'keystone.js', 'package.json']

};

gulp.task('bundleStyles', function () {
	return gulp.src(['node_modules/normalize.css/normalize.css', 'public/styles/main.css'])
		.pipe(concat('main.min.css'))
		.pipe(gulp.dest('./public/styles'));
});

gulp.task('bundle:vendorjs', function () {
	return gulp.src(['node_modules/jquery/dist/jquery.js'])
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('public/js'));
});

gulp.task('watch:css', function () {
	gulp.watch(['public/styles/main.css'], ['bundleStyles']);
});

gulp.task('default', ['watch:css']);