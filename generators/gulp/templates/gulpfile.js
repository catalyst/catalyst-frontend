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

<% if (options.flatStructure) { -%>
const PATHS = {
  'src': {
    'scss': './<%= options.src %>/**/*.scss'
  },
  'dist': {
    'css': './<%= options.dist %>/'
  }
}
<% } else { %>
const PATHS = {
  'src': {
    'root': './<%= options.src %>/**',<% if (options.js) { %>
    'js': './<%= options.src %>/js/**/*.js',<% } %>
    'scss': './<%= options.src %>/scss/**/*.scss'
  },
  'dist': {
    'root': './<%= options.dist %>/',<% if (options.js) { %>
    'js': './<%= options.dist %>/js/',<% } %>
    'css': './<%= options.dist %>/css/'
  }
}

gulp.task('copy-files', () => {
  return gulp.src([PATHS.src.root, '!' + PATHS.src.scss<% if (options.js) { %>, '!' + PATHS.src.js<% } %>])
    .pipe(gulp.dest(PATHS.dist.root));
});
<% } -%>

gulp.task('scss', () => {
  return gulp.src(PATHS.src.scss)
    .pipe(sass({
        includePaths: [<% if (options.bootstrap4) { %>
          './node_modules/bootstrap/scss/'
          <% } else if (options.bootstrap) { %>
          './node_modules/bootstrap-sass/assets/stylesheets/'
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
      './node_modules/jquery/dist/jquery.js',<% } %><% if (options.tooltips && options.bootstrap4) { %>
      './node_modules/popper.js/dist/umd/popper.js',<% } else if (options.tooltips) { %>'./node_modules/tether/dist/js/tether.js',<% } %><% if (options.bootstrapjs && options.bootstrap4) { %>
      './node_modules/bootstrap/dist/js/bootstrap.js',<% } else if (options.bootstrapjs) { %>
      './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',<% } %>
      PATHS.src.js
    ])
    .pipe(sourcemaps.init())
    .pipe(concatjs('bundle.js'))
    .pipe(uglifyjs({ mangle: false }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(PATHS.dist.js));
});
<% } -%>

gulp.task('build', gulp.parallel(<% if (!options.flatStructure) { %>'copy-files', <% } %>'scss'<% if (options.js) { %>, 'js'<% } %>));

gulp.task('watch', () => {
  gulp.watch(<% if (options.flatStructure) { %>PATHS.src.scss<% } else { %>PATHS.src.root<% } %>, gulp.series('build'));
});

gulp.task('default', gulp.series('build', 'watch'));
