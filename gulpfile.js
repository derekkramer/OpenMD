'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')

gulp.task('sass', () => {
  return gulp.src('./src/frame/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/frame'))
})

gulp.task('watch', () => {
  gulp.watch('./src/frame/*.scss', gulp.parallel('sass'))
})

gulp.task('default', gulp.series('sass', 'watch'))