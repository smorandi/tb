var gulp = require('gulp');

var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var stylus = require('gulp-stylus');
var open = require('gulp-open');
var concat = require('gulp-concat');
var util = require('gulp-util');
var minify = require('gulp-minify');
var filesort = require('gulp-angular-filesort');

var urlBuild = "http://localhost:9999";
var urlApp = "http://localhost:8888";

//App Dev
gulp.task('inject', function(){
    gulp.src('./public/index.html')
        .pipe(inject(gulp.src(['./public/assets/lib_head/**/*.js'], {read: false}), {relative: true, name: 'head'}))
        .pipe(inject(gulp.src(bowerFiles(), {read: false}), {relative: true, name: 'bower'}))
        .pipe(inject(gulp.src(['./public/api/**/*.js', './public/components/**/*.js', './public/infrastructure/**/*.js', './public/injections.js' ],
            {read: true}).pipe(filesort()), {relative: true, name:'angular'}))
        .pipe(inject(gulp.src(['./public/app.js'], {read: false}), {relative: true, name:'anguapp'}))
        .pipe(inject(gulp.src(['./public/assets/css/**/*.css'], {read: false}), {relative: true}))
        .pipe(gulp.dest('./public'))
        .on('error', util.log);
});

gulp.task('lint', function() {
    gulp.src(['./app/**/*.js', '!./app/assets/lib/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('connect', function () {
    connect.server({
        root: 'public/',
        port: 8888
    });
});

gulp.task('appOpen', function(){
    gulp.src(__filename)
        .pipe(open({uri: urlApp}));
});

//// Build
//gulp.task( 'buildConcatBower', function(){
//    gulp.src(bowerFiles())
//        .pipe(concat('bowersrc.min.js'))
//        .pipe(gulp.dest('./build/js'))
//        .on('error', util.log);
//});
//
//gulp.task( 'buildConcatAngular', function(){
//    gulp.src(['./app/**/*.js', '!./app/assets/lib/**'])
//        .pipe(concat('drinkapp.min.js'))
//        .pipe(gulp.dest('./build/js'))
//        .on('error', util.log);
//});
//
//gulp.task('buildClean', function() {
//    gulp.src('./build', {reade: false})
//        .pipe(clean({force: true}))
//        .on('error', util.log);
//});
//
//gulp.task('buildMinifyCss', function() {
//    var opts = {comments:true,spare:true};
//    gulp.src(['./app/**/*.css', '!./app/assets/lib/**'])
//        .pipe(minifyCSS(opts))
//        .pipe(gulp.dest('./build/css'))
//        .on('error', util.log);
//});
//gulp.task('buildMinifyJs', function() {
//    gulp.src(['./build/**/*.js'])
//        .pipe(uglify())
//        .pipe(gulp.dest('./build/'))
//        .on('error', util.log);
//});
//gulp.task('buildUglifyBower', function(){
//    gulp.src(bowerFiles())
//        .pipe(uglify())
//        .pipe(gulp.dest('build/bower'));
//});
//gulp.task('copy-bower-components', function () {
//    gulp.src('./app/assets/lib/**')
//        .pipe(gulp.dest('build/assets/lib/'));
//});
//gulp.task('copy-html-files', function () {
//    gulp.src('./app/**/*.html')
//        .pipe(gulp.dest('build/'));
//});

gulp.task('connectDist', function () {
    connect.server({
        root: 'build/',
        port: 9999
    });
});

gulp.task('buildOpen', function(){
    gulp.src(__filename)
        .pipe(open({uri: urlBuild}));
});


gulp.task('default',
    ['inject', 'lint', 'connect', 'appOpen']
);

gulp.task('app',
    ['inject', 'connect', 'appOpen']
);

/*
gulp.task('build',
    ['cleanBuild', 'inject', 'minify-css', 'minify-js', 'copy-html-files', 'copy-bower-components', 'connectDist', 'buildOpen']
);*/
