'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.props = this.options.props;
  }

  end() {
    this.log(
      chalk.green('Complete!')
    );

    if (this.props.newFolder && !this.props.ignoreNewFolderSettings) {
      this.log(
        chalk.white(`\nDon't forget to change directory into your new folder,`),
        chalk.blue(this.props.name)
      );
    }

    this.props.ignoreNewFolderSettings = true; // add this to the saved config
    // so reruns do not cause nested project subfolders

    this.config.set(Object.assign({}, this.config.getAll(), this.props));

    this.log(
      chalk.white('\nWe recommend that if you received npm security warnings during\ninstallation that you run `npm audit fix`.'),
      chalk.red('\n\nRun'),
      chalk.white('npm start'),
      chalk.red('to start developing, or read'),
      chalk.white('README.md'),
      chalk.red('for more details.')
    );
  }
};
