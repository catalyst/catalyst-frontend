'use strict';
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');
const kebabCase = require('lodash.kebabcase');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.packages = [
      'autoprefixer',
      'cssnano',
      'gulp',
      'gulp-postcss',
      'gulp-sass',
      'gulp-sourcemaps',
      'postcss-flexbugs-fixes',
      'npm-check-updates'
    ];

    this.props = this.options.reconfigure ? {} : this.config.getAll();
  }

  prompting() {
    const prompts = [
      {
        'type': 'confirm',
        'name': 'bootstrap',
        'message': `Do you want to add Bootstrap to your project?`,
        'default': false,
        'when': typeof(this.props.bootstrap) !== "boolean"
      },
      {
        'type': 'confirm',
        'name': 'bootstrap4',
        'message': `Do you want to use the Bootstrap 4 alpha?`,
        'default': true,
        'when': answers => {
          return typeof(this.props.bootstrap4) !== "boolean" && answers.bootstrap === true;
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
        'name': 'tether',
        'message': `Do you want to use Bootstrap's tooltips?`,
        'default': false,
        'when': answers => {
          return (answers.bootstrapjs || this.props.bootstrapjs) && (typeof(this.props.tether) !== "boolean");
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = Object.assign({}, this.props, props);
    });
  }

  configuring() {
    if (this.props.js) {
      this.packages.push('gulp-uglify');
      this.packages.push('gulp-concat');
      this.packages.push('retire');
    }

    if (this.props.jquery) {
      this.packages.push('jquery');
    }

    if (this.props.bootstrap4) {
      this.packages.push('bootstrap@4.0.0-beta'); // DUE TO THIS BEING BETA, IT NEEDS MANUAL UPDATE HERE
    } else if (this.props.bootstrap) {
      this.packages.push('bootstrap-sass');
    }
  }

  writing() {
    let scssPath = this.props.flatStructure ? `${this.props.src}` : `${this.props.src}/scss`;

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { options: this.props, name: this.options.name }
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
        this.destinationPath(`${scssPath}/_variables-bootstrap.scss`)
      );
    }

    if (this.props.bootstrap || this.props.js) {
      this.fs.copyTpl(
        this.templatePath('.retireignore.json'),
        this.destinationPath('.retireignore.json'),
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
    }

    this.npmInstall(this.packages, { 'save-dev': true });
  }
};
