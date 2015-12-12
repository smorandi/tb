var gulp = require("gulp");

var minifyHTML = require("gulp-minify-html");
var uglify = require("gulp-uglify");
var inject = require("gulp-inject");
var bowerFiles = require("main-bower-files");
var open = require("gulp-open");
var util = require("gulp-util");
var minify = require("gulp-minify");
var filesort = require("gulp-angular-filesort");
var exec = require("child_process").exec;
var exit = require("gulp-exit");
var gnf = require("gulp-npm-files");
var rimraf = require("gulp-rimraf");
var sloc = require('gulp-sloc');
var jshint = require('gulp-jshint');
var gulpProtractorAngular = require("gulp-angular-protractor");
var less = require("gulp-less");
var Server = require("karma").Server;
var gulpSequence = require('gulp-sequence');

var urlApp = "http://localhost:3000";

var MESSAGE_TASK_END = "task end";
var MESSAGE_INFO = "info";
var MESSAGE_WARNING = "warning";
var MESSAGE_ERROR = "error";
var MESSAGE_SUCCESS = "success";

var TASK_TEST_MIDWAY = "test.midway";
var TASK_TEST_E2E = "test.e2e";
var TASK_TEST_UNIT = "test.unit";
var TASK_TEST_ALL = "test.all";

var TASK_DEV_INJECT_SOURCE_TO_INDEX = "dev.inject.index";
var TASK_DEV_APP_OPEN = "dev.appOpen";
var TASK_DEV_BUILD_CSS_FROM_LESS = "dev.fe.less";
var TASK_DEV_LINT = "dev.lint";
var TASK_DEV_SLOC_SERVER = "dev.sloc.server";
var TASK_DEV_SLOC_CLIENT = "dev.sloc.client";
var TASK_DEV_INJECT = "dev.inject";

var TASK_BUILD_DELETE_EXISTING_FILE = "build.rimraf";
var TASK_BUILD_FE_ANGULAR_HTML_MINIFY = "build.fe.angular.html";
var TASK_BUILD_FE_ANGULAR_JS = "build.fe.angular.js";
var TASK_BUILD_FE_COPY_CSS = "build.fe.css";
var TASK_BUILD_FE_FILE_COPY = "build.fe.file";
var TASK_BUILD_FE_COPY_GLYPHICONS = "build.fe.glyphicons";
var TASK_BUILD_SERVER_FILE_COPY = "build.server.file";
var TASK_BUILD_SERVERJS = "build.server.main";
var TASK_BUILD_NODE = "build.node";
var TASK_BUILD_SERVER_JS_UGLIFY_AND_COPY = "build.server.js";
var TASK_BUILD_FE_BOWER_COPY = "build.bower";
var TASK_BUILD_ALL = "build.all";
var TASK_BUILD_FE = "build.fe";
var TASK_BUILD_SERVER = "build.server";

var TASK_SERVER_START = "start.server";
var TASK_SERVER_START_DEV = "start.server.dev";

function logGulp(taskName, message, state) {

    var messageOut = taskName + " : " + message;

    switch (state) {
        case MESSAGE_ERROR:
            util.log(util.colors.red(messageOut));
            break;
        case MESSAGE_INFO:
            util.log(util.colors.magenta(messageOut));
            break;

        case MESSAGE_WARNING:
            util.log(util.colors.yellow(messageOut));
            break;

        case MESSAGE_SUCCESS:
            util.log(util.colors.green(messageOut));
            break;

        default:
            util.log(messageOut);
            break
    }

}

//tasks for developing
gulp.task(TASK_DEV_INJECT_SOURCE_TO_INDEX, function () {

    return gulp.src("./public/index.html")
        .pipe(inject(gulp.src(["./public/assets/lib_head/**/*.js"], {read: false}), {relative: true, name: "head"}))
        .pipe(inject(gulp.src(bowerFiles(), {read: true}), {relative: true, name: "bower"}))
        .pipe(inject(gulp.src(["./public/api/**/*.js", "./public/components/**/*.js", "./public/infrastructure/**/*.js", "./public/injections.js"],
            {read: true}).pipe(filesort()), {relative: true, name: "angular"}))
        .pipe(inject(gulp.src(["./public/app.js"], {read: false}), {relative: true, name: "anguapp"}))
        .pipe(inject(gulp.src(["./public/assets/css/**/*.css"], {read: false}), {relative: true, name: "style"}))
        .pipe(gulp.dest("./public"))
        .on("error", function (e) {
            logGulp(TASK_DEV_INJECT, e, MESSAGE_ERROR);
        })
});

