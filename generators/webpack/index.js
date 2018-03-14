'use strict';
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');
const kebabCase = require('lodash.kebabcase');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.packages = [
      'autoprefixer',
      'babel-core',
      'babel-loader',
      'babel-polyfill',
      'babel-preset-env',
      'css-loader',
      'eslint',
      'eslint-loader',
      'extract-text-webpack-plugin',
      'file-loader',
      'html-webpack-plugin',
      'node-sass',
      'npm-check-updates',
      'postcss-flexbugs-fixes',
      'postcss-loader',
      'retire',
      'sass-loader',
      'style-loader',
      'url-loader',
      'webpack',
      'webpack-cli',
      'webpack-dev-server',
      'webpack-merge'
    ];

    this.props = this.options.reconfigure ? {} : this.config.getAll();
  }

  prompting() {
    const prompts = [
      {
        'type': 'confirm',
        'name': 'react',
        'message': `Do you want to add React to your project?`,
        'default': true,
        'when': typeof(this.props.react) !== "boolean"
      },
      {
        'type': 'confirm',
        'name': 'jest',
        'message': `Do you want to add Jest (for testing) to your project?`,
        'default': true,
        'when': typeof(this.props.jest) !== "boolean"
      },
      {
        'type': 'confirm',
        'name': 'bootstrap',
        'message': `Do you want to add Bootstrap to your project?`,
        'default': false,
        'when': typeof(this.props.bootstrap) !== "boolean"
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
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = Object.assign({}, this.props, props);
    });
  }

  configuring() {
    if (this.props.react) {
      this.packages.push('babel-preset-react');
      this.packages.push('prop-types');
      this.packages.push('react');
      this.packages.push('react-dom');
      this.packages.push('eslint-plugin-react');
    }

    if (this.props.jest) {
      this.packages.push('jest');
      this.packages.push('enzyme');
      this.packages.push('babel-jest');
      this.packages.push('react-addons-test-utils');
      this.packages.push('react-test-renderer');
    }

    if (this.props.jest && this.props.react) {
      this.packages.push('react-addons-test-utils');
      this.packages.push('react-test-renderer');
    }

    if (this.props.bootstrap) {
      this.packages.push('bootstrap');
    }
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { options: this.props, name: this.options.name }
    );

    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc'),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig'),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
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
      this.templatePath('.retireignore.json'),
      this.destinationPath('.retireignore.json'),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('.eslintrc.json'),
      this.destinationPath('.eslintrc.json'),
      { options: this.props }
    );

    if (this.props.jest) {
      this.fs.copyTpl(
        this.templatePath('jest-mock-files.js'),
        this.destinationPath('jest-mock-files.js'),
        { options: this.props }
      );

      this.fs.copyTpl(
        this.templatePath('jest-mock-styles.js'),
        this.destinationPath('jest-mock-styles.js'),
        { options: this.props }
      );
    }

    if (this.props.react) {
      this.fs.copyTpl(
        this.templatePath('src/index.js'),
        this.destinationPath(this.props.src + '/index.jsx'),
        { options: this.props }
      );
    } else {
      this.fs.copyTpl(
        this.templatePath('src/index.js'),
        this.destinationPath(this.props.src + '/index.js'),
        { options: this.props }
      );
    }

    this.fs.copyTpl(
      this.templatePath('src/index.html'),
      this.destinationPath(this.props.src + '/index.html'),
      { options: this.props, name: this.options.name }
    );

    this.fs.copyTpl(
      this.templatePath('src/index.scss'),
      this.destinationPath(this.props.src + '/index.scss'),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('src/base-styles/_base.scss'),
      this.destinationPath(this.props.src + '/base-styles/_base.scss'),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('src/base-styles/_variables.scss'),
      this.destinationPath(this.props.src + '/base-styles/_variables.scss'),
      { options: this.props }
    );

    if (this.props.bootstrap) {
      this.fs.copyTpl(
        this.templatePath('src/base-styles/_custom-bootstrap.scss'),
        this.destinationPath(this.props.src + '/base-styles/_custom-bootstrap.scss'),
        { options: this.props }
      );

      this.fs.copyTpl(
        this.templatePath('src/base-styles/_project-variables.scss'),
        this.destinationPath(this.props.src + '/base-styles/_project-variables.scss'),
        { options: this.props }
      );
    }

    this.config.set(Object.assign({}, this.config.getAll(), this.props));
  }

  install() {
    if (this.props.react) { mkdirp(`${this.props.src}/components`) };

    this.npmInstall(this.packages, { 'save-dev': true });
  }
};
