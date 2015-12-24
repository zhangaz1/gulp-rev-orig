var _ = require('lodash');
var through = require('through2');
var gutil = require('gulp-util');

var cheerio = require('cheerio');
var fs = require('fs');
var dateformat = require('dateformat');
var url = require('url');
var path = require('path');
var crypto = require('crypto');

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
            this.emit('error', new gutil.PluginError('gulp-rev-easy', err));
        }

        logEnd(file);
        this.push(file);
        return cb();

        // return void(0);

        function rev(file) {
            var $ = cheerio.load(file.contents.toString(), {
                decodeEntities: false
            });

            var baseDir = options.base;

            if (baseDir === '') {
                baseDir = file.cwd;
            }

            for (var i = 0; i < options.fileTypes.length; i++) {
                var fileType = options.fileTypes[i];
                var attributes = options.elementAttributes[fileType];

                var $assets = $(attributes.name);
                for (var j = 0; j < $assets.length; j++) {
                    var $asset = $assets.eq(j);

                    var src = $asset.attr(attributes.src);

                    if (src && !src.match(/.*(\/\/).*/)) {
                        var revv = '';

                        if (options.revType === 'hash') {
                            var srcpath = url.parse(src).pathname;
                            var filepath = null;

                            //if is a /a/b/c/i.png path need a basedir
                            if ((/^\/{1}[^\/]+/gi).test(srcpath)) {
                                filepath = path.join(baseDir, srcpath);
                            } else {
                                filepath = path.join(path.dirname(file.path), srcpath);
                            }
                            if (fs.existsSync(filepath)) {
                                var mtime = +fs.statSync(filepath).mtime;
                                if (fileverCache[filepath] && fileverCache[filepath].mtime == mtime) {
                                    revv = fileverCache[filepath].rev;
                                    gutil.log(gutil.colors.green('found in cache >>' + filepath + '@' + mtime));
                                } else {
                                    revv = crypto
                                        .createHash('md5')
                                        .update(
                                            fs.readFileSync(filepath, {
                                                encoding: 'utf8'
                                            }))
                                        .digest('hex').substring(0, options.hashLength);
                                }
                                fileverCache[filepath] = {
                                    mtime: mtime,
                                    rev: revv
                                };
                            } else {
                                gutil.log(gutil.colors.red(filepath + ' not found'));
                            }
                        } else {
                            revv = dateformat(new Date(), options.dateFormat);
                        }

                        if (revv !== '') {
                            var newname = options.transformPath(src, revv);
                            $asset.attr(attributes.src, newname);
                            gutil.log(src + ' --> ', gutil.colors.green(newname));
                        } else {
                            gutil.log(gutil.colors.blue('ignore:rev is empty'), src);
                        }
                    }
                }
            }
            file.contents = new Buffer($.html());
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
            var reg = new RegExp('((\\?|\\&|\\&amp\\;)' + options.suffix + '=)([^&\\s]+)', 'gi');
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
                    name: 'script',
                    src: 'src'
                },
                css: {
                    name: 'link[rel="stylesheet"]',
                    src: 'href'
                },
                img: {
                    name: 'img',
                    src: 'src'
                }
            };
        }
    }
}