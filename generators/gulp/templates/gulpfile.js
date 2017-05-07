const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const flexfixes = require('postcss-flexbugs-fixes');
const cssnano = require('cssnano');
<% if (options.js) { %>
const concatjs = require('gulp-concat');
const uglifyjs = require('gulp-uglify');
<% } -%>

const PATHS = {
  'src': {
    'root': './<%= src %>/**',<% if (options.js) { %>
    'js': './<%= src %>/js/**/*.js',<% } %>
    'scss': './<%= src %>/scss/**/*.scss'
  },
  'dist': {
    'root': './<%= dist %>/',<% if (options.js) { %>
    'js': './<%= dist %>/js/',<% } %>
    'css': './<%= dist %>/css/'
  }
}

gulp.task('copy-files', () => {
  return gulp.src([PATHS.src.root, '!' + PATHS.src.scss<% if (options.js) { %>, '!' + PATHS.src.js<% } %>])
    .pipe(gulp.dest(PATHS.dist.root));
});

gulp.task('scss', () => {
  return gulp.src(PATHS.src.scss)
    .pipe(sass({
        includePaths: [<% if (options.bootstrap) { %>
          './node_modules/bootstrap/scss/'
        <% } %>]
      })
      .on('error', sass.logError)
    )
    .pipe(sourcemaps.init())
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
        remove: false
      }),
      flexfixes(),
      cssnano()
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(PATHS.dist.css));
});

<% if (options.js) { -%>
gulp.task('js', function() {
  return gulp.src([<% if (options.jquery) { %>
      './node_modules/jquery/dist/jquery.js',<% } %><% if (options.tether) { %>
      './node_modules/tether/dist/js/tether.js',<% } %><% if (options.bootstrapjs) { %>
      './node_modules/bootstrap/dist/js/bootstrap.js',<% } %>
      PATHS.src.js
    ])
    .pipe(sourcemaps.init())
    .pipe(concatjs('bundle.js'))
    .pipe(uglifyjs({ mangle: false }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(PATHS.dist.js));
});
<% } -%>

gulp.task('build', ['copy-files', 'scss'<% if (options.js) { %>, 'js'<% } %>]);

gulp.task('watch', () => {
  gulp.watch(PATHS.src.root, ['build']);
});

gulp.task('default', ['build', 'watch']);
