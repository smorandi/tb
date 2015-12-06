
module.exports = function() {
    return {
     // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
      files: [
          //App
          'public/socket.io/socket.io.js',
          'public/assets/lib/bower_components/jquery/dist/jquery.js',
          'public/assets/lib/bower_components/angular/angular.js',
          'public/assets/lib/bower_components/angular-mocks/angular-mocks.js',
          'public/assets/lib/bower_components/angular-animate/angular-animate.js',
          'public/assets/lib/bower_components/angular-sanitize/angular-sanitize.js',
          'public/assets/lib/bower_components/angular-ui-router/release/angular-ui-router.js',
          'public/assets/lib/bower_components/angular-local-storage/dist/angular-local-storage.js',
          'public/assets/lib/bower_components/angular-resource/angular-resource.js',
          'public/assets/lib/bower_components/rfc6570/rfc6570.js',
          'public/assets/lib/bower_components/angular-socket-io/socket.js',
          'public/assets/lib/bower_components/angular-bootstrap/ui-bootstrap.js',
          'public/assets/lib/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
          'public/assets/lib/bower_components/AngularJS-Toaster/toaster.js',
          'public/assets/lib/bower_components/valdr/valdr.js',
          'public/assets/lib/bower_components/valdr/valdr-message.js',
          'public/assets/lib/bower_components/lodash/lodash.js',
          'public/assets/lib/bower_components/angular-lodash-module/angular-lodash-module.js',
          'public/assets/lib/bower_components/angular-translate/angular-translate.js',
          'public/assets/lib/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
          'public/assets/lib/angular-hal.js',
          'public/injections.js',
          'public/components/**/*.js',
          'public/infrastructure/**/*.js',
          'public/api/models.js',
          'public/api/interfaces.js',
          'public/api/constants.js',
          'public/api/enums.js',
          'public/api/validations.js',
          'public/app.js',
          //'public/infrastructure/**/*.json',

          //Conf
          'node_modules/chai/chai.js',
          'testFE/chai-conf.js',

          //Test resource
          './testFE/test_util/testResource.js'

      ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'public/components/**/*.js' : ['coverage'],
        'public/infrastructure/**/*.js' : ['coverage'],
        'public/api/models.js' : ['coverage'],
        'public/api/interfaces.js' : ['coverage'],
        'public/api/constants.js' : ['coverage'],
        'public/api/enums.js' : ['coverage'],
        'public/api/validations.js' : ['coverage'],
        'public/app.js' : ['coverage']
    },

    coverageReporter: {
      type : 'html',
      dir : './testFE/coverage/'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  }
};
