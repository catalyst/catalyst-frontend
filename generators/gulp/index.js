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
    // TODO gulp specific questions go here
  }

  configuring() {
    // push optional extra packages here
    // this.packages.push('jquery');
    // 'bootstrap', 'gulp-concat', 'gulp-uglify',
  }

  writing() {
    // TODO any straight copies?
    // this.fs.copy(
    //   this.templatePath('package.json'),
    //   this.destinationPath('package.json')
    // );

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { name: 'TODO-user-input' }
    );
  }

  install() {
    // TODO re-enable this later
    // this.npmInstall(this.packages, { 'save-dev': true });
  }
};
