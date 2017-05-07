'use strict';
const Generator = require('yeoman-generator');

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
        'when': (answers) => {
          return answers.js;
        }
      },
      {
        'type': 'confirm',
        'name': 'bootstrapjs',
        'message': `Do you want to add Bootstrap's JS files into your JavaScript bundle?`,
        'default': true,
        'when': (answers) => {
          return (answers.js && answers.bootstrap);
        }
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
      this.packages.push('bootstrap'); // TODO bootstrap @ current alpha
    }
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { name: this.options.name }
    );
  }

  install() {
    // TODO re-enable this later (works correctly)
    // this.npmInstall(this.packages, { 'save-dev': true });
  }
};
