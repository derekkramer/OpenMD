'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')

gulp.task('sass', () => {
  return gulp.src('./src/frame/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/frame'))
})

gulp.task('sass:watch', () => {
  gulp.watch('./src/frame/*.scss', ['sass'])
})

gulp.task('default', ['sass', 'sass:watch'])