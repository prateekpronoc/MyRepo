/*jshint node: true */

'use strict';

var gulp = require('gulp'),
  $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'del', 'browser-sync', 'wiredep', 'event-stream',
      'proxy-middleware', 'url', 'imagemin-pngcrush'
    ]
  }),
  config = require('./package.json').config,
  _ = require('lodash'),
  modules = require('require-dir')('./tasks'),
  opts,
  defaultConfig;

try {
  opts = require('./options.json');
} catch (e) {
  opts = require('./options.example.json');
}

defaultConfig = {
  name: 'wams',
  devDir: './app',
  buildDir: './.tmp',
  distDir: './.dist',
  analysisDir: './.analysis',
  js: [
    'app/**/*.module.js',
    'app/**/*.js'
  ],
  unit: 'test/unit/**/*.js',
  e2e: ['test/e2e/**/create.scenario.js'],
  vendor: 'bower_components'
};

config = _.defaults(config, defaultConfig);
config.opts = opts;
config.isWatching = false;

_.forOwn(modules, function (module) {
  if (_.isFunction(module)) {
    // console.log('Module = ' + module);
    module(gulp, $, config, _);
  }
});
