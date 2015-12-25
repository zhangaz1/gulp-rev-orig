var gulp = require('gulp');
var util = require('gulp-util')
var revOrig = require('./../index.js');

gulp.task('revOrig', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig())
        .pipe(gulp.dest('./dist'))
});