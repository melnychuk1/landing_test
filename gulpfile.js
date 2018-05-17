const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf= require('rimraf');
const rename= require('gulp-rename');
// const autoprefixer = require('gulp-autoprefixer');
// const sourcemaps = require('gulp-sourcemap');


/* ______________Server _____________*/
 gulp.task('server', function() {
     browserSync.init({
         server: {
             port: 9000,
             baseDir: "build"
         }
     });

     gulp.watch('build/**/*').on('change', browserSync.reload)
 });


 /* ___________PUG____________*/
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('src/template/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
});

/*____________Style_____________*/
gulp.task('styles:compile', function () {
    return gulp.src('src/styles/main.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('build/css'));
});


/*________Sprite_________*/
gulp.task('sprite', function (cb) {
    const spriteData = gulp.src('src/images/icon/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../images/sprite.png',
        cssName: 'sprite.css'
    }));
    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('src/styles/global'));
    cb();
});

/*_________Delete__________*/
gulp.task('clean', function del(cb){
    return rimraf('build', cb);
});

// /*____________Autoprefixer_______*/
// gulp.task('default', () =>
//     gulp.src('src/app.css')
//         .pipe(autoprefixer({
//             browsers: ['last 2 versions'],
//             cascade: false
//         }))
//         .pipe(gulp.dest('dist'))
// );
//
// /*____________Sourcemap____________*/
// gulp.src('dist/JSLite.js')
//     .pipe(sourcemap({
//         outSourceMap:'JSLite.js.map',
//         sourceRoot:"http://jslite.io",
//         write:'./build/'
//     }))
//     .pipe(gulp.dest('./build/'));

/*__________Copy fonts_________*/
gulp.task('copy:fonts', function () {
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
});

/*____________Copy images____________*/
gulp.task('copy:images', function () {
    return gulp.src('./src/images/**/*.*')
        .pipe(gulp.dest('build/images'));
});

/*____________Copy_____________*/
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/*_____________Watchers___________*/
gulp.task('watch', function () {
    gulp.watch('src/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('src/styles/**/*.scss', gulp.series('styles:compile'));
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
));