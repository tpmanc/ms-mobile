var gulp = require('gulp'),
    less = require('gulp-less'),
    livereload = require('gulp-livereload');

gulp.task('less', function() {
  gulp.src('theme/mobile/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('theme/mobile/css/'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('theme/mobile/less/*.less', ['less']);
});