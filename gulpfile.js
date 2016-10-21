'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    jade = require('jade'),
    gulpJade = require('gulp-jade'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-clean-css'),
    wait = require('gulp-wait'),
    include = require('gulp-include'),
    uglify = require('gulp-uglify');

var path = {
    build: { // куда складывать
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/'
    },
    src: { // откуда брать
        html: 'assets/pages/*.jade',
        js: 'assets/import.js',
        style: 'assets/import.scss'
    },
    watch: { // за чем наблюдать
        html: 'assets/**/*.jade',
        //js: ['assets/**/*.js', 'assets/default.js'],
        style: 'assets/**/*.scss'
    },
    clean: './assets'
};

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    includePaths: 'assets/**/*.scss'
};

/* собрать jade в html */
gulp.task('html:build', function () {
  return gulp.src(path.src.html)
    .pipe(gulpJade({
      jade: jade,
      pretty: true
    }))
    .pipe(gulp.dest(path.build.html))
});

/* собрать скрипты */
gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(include())
        .pipe(uglify())
        .pipe(concat('main.js'))
        .pipe(gulp.dest(path.build.js))
});

/* собрать scss в css */
gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(wait(100))
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(concat('main.css'))
        .pipe(gulp.dest(path.build.css))
});

/* собрать всё */
gulp.task('build', [
    'html:build',
    'js:build',
    'style:build'
]);

/* следить за изменениями */
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch(['assets/**/*.js', 'assets/default.js'], function(event, cb) {
        gulp.start('js:build');
    });
});

gulp.task('default', ['build', 'watch']);