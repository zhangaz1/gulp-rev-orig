var _ = require('lodash');
var through = require('through2');
var gutil = require('gulp-util');

var cheerio = require('cheerio');
var fs = require('fs');
var dateformat = require('dateformat');
var url = require('url');
var path = require('path');
var crypto = require('crypto');

var regOption = 'ig';

var fileverCache = {};

module.exports = handlerFactory;

return void(0);

function handlerFactory(options) {
    var defaultOptions = createDefaultOptions();
    var options = _.assign(defaultOptions, options);
    return through.obj(revHandler);

    // return void(0);

    function revHandler(file, enc, cb) {
        if (options.cwd !== '') {
            var msg = gutil.colors.red('options.cwd is obsoleted, use options.base or set gulp.src(path, {cwd:mycwd}) instead');
            gutil.log(msg);
            return;
        }

        logStart(file);

        if (file.isStream()) {
            var err = new gutil.PluginError('gulp-rev-orig', 'Streaming is not supported');
            this.emit('error', err);
            return cb();
        }

        try {
            if (!file.isNull()) {
                rev(file);
            }
        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-rev-orig', err));
        }

        logEnd(file);
        this.push(file);
        return cb();

        // return void(0);

        function rev(file) {
            var html = file.contents.toString();

            var tagsRegStr = createTagRegStr();
            var tagsReg = new RegExp(tagsRegStr, regOption);
            var htmlSegments = html.split(tagsReg);

            prepareRegs();

            _(htmlSegments)
                .forEach(function(segment, index, segments) {
                    if (isOdd(index)) {
                        segments[index] = addRev(segment);
                    }
                });

            file.contents = new Buffer(htmlSegments.join(''));

            return void(0);

            function prepareRegs() {
                forEachElementSettings(function(elementSetting) {
                    elementSetting.tagReg = new RegExp(elementSetting.tagRegStr, regOption);
                    elementSetting.pathReg = new RegExp(elementSetting.pathRegStr, regOption);
                });
            }

            function forEachElementSettings(cb) {
                _(options.fileTypes)
                    .forEach(function(fileType) {
                        console.log(fileType);
                        return cb(options.elementAttributes[fileType])
                    });
            }

            function isOdd(n) {
                return n % 2 === 1;
            }

            function createTagRegStr() {
                var regStr = _(options.fileTypes)
                    .map(function(fileType) {
                        return options.elementAttributes[fileType].tagRegStr;
                    })
                    .value()
                    .join('|');

                return '(' + regStr + ')';
            }

            function addRev(segment) {
                var segmentWithRev = segment;

                forEachElementSettings(function(elementSetting) {
                    if (elementSetting.tagReg.test(segment)) {
                        elementSetting.pathReg.lastIndex = 0;
                        var match = elementSetting.pathReg.exec(segment);
                        console.log(segment, elementSetting.pathReg, match);
                        segmentWithRev = segment.replace(elementSetting.pathReg, '$1' + '?v=xxxxxxxxx');
                        return false; // 终止filetype尝试
                    }
                });

                return segmentWithRev;
            }
        }

        function logStart(file) {
            gutil.log('==== begin rev:', gutil.colors.cyan(file.path));
        }

        function logEnd(file) {
            gutil.log('==== end rev:' + gutil.colors.cyan(file.path));
        }
    }

    function createDefaultOptions() {
        return {
            cwd: '',
            base: '',
            suffix: 'v',
            fileTypes: ['js', 'css', 'img'],
            hashLength: 8,
            dateFormat: 'yyyymmddHHMM',
            revType: 'hash',
            transformPath: defaultPathTransformer,
            elementAttributes: getDefaultElementAttributes()
        };

        // return void(0);

        function defaultPathTransformer(orgPath, rev) {
            var regStr = '((\\?|\\&|\\&amp\\;)' + options.suffix + '=)([^&\\s]+)';
            var reg = new RegExp(regStr, regOption);
            var newpath = orgPath;
            if (reg.test(orgPath)) {
                newpath = orgPath.replace(reg, '$1' + rev);
            } else {
                newpath += ((orgPath.indexOf('?') > -1 ? '&' : '?') + options.suffix + '=' + rev);
            }
            return newpath;
        }

        function getDefaultElementAttributes() {
            return {
                js: {
                    tagRegStr: '<script [^>]+/?>',
                    pathRegStr: '(?:\\s+src="([^"]+)")'
                },
                css: {
                    tagRegStr: '<link [^>]+/?>',
                    pathRegStr: '(?:\\s+href="([^"]+)")'
                },
                img: {
                    tagRegStr: '<img [^>]+/?>',
                    pathRegStr: '(?:\\s+src="([^"]+)")'
                }
            };
        }
    }
}