'use strict';

const browserSync = require('browser-sync').create();
const colorguard  = require('gulp-colorguard');
const csscomb     = require('gulp-csscomb');
const dateTime    = require('@radioactivehamster/date-time');
const fs          = require('fs');
const gulp        = require('gulp');
const htmlhint    = require('gulp-htmlhint');
const htmltidy    = require('gulp-htmltidy');
const yaml        = require('js-yaml');
const less        = require('gulp-less');
const pkg         = require('./package.json');
const stachio     = require('gulp-stachio');
const taskDoc     = require('gulp-task-doc').patchGulp();

/**
 * Display this help.
 */
gulp.task('help', taskDoc.help());

/**
 * Start web server.
 */
gulp.task('serve', ['style', 'template'], () => {
    browserSync.init({
        open: false,
        server: { baseDir: './' }
    });
    gulp.watch('./src/**/*.*', ['style', 'template']).on('change', browserSync.reload);
});

/**
 * Build stylesheets.
 */
gulp.task('style', () => {
    return gulp.src('./src/style/main.less')
        .pipe(less())
        .pipe(csscomb())
        .pipe(colorguard().on('error', e => console.error(e.message)))
        .pipe(gulp.dest('./'));
});

/**
 * Compile templates.
 */
gulp.task('template', () => {
    /**
     * Remove angle bracket enclosed email addresses.
     * @todo Look into potential "safe string" encoding issues in `stachio`.
     */
    let author = pkg.author.replace(/ <.+>/i, '');
    let cname  = fs.readFileSync('./CNAME').toString().trim();
    let tidyrc = yaml.load(fs.readFileSync('./.tidyrc').toString());
    let vcard  = fs.readFileSync('./data/me/vcard.jsonld').toString().trim();

    return gulp.src('./src/template/**/*.hbs')
        .pipe(stachio({author, cname, timestamp: dateTime(), vcard}))
        .pipe(htmltidy(tidyrc))
        .pipe(htmlhint())
        .pipe(htmlhint.reporter())
        .pipe(gulp.dest('./'));
});

// @internal
gulp.task('default', ['style', 'template']);
