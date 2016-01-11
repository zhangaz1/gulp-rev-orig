# gulp-rev-orig (from gulp-rev-easy)
gulp rev for js&css&img path in html without prejudice of other

# Install

```
$ npm install gulp-rev-orig --save-dev
```

# Examples

```
assets\index.css
assets\index.js
test.html
gulpfile.js
```

## Input

```html
//test.html
<!doctype html>
<html lang="en">
<head>
  <title>gulp-rev-easy</title>
  <link type="text/css" rel="stylesheet" media="all" href="assets/index.css?max_age=1024">
</head>
<body>
  <img data-src="assets/audrey-hepburn.jpg" src="assets/audrey-hepburn.jpg">
  <script src="assets/index.js?max_age=1024"></script>
  <script src="/assets/index.js"></script>
  <script src="/assets/index1.js"></script>
  <script src="http://assets/index.js"></script>
</body>
</html>
```

## Useage

```js
//gulpfile.js
gulp.task('revOrig-default', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig())
        .pipe(gulp.dest('./dist'));
});
```

```
gulp revOrig-default
```

## Output

```html
<!doctype html>
<html lang="en">
<head>
  <title>gulp-rev-easy</title>
  <link type="text/css" rel="stylesheet" media="all" href="assets/index.css?max_age=1024&v=0a1085be">
</head>
<body>
  <img data-src="assets/audrey-hepburn.jpg" src="assets/audrey-hepburn.jpg?v=6a5f96ce">
  <script src="assets/index.js?max_age=1024&v=3fffb693"></script>
  <script src="/assets/index.js?v=3fffb693"></script>
  <script src="/assets/index1.js"></script>
  <script src="http://assets/index.js"></script>
</body>
</html>
```

# Options
- base
- revType
- dateFormat
- hashLength
- suffix
- fileTypes
- elementAttributes
- transformPath
- defaultDoAddElementRev
- elementAttributes.addElementRev
- createDefaultOptions

## options.base

```
type:string
default:file.cwd

set base directory for your assets
<img src='/a/b.png'/> rev will found file in path.join(base, src)
options.cwd is obsoleted, use options.base or set gulp.src(path, {cwd:mycwd}) instead
```

## options.revType

```
type:['hash'|date']
default:'hash'

set rev type
```

### example

```js
var gulp = require('gulp');
var revOrig = require('gulp-rev-orig');

gulp.task('revOrig-byDate', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig({
            revType: 'date'
        }))
        .pipe(gulp.dest('./dist'));
});
```

### Output

```html
<!--default output-->
<link type="text/css" rel="stylesheet" media="all"
  href="assets/index.css?max_age=1024">
```

-->

```html
<link type="text/css" rel="stylesheet" media="all"
  href="assets/index.css?max_age=1024&v=201512291737">
```

## options.dateFormat

```
type:string
default:'yyyymmddHHMM'
```

### example

```js
var gulp = require('gulp');
var revOrig = require('gulp-rev-orig');

gulp.task('revOrig-withDateFormat', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig({
            revType: 'date',
            dateFormat: 'yymmddHHmm'
        }))
        .pipe(gulp.dest('./dist'));
});
```

### Output

```html
<!--default output-->
<link type="text/css" rel="stylesheet" media="all"
  href="assets/index.css?max_age=1024&v=201512291712">
```

-->

```html
<link type="text/css" rel="stylesheet" media="all"
  href="assets/index.css?max_age=1024&v=1512291712">
```

## options.hashLength

```
type:integer
default:8
```

### example

```js
gulp.task('revOrig-withHashLength', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig({
            revType: 'hash',
            hashLength: 5
        }))
        .pipe(gulp.dest('./dist'));
});
```

### Output

```html
<!--default output-->
<img data-src="assets/audrey-hepburn.jpg"
  src="assets/audrey-hepburn.jpg?v=6a5f96ce">
```

-->

```html
<img data-src="assets/audrey-hepburn.jpg"
  src="assets/audrey-hepburn.jpg?v=6a5f9">
```

## options.suffix

```
type:string
default:v
```

### example

```js
var gulp = require('gulp');
var revOrig = require('gulp-rev-orig');

gulp.task('revOrig-withHashKey', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig({
            suffix: 'hashkey'
        }))
        .pipe(gulp.dest('./dist'));
});
```

### Output

```html
<!--default output-->
<img src="assets/audrey-hepburn.jpg?v=6a5f96ce">
```

-->

```html
<img src="assets/audrey-hepburn.jpg?hashkey=6a5f96ce">
```

## options.fileTypes

