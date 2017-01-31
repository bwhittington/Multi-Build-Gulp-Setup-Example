/// <binding BeforeBuild='default' />
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify = require('gulp-uglify');
var xmlTransformer = require('gulp-xml-transformer');
var replace = require('gulp-replace');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('build-development', function () {
    gulp.src('./www/app/**/*.js')
      .pipe(replace('@@GoogleProjectNumber', 'XXXXXXXXXX'))
      .pipe(replace('@@GoogleAnalyticsCode', 'UA-XXXXXXXX-XX'))
      .pipe(replace('@@AppName', 'com.XXX.mobile.dev'))
      .pipe(replace('@@ServerName', 'http://www.your-dev-domain.com/'))
      .pipe(concat('scripts.js'))
      .pipe(gulp.dest('./www/'));

    gulp.src("./config-development.xml")
        .pipe(xmlTransformer([
            { path: '//xmlns:widget', attr: [{ 'id': 'com.XXX.mobile.dev' }, { 'version': '1.0.0' }] },
            { path: '//xmlns:name', text: 'Multi-Build Gulp Setup Development Build Example' },
            { path: '//xmlns:description', text: 'A template project showing how to setup multiple builds using Gulp.' },
            { path: '//xmlns:icon[@name="android-icon"]', attr: { 'src': 'resources/android/icon/drawable-xhdpi-icon.png' } },
            { path: '//xmlns:icon[@name="ios-icon"]', attr: { 'src': 'resources/ios/icon/icon.png' } },
        ], 'http://www.w3.org/ns/widgets'))
        .pipe(rename('config.xml'))
        .pipe(gulp.dest("./"));
});

