'use strict';

var gulp = require('gulp');
var zip = require('gulp-zip');

var files = [
    'src/manifest.json',
    'src/index.js',
    'src/LICENSE',
    'src/common.js',
    'src/get-text.js',
    'src/*.png',
    'src/text-entry.html'
];
var xpiName = '@fastcadastrex-0.0.1.xpi';

gulp.task('default', function () {
  gulp.src(files)
    .pipe(zip(xpiName))
    .pipe(gulp.dest('.'));
});
