/*jslint node: true */

'use strict';

module.exports = function (gulp, $, cfg) {

  gulp.task('clean', ['clean:analysis', 'clean:dist', 'clean:build']);

  gulp.task('clean:analysis', function (done) {
    $.del([cfg.analysisDir], done);
  });

  gulp.task('clean:dist', function (done) {
    $.del([cfg.distDir], done);
  });

  gulp.task('clean:build', function (done) {
    $.del([cfg.buildDir], done);
  });

};
