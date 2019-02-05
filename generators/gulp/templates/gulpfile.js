<% if (options.browsersync) { %>const browsersync = require('browser-sync').create();
<% } -%>const gulp = require('gulp');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const flexfixes = require('postcss-flexbugs-fixes');
const cssnano = require('cssnano');
const stylelint = require('gulp-stylelint');<% if (options.js) { %>
const concatjs = require('gulp-concat');
const uglifyjs = require('gulp-uglify');
const eslint = require('gulp-eslint');
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
}<% } %>
<% if (options.browsersync) { %>const BROWSERSYNCOPTS = {
  <% if (options.browsersyncproxy) { %>proxy: '<%= options.browsersyncproxyaddress %>',<% } else { %>server: { baseDir: './<% if (!options.flatStructure) { %><%= options.dist %>/<% } %>' },
  <% } -%>files: [
    '**/*.html',
    '**/*.js',
    // you can add other paths to watch for reloads here,
    // e.g. 'templates/**/*.twig' or 'templates/**/*.ss' or '**/*.php'
  ]
}
<% } -%>
let buildFlag = false; // used to determine if minification needed

<% if (!options.flatStructure) { -%>
gulp.task('copy-files', () => {
  return gulp.src([PATHS.src.root, '!./<%= options.src %>/scss', '!' + PATHS.src.scss<% if (options.js) { %>, '!' + PATHS.src.js<% } %>])
    .pipe(gulp.dest(PATHS.dist.root));
});
<% } -%>

gulp.task('scss', () => {
  return gulp.src(PATHS.src.scss)
    .pipe(stylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]})
    )
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
    .pipe(gulpif(buildFlag,
      postcss([ // building, run minification
        autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false,
          remove: false
        }),
        flexfixes(),
        cssnano()
      ]),
      postcss([ // not building, don't run minification
        autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false,
          remove: false
        }),
        flexfixes()
      ])
    ))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(PATHS.dist.css))<% if (options.browsersync) { %>
    .pipe(browsersync.stream({match: '**/*.css'}))<% } %>;
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
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(sourcemaps.init())
    .pipe(concatjs('bundle.js'))
    .pipe(gulpif(buildFlag, uglifyjs({ mangle: false })))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(PATHS.dist.js));
});
<% } -%>

gulp.task('set-build-flag', function(done) {
  // only set when gulp is called via `build` command
  buildFlag = true;
  done();
});

gulp.task('build', gulp.series('set-build-flag', <% if (!options.flatStructure) { %>'copy-files', <% } %>'scss'<% if (options.js) { %>, 'js'<% } %>));

gulp.task('watch', () => {
  <% if (options.browsersync) { %>browsersync.init(BROWSERSYNCOPTS);<% } %>
  gulp.watch(<% if (options.flatStructure) { %>PATHS.src.scss<% } else { %>PATHS.src.root<% } %>, gulp.parallel(<% if (!options.flatStructure) { %>'copy-files', <% } %>'scss'<% if (options.js) { %>, 'js'<% } %>));
});

gulp.task('default', gulp.series(<% if (!options.flatStructure) { %>'copy-files', <% } %>'scss'<% if (options.js) { %>, 'js'<% } %>, 'watch'));
