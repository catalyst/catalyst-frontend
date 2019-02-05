'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const kebabCase = require('lodash.kebabcase');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.packages = [
      'autoprefixer',
      'babel-eslint', // unfortunately a dep of eslint-config-airbnb-es5 even if we're not using babel :/
      'eslint',
      'eslint-config-airbnb-es5',
      'eslint-plugin-react', // unfortunately a dep of eslint-config-airbnb-es5 even if we're not using react :/
      'cssnano',
      'gulp@^4.0.0',
      'gulp-eslint',
      'gulp-if',
      'gulp-postcss',
      'gulp-sass',
      'gulp-sourcemaps',
      'gulp-stylelint',
      'postcss-flexbugs-fixes',
      'stylelint',
      'stylelint-config-sass-guidelines',
      'stylelint-config-standard',
    ];
    this.projectPackages = [];

    this.props = this.options.reconfigure ? {} : this.config.getAll();

    // convert legacy 'tether' option to new name, 'tooltips'
    if (typeof(this.props.tether) === "boolean")  {
      this.props.tooltips = this.props.tether;
    }
  }

  prompting() {
    const prompts = [
      {
        'type': 'confirm',
        'name': 'index',
        'message': `Do you want an index.html file created?`,
        'default': false,
        'when': typeof(this.props.index) !== "boolean"
      },
      {
        'type': 'confirm',
        'name': 'browsersync',
        'message': `Do you want to use Browsersync (auto page reloading server/proxy)?`,
        'default': true,
        'when': typeof(this.props.browsersync) !== "boolean"
      },
      {
        'type': 'list',
        'name': 'browsersyncproxy',
        'message': 'Do you need Browsersync to proxy your existing dev env?',
        'choices': [
          {
            'name': 'Yes, proxy to my existing environment',
            'short': 'Use Browsersync as a proxy',
            'value': true
          },
          {
            'name': 'No, just serve my project directly',
            'short': 'Use Browsersync to serve my files',
            'value': false
          }
        ],
        'when': answers => {
          return typeof(this.props.browsersyncproxy) !== "boolean" && (answers.browsersync === true || this.props.browsersync === true);
        }
      },
      {
        'type': 'input',
        'name': 'browsersyncproxyaddress',
        'message': 'What is the address of your local dev env to proxy?',
        'default': 'http://localhost:8080',
        'when': answers => {
          return !this.props.browsersyncproxyaddress && (answers.browsersyncproxy === true || this.props.browsersyncproxy === true);
        }
      },
      {
        'type': 'confirm',
        'name': 'bootstrap',
        'message': `Do you want to add Bootstrap to your project?`,
        'default': false,
        'when': typeof(this.props.bootstrap) !== "boolean"
      },
      {
        'type': 'list',
        'name': 'bootstrap4',
        'message': `Which version of Bootstrap do you want to use?`,
        'choices': [
          {
            'name': 'Bootstrap 4',
            'short': '4',
            'value': true
          },
          {
            'name': 'Bootstrap 3',
            'short': '3',
            'value': false
          }
        ],
        'when': answers => {
          return typeof(this.props.bootstrap4) !== "boolean" && (answers.bootstrap === true || this.props.bootstrap === true);
        }
      },
      {
        'type': 'list',
        'name': 'js',
        'message': 'Do you want JavaScript build support?',
        'choices': [
          {
            'name': 'No, just SASS compilation please',
            'short': 'No JS support',
            'value': false
          },
          {
            'name': 'Yes, I want to process my JS files into a bundle (single JS file)',
            'short': 'JS support',
            'value': true
          }
        ],
        'when': typeof(this.props.js) !== "boolean"
      },
      {
        'type': 'list',
        'name': 'flatStructure',
        'message': 'Do you want to keep your compiled and uncompiled files in separate trees, or use a flat structure?',
        'choices': [
          {
            'name': 'In seperate nested trees, e.g. /myproject/src/scss and /myproject/dist/css',
            'short': 'Nested',
            'value': false
          },
          {
            'name': 'In a flat structure, e.g. /myproject/scss and /myproject/css',
            'short': 'Flat',
            'value': true
          }
        ],
        'when': answers => {
          return (answers.js === false || this.props.js === false) && (typeof(this.props.flatStructure) !== "boolean");
        }
      },
      {
        'type': 'input',
        'name': 'src',
        'message': 'Name of the directory where your uncompiled files will live:',
        'default': answers => {
          if (answers.flatStructure || this.props.flatStructure) {
            return 'scss';
          }

          return 'src';
        },
        'filter': input => kebabCase(input),
        'when': !this.props.src && !this.props.flatStructure
      },
      {
        'type': 'input',
        'name': 'dist',
        'message': 'Name of the directory where your built files will be written:',
        'default': answers => {
          if (answers.flatStructure || this.props.flatStructure) {
            return 'css';
          }

          return 'dist';
        },
        'filter': input => kebabCase(input),
        'validate': (input, answers) => {
          if (input === answers.src) {
            return "Folder names for uncompiled and built files must be different."
          }

          return true;
        },
        'when': !this.props.dist && !this.props.flatStructure
      },
      {
        'type': 'confirm',
        'name': 'jquery',
        'message': 'Do you want to add jQuery into your JavaScript bundle?',
        'default': true,
        'when': answers => {
          return (answers.js || this.props.js) && (typeof(this.props.jquery) !== "boolean");
        }
      },
      {
        'type': 'confirm',
        'name': 'bootstrapjs',
        'message': `Do you want to add Bootstrap's JS into your JavaScript bundle?`,
        'default': true,
        'when': answers => {
          return ((answers.js || this.props.js) && (answers.bootstrap || this.props.bootstrap) && (answers.jquery || this.props.jquery) && (typeof(this.props.bootstrapjs) !== "boolean"));
        }
      },
      {
        'type': 'confirm',
        'name': 'tooltips',
        'message': `Do you want to use Bootstrap's tooltips?`,
        'default': false,
        'when': answers => {
          return (answers.bootstrapjs || this.props.bootstrapjs) && (typeof(this.props.tooltips) !== "boolean");
        }
      },
      {
        'type': 'confirm',
        'name': 'drupalbootstrap',
        'message': `Are you using Drupal and Drupal's Bootstrap theme?`,
        'default': false,
        'when': answers => {
          return ((!answers.bootstrap4 && !this.props.bootstrap4) && (answers.bootstrap || this.props.bootstrap) && (typeof(this.props.drupalbootstrap) !== "boolean"));
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = Object.assign({}, this.props, props);
    });
  }

  configuring() {
    if (this.props.browsersync) {
      this.packages.push('browser-sync');
    }

    if (this.props.js) {
      this.packages.push('gulp-uglify');
      this.packages.push('gulp-concat');
    }

    if (this.props.jquery) {
      this.projectPackages.push('jquery');
    }

    if (this.props.bootstrap4) {
      this.projectPackages.push('bootstrap');
    } else if (this.props.bootstrap) {
      this.projectPackages.push('bootstrap-sass');
    }

    if (this.props.bootstrap4 && this.props.tooltips) {
      this.projectPackages.push('popper.js');
    } else if (this.props.tooltips) {
      this.projectPackages.push('tether');
    }
  }

  writing() {
    let scssPath = this.props.flatStructure ? `${this.props.src}` : `${this.props.src}/scss`;
    let distOrRootPath = this.props.flatStructure ? '' : `${this.props.dist}/`;

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { options: this.props, name: this.options.name }
    );

    this.fs.copyTpl(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig'),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('.eslintrc.json'),
      this.destinationPath('.eslintrc.json')
    );

    this.fs.copyTpl(
      this.templatePath('example.stylelintrc'),
      this.destinationPath('.stylelintrc')
    );

    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      { options: this.props, name: this.options.name }
    );

    this.fs.copyTpl(
      this.templatePath('example.gitignore'),
      this.destinationPath('.gitignore'),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('example.gitattributes'),
      this.destinationPath('.gitattributes'),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath(`${distOrRootPath}index.html`),
      {
        name: this.options.name,
        options: this.props
      }
    );

    this.fs.copyTpl(
      this.templatePath('scss/index.scss'),
      this.destinationPath(`${scssPath}/index.scss`),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('scss/_variables-project.scss'),
      this.destinationPath(`${scssPath}/_variables-project.scss`)
    );

    if (this.props.bootstrap) {
      this.fs.copyTpl(
        this.templatePath('scss/_variables-bootstrap.scss'),
        this.destinationPath(`${scssPath}/_variables-bootstrap.scss`),
        { options: this.props }
      );
    }

    this.config.set(Object.assign({}, this.config.getAll(), this.props));
  }

  install() {
    if (!this.props.flatStructure) {
      mkdirp(`${this.props.src}/scss`);
      mkdirp(`${this.props.src}/fonts`);
      mkdirp(`${this.props.src}/img`);
      if (this.props.js) { mkdirp(`${this.props.src}/js`); }
    } else if (this.props.bootstrap && !this.props.bootstrap4) {
      // make a fonts folder
      mkdirp('fonts');
    }

    this.npmInstall(this.packages, { 'save-dev': true });
    this.npmInstall(this.projectPackages, { 'save-dev': false });
  }

  end() {
    if (this.props.bootstrap && !this.props.bootstrap4) {
      // copy over the Bootstrap 3 font
      if (!this.props.flatStructure) {
        this.spawnCommandSync(
          'cp', ['-r', 'node_modules/bootstrap-sass/assets/fonts/bootstrap', `${this.props.src}/fonts`]
        );
      } else {
        this.spawnCommandSync(
          'cp', ['-r', 'node_modules/bootstrap-sass/assets/fonts/bootstrap', 'fonts']
        );
      }
    }

    if (this.props.drupalbootstrap) {
      // copy Bootstrap 3 assets to local folder for Drupal
      // https://drupal-bootstrap.org/api/bootstrap/starterkits!sass!README.md/group/sub_theming_sass/8
      this.spawnCommandSync(
        'cp', ['-r', 'node_modules/bootstrap-sass/.', 'bootstrap']
      );
    }
  }
};
