'use strict';

var browserSync = require('browser-sync').create();
var dateTime    = require('@radioactivehamster/date-time');
var fs          = require('fs');
var gulp        = require('gulp');
var htmltidy    = require('gulp-htmltidy');
var jsYaml      = require('js-yaml');
var less        = require('gulp-less');
var stachio     = require('gulp-stachio');

gulp.task('serve', ['style', 'template'], () => {
    browserSync.init({
        open: false,
        server: { baseDir: './dist' }
    });
    gulp.watch('./src/**/*.*', ['style', 'template']).on('change', browserSync.reload);
});

gulp.task('style', () => {
    return gulp.src('./src/style/main.less')
        .pipe(less())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('template', () => {
    let htmltidyrc = jsYaml.load(fs.readFileSync('./.htmltidyrc').toString());

    return gulp.src('./src/template/**/*.hbs')
        .pipe(stachio({ timestamp: dateTime() }))
        // htmltidy wipes out `data` elements and leaves only their values for
        // some reason... probably because the element isn't internally registered?
        .pipe(htmltidy(htmltidyrc))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['serve']);
