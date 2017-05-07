'use strict';
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');

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
      'postcss-flexbugs-fixes'
    ];
  }

  prompting() {
    const prompts = [
      {
        'type': 'confirm',
        'name': 'bootstrap',
        'message': `Do you want to add Bootstrap to your project?`,
        'default': false
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
        ]
      },
      {
        'type': 'confirm',
        'name': 'jquery',
        'message': 'Do you want to add jQuery into your JavaScript bundle?',
        'default': true,
        'when': answers => answers.js
      },
      {
        'type': 'confirm',
        'name': 'bootstrapjs',
        'message': `Do you want to add Bootstrap's JS into your JavaScript bundle?`,
        'default': true,
        'when': (answers) => {
          return (answers.js && answers.bootstrap && answers.jquery);
        }
      },
      {
        'type': 'confirm',
        'name': 'tether',
        'message': `Do you want to use Bootstrap's tooltips?`,
        'default': false,
        'when': answers => answers.bootstrapjs
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  configuring() {
    if (this.props.js) {
      this.packages.push('gulp-uglify');
      this.packages.push('gulp-concat');
    }

    if (this.props.jquery) {
      this.packages.push('jquery');
    }

    if (this.props.bootstrap) {
      this.packages.push('bootstrap@4.0.0-alpha.6'); // DUE TO THIS BEING ALPHA, IT NEEDS MANUAL UPDATE HERE
    }
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { name: this.options.name }
    );

    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      { options: this.props, src: this.options.src, dist: this.options.dist }
    );
  }

  install() {
    mkdirp(`${this.options.src}/scss`);
    mkdirp(`${this.options.src}/fonts`);
    mkdirp(`${this.options.src}/img`);
    if (this.props.js) { mkdirp(`${this.options.src}/js`); }

    this.npmInstall(this.packages, { 'save-dev': true });
  }
};