```
type:array
default:['js','css','img']
```

### example

```js
var gulp = require('gulp');
var revOrig = require('gulp-rev-orig');

gulp.task('revOrig-withFileTypes', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig({
            fileTypes: ['js']
        }))
        .pipe(gulp.dest('./dist'));
});
```

### Output

```html
<!doctype html>
<html lang="en">
<head>
  <title>gulp-rev-easy</title>
  <link type="text/css" rel="stylesheet" media="all" href="assets/index.css?max_age=1024">
</head>
<body>
  <img data-src="assets/audrey-hepburn.jpg" src="assets/audrey-hepburn.jpg">
  <script src="assets/index.js?max_age=1024&v=3fffb693"></script>
  <script src="/assets/index.js?v=3fffb693"></script>
  <script src="/assets/index1.js"></script>
  <script src="http://assets/index.js"></script>
</body>
</html>
```

## options.elementAttributes

```js
/*
how find target element
js: {
    tagRegStr: '(<script [^>]+/?>)',
    pathRegStr: '(?:(\\s+src=")([^"]+)("))'
}
*/
type:object
default:{
    js: {
        tagRegStr: '(<script [^>]+/?>)',
        pathRegStr: '(?:(\\s+src=")([^"]+)("))'
    },
    css: {
        tagRegStr: '(<link [^>]+/?>)',
        pathRegStr: '(?:(\\s+href=")([^"]+)("))'
    },
    img: {
        tagRegStr: '(<img [^>]+/?>)',
        pathRegStr: '(?:(\\s+src=")([^"]+)("))'
    }
}
```

### example

```js
var gulp = require('gulp');
var revOrig = require('gulp-rev-orig');

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
```

### Output

```html
<!--default out-->
<img data-src="assets/audrey-hepburn.jpg"
  src="assets/audrey-hepburn.jpg?v=6a5f96ce">
```

-->

```html
<img data-src="assets/audrey-hepburn.jpg?v=6a5f96ce"
    src="assets/audrey-hepburn.jpg">
```

## options.transformPath

```js
type: function
default: function (orgPath, rev) {
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
```

### example

```js
var gulp = require('gulp');
var revOrig = require('gulp-rev-orig');

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
```

### Output

```html
<!--default out-->
<img data-src="assets/audrey-hepburn.jpg"
  src="assets/audrey-hepburn.jpg?v=6a5f96ce">
```

-->

```html
<img data-src="assets/audrey-hepburn.jpg"
  src="http://s1.cdn.com/assets/audrey-hepburn.jpg?v=6a5f96ce">
```

## options.defaultDoAddElementRev

```js
type: function
default: function (segment, addSrcRev, elementSetting) {
    elementSetting.pathReg.lastIndex = 0;
    var match = elementSetting.pathReg.exec(segment);
    if (match) {
        var src = match[2];
        var revSrc = addSrcRev(src);
        return segment.replace(elementSetting.pathReg, '$1' + revSrc + '$3');
    } else {
        return segment;
    }
}
```

### example

```js
var gulp = require('gulp');
var revOrig = require('gulp-rev-orig');

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
```

### Output

```html
<!--default out-->
<!doctype html>
<html lang="en">
<head>
  <title>gulp-rev-easy</title>
  <link type="text/css" rel="stylesheet" media="all" href="assets/index.css?max_age=1024&v=0a1085be">
</head>
<body>
  <img data-src="assets/audrey-hepburn.jpg" src="assets/audrey-hepburn.jpg?v=6a5f96ce">
  <script src="assets/index.js?max_age=1024&v=3fffb693"></script>
  <script src="/assets/index.js?v=3fffb693"></script>
  <script src="/assets/index1.js"></script>
  <script src="http://assets/index.js"></script>
</body>
</html>
```

-->

```html
<!doctype html>
<html lang="en">
<head>
  <title>gulp-rev-easy</title>
  <link type="text/css" rel="stylesheet" media="all" href="./xxx/assets/index.css?max_age=1024&v=0a1085be">
</head>
<body>
  <img data-src="assets/audrey-hepburn.jpg" src="./xxx/assets/audrey-hepburn.jpg?v=6a5f96ce">
  <script src="./xxx/assets/index.js?max_age=1024&v=3fffb693"></script>
  <script src="./xxx/assets/index.js?v=3fffb693"></script>
  <script src="/assets/index1.js"></script>
  <script src="http://assets/index.js"></script>
</body>
</html>
```

## options.elementAttributes.addElementRev

```js
type: function
default: use options.defaultDoAddElementRev
```

### example

