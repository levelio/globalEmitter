/**
 * Created by hezhiqiang on 16/2/28.
 */
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename');

gulp.task('build-script', function(){
    gulp.src('./src/*.js')
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('lint', function(){
    gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
});
