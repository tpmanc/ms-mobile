var gulp = require('gulp'),
	less = require('gulp-less'),
	csso = require('gulp-csso'),
	fileinclude = require('gulp-file-include'),
	autoprefixer = require('gulp-autoprefixer'),
	livereload = require('gulp-livereload');

gulp.task('less', function() {
	gulp.src('theme/mobile/less/style.less')
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(csso())
		.pipe(gulp.dest('theme/mobile/css/'))
		.pipe(livereload());
});

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('theme/mobile/less/*.less', ['less']);
});