const { src, dest, watch, parallel, task } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const browsersync = require('browser-sync');

const imagemin = require('gulp-imagemin');

// variables

var initialCSSFile = './src/scss/style.scss';
var destinationCSSFile='./dist/css/';

var initialJSFile = 'script.js';
var folderJs = './src/js/';
var destinationJSFile='./dist/js/';

var directoryCSSWatch = './src/scss/**/*.scss';
var directoryJSWatch = './src/js/**/*.js';

var jsFiles = [initialJSFile];

function styles() {
    return src(initialCSSFile)
        .pipe(sourcemaps.init())
        .pipe(sass({ errorLogToConsole : true, outputStyle: "compressed" }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer({cascade:false }))
        .pipe(rename({suffix:'.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe(dest(destinationCSSFile));
}

function scripts(cb) {
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
        .pipe( dest(destinationJSFile) );
      });

    cb();
}

function optimizeImg(){
    return src('src/img/*.{jpg,png}')
    .pipe(imagemin())
    .pipe(dest('dist/img'));
}

exports.build = parallel(styles,scripts, optimizeImg);
exports.default = parallel(styles, scripts,optimizeImg);

watch(directoryCSSWatch, styles);
watch(directoryJSWatch, scripts);