'use strict';
const gulp         = require('gulp');
const size         = require('gulp-size');

// include paths
const paths        = require('../paths');

// 'gulp assets:copy' -- copies assets into the /_site/ to avoid Jekyll overwriting the whole directory
gulp.task('copy:assets', () =>
  gulp.src(paths.assetFilesTemp + '/**/*')
    .pipe(gulp.dest(paths.assetFilesSite))
);

// 'gulp copy:tmp' -- copies Jekyll site to a temporary directory to be processed
gulp.task('copy:tmp', () =>
  gulp.src(paths.sourceFolderName + '/html/**/*', {dot: true})
    .pipe(gulp.dest(paths.tempDir + paths.sourceFolderName))
    .pipe(size({title: 'Jekyll'}))
);

// 'gulp copy:site' -- copies processed Jekyll site to /_site/
gulp.task('copy:site', () =>
  gulp.src(paths.tempDir + paths.siteFolderName + '/**/*', {dot: true})
    .pipe(gulp.dest(paths.siteFolderName))
);

// 'gulp copy:favicons' -- copia archivos de favicons a /_site/
gulp.task('copy:static', () =>
  gulp.src(paths.sourceFolderName + '/static/*', {dot: true})
    .pipe(gulp.dest(paths.siteFolderName))
);

// 'gulp copy:phplib' -- copia archivos de phplib a /_site/
gulp.task('copy:phplib', () =>
  gulp.src(paths.phplibFolderName + '/**/*')
    .pipe(gulp.dest(paths.siteDir + paths.phplibFolderName))
);

// 'gulp copy:php' -- copia archivos de php a /_site/
gulp.task('copy:php', () =>
  gulp.src(paths.phpFiles + '/**/*', {dot: true})
    .pipe(gulp.dest(paths.siteFolderName + '/server'))
);



gulp.task('copy:productos', () =>
  gulp.src(paths.imageFilesSite + '/productos' + '/**/*')
    .pipe(gulp.dest(paths.tempDir + paths.sourceFolderName + '/img/productos'))
);