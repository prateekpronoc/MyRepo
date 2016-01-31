/*jslint node: true */

'use strict';

module.exports = function (config) {

  config.set({
    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],

    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ]
  });

};