```js
var gulp = require('gulp');
var revOrig = require('gulp-rev-orig');

gulp.task('revOrig-withDefaultDoAddElementRev', function(argument) {
    gulp.src('test.html')
        .pipe(revOrig({
            defaultDoAddElementRev: function(segment, addSrcRev, elementSetting) {
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
        }))
        .pipe(gulp.dest('./dist'));
});
```

### Output

```html
<!--default out-->
<!doctype html>
<html lang="en">
<head>
  <title>gulp-rev-easy</title>
  <link type="text/css" rel="stylesheet" media="all" href="assets/index.css?max_age=1024&v=0a1085be">
</head>
<body>
  <img data-src="assets/audrey-hepburn.jpg" src="assets/audrey-hepburn.jpg?v=6a5f96ce">
  <script src="assets/index.js?max_age=1024&v=3fffb693"></script>
  <script src="/assets/index.js?v=3fffb693"></script>
  <script src="/assets/index1.js"></script>
  <script src="http://assets/index.js"></script>
</body>
</html>
```

-->

```html
<!doctype html>
<html lang="en">
<head>
  <title>gulp-rev-easy</title>
  <link type="text/css" rel="stylesheet" media="all" href="assets/index.css?max_age=1024">
</head>
<body>
  <img data-src="[assets/audrey-hepburn.jpg?v=6a5f96ce]" src="assets/audrey-hepburn.jpg">
  <script src="assets/index.js?max_age=1024&v=3fffb693"></script>
  <script src="/assets/index.js?v=3fffb693"></script>
  <script src="/assets/index1.js"></script>
  <script src="http://assets/index.js"></script>
</body>
</html>
```

## createDefaultOptions

```js
type: function
create default options for template
```

### example

```js
var gulp = require('gulp');
var revOrig = require('gulp-rev-orig');

gulp.task('revOrig-createDefaultOptions', function() {
    var options = revOrig.createDefaultOptions();

    options.elementAttributes.loadJs = {
        tagRegStr: '(<js [^>]+/?>)',
        pathRegStr: '(?:(\\s+src=")([^"]+)("))'
    };

    options.fileTypes.push('loadJs');

    gulp.src('test.html')
        .pipe(revOrig(options))
        .pipe(gulp.dest('./dist'));
});
```

### Input

```html
<!doctype html>
<html lang="en">

<head>
    <title>gulp-rev-easy</title>
    <link type="text/css" rel="stylesheet" media="all" href="assets/index.css?max_age=1024"
    />
    <link type="text/css" rel="stylesheet" media="all" href="assets/index.css?max_age=1024"
    />
</head>

<body>
    <img data-src="assets/audrey-hepburn.jpg" src="assets/audrey-hepburn.jpg">
    <script src="assets/index.js?max_age=1024"></script>
    <script src="/assets/index.js"></script>
    <script src="/assets/index1.js"></script>
    <script src="http://assets/index.js"></script>

    <loads style="display: none;">
        <js load="true" src="/assets/index.js"></js>,
        <js load="true" src="/assets/index.js"></js>
        <js load="true" src="/assets/index.js"></js>

        <js load="false" src="/assets/index.js"></js>
        <js load="false" src="/assets/index.js"></js>
        <js load="false" src="/assets/index.js"></js>
    </loads>
</body>

</html>
```

### Output

```html
<!doctype html>
<html lang="en">

<head>
    <title>gulp-rev-easy</title>
    <link type="text/css" rel="stylesheet" media="all" href="assets/index.css?max_age=1024&v=0a1085be"
    />
    <link type="text/css" rel="stylesheet" media="all" href="assets/index.css?max_age=1024&v=0a1085be"
    />
</head>

<body>
    <img data-src="assets/audrey-hepburn.jpg" src="assets/audrey-hepburn.jpg?v=6a5f96ce">
    <script src="assets/index.js?max_age=1024&v=3fffb693"></script>
    <script src="/assets/index.js?v=3fffb693"></script>
    <script src="/assets/index1.js"></script>
    <script src="http://assets/index.js"></script>

    <loads style="display: none;">
        <js load="true" src="/assets/index.js?v=3fffb693"></js>,
        <js load="true" src="/assets/index.js?v=3fffb693"></js>
        <js load="true" src="/assets/index.js?v=3fffb693"></js>

        <js load="false" src="/assets/index.js?v=3fffb693"></js>
        <js load="false" src="/assets/index.js?v=3fffb693"></js>
        <js load="false" src="/assets/index.js?v=3fffb693"></js>
    </loads>
</body>

</html>
```

# Other
