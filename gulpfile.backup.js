var gulp = require('gulp');
const { watch, series } = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass')(require('sass'));
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var browsersync = require('browser-sync');

var initialCSSFile = './src/scss/style.scss';
var destinationCSSFile='./dist/css/';

var initialJSFile = 'script.js';
var folderJs = './src/js/';
var destinationJSFile='./dist/js/';

var directoryCSSWatch = './src/scss/**/*.scss';
var directoryJSWatch = './src/js/**/*.js';

var jsFiles = [initialJSFile];

gulp.task('browserSync', function(){
  browsersync.init({
    server:{
      baseDir:'./'
    }
  });
});

gulp.task('styles', function(){
  gulp.src(initialCSSFile)
    .pipe(sourcemaps.init())
    .pipe( sass( { errorLogToConsole : true,
      outputStyle:'compressed' } ) )
    .on('error', console.error.bind(console))
    .pipe(autoprefixer({ 
         cascade:false }))
    .pipe(rename({ suffix:'.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe( gulp.dest(destinationCSSFile) );
});

gulp.task('js', function(){
      jsFiles.map(function(entry){
        return browserify({
          entries:[folderJs + entry]
        })
        .transform(babelify,{"presets": ["@babel/preset-env"]})
        .bundle()
        .pipe(source( entry ))
        .pipe(rename({'extname':'.min.js'}))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe( gulp.dest(destinationJSFile) );
      });
})

gulp.task('watch',function(){
  gulp.watch(directoryCSSWatch,  gulp.series('styles'));
  gulp.watch(directoryJSWatch,  gulp.series('js'));
});

gulp.task('default', gulp.parallel('styles', 'js','watch'));
/*exports.default = function(){
  watch(directoryJSWatch, gulp.series('styles'));
  watch(directoryCSSWatch, gulp.series('js'));
}*/