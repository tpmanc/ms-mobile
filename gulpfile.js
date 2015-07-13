var gulp = require('gulp'),
	less = require('gulp-less'),
	csso = require('gulp-csso'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	imageop = require('gulp-image-optimization'),
	fileinclude = require('gulp-file-include'),
	autoprefixer = require('gulp-autoprefixer'),
	livereload = require('gulp-livereload');

gulp.task('less', function() {
	gulp.src('theme/mobile/less/style.less')
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(csso())
		.pipe(gulp.dest('theme/mobile/production/'))
		.pipe(livereload());
});

gulp.task('img', function() {
	gulp.src(['./theme/mobile/img/*.*', './theme/mobile/img/*/*.*'])
		.pipe(imageop({
			optimizationLevel: 5,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('./imagesNew'));
});

gulp.task('js', function() {
	gulp.src([
			'./theme/mobile/js/jquery-2.1.4.min.js',
			'./theme/mobile/js/jquery-migrate-1.2.1.min.js',
			'./theme/mobile/js/devou-countdown.min.js',
			'./theme/mobile/js/slick.min.js',
			'./theme/mobile/js/jquery.touchSwipe.min.js',
			'./theme/mobile/js/jquery.maskedinput.min.js',
			'./theme/mobile/js/index.js',
			'./theme/mobile/js/pickup-points.js',
		])
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./theme/mobile/production/'));

	// gulp.src([
	// 		'./theme/mobile/js/pickup-points.js',
	// 	])
	// 	.pipe(uglify())
	// 	.pipe(gulp.dest('./theme/mobile/production/'));
});

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch(['./theme/mobile/less/*.less','theme/mobile/less/*/*.less'], ['less']);
	gulp.watch('./theme/mobile/js/*.js', ['js']);
});