gulp.task(TASK_DEV_BUILD_CSS_FROM_LESS, [TASK_BUILD_DELETE_EXISTING_FILE], function() {
    gulp.src("./public/assets/less/tb.less")
        .pipe(less())
        .pipe(gulp.dest("./public/assets/css/main"));
});

gulp.task(TASK_DEV_INJECT, gulpSequence(TASK_DEV_BUILD_CSS_FROM_LESS, TASK_DEV_INJECT_SOURCE_TO_INDEX));

gulp.task(TASK_DEV_APP_OPEN, function () {

    return gulp.src(__filename)
        .pipe(open({uri: urlApp}))
        .on("error", function (e) {
            logGulp(TASK_DEV_APP_OPEN, e, MESSAGE_ERROR);
        });
});

gulp.task(TASK_DEV_SLOC_SERVER, function(){
    gulp.src(["./backend/**/*.js"])
        .pipe(sloc());
});

gulp.task(TASK_DEV_SLOC_CLIENT, function(){
    gulp.src(["!./public/assets/**/*", "!**/*/all.references.js", "./public/**/*.js"])
        .pipe(sloc());
});

gulp.task(TASK_DEV_LINT, function() {
    return gulp.src(["./backend/**/*.js"])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// tasks around the server
gulp.task(TASK_SERVER_START, function (cb) {
    exec("start npm start", function (err, stdout, stderr) {
        logGulp(TASK_SERVER_START, stdout, MESSAGE_INFO);
        logGulp(TASK_SERVER_START, stderr, MESSAGE_INFO);
        if (err) {
            logGulp(TASK_SERVER_START, err, MESSAGE_ERROR);
            cb(err);
        } else {
            cb();
        }
    });
});

gulp.task(TASK_SERVER_START_DEV, function (cb) {
    exec("start npm run start-dev", function (err, stdout, stderr) {
        logGulp(TASK_SERVER_START_DEV, stdout, MESSAGE_INFO);
        logGulp(TASK_SERVER_START_DEV, stderr, MESSAGE_INFO);
        if (err) {
            logGulp(TASK_SERVER_START_DEV, err, MESSAGE_ERROR);
            cb(err);
        } else {
            cb();
        }
    });
});

// tasks for testing
gulp.task(TASK_TEST_E2E, function (callback) {
    gulp.src(["./testFE/e2e/*.js"])
        .pipe(gulpProtractorAngular({
            "configFile": "./testFE/protractor.conf.js",
            "debug": false,
            "autoStartStopServer": true
        }))
        .on("error", function (e) {
            callback(e);
        })
        .on("end", function () {
            callback()
        });
});

gulp.task(TASK_TEST_UNIT, function (done) {
    var karmaServer = new Server({
        configFile: __dirname + "/testFE/karma-unit.conf.js",
        singleRun: true
    });

    karmaServer.on("browser_error", function (browser, err) {
        logGulp(TASK_TEST_UNIT, "tests failed: " + err.message, MESSAGE_ERROR);
        logGulp(TASK_TEST_UNIT, MESSAGE_TASK_END, MESSAGE_INFO);
        done(err);
    });

    karmaServer.on("run_complete", function (browsers, results) {
        var error = null;
        if (results.error) {
            logGulp(TASK_TEST_UNIT, "tests failed", MESSAGE_ERROR);
            try {
                throw new Error("Unit tests failed");
            } catch (e) {
                error = e;
            }
        } else {
            logGulp(TASK_TEST_UNIT, "tests success", MESSAGE_SUCCESS);
        }
        logGulp(TASK_TEST_UNIT, MESSAGE_TASK_END, MESSAGE_INFO);
        done(error);
    });

    karmaServer.start();
});

gulp.task(TASK_TEST_MIDWAY, function (done) {
    var midwayServer = new Server({
        configFile: __dirname + "/testFE/karma-midway.conf.js",
        singleRun: true
    });

    midwayServer.on("browser_error", function (browser, err) {
        logGulp(TASK_TEST_MIDWAY, "tets failed " + err.message, MESSAGE_ERROR);
        logGulp(TASK_TEST_MIDWAY, MESSAGE_TASK_END, MESSAGE_INFO);
        done(err);
    });

    midwayServer.on("run_complete", function (browsers, results) {
        var error = null;

        logGulp(TASK_TEST_MIDWAY, "tests " + results.failed + " failed, " + results.success + " success", MESSAGE_INFO);

        if (results.error) {
            logGulp(TASK_TEST_MIDWAY, "tests failed", MESSAGE_ERROR);
            error = new Error("Unit tests failed");
        } else {
            logGulp(TASK_TEST_MIDWAY, "tests success", MESSAGE_SUCCESS);
        }
        logGulp(TASK_TEST_MIDWAY, MESSAGE_TASK_END, MESSAGE_INFO);
        done(error);
    });

    midwayServer.start();

});

gulp.task(TASK_TEST_ALL,
    [TASK_SERVER_START_DEV, TASK_TEST_MIDWAY, TASK_TEST_UNIT, TASK_TEST_E2E]
);

// tasks to build the project

gulp.task(TASK_BUILD_DELETE_EXISTING_FILE, function () {
    return gulp.src("./build", {read: false})
        .pipe(rimraf({force: true}));
});

gulp.task(TASK_BUILD_FE_ANGULAR_HTML_MINIFY, [TASK_BUILD_DELETE_EXISTING_FILE], function () {
    // minify options
    var opts = {
        conditionals: false,
        spare:false,
        quotes:false,
        empty:true,
        cdata:false,
        comments:false,
        loose:false
    };

    return gulp.src(["!./public/assets/**/*", "./public/**/*.html"])
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest("./build/public/"));
});

gulp.task(TASK_BUILD_FE_ANGULAR_JS, [TASK_BUILD_DELETE_EXISTING_FILE], function () {
    return gulp.src(["!./public/assets/**/*", "!**/*/all.references.js", "./public/**/*.js"])
        //.pipe(uglify())
        .pipe(gulp.dest("./build/public/"));
});

gulp.task(TASK_BUILD_FE_COPY_CSS, [TASK_BUILD_DELETE_EXISTING_FILE], function () {
    return gulp.src(["!./public/assets/lib/**/*", "./public/**/*.css"])
        .pipe(gulp.dest("./build/public/"));
});

gulp.task(TASK_BUILD_FE_COPY_GLYPHICONS,[TASK_BUILD_DELETE_EXISTING_FILE], function () {
    return gulp.src(["./public/assets/lib/bower_components/bootstrap-less-v3/fonts/glyphicons*"])
        .pipe(gulp.dest("./build/public/assets/lib/bower_components/bootstrap-less-v3/fonts/"));
});

gulp.task(TASK_BUILD_FE_FILE_COPY, [TASK_BUILD_DELETE_EXISTING_FILE], function () {
    return gulp.src(["!./public/assets/lib/**/*", "./public/**/*.jpg", "./public/**/*.ico", "./public/**/*.png", "./public/**/*.json"])
        .pipe(gulp.dest("./build/public/"));
});

gulp.task(TASK_BUILD_FE_BOWER_COPY, [TASK_BUILD_DELETE_EXISTING_FILE], function () {
    return gulp.src(bowerFiles(), {base: "./public/assets/lib/bower_components"})
        .pipe(gulp.dest("./build/public/assets/lib/bower_components"));
});

gulp.task(TASK_BUILD_SERVER_JS_UGLIFY_AND_COPY, [TASK_BUILD_DELETE_EXISTING_FILE], function () {
    return gulp.src(["./backend/**/*.js"])
        .pipe(uglify())
        .pipe(gulp.dest("./build/backend/"));
});

gulp.task(TASK_BUILD_SERVER_FILE_COPY, [TASK_BUILD_DELETE_EXISTING_FILE], function () {
    return gulp.src(["./backend/**/*.json", "./backend/**/*.pem"])
        .pipe(gulp.dest("./build/backend/"));
});

gulp.task(TASK_BUILD_SERVERJS, [TASK_BUILD_DELETE_EXISTING_FILE], function () {
    return gulp.src("./server.js")
        .pipe(uglify())
        .pipe(gulp.dest("./build/"));
});

gulp.task(TASK_BUILD_NODE, [TASK_BUILD_DELETE_EXISTING_FILE], function () {
    return gulp.src(gnf(null, "./package.json"), {base: "./"})
        .pipe(gulp.dest("./build"));
});

gulp.task(TASK_BUILD_FE, [TASK_BUILD_FE_ANGULAR_HTML_MINIFY, TASK_BUILD_FE_ANGULAR_JS, TASK_BUILD_FE_COPY_GLYPHICONS, TASK_BUILD_FE_FILE_COPY, TASK_BUILD_FE_COPY_CSS, TASK_BUILD_FE_BOWER_COPY]);
gulp.task(TASK_BUILD_SERVER, [TASK_BUILD_SERVER_JS_UGLIFY_AND_COPY, TASK_BUILD_SERVER_FILE_COPY, TASK_BUILD_SERVERJS, TASK_BUILD_NODE]);
gulp.task(TASK_BUILD_ALL , gulpSequence(TASK_DEV_BUILD_CSS_FROM_LESS, TASK_DEV_INJECT_SOURCE_TO_INDEX, [TASK_BUILD_FE, TASK_BUILD_SERVER]));

//workflow
gulp.task("default",
    [TASK_SERVER_START, TASK_DEV_APP_OPEN]
);
