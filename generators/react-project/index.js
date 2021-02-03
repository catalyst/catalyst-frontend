'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.packages = [
      '@babel/core',
      '@babel/preset-env',
      '@babel/plugin-proposal-object-rest-spread',
      "@hot-loader/react-dom",
      'autoprefixer',
      'babel-loader',
      'css-loader',
      'core/js',
      'es6-promise',
      'eslint',
      'eslint-config-airbnb',
      'eslint-config-prettier',
      'eslint-loader',
      'eslint-plugin-import',
      'eslint-plugin-prettier',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'eslint-plugin-jsx-a11y',
      'mini-css-extract-plugin',
      'file-loader',
      'html-webpack-plugin',
      'node-sass',
      'postcss',
      'postcss-flexbugs-fixes',
      'postcss-loader@4',
      'prettier',
      'sass-loader',
      'style-loader',
      'stylelint',
      'stylelint-config-sass-guidelines',
      'stylelint-config-standard',
      'stylelint-webpack-plugin',
      'url-loader',
      'webpack@4',
      'webpack-cli',
      'webpack-dev-server',
      'webpack-merge'
    ];
    this.projectPackages = ['whatwg-fetch'];

    this.props = this.options.reconfigure ? {} : this.config.getAll();
  }

  prompting() {
    const prompts = [];

    return this.prompt(prompts).then(props => {
      this.props = Object.assign({}, this.props, props);
    });
  }

  configuring() {
    // preinstall npm packages if needs to be
  }

  writing() {
    //  for some reason when copying whole folder,
    // some files are missing
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { options: this.props, name: this.options.name }
    );

    this.fs.copy(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc'),
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
      this.templatePath('.gitattributes'),
      this.destinationPath('.gitattributes'),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('.eslintrc.js'),
      this.destinationPath('.eslintrc.js'),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('example.eslintignore'),
      this.destinationPath('.eslintignore'),
    );

    this.fs.copyTpl(
      this.templatePath('.prettierrc.js'),
      this.destinationPath('.prettierrc.js'),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('.stylelintrc.js'),
      this.destinationPath('.stylelintrc.js')
    );

    this.fs.copyTpl(
      this.templatePath('jest-mock-files.js'),
      this.destinationPath('jest-mock-files.js')
    );

    this.fs.copyTpl(
      this.templatePath('jest-mock-styles.js'),
      this.destinationPath('jest-mock-styles.js')
    );

    this.fs.copyTpl(
      this.templatePath('src/index.tsx'),
      this.destinationPath('src/index.tsx'),
      { options: this.props }
    );
    
    this.fs.copyTpl(
      this.templatePath('src/examples'),
      this.destinationPath('src/examples'),
    );
    this.fs.copyTpl(
      this.templatePath('src/App.tsx'),
      this.destinationPath('src/App.tsx')
    );

    this.fs.copyTpl(
      this.templatePath('jest-setup.js'),
      this.destinationPath('jest-setup.js')
    );

    this.fs.copyTpl(
      this.templatePath('tsconfig.json'),
      this.destinationPath('tsconfig.json'),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('src/index.html'),
      this.destinationPath('src/index.html'),
      { options: this.props, name: this.options.name }
    );

    this.fs.copyTpl(
      this.templatePath('src/index.scss'),
      this.destinationPath('src/index.scss'),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('src/base-styles/_base.scss'),
      this.destinationPath('src/base-styles/_base.scss'),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('src/base-styles/_variables.scss'),
      this.destinationPath('src/base-styles/_variables.scss'),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('.storybook'),
      this.destinationPath('.storybook'),
      { options: this.props }
    );

    this.fs.copyTpl(
      this.templatePath('src/stories'),
      this.destinationPath('src/stories'),
      { options: this.props }
    );
  }

  install() {
    // npm install if needed
    mkdirp(`src/components`);
  }

  end() {
    this.log(
      chalk.green('\nComplete!')
    );

    if (this.props.newFolder && !this.props.ignoreNewFolderSettings) {
      this.log(
        chalk.white(`\nDon't forget to change directory into your new folder,`),
        chalk.blue(this.props.name)
      );
    }

    this.config.set(Object.assign({}, this.config.getAll(), this.props));
    
    this.log(
      chalk`
  *****************************************************************************
  *                                                                           *
  *  {underline Further instructions}:                                                    *
  *                                                                           *
  *    - node_modules are not installed yet,                                  *
  *      you can install it by running {blue npm install}                            *
  *      inside your project directory                                        *
  *                                                                           *
  *    - some of your packages might be outdated                              *
  *      use {blue npm-check-update} library to figure out what needs to be updated  *
  *      follow official migration guides from the libraries                  *
  *      that need to be updated                                              *
  *                                                                           *
  *    - Don't forget to change directory if you                              *
  *      created a project in a new folder                                    *
  *                                                                           *
  *                                                                           *
  *    Happy coding!                                                          *
  *                                                                           *
  *****************************************************************************


`
    );

    this.props.ignoreNewFolderSettings = true; // add this to the saved config
    // so reruns do not cause nested project subfolders

    this.config.set(Object.assign({}, this.config.getAll(), this.props));
  }
};
