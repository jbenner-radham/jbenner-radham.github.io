'use strict';

var browserSync = require('browser-sync').create();
var dateTime    = require('@radioactivehamster/date-time');
var fs          = require('fs');
var gulp        = require('gulp');
var htmltidy    = require('gulp-htmltidy');
var yaml        = require('js-yaml');
var less        = require('gulp-less');
var pkg         = require('./package.json');
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
    /**
     * Remove angle bracket enclosed email addresses.
     * @todo Look into potential "safe string" encoding issues in `stachio`.
     */
    let author     = pkg.author.replace(/ <.+>/i, '');
    let htmltidyrc = yaml.load(fs.readFileSync('./.htmltidyrc').toString());

    return gulp.src('./src/template/**/*.hbs')
        .pipe(stachio({ author: author, timestamp: dateTime() }))
        // htmltidy wipes out `data` elements and leaves only their values for
        // some reason... probably because the element isn't internally registered?
        .pipe(htmltidy(htmltidyrc))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['serve']);
