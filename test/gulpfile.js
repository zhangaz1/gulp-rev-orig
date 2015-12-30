var gulp = require('gulp');
var revOrig = require('./../index.js');

gulp.task('revOrig-default', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig())
        .pipe(gulp.dest('./dist'));
});

gulp.task('revOrig-byDate', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig({
            revType: 'date'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('revOrig-withDateFormat', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig({
            revType: 'date',
            dateFormat: 'yymmddHHmm'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('revOrig-withHashLength', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig({
            revType: 'hash',
            hashLength: 5
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('revOrig-withHashKey', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig({
            suffix: 'hashkey'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('revOrig-withFileTypes', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig({
            fileTypes: ['js']
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('revOrig-withElementAttributes', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig({
            fileTypes: ['img1'],
            elementAttributes: {
                img1: {
                    tagRegStr: '(<img [^>]+/?>)',
                    pathRegStr: '(?:(\\s+data-src=")([^"]+)("))'
                }
            }
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('revOrig-withTransformPath', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig({
            transformPath: function(orgpath, ver) {
                var newpath = 'http://s1.cdn.com/' + orgpath + (orgpath.indexOf('?') > -1 ? '&' : '?') + 'v=' + ver;
                return newpath;
            }
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('revOrig-withDefaultAddElementRev', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig({
            defaultAddElementRev: function(segment, addSrcRev, elementSetting) {
                elementSetting.pathReg.lastIndex = 0;
                var match = elementSetting.pathReg.exec(segment);
                if (match) {
                    var src = match[2];
                    var revSrc = addSrcRev(src);
                    if (revSrc !== src) {
                        var base = './xxx' + (revSrc[0] === '/' ? '' : '/');
                        return segment.replace(elementSetting.pathReg, '$1' + base + revSrc + '$3');
                    } else {
                        return segment;
                    }
                } else {
                    return segment;
                }
            }
        }))
        .pipe(gulp.dest('./dist'));
});


gulp.task('revOrig-withAddElementRev', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig({
            fileTypes: ['js', 'img1'],
            elementAttributes: {
                js: {
                    tagRegStr: '(<script [^>]+/?>)',
                    pathRegStr: '(?:(\\s+src=")([^"]+)("))'
                },
                img1: {
                    tagRegStr: '(<img [^>]+/?>)',
                    pathRegStr: '(?:(\\s+data-src=")([^"]+)("))',
                    addElementRev: function(segment, addSrcRev, elementSetting) {
                        elementSetting.pathReg.lastIndex = 0;
                        var match = elementSetting.pathReg.exec(segment);
                        if (match) {
                            var src = match[2];
                            var revSrc = addSrcRev(src);
                            return segment.replace(elementSetting.pathReg, '$1[' + revSrc + ']$3');
                        } else {
                            return segment;
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest('./dist'));
});