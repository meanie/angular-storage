'use strict';

/**
 * Dependencies
 */
var gulp = require('gulp');
var karma = require('gulp-karma');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

/**
 * Assets
 */
var assets = require('./meanie').assets;

/**
 * Default task
 */
gulp.task('default', gulp.series(
  lint, test
));

/**
 * Helper to merge file arrays
 */
function merge() {
  var merged = [];
  for (var i = 0; i < arguments.length; i++) {
    merged = merged.concat(arguments[i]);
  }
  return merged;
}

/**
 * Linting
 */
function lint() {
  return gulp.src(merge(assets.src, assets.tests))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
}

/**
 * Run unit tests
 */
function test() {
  return gulp.src(merge(
    assets.testing,
    assets.src,
    assets.tests
  ))
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      //Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
}
