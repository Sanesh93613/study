// проблемы с gulp watch в зависимости от версий  https://stackoverflow.com/questions/39665773/gulp-error-watch-task-has-to-be-a-function

// подключение browser-sync   https://hmarketing.ru/blog/gulp/live-server/


'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

// определяем константы Gulp
const { src, dest, parallel, series, watch } = require('gulp');
// подключаем Browsersync
const browserSync = require('browser-sync').create();


// перевод sass в css 
gulp.task('styles', function() {
  return gulp.src('./new_uber/SASS/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./new_uber/css'));
});

gulp.task('browsersync',function () {
    // инициализация Browsersync
    browserSync.init({ 
      // указываем папку сервера
      server: { baseDir: './new_uber/' }, 
      // отключаем уведомления
      notify: false, 
      // отвечает за режим работы: true (подключение к интернет) или false (без подключения интернет)
      online: true 
    });
  });

gulp.task('watch', function() {
    gulp.watch('./new_uber/SASS/*.sass', gulp.series('styles'));
    gulp.watch("./new_uber/CSS/*.css").on('change', browserSync.reload);
    gulp.watch("./new_uber/*.html").on('change', browserSync.reload);
});  

gulp.task('default', gulp.parallel('styles', 'watch', 'browsersync'));