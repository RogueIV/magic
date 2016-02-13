var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var replace = require('gulp-replace');
var minifyHtml = require('gulp-minify-html');
var templateCache = require('gulp-angular-templatecache');
var livereload = require('gulp-livereload');
var dest = require('gulp-dest');
livereload({ start: true });

var destinationFolder = './www';
var paths = {
  sass: ['./assets/styles/**/*.scss'],
  components: ['./assets/components/**/*.js', './assets/services/**/*.js'],
  modules: ['./assets/javascripts/*.js'],
  templates: ['./assets/components/**/*.html'],
  images: ['./assets/images/**/*.*'],
  fonts: [
      './assets/fonts/**/*.eot',
      './assets/fonts/**/*.svg',
      './assets/fonts/**/*.ttf',
      './assets/fonts/**/*.woff'
  ],
  staticHtml: ['./assets/*.html'],
  libraries: [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/ionic/js/ionic.bundle.js',
    'bower_components/angular-resource/angular-resource.min.js',
    'bower_components/angular-sanitize/angular-sanitize.min.js',
    'bower_components/angular-cache/dist/angular-cache.min.js',
    'bower_components/ui-router-extras/release/ct-ui-router-extras.min.js',
    'bower_components/angular-bootstrap/ui-bootstrap.min.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    'bower_components/angular-logex/dist/log-ex-unobtrusive.min.js',
    'bower_components/node-uuid/uuid.js',
    'bower_components/enquire/dist/enquire.min.js',
    'assets/javascripts/strophe/strophe.js',
    'assets/javascripts/strophe/strophe.ping.js',
    'bower_components/angular-options-disabled/src/angular-options-disabled.min.js',
    'bower_components/restangular/dist/restangular.min.js',
    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.min.js',
    'bower_components/angular-ui-utils/ui-utils.min.js',
    'bower_components/angular-cookies/angular-cookies.min.js',
    'bower_components/lodash/lodash.min.js',
    'bower_components/datejs/build/production/date.min.js',
    'bower_components/moment/min/moment.min.js',
    'bower_components/humanize-duration/humanize-duration.js',
    'bower_components/angular-timer/dist/angular-timer.min.js',
    'bower_components/gsap/src/minified/TweenMax.min.js',
    'bower_components/ngFx/dist/ngFx.min.js',
    'bower_components/angular-messages/angular-messages.min.js',
    'bower_components/angular-validation-match/dist/angular-validation-match.min.js',
    'bower_components/angular-aria/angular-aria.min.js',
    'bower_components/angular-jwt/dist/angular-jwt.min.js',
    'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
    'bower_components/re-tree/re-tree.min.js',
    'bower_components/ng-device-detector/ng-device-detector.min.js'
  ],
  ngCordova: ['bower_components/ngCordova/dist/ng-cordova.min.js']
};

gulp.task('default', ['build']);

gulp.task('build', ['move-static-html', 'cache-templates',
    'move-fonts', 'move-images', 'build-js', 'build-modules',
    'build-components', 'build-ng-cordova', 'sass', 'sass-ionic'], function (done) {
    var date = new Date();
    var YYMMDDHHMMSS = date.getFullYear() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        'T' +
        ('0' + date.getHours() + 1 ).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);
    gulp.src('./www/index.html')
        .pipe(replace('$$base_url$$', YYMMDDHHMMSS))
        .pipe(gulp.dest(destinationFolder + '/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.components, ['build-components']);
  gulp.watch(paths.modules, ['build-modules']);
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.staticHtml, ['move-static-html']);
  gulp.watch(paths.templates, ['cache-templates']);
  gulp.watch(paths.images, ['move-images']);
  gulp.watch(paths.fonts, ['move-fonts']);
});

gulp.task('sass-ionic', function () {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(dest('/css'))
        .pipe(gulp.dest(destinationFolder));
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

// build our libraries.js file
gulp.task('build-js', function () {
    gulp.src(paths.libraries)
        .pipe(concat('libraries.js'))
        .pipe(gulp.dest(destinationFolder + '/js'))
});

// build our modules.js file
gulp.task('build-modules', function () {
    gulp.src(paths.modules)
        .pipe(concat('modules.js'))
        .pipe(gulp.dest(destinationFolder + '/js'))
});

// build our ng-cordova.js file
gulp.task('build-ng-cordova', function () {
    gulp.src(paths.ngCordova)
        .pipe(concat('ng-cordova.js'))
        .pipe(gulp.dest(destinationFolder + '/js'))
});

// compile angular assets
gulp.task('build-components', function (done) {
    gulp.src(paths.components)
        .pipe(concat('application.js'))
        .pipe(gulp.dest(destinationFolder + '/js'))
});

// compile our sass assets into a concatenated CSS file
gulp.task('sass', function () {
    gulp.src(paths.sass)
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(concat('style.css'))
        .pipe(gulp.dest(destinationFolder + '/css'));
});

// move image files into the www/images folder
gulp.task('move-images', function (done) {
    gulp.src(paths.images)
        .pipe(gulp.dest(destinationFolder + '/images'))
        .on('end', done);
});

// move font files into the www/fonts folder
gulp.task('move-fonts', function (done) {
    gulp.src(paths.fonts)
        .pipe(gulp.dest(destinationFolder + '/fonts'))
        .on('end', done);
});

// build our cached templates javascript file
gulp.task('cache-templates', function(done) {
    gulp.src(paths.templates).pipe(minifyHtml({
        empty: true
    })).pipe(templateCache({
        standalone: true,
        root: ''
    })).pipe(gulp.dest(destinationFolder + '/js'))
        .on('end', done);
});

// move template files (.html) into the www folder
gulp.task('move-static-html', function (done) {
    gulp.src(paths.staticHtml)
        .pipe(gulp.dest(destinationFolder + ''))
        .on('end', done);
});
