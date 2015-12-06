var karmaConfig = require('./karma.conf');

module.exports = function(config) {
    var conf = karmaConfig();

    conf.files = conf.files.concat([
        './testFE/unit/controller/dashboard.test.js',
        './testFE/unit/controller/profil.test.js'
    ]);

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    conf.logLevel = config.LOG_ERROR,

    conf.proxies = {
        '/': 'http://localhost:9999/'
    };

    config.set(conf);
};

