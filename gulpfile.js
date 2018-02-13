const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');

gulp.task('sass', () => {
  gulp.src('./sass/main.scss')
    .pipe(rename('style.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/style'));
});

gulp.task('watch', () => {
  livereload.listen();

  nodemon({
    script: 'app.js',
    ext: 'js',
  });

  gulp.watch('public/**/*', (event) => {
    const fileName = path.relative(path.join(__dirname, 'public'), event.path);
    livereload.changed(fileName);
  });

  gulp.watch('sass/**/*.scss', ['sass']);
});

gulp.task('dev', ['sass', 'watch']);
gulp.task('build', ['sass']);
