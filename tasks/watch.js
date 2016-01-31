/*jslint node: true */

'use strict';

module.exports = function (gulp) {
  gulp.task('watch', ['index'], function (cb) {
    gulp.watch('app/**/*.less', ['styles']);
    gulp.watch('app/index.html', ['index']);
    gulp.watch('app/**/*.js').on('change', function (evt) {
      if (evt.type !== 'changed') {
        gulp.start('index');
      }
    });
    cb();
  });
};
