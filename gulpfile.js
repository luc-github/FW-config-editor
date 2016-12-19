var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    htmlmin = require('gulp-htmlmin'),
    del = require('del'),
    gzip = require('gulp-gzip'),
    smoosher = require('gulp-smoosher');
    
function clean() {
    return del(['dist']);
}
   
function minifyHTML() {
        return gulp.src('app/config.html')
        .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true}))
        .pipe(gulp.dest('dist'))
}


function scripts() {
        return gulp.src('app/js/scripts.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify({mangle: true}))
        .pipe(gulp.dest('dist/js'))
}

function style() {
        return gulp.src('app/css/style.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'))
}

function smoosh() {
    return gulp.src('dist/config.html')
        .pipe(smoosher())
        .pipe(gulp.dest('dist'))
}

function compress() {
    return gulp.src('dist/config.html')
        .pipe(gzip())
        .pipe(gulp.dest('.'));
}

gulp.task(clean);
gulp.task(minifyHTML);
gulp.task(scripts);
gulp.task(style);
gulp.task(smoosh);
gulp.task(compress);

var defaultSeries = gulp.series(clean, minifyHTML, scripts, style, smoosh);
var packageSeries = gulp.series(clean, minifyHTML, scripts, style, smoosh, compress);
var testSeries = gulp.series(clean, minifyHTML, scripts, style);

gulp.task('default', defaultSeries);
gulp.task('package', packageSeries);
gulp.task('test', testSeries);
