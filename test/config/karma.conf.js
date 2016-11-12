var path = require('path');

module.exports = function (config) {

  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '../../',

    frameworks: ['mocha', 'chai-sinon', 'chai'],

    // list of files / patterns to load in the browser
    files: [
      'index.js',
      'node_modules/hugs/src/exporters/chai.js',
      'node_modules/hugs/src/exporters/sinon.js',
      'node_modules/hugs/src/targets/mocha.js',
      'node_modules/hugs/src/index.js',
      './test/index.js'
    ],

    // list of files to exclude
    exclude: [],

    preprocessors: {
      'index.js': ['coverage']
    },

    // use dots reporter, as travis terminal does not support escaping sequences
    // possible values: 'dots', 'progress'
    // CLI --reporters progress
    reporters: ['spec', 'junit', 'coverage'],

    junitReporter: {
      outputDir: ['./target', ''].join(path.sep),
      outputFile: 'test-results.xml'
    },

    coverageReporter: {
      dir: ['./target', 'coverage'].join(path.sep),
      reporters: [
        {
          type: 'html',
          subdir: 'report-html'
        },
        {
          type: 'lcov',
          subdir: 'report-lcov'
        }
      ]
    },

    // web server port
    // CLI --port 9876
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    // CLI --colors --no-colors
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    // CLI --log-level debug
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    // CLI --auto-watch --no-auto-watch
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // CLI --browsers Chrome,Firefox,Safari
    browsers: ['PhantomJS'],

    // If browser does not capture in given timeout [ms], kill it
    // CLI --capture-timeout 5000
    captureTimeout: 20000,

    // Auto run tests on start (when browsers are captured) and exit
    // CLI --single-run --no-single-run
    singleRun: true,

    // report which specs are slower than 500ms
    // CLI --report-slower-than 500
    reportSlowerThan: 500,

    client: {
      mocha: {
        reporter: 'html', // change Karma's debug.html to the mocha web reporter
        ui: 'tdd'
      }
    }
  });
};
