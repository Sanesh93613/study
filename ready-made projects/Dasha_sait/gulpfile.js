const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

// live сервер
gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "./" //если index находится в той же папке оставить вот так
        }
    });

    gulp.watch("src/*.html").on('change', browserSync.reload);
});
// создаем задачу для компиляции scss или sass в css
gulp.task('styles',function(){
    return gulp.src("sass/*.+(scss|sass)")
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // Просто делаем чтобы css был сжат
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest("css"))
    .pipe(browserSync.stream()); // перезапускаем live server 
});
// как только файлы sass будут изменяться будет работать функция styles которая будет все переделывать в css и обновлять работу live server
gulp.task('watch', function(){
    gulp.watch("sass/*.+(scss|sass)", gulp.parallel('styles'));
    // обновляем live server при изменениях в html 
    gulp.watch("*html").on('change', browserSync.reload);
});

// запускаем команды в работу одной командой 
gulp.task('default', gulp.parallel('server', 'styles', 'watch')); 
