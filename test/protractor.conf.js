// An example configuration file.
exports.config = {
  // The address of a running selenium server.
  //seleniumAddress: 'http://localhost:4444/wd/hub',
  seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.44.0.jar',

  // Use Jasmine 2 by default
  framework: 'jasmine2',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    browserName: 'chrome'
  },
  allScriptsTimeout: 30000,
  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['test/e2e/**/*.scenario.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 90000
  },
  onPrepare: function () { // This function prepares the reports for the test cases executed
    'use strict';
    /* global jasmine */
    var folderName = (new Date()).toString().split(' ').splice(1, 4).join(' '),
      mkdirp = require('mkdirp'),
      newFolder = './reports/' + folderName; //jasmine = require('jasmine')

    require('jasmine-reporters');
    mkdirp(newFolder, function (err) {
      if (err) {
        console.error(err);
      } else {
        jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter(newFolder, true, true));
      }
    });
  }
};
