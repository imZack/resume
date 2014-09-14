var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var del = require('del');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var changed = require('gulp-changed');
var rename = require('gulp-rename');
var usemin = require('gulp-usemin');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var rev = require = require('gulp-rev');

var paths = {
  css: 'css/*',
  font: 'font/*',
  scripts: 'js/**/*.js',
  images: 'img/**/*',
  html: 'index.html'
};

var DEST = './build/';


gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task('images', ['clean'], function() {
  return gulp.src(paths.images)
    .pipe(changed(DEST))
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(DEST + 'img'));
});

gulp.task('font', ['clean'], function() {
  return gulp.src(paths.font)
    .pipe(gulp.dest(DEST + 'font/'));
});

gulp.task('usemin', ['clean'], function() {
  return gulp.src(paths.html)
    .pipe(changed(DEST))
    .pipe(usemin({
      css: [minifyCss(), 'concat'],
      html: [minifyHtml({empty: true})],
      js: [uglify(), rev()]
    }))
    .pipe(gulp.dest(DEST))
    .pipe(reload({stream: true}));
})

gulp.task('watch', function() {

  var watchFunc = function(src, dest) {
    return function() {
      gulp.src(src)
        .pipe(reload({stream: true}));
    }
  };

  gulp.watch(paths.scripts, watchFunc(paths.scripts));
  gulp.watch(paths.images, watchFunc(paths.images));
  gulp.watch(paths.css, watchFunc(paths.css));
  gulp.watch(paths.html, watchFunc(paths.html));
});

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('default', ['serve', 'watch']);
gulp.task('build', ['usemin', 'images', 'font']);
