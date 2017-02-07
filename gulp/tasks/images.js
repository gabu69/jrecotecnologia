'use strict';

const gulp     = require('gulp'),
      cheerio      = require('gulp-cheerio'),
      imagemin = require('gulp-imagemin'),
      newer    = require('gulp-newer'),
      size     = require('gulp-size'),
      rename   = require('gulp-rename'),
      svgstore     = require('gulp-svgstore'),
      svgmin       = require('gulp-svgmin'),
      resize   = require('./resize-images'),
      merge2   = require('merge2');

// include paths file
const paths    = require('../paths');

// 'gulp images:noresize' -- optimizes images
gulp.task('images:noresize', () => 
  gulp.src([
      paths.imageFilesGlob, '!' + paths.imageFiles + '/{productos,productos/**}',
      '!' + paths.imageFiles + '/{sucursales,sucursales/**}',
      '!' + paths.imageFiles + '/{svg,svg/**}'
    ])
    .pipe(newer(paths.imageFilesSite))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng()
    ], {verbose: true}))
    .pipe(gulp.dest(paths.imageFilesSite))
    .pipe(size({title: 'images'}))
);

// Image resize values
var options = [
  { width: 25, upscale: false },
  { width: 200, upscale: false },
  { width: 300, upscale: false },
  { width: 400, upscale: false },
  { width: 600, upscale: false },
  { width: 800, upscale: false }
];

// 'gulp images:~' -- resizes, optimizes, and caches feature images
// https://gist.github.com/ddprrt/1b535c30374158837df89c0e7f65bcfc
gulp.task('images:productos', function() {
  var streams = options.map(function(el) {
    return gulp.src([paths.imageFiles + '/productos' + paths.imagePattern])
      .pipe(rename(function(file) {
        if(file.extname) {
          if(el.width == 25) {
            file.basename = 'lqip-' + file.basename;
          } else {
            file.basename += '-' + el.width;
          }
        }
      }))
      .pipe(newer(paths.imageFilesSite + '/productos'))
      .pipe(resize(el))
      .pipe(imagemin([
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng()
      ], {verbose: true}))
      .pipe(gulp.dest(paths.imageFilesSite + '/productos'));
  });
  return merge2(streams);
});

gulp.task('images:sucursales', function() {
  var streams = options.map(function(el) {
    return gulp.src([paths.imageFiles + '/sucursales' + paths.imagePattern])
      .pipe(rename(function(file) {
        if(file.extname) {
          file.basename += '-' + el.width;
        }
      }))
      .pipe(newer(paths.imageFilesSite + '/sucursales'))
      .pipe(resize(el))
      .pipe(imagemin([
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng()
      ], {verbose: true}))
      .pipe(gulp.dest(paths.imageFilesSite + '/sucursales'));
  });
  return merge2(streams);
});

gulp.task('icons', function () {
  return gulp.src(paths.iconFiles + '/**/*.svg')
    .pipe(svgmin({
        plugins: [{
          cleanupIDs: false
        }]
      }))
    .pipe(svgstore({ inlineSvg: true}))
    .pipe(cheerio({
      run: function ($, file) {
        $('svg').attr('style', 'display:none');
        $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.imageFiles + '/svg/'));
});

gulp.task('images:svg', () =>
  gulp.src(paths.imageFiles + '/svg/**/*')
    .pipe(gulp.dest(paths.imageFilesSite + '/svg'))
);