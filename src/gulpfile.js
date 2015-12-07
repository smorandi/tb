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
var gulpProtractorAngular = require("gulp-angular-protractor");
var Server = require("karma").Server;

var urlApp = "http://localhost:3000";

var MESSAGE_TASK_START = "start task";
var MESSAGE_TASK_END = "task end";
var MESSAGE_INFO = "info";
var MESSAGE_WARNING = "warning";
var MESSAGE_ERROR = "error";
var MESSAGE_SUCCESS = "success";

var TASK_TEST_MIDWAY = "test.midway";
var TASK_TEST_E2E = "test.e2e";
var TASK_TEST_UNIT = "test.unit";
var TASK_TEST_ALL = "test.all";

var TASK_DEV_INJECT = "dev.inject";
var TASK_DEV_APP_OPEN = "dev.appOpen";

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

// Dev
gulp.task(TASK_DEV_INJECT, function () {

    return gulp.src("./public/index.html")
        .pipe(inject(gulp.src(["./public/assets/lib_head/**/*.js"], {read: false}), {relative: true, name: "head"}))
        .pipe(inject(gulp.src(bowerFiles(), {read: true}), {relative: true, name: "bower"}))
        .pipe(inject(gulp.src(["./public/api/**/*.js", "./public/components/**/*.js", "./public/infrastructure/**/*.js", "./public/injections.js"],
            {read: true}).pipe(filesort()), {relative: true, name: "angular"}))
        .pipe(inject(gulp.src(["./public/app.js"], {read: false}), {relative: true, name: "anguapp"}))
        .pipe(inject(gulp.src(["./public/assets/css/**/*.css"], {read: false}), {relative: true}))
        .pipe(gulp.dest("./public"))
        .on("error", function (e) {
            logGulp(TASK_DEV_INJECT, e, MESSAGE_ERROR);
        })
});

gulp.task(TASK_DEV_APP_OPEN, function () {

    return gulp.src(__filename)
        .pipe(open({uri: urlApp}))
        .on("error", function (e) {
            logGulp(TASK_DEV_APP_OPEN, e, MESSAGE_ERROR);
        });
});

// Server

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

// Testing
gulp.task(TASK_TEST_E2E, function (callback) {
    gulp.src(["./testFE/*.js"])
        .pipe(gulpProtractorAngular({
            "configFile": "./testFE/protractor.conf.js",
            "debug": false,
            "autoStartStopServer": true
        }))
        .on("error", function (e) {
            logGulp(TASK_TEST_E2E, e, MESSAGE_ERROR);
            callback(e);
        })
        .on("end", function () {
            logGulp(TASK_TEST_E2E, MESSAGE_TASK_END, MESSAGE_INFO);
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

// Build
gulp.task("build.rimraf", function () {
    return gulp.src("./build", {read: false})
        .pipe(rimraf({force: true}));
});

gulp.task("build.fe.angular.html", ["build.rimraf"], function () {
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

gulp.task("build.fe.angular.js", ["build.rimraf"], function () {
    return gulp.src(["!./public/assets/**/*", "!**/*/all.references.js", "./public/**/*.js"])
        //.pipe(uglify())
        .pipe(gulp.dest("./build/public/"));
});

gulp.task("build.fe.css", ["build.rimraf"], function () {
    return gulp.src(["!./public/assets/lib/**/*", "./public/**/*.css"])
        .pipe(gulp.dest("./build/public/"));
});

gulp.task("build.fe.file", ["build.rimraf"], function () {
    return gulp.src(["!./public/assets/lib/**/*", "./public/**/*.jpg", "./public/**/*.ico", "./public/**/*.png", "./public/**/*.json"])
        .pipe(gulp.dest("./build/public/"));
});

gulp.task("build.bower", ["build.rimraf"], function () {
    return gulp.src(bowerFiles(), {base: "./public/assets/lib/bower_components"})
        .pipe(gulp.dest("./build/public/assets/lib/bower_components"));
});

gulp.task("build.server.js", ["build.rimraf"], function () {
    return gulp.src(["./backend/**/*.js"])
        .pipe(uglify())
        .pipe(gulp.dest("./build/backend/"));
});

gulp.task("build.server.file", ["build.rimraf"], function () {
    return gulp.src(["./backend/**/*.json", "./backend/**/*.pem"])
        .pipe(gulp.dest("./build/backend/"));
});

gulp.task("build.server.main", ["build.rimraf"], function () {
    return gulp.src("./server.js")
        .pipe(uglify())
        .pipe(gulp.dest("./build/"));
});

gulp.task("build.node", ["build.rimraf"], function () {
    return gulp.src(gnf(null, "./package.json"), {base: "./"})
        .pipe(gulp.dest("./build"));
});


gulp.task("build.fe", ["build.fe.angular.html", "build.fe.angular.js", "build.fe.file", "build.fe.css", "build.bower"]);
gulp.task("build.server", ["build.server.js", "build.server.file", "build.server.main", "build.node"]);
gulp.task("build.all", ["build.fe", "build.server"]);

//workflow
gulp.task("default",
    [TASK_SERVER_START, TASK_DEV_APP_OPEN]
);

