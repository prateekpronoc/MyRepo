/*jslint node: true */

'use strict';

module.exports = function (gulp, $, cfg) {

  gulp.task('unit', function () {
    var bowerDeps = $.wiredep({
        exclude: ['bootstrap.js'],
        devDependencies: true
      }),
      testFiles = bowerDeps.js.concat(cfg.js.concat(cfg.unit));

    return gulp.src(testFiles)
      .pipe($.karma({
        configFile: 'test/karma.conf.js'
      }))
      .on('error', function (err) {
        throw err;
      });
  });

  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  /* jshint -W106 */
  gulp.task('webdriver-update', $.protractor.webdriver_update);
  gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);
  /* jshint +W106 */
  // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

  gulp.task('e2e', ['webdriver-update', 'serve:e2e'], protractor);
  gulp.task('e2e:dist', ['webdriver-update', 'serve:e2e:dist'], protractor);

  function protractor() {
    return gulp.src(cfg.e2e)
      .pipe($.protractor.protractor({
        configFile: 'test/protractor.conf.js'
      }))
      .on('error', function (err) {
        throw err;
      })
      .on('end', function () {
        $.browserSync.exit();
      });
  }
};
