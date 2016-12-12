/* eslint-env node */

'use strict';

const gulp = require('gulp');
const del = require('del');
const express = require('express');
const ghPages = require('gh-pages');
const packageJson = require('./package.json');
const path = require('path');
const runSequence = require('run-sequence');
const swPrecache = require('sw-precache');

const DEV_DIR = 'src';
const DIST_DIR = 'dist';

function runExpress(port, rootDir) {
  const app = express();

  app.use(express.static(rootDir));

  const server = app.listen(port, () => {
    const host = process.env.IP;
    const port = server.address().port;
    console.log(`Server running at https://${host}:${port}`);
  });
}

function writeServiceWorkerFile(rootDir, handleFetch, callback) {
  const config = {
    cacheId: packageJson.name,
    // If handleFetch is false (i.e. because this is called from generate-service-worker-dev), then
    // the service worker will precache resources but won't actually serve them.
    // This allows you to test precaching behavior without worry about the cache preventing your
    // local changes from being picked up during the development cycle.
    handleFetch: handleFetch,
    staticFileGlobs: [
      rootDir + '/css/**.css',
      rootDir + '/js/**.js',
      rootDir + '/**.html',
      rootDir + '/images/**.*',
      rootDir + '/favicomatic/**.*',
    ],
    stripPrefix: rootDir + '/',
    verbose: true
  };

  swPrecache.write(path.join(rootDir, 'service-worker.js'), config, callback);
}

gulp.task('default', ['serve-dist']);

gulp.task('build', (callback) => {
  runSequence('copy-dev-to-dist', 'generate-service-worker-dist', callback);
});

gulp.task('clean', () => {
  del.sync([DIST_DIR]);
});

gulp.task('serve-dev', ['generate-service-worker-dev'], () => {
  const port = process.env.PORT ? process.env.PORT : 3001;
  runExpress(port, DEV_DIR);
});

gulp.task('serve-dist', ['build'], () => {
  const port = process.env.PORT ? process.env.PORT : 3000;
  runExpress(port, DIST_DIR);
});

gulp.task('gh-pages', ['build'], (callback) => {
  ghPages.publish(path.join(__dirname, DIST_DIR), callback);
});

gulp.task('generate-service-worker-dev', (callback) => {
  writeServiceWorkerFile(DEV_DIR, false, callback);
});

gulp.task('generate-service-worker-dist', function(callback) {
  writeServiceWorkerFile(DIST_DIR, true, callback);
});

gulp.task('copy-dev-to-dist', () => {
  return gulp.src(DEV_DIR + '/**')
    .pipe(gulp.dest(DIST_DIR));
});
