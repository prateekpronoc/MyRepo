/*jslint node: true */

'use strict';

module.exports = function (gulp, $, cfg) {

  var htmlMinOpts = {
    empty: true,
    spare: true,
    quotes: true
  };

  gulp.task('dist', ['index:dist', 'images', 'fonts', 'analyze'], function (done) {
    done();
  });
  gulp.task('index:dist', ['index', 'partials:dist'], function () {
    var jsFilter = $.filter('**/*.js'),
      // appJsFilter = $.filter(['**/*.js', '!**/*-vendor*.js']),
      // vendorJsFilter = $.filter(['**/*-vendor*.js']),
      cssFilter = $.filter('**/*.css'),
      htmlFilter = $.filter('**/*.html'),
      assets;
    return gulp.src('.tmp/index.html')
      .pipe($.inject(gulp.src('.tmp/partials/templates.js'), {
        read: false,
        starttag: '<!-- inject:partials -->',
        ignorePath: ['.tmp']
      }))
      .pipe(assets = $.useref.assets())
      .pipe($.rev())
      .pipe(jsFilter)
      //Needed this to fix the URL which should work in production mode for API calls.
      //IIS proxy was not working due to issue in ARR installation
      .pipe($.replace('mappedTo: \'\'', 'mappedTo: \'' + cfg.opts.mappedUrlPrefix + '\''))
      .pipe($.ngAnnotate())
      // .pipe($.uglify({
      //   preserveComments: function (node, comment) {
      //     var text = comment.value, type = comment.type;
      //     if (type === 'comment2') {
      //       return /@preserve|@license|@cc_on/i.test(text);
      //     }
      //   },
      //   mangle: false
      // }))
      .pipe(jsFilter.restore())
      // .pipe(appJsFilter)
      // .pipe($.debug({title: 'Uglify: '}))
      // .pipe($.uglify({
      //   preserveComments: function (node, comment) {
      //     var text = comment.value, type = comment.type;
      //     if (type === 'comment2') {
      //       return /@preserve|@license|@cc_on/i.test(text);
      //     }
      //   }
      // }))
      // .pipe(appJsFilter.restore())
      // .pipe(vendorJsFilter)
      // .pipe($.debug({title: 'Uglify Vendor: '}))
      // .pipe($.uglify({
      //   preserveComments: function (node, comment) {
      //     var text = comment.value, type = comment.type;
      //     if (type === 'comment2') {
      //       return /@preserve|@license|@cc_on/i.test(text);
      //     }
      //   },
      //   mangle: false // This is needed as there is an error with Angular JS uglification
      // }))
      // .pipe(vendorJsFilter.restore())
      .pipe(cssFilter)
      .pipe($.replace('bower_components/bootstrap-sass-official/assets/fonts/bootstrap', 'fonts'))
      .pipe($.csso())
      .pipe(cssFilter.restore())
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.revReplace())
      .pipe(htmlFilter)
      .pipe($.minifyHtml(htmlMinOpts))
      .pipe(htmlFilter.restore())
      .pipe(gulp.dest('.dist'))
      .pipe($.size());
  });

  gulp.task('partials:dist', function () {
    return gulp.src(['app/**/*.html', '!app/index.html'])
      .pipe($.minifyHtml(htmlMinOpts))
      .pipe($.angularTemplatecache({
        module: cfg.name
      }))
      .pipe(gulp.dest('.tmp/partials'))
      .pipe($.size({
        title: 'partials'
      }));
  });

  gulp.task('images', function () {
    return gulp.src('app/images/*.png')
      .pipe(gulp.dest('.dist/images'))
      .pipe($.size());
  });

  gulp.task('fonts', function () {
    var fontFilter = $.filter('**/*.{eot,otf,svg,ttf,woff}');
    return gulp.src($.mainBowerFiles())
      .pipe(fontFilter)
      .pipe(gulp.dest('.dist/fonts'))
      .pipe($.size())
      .pipe(fontFilter.restore());
  });
};
