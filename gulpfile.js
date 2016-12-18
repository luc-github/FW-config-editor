var gulp = require('gulp'),
    del = require('del'),
    gzip = require('gulp-gzip'),
    smoosher = require('gulp-smoosher');
    
function clean() {
    return del(['dist']);
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
gulp.task(smoosh);

var defaultSeries = gulp.series(clean,  smoosh);
var packageSeries = gulp.series(clean,  smoosh, compress);

gulp.task('default', defaultSeries);
gulp.task('package', packageSeries);
