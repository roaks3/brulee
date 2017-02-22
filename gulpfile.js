'use strict';

/*eslint-env node*/
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');
var lazypipe = require('lazypipe');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var WebpackDevServer = require('webpack-dev-server');
var makeWebpackConfig = require('./webpack.make');

var port = 9000;

var yeoman = {
  app: 'app',
  dist: 'dist'
};

var paths = {
  scripts: [yeoman.app + '/**/*.js'],
  views: {
    main: yeoman.app + '/index.html'
  }
};

////////////////////////
// Reusable pipelines //
////////////////////////

var lintScripts = lazypipe()
  .pipe($.eslint, './.eslintrc.js')
  .pipe($.eslint.format);

///////////
// Tasks //
///////////

gulp.task('webpack:dev', function () {
  var webpackDevConfig = makeWebpackConfig({ DEV: true });
  return gulp.src(webpackDevConfig.entry.app)
    .pipe($.plumber())
    .pipe(webpackStream(webpackDevConfig))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('webpack:dist', function () {
  var webpackDistConfig = makeWebpackConfig({ BUILD: true });
  return gulp.src(webpackDistConfig.entry.app)
    .pipe(webpackStream(webpackDistConfig))
    .on('error', () => {
      this.emit('end'); // Recover from errors
    })
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('jshint', function () {
  return gulp.src(paths.scripts)
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('jscs', function () {
  return gulp.src(paths.scripts)
    .pipe($.jscs())
    .pipe($.jscs.reporter());
});

gulp.task('lint', ['jshint', 'jscs'], function () {
  return gulp.src(paths.scripts)
    .pipe(lintScripts());
});

gulp.task('clean:tmp', function (cb) {
  rimraf('./.tmp', cb);
});

gulp.task('watch', function () {
  $.watch(paths.scripts, function () {
    gulp.src(paths.scripts)
      .pipe(lintScripts());
  });
});

gulp.task('webpack-dev-server', function () {
  var webpackDevConfig = makeWebpackConfig({ DEV: true });
  webpackDevConfig.entry.app = [
    'webpack-dev-server/client?http://localhost:' + port + '/',
    'webpack/hot/dev-server',
    webpackDevConfig.entry.app
  ];
  new WebpackDevServer(webpack(webpackDevConfig), webpackDevConfig.devServer).listen(port, 'localhost', function () {
    open('http://localhost:' + port);
  });
});

gulp.task('serve', function (cb) {
  runSequence(
    'lint',
    'webpack-dev-server',
    'watch', cb);
});

///////////
// Build //
///////////

gulp.task('clean:dist', function (cb) {
  rimraf('./' + yeoman.dist, cb);
});

gulp.task('images', function () {
  return gulp.src(yeoman.app + '/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(yeoman.dist + '/images'));
});

gulp.task('copy:extras', function () {
  return gulp.src(yeoman.app + '/*/.*', { dot: true })
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('build', ['clean:dist'], function (cb) {
  runSequence(['images', 'copy:extras', 'webpack:dist'], cb);
});

gulp.task('default', ['build']);
