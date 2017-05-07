'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const path = require('path');
const kebabCase = require('lodash.kebabcase');

module.exports = class extends Generator {
  prompting() {
    this.log(
      chalk.green('\nWelcome to the'),
      chalk.blue('catalyst-frontend'),
      chalk.green('build pipeline generator.')
    );

    this.log('We just need to ask you some questions to get started!\n');

    const prompts = [
      {
        'type': 'input',
        'name': 'name',
        'message': 'What is the name of your project?',
        'default': kebabCase(path.basename(this.destinationPath())),
        'filter': input => kebabCase(input)
      },
      {
        'type': 'list',
        'name': 'newFolder',
        'message': 'Where do you want your build process to be installed?',
        'choices': (answers) => {
          return [
            {
              'name': 'In the current directory',
              'short': 'Current directory',
              'value': false
            },
            {
              'name': 'In a new directory',
              'short': `New directory '${answers.name}' created`,
              'value': true
            }
          ]
        }
      },
      {
        'type': 'input',
        'name': 'src',
        'message': 'Name of the directory where your uncompiled files will live:',
        'default': 'src',
        'filter': input => kebabCase(input)
      },
      {
        'type': 'input',
        'name': 'dist',
        'message': 'Name of the directory where your built files are will be written:',
        'default': 'dist',
        'filter': input => kebabCase(input)
      },
      {
        'type': 'list',
        'name': 'buildType',
        'message': 'What kind of build process do you need?',
        'choices': [
          {
            'name': 'Gulp: for SASS compilation, with options for jQuery and/or Bootstrap integration',
            'short': 'Gulp',
            'value': 'gulp'
          },
          {
            'name': 'Webpack: for ES6 JS projects, with options for React integration',
            'short': 'Webpack',
            'value': 'webpack'
          }
        ]
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  default() {
    if (this.props.newFolder) {
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }

    if (this.props.buildType === 'gulp') {
      this.composeWith(require.resolve('../gulp'),  { 'name': this.props.name, 'src': this.props.src, 'dist': this.props.dist });
    } else  {
      // it's Webpack
      this.log(chalk.red('Webpack build functionality coming soon!'));
    }
  }

  writing() {
    this.fs.copy(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig')
    );

    this.fs.copyTpl(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore'),
      { dist: this.props.dist }
    );
  }
};
