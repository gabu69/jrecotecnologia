'use strict';

const argv  = require('yargs').argv;
const gulp  = require('gulp');
const shell = require('shelljs');
const php  = require('gulp-connect-php');

// include paths file
const paths = require('../paths');

// 'gulp site' -- builds site with development settings
// 'gulp site --prod' -- builds site with production settings
gulp.task('site', done => {
  if (!argv.prod) {
    shell.exec('bundle exec jekyll build --config _config.yml,_config.dev.yml');
    done();
  } else if (argv.prod) {
    shell.exec('JEKYLL_ENV=production bundle exec jekyll build');
    done();
  }
});

gulp.task('server', done => {
    php.server({
        base: '_site',
        hostname: process.env.IP,
        port: process.env.PORT
    });
});

gulp.task('watch', () => {
    gulp.watch('_config.yml', gulp.series('build:site'));
    gulp.watch([paths.mdFilesGlob, paths.htmlFilesGlob, paths.ymlFilesGlob, paths.xmlFilesGlob], gulp.series('build:site'));
    gulp.watch(paths.jsFilesGlob, gulp.series('scripts', 'copy:assets'));
    gulp.watch(paths.sassFilesGlob, gulp.series('styles', 'copy:assets'));
    gulp.watch(paths.imageFilesGlob, gulp.series('images', 'copy:assets'));
    gulp.watch(paths.phpFiles + '/**/*', gulp.series('copy:php'));
});