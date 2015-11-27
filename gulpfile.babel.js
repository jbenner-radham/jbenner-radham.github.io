'use strict';

var browserSync = require('browser-sync').create();
var colorguard  = require('gulp-colorguard');
var csscomb     = require('gulp-csscomb');
var dateTime    = require('@radioactivehamster/date-time');
var fs          = require('fs');
var gulp        = require('gulp');
var htmltidy    = require('gulp-htmltidy');
var jade        = require('gulp-jade');
var yaml        = require('js-yaml');
var less        = require('gulp-less');
var pkg         = require('./package.json');
var stachio     = require('gulp-stachio');
var stylus      = require('gulp-stylus');

gulp.task('serve', ['style', 'template'], () => {
    browserSync.init({
        open: false,
        server: { baseDir: './' }
    });
    gulp.watch('./src/style/stylus/*.styl', ['style']);
    gulp.watch('./src/**/*.*', ['template']).on('change', browserSync.reload);
});

gulp.task('style', () => {
    //let stylesheet = './src/style/main.less';
    let stylesheet = './src/style/stylus/main.styl';

    return gulp.src(stylesheet)
        .pipe(stylus())
        //.pipe(less())
        //.pipe(csscomb())
        /**
         * @todo Correct the color conflict with "links.css."
         */
        .pipe(colorguard().on('error', e => console.warn(e.message)))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('template', () => {
    /**
     * Remove angle bracket enclosed email addresses.
     * @todo Look into potential "safe string" encoding issues in `stachio`.
     */
    let author     = pkg.author.replace(/ <.+>/i, '');
    let cname      = fs.readFileSync('./CNAME').toString();
    let htmltidyrc = yaml.load(fs.readFileSync('./.htmltidyrc').toString());
    //let templates  = './src/template/**/*.hbs';
    let templates  = './src/template/jade/**/*.jade';

    return gulp.src(templates)
        //.pipe(stachio({ author: author, cname: cname, timestamp: dateTime() }))
        .pipe(jade({
            locals: {
                author:    author,
                cname:     cname,
                timestamp: dateTime()
            }
        }))
        .pipe(htmltidy(htmltidyrc))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['style', 'template']);
