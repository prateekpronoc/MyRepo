/*jslint node: true */
'use strict';

module.exports = function (gulp, $, cfg) {
  var cwdOpts = {
    cwd: cfg.devDir
  };

  gulp.task('styles', function () {
    return gulp.src('*.less', cwdOpts)
      .pipe($.sourcemaps.init())
      .pipe($.less())
      // .pipe($.uncss({
      //   html: ['app/index.html', 'app/**/*.html']
      // }))
      .on('error', handleError)
      .pipe(gulp.dest(cfg.buildDir))
      .pipe($.autoprefixer())
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(cfg.buildDir))
      .pipe($.size({
        title: 'wams css'
      }));
  });

  gulp.task('index', ['styles'], function () {
    return gulp.src('index.html', cwdOpts)
      .pipe($.wiredep.stream({
        ignorePath: '../bower_components',
        exclude: ['bootstrap.js']
      }))
      .pipe($.inject(gulp.src(cfg.js, {
        read: false
      }), {
        ignorePath: 'app/'
      }))
      .pipe($.inject(gulp.src('*.css', {
        cwd: cfg.buildDir,
        read: false
      })))
      .pipe(gulp.dest(cfg.buildDir))
      .on('error', $.util.log);
  });

  gulp.task('htmllint', function () {
    return gulp.src('app/**/*.html')
      .pipe($.size())
      .pipe($.htmlhint('/.htmlhintrc'))
      .pipe($.htmlhint.failReporter());
  });

  gulp.task('build', ['clean'], function (done) {
    gulp.start('index');
    done();
  });

  gulp.task('jscpd', function () {
    return gulp.src('**/*.js')
      .pipe($.jscpd({
        'min-lines': 10,
        verbose: true
      }));
  });

  function handleError(err) {
    console.error(err.toString());
    /* jshint validthis: true */
    this.emit('end');
  }

};
