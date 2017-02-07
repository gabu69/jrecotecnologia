// Modificado de https://github.com/mmistakes/made-mistakes-jekyll/blob/master/gulpfile.js

'use strict';

const gulp = require('gulp'),
      gutil = require('gulp-util'),
      svgmin = require('gulp-svgmin'),
      svgstore = require('gulp-svgstore'),
      cheerio = require('gulp-cheerio'),
      rename = require('gulp-rename'),
      purify = require('gulp-purifycss');

const requireDir = require('require-dir');
const tasks = requireDir('./gulp/tasks', {recurse: true}); // eslint-disable-line

// include paths file
var paths      = require('./gulp/paths');

// 'gulp images' -- copies, builds, and then copies it again
gulp.task('images', gulp.series('images:noresize', 'images:productos', 'images:sucursales', 'images:svg'));

// 'gulp scripts' -- genera los JS
gulp.task('scripts', gulp.parallel('scripts:webpack'));

// 'gulp assets' -- removes assets and rebuilds them
// 'gulp assets --prod' -- same as above but with production settings
gulp.task('assets', gulp.series(
  gulp.parallel('styles', 'scripts'),
  gulp.series('images', 'copy:assets')
));

// 'gulp clean' -- removes temporary and built files
gulp.task('clean', gulp.parallel('clean:assets', 'clean:dist', 'clean:site'));

// 'gulp inject' -- injects CSS and JS into includes
gulp.task('inject', gulp.parallel('inject:css', 'inject:scripts'));

// 'gulp php' -- Copa archivos php a _site
gulp.task('php', gulp.parallel('copy:phplib', 'copy:php'));

// 'gulp build:site' -- copies, builds, and then copies it again
gulp.task('build:site', gulp.series('copy:tmp', 'inject', 'copy:productos', 'site', 'clean:productos', 'copy:site'));

// 'gulp build' -- same as 'gulp' but doesn't serve site
// 'gulp build --prod' -- same as above but with production settings
gulp.task('build', gulp.series('clean', 'assets', 'build:site', 'html', 'php', 'copy:static', 'inject:htaccess', 'inject:trabajador'));

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'server')));




gulp.task('mapa', function () {
  const genMapa = child.spawn('node', ['./src/assets/mapa/mapa-home.js']);
  genMapa.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    
    if (code == 0) {
      return gulp.src('./src/assets/mapa/mapa-sucursales.svg')
        .pipe(svgmin({
              plugins: [{
                  cleanupIDs: false
                }, {
                  collapseGroups: false
                }, {
                  mergePaths: false
                }]
      //        , js2svg: {
      //          pretty: true
      //        }
          }))
        .pipe(cheerio({
              run: function ($, file) {
                $('svg').attr('xmlns:xlink', 'http://www.w3.org/1999/xlink');
              },
              parserOptions: { xmlMode: true }
          }))
        .pipe(rename('mapaSucursales.svg'))
        .pipe(gulp.dest('./_assets/images/productos/'));
    }
  });
});