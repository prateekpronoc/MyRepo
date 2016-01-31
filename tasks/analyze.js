/*jslint node: true */

'use strict';

module.exports = function (gulp, $, cfg) {

  function handleError(err) {
    console.error(err.toString());
    /* jshint validthis: true */
    this.emit('end');
  }

  var appFiles = 'app/**/*.js',
    testFiles = 'test/**/*.js',
    gulpFiles = [
      'gulpfile.js',
      'tasks/*.js'
    ];

  gulp.task('analyze', ['lint', 'staticAnalysis'], function (cb) {
    cb();
  });

  gulp.task('lint', ['jshint:src', 'jshint:test', 'jscs'], function (cb) {
    cb();
  });

  gulp.task('jshint:src', function () {
    return lintJS(gulpFiles.concat(appFiles), '.jshintrc');
  });

  gulp.task('jshint:test', function () {
    return lintJS(testFiles, 'test/.jshintrc');
  });

  gulp.task('jscs', function () {
    var sources = gulpFiles.concat(appFiles, testFiles);
    return gulp.src(sources)
      .pipe($.jscs())
      .on('error', handleError);
  });

  gulp.task('staticAnalysis', function () {
    return gulp.src(appFiles)
      .pipe($.plato(cfg.analysisDir));
  });

  function lintJS(glob, jshintrc) {
    return gulp.src(glob)
      .pipe($.jshint(jshintrc))
      .pipe($.jshint.reporter('jshint-stylish'));
  }
};
