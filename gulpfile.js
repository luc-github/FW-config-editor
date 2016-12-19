var gulp = require('gulp'),
    del = require('del'),
    gzip = require('gulp-gzip'),
    smoosher = require('gulp-smoosher');
    
function clean() {
    return del(['dist']);
}
   
function minifyHTML() {
        return gulp.src('app/config.html')
        .pipe(gulp.dest('dist'))
}

function scripts() {
        return gulp.src('app/js/scripts.js')
        .pipe(gulp.dest('dist/js'))
}

function style() {
        return gulp.src('app/css/style.css')
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

gulp.task('clean', clean);
gulp.task('minifyHTML', minifyHTML);
gulp.task('scripts', scripts);
gulp.task('style', style);
gulp.task('smoosh', smoosh);
gulp.task('compress', compress);

var defaultSeries = gulp.series(clean, minifyHTML, scripts, style, smoosh);
var packageSeries = gulp.series(clean, minifyHTML, scripts, style, smoosh, compress);

gulp.task('default', defaultSeries);
gulp.task('package', packageSeries);
