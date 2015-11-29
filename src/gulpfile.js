var gulp = require('gulp');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
//var minifyCSS = require('gulp-minify-css');
//var clean = require('gulp-clean');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var stylus = require('gulp-stylus');
var open = require('gulp-open');
var concat = require('gulp-concat');
var util = require('gulp-util');
//var minify = require('gulp-minify');
var filesort = require('gulp-angular-filesort');
//var run = require('gulp-run');
var exec = require('child_process').exec;
var exit = require('gulp-exit');

var gulpProtractorAngular = require('gulp-angular-protractor');
var Server = require('karma').Server;

var urlApp = "http://localhost:3000";

//App Dev
gulp.task('inject', function(){
    gulp.src('./public/index.html')
        .pipe(inject(gulp.src(['./public/assets/lib_head/**/*.js'], {read: false}), {relative: true, name: 'head'}))
        .pipe(inject(gulp.src(bowerFiles(), {read: true}), {relative: true, name: 'bower'}))
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

gulp.task('appOpen', function(){
    gulp.src(__filename)
        .pipe(open({uri: urlApp}));
});

// Server

gulp.task('start.server', function (cb) {
    exec('start npm start', function (err, stdout, stderr) {
        util.log(stdout);
        util.log(stderr);
        cb(err);
    });
});

gulp.task('start.server.dev', function (cb) {
    exec('start npm run start-dev', function (err, stdout, stderr) {
        util.log(stdout);
        util.log(stderr);
        cb(err);
    });
});

gulp.task('start.mongod', function (cb) {
    exec('start mongod', function (err, stdout, stderr) {
        util.log(stdout);
        util.log(stderr);
        cb(err);
    });
});

// Testing

gulp.task('test.e2e', function(callback) {
    gulp.src(['./testFE/*.js'])
        .pipe(gulpProtractorAngular({
            'configFile': './testFE/protractor.conf.js',
            'debug': false,
            'autoStartStopServer': true
        }))
        .on('error', function(e) {
            console.log(e);
        })
        .on('end', callback);
});

gulp.task('test.unit', function (done) {
    new Server({
        configFile: __dirname +'/testFE/karma-unit.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('test.midway', function (done) {
    new Server({
        configFile: __dirname +'/testFE/karma-midway.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('test.all',
    ['start.mongod', 'start.server.dev', 'test.midway', 'test.unit', 'test.e2e']
);

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


//workflow

gulp.task('default',
    [ 'start.mongod', 'start.server', 'appOpen']
);

/*
gulp.task('build',
    ['cleanBuild', 'inject', 'minify-css', 'minify-js', 'copy-html-files', 'copy-bower-components', 'connectDist', 'buildOpen']
);*/

