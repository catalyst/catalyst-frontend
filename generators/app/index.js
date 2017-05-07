'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const path = require('path');
const kebabCase = require('lodash.kebabcase');

module.exports = class extends Generator {
  initializing() {
    this.composeWith(require.resolve('../gulp'));
  }

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

      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  default() {
    if (this.props.newFolder) {
      this.log(
        'Creating a new folder ',
        chalk.green(this.props.name)
      );
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  }
};
