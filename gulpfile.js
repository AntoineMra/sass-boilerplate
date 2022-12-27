// plugins
const gulp = require('gulp');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const minifyCss = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const browsersync = require('browser-sync').create();
//const sass = require('gulp-sass');
var sass = require('gulp-dart-sass');

const distFolder = './dist/';
const srcFolder = './src/';

const paths = {
  css: {
    src: './src/assets/css/**/*.css',
    dest: './dist/assets/css/',
  },
  scss: {
    src: './src/assets/scss/**/*.scss',
    dest: './src/assets/css/',
  },
  html: {
    src: './src/**/*.html',
    dest: './dist/',
  },
  img: {
    src: './src/assets/img/**/*',
    dest: './dist/assets/img/',
  },
  font: {
    src: './src/assets/fonts/**/*',
    dest: './dist/assets/fonts/',
  },
};

function browserSyncDev() {
  browsersync.init({
    server: {
      baseDir: srcFolder,
    },
    port: 3000,
  });
}

function browserSync() {
  browsersync.init({
    server: {
      baseDir: distFolder,
    },
    port: 3000,
  });
}

// clean dist
function clear() {
  return del([distFolder]);
}

function html() {
  return (
    gulp
      .src(paths.html.src, { since: gulp.lastRun(html) })
      .pipe(plumber())
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest(paths.html.dest))
      .pipe(browsersync.stream())
  );
}

function html2() {
  return (
    gulp
      .src(paths.html.src, { since: gulp.lastRun(html2) })
     
      .pipe(browsersync.stream())
  );
}

function scss() {
  return (
    gulp
      .src(paths.scss.src)
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(paths.scss.dest))
      .pipe(browsersync.stream())
  );
}



function css() {
  return (
    gulp
      .src(paths.css.src, { since: gulp.lastRun(css) })
      .pipe(plumber())
      .pipe(autoprefixer())
      .pipe(minifyCss())
      .pipe(gulp.dest(paths.css.dest))
      .pipe(browsersync.stream())
  );
}


function images() {
  return (
    gulp
      .src(paths.img.src)
      .pipe(plumber())
      .pipe(imagemin())
      .pipe(gulp.dest(paths.img.dest))
      .pipe(browsersync.stream())
  );
}

function watchFiles() {
  // Ecoute ce qui se passe sur paths.css.src, et lance la fonction css s'il y a des modifs
  gulp.watch(paths.scss.src, scss);
  gulp.watch(paths.css.src, css);
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.img.src, images);
}

function watch() {
  gulp.watch(paths.scss.src, scss);
  gulp.watch(paths.html.src,html2);

}


function font() {
  return (
    gulp
      .src(paths.font.src, { since: gulp.lastRun(font) })
      .pipe(plumber())
      .pipe(gulp.dest(paths.font.dest))
      .pipe(browsersync.stream())
  );
}

const serie = gulp.series(clear, html, scss, css, images, font);
const build = gulp.series(serie, gulp.parallel(watchFiles, browserSync));

const dev = gulp.series(scss, gulp.parallel(watch, browserSyncDev));


// exports
exports.sass = sass;
exports.clear = clear;
exports.build = build;
exports.dev = dev;
exports.default = dev;
