var karmaConfig = require('./karma.conf.js');

module.exports = function(config) {
    var conf = karmaConfig();

    conf.files = conf.files.concat([

        './testFE/midway/appModul.test.js',
        //'./testFE/midway/appRouter.test.js'
    ]);

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    conf.logLevel = config.LOG_INFO,

    conf.proxies = {
        '/': 'http://localhost:9999/'
    };

    config.set(conf);
};
