'use strict';

const browserSync = require('browser-sync').create();
const colorguard  = require('gulp-colorguard');
const csscomb     = require('gulp-csscomb');
const dateTime    = require('@radioactivehamster/date-time');
const fs          = require('fs');
const gulp        = require('gulp');
const htmltidy    = require('gulp-htmltidy');
const yaml        = require('js-yaml');
const less        = require('gulp-less');
const pkg         = require('./package.json');
const stachio     = require('gulp-stachio');

gulp.task('serve', ['style', 'template'], () => {
    browserSync.init({
        open: false,
        server: { baseDir: './' }
    });
    gulp.watch('./src/**/*.*', ['style', 'template']).on('change', browserSync.reload);
});

gulp.task('style', () => {
    return gulp.src('./src/style/main.less')
        .pipe(less())
        .pipe(csscomb())
        /**
         * @todo Correct the color conflict with "links.css."
         */
        .pipe(colorguard().on('error', e => console.error(e.message)))
        .pipe(gulp.dest('./'));
});

gulp.task('template', () => {
    /**
     * Remove angle bracket enclosed email addresses.
     * @todo Look into potential "safe string" encoding issues in `stachio`.
     */
    let author     = pkg.author.replace(/ <.+>/i, '');
    let cname      = fs.readFileSync('./CNAME').toString().trim();
    let htmltidyrc = yaml.load(fs.readFileSync('./.htmltidyrc').toString());
    let vcard      = fs.readFileSync('./data/me/vcard.jsonld').toString().trim();

    return gulp.src('./src/template/**/*.hbs')
        .pipe(stachio({ author: author, cname: cname, timestamp: dateTime(), vcard: vcard }))
        .pipe(htmltidy(htmltidyrc))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['style', 'template']);
