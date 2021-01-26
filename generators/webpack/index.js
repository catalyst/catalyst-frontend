'use strict';
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');
const kebabCase = require('lodash.kebabcase');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.packages = [
      '@babel/core',
      '@babel/preset-env',
      '@babel/plugin-proposal-object-rest-spread',
      'autoprefixer',
      'babel-loader',
      'css-loader',
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
      'postcss-flexbugs-fixes',
      'postcss-loader',
      'prettier',
      'sass-loader',
      'style-loader',
      'stylelint',
      'stylelint-config-sass-guidelines',
      'stylelint-config-standard',
      'stylelint-webpack-plugin',
      'url-loader',
      'webpack@4',
      'webpack-cli@3',
      'webpack-dev-server',
      'webpack-merge'
    ];
    this.projectPackages = ['@babel/polyfill', 'whatwg-fetch'];

    this.props = this.options.reconfigure ? {} : this.config.getAll();
  }

  prompting() {
    const prompts = [
      {
        type: 'confirm',
        name: 'react',
        message: 'Do you want to add React to your project?',
        default: true,
        when: typeof this.props.react !== 'boolean'
      },
      {
        type: 'confirm',
        name: 'jest',
        message: 'Do you want to add Jest (for testing) to your project?',
        default: true,
        when: typeof this.props.jest !== 'boolean'
      },
      {
        type: 'confirm',
        name: 'typescript',
        message: 'Do you want to add Typescript to your project?',
        default: true,
        when: typeof this.props.typescript !== 'boolean'
      },
      {
        type: 'confirm',
        name: 'bootstrap',
        message: 'Do you want to add Bootstrap to your project?',
        default: false,
        when: typeof this.props.bootstrap !== 'boolean'
      },
      {
        type: 'confirm',
        name: 'storybook',
        message: 'Do you want to add Storybook to your project?',
        default: false,
        when: typeof this.props.storybook !== 'boolean'
      },
      {
        type: 'input',
        name: 'src',
        message: 'Name of the directory where your uncompiled files will live:',
        default: answers => {
          if (answers.flatStructure || this.props.flatStructure) {
            return 'scss';
          }

          return 'src';
        },
        filter: input => kebabCase(input),
        when: !this.props.src && !this.props.flatStructure
      },
      {
        type: 'input',
        name: 'dist',
        message:
          'Name of the directory where your built files will be written:',
        default: answers => {
          if (answers.flatStructure || this.props.flatStructure) {
            return 'css';
          }

          return 'dist';
        },
        filter: input => kebabCase(input),
        validate: (input, answers) => {
          if (input === answers.src) {
            return 'Folder names for uncompiled and built files must be different.';
          }

          return true;
        },
        when: !this.props.dist && !this.props.flatStructure
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = Object.assign({}, this.props, props);
    });
  }

  configuring() {
    if (this.props.react) {
      this.packages.push('@babel/preset-react');
      this.projectPackages.push('prop-types');
      this.projectPackages.push('react');
      this.projectPackages.push('react-dom');
      this.packages.push('react-hot-loader');
    }

    if (this.props.jest) {
      this.packages.push('jest');
      this.packages.push('babel-jest');
      this.packages.push('@babel/plugin-transform-modules-commonjs');
      this.packages.push('babel-core@7.0.0-bridge.0');
    }

    if (this.props.jest && this.props.react) {
      this.packages.push('@testing-library/react');
      this.packages.push('react-addons-test-utils');
      this.packages.push('react-test-renderer');
    }

    if (this.props.typescript) {
      this.packages.push('typescript');
      this.packages.push('@babel/preset-typescript');

      // Typescript
      this.packages.push('@types/webpack-env');
      this.packages.push('@types/node');

      if (this.props.react) {
        this.packages.push('@typescript-eslint/eslint-plugin');
        this.packages.push('eslint-config-airbnb-typescript');

        this.packages.push('@types/react');
        this.packages.push('@types/react-dom');
      }

      if (this.props.jest) {
        this.packages.push('ts-jest');
        this.packages.push('@testing-library/jest-dom');
        this.packages.push('@types/jest');
      }
    }

    if (this.props.bootstrap) {
      this.projectPackages.push('bootstrap');
    }

    if (this.props.storybook) {
      this.projectPackages.push('@storybook/react');
    }
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      {options: this.props, name: this.options.name}
    );

    const renderBabelrc = require('./configs/.babelrc.config.js');
    this.fs.copy(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc'),
      {
        process: (contents, filename) => {
          return renderBabelrc(contents, filename, this.props);
        }
      }
    );

    this.fs.copyTpl(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig'),
      {options: this.props}
    );

    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      {options: this.props}
    );

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      {options: this.props, name: this.options.name}
    );

    this.fs.copyTpl(
      this.templatePath('example.gitignore'),
      this.destinationPath('.gitignore'),
      {options: this.props}
    );

    this.fs.copyTpl(
      this.templatePath('example.gitattributes'),
      this.destinationPath('.gitattributes'),
      {options: this.props}
    );

    this.fs.copyTpl(
      this.templatePath('.eslintrc.json'),
      this.destinationPath('.eslintrc.json'),
      {options: this.props}
    );

    this.fs.copyTpl(
      this.templatePath('.prettierrc.js'),
      this.destinationPath('.prettierrc.js'),
      {options: this.props}
    );

    this.fs.copyTpl(
      this.templatePath('example.stylelintrc'),
      this.destinationPath('.stylelintrc')
    );

    if (this.props.jest) {
      this.fs.copyTpl(
        this.templatePath('jest-mock-files.js'),
        this.destinationPath('jest-mock-files.js')
      );

      this.fs.copyTpl(
        this.templatePath('jest-mock-styles.js'),
        this.destinationPath('jest-mock-styles.js')
      );
    }

    if (this.props.react) {
      if (this.props.typescript) {
        this.fs.copyTpl(
          this.templatePath('src/index.js'),
          this.destinationPath(this.props.src + '/index.tsx'),
          {options: this.props}
        );

        this.fs.copyTpl(
          this.templatePath('src/app.jsx'),
          this.destinationPath(this.props.src + '/app.tsx')
        );
      } else {
        this.fs.copyTpl(
          this.templatePath('src/index.js'),
          this.destinationPath(this.props.src + '/index.jsx'),
          {options: this.props}
        );

        this.fs.copyTpl(
          this.templatePath('src/app.jsx'),
          this.destinationPath(this.props.src + '/app.jsx')
        );
      }
    } else {
      this.fs.copyTpl(
        this.templatePath('src/index.js'),
        this.destinationPath(this.props.src + '/index.js'),
        {options: this.props}
      );
    }

    if (this.props.react && this.props.jest) {
      this.fs.copyTpl(
        this.templatePath('jest-setup.js'),
        this.destinationPath('jest-setup.js')
      );
    }

    if (this.props.typescript) {
      this.fs.copyTpl(
        this.templatePath('tsconfig.json'),
        this.destinationPath('tsconfig.json'),
        {options: this.props}
      );
    }

    this.fs.copyTpl(
      this.templatePath('src/index.html'),
      this.destinationPath(this.props.src + '/index.html'),
      {options: this.props, name: this.options.name}
    );

    this.fs.copyTpl(
      this.templatePath('src/index.scss'),
      this.destinationPath(this.props.src + '/index.scss'),
      {options: this.props}
    );

    this.fs.copyTpl(
      this.templatePath('src/base-styles/_base.scss'),
      this.destinationPath(this.props.src + '/base-styles/_base.scss'),
      {options: this.props}
    );

    this.fs.copyTpl(
      this.templatePath('src/base-styles/_variables.scss'),
      this.destinationPath(this.props.src + '/base-styles/_variables.scss'),
      {options: this.props}
    );

    if (this.props.bootstrap) {
      this.fs.copyTpl(
        this.templatePath('src/base-styles/_custom-bootstrap.scss'),
        this.destinationPath(
          this.props.src + '/base-styles/_custom-bootstrap.scss'
        ),
        {options: this.props}
      );

      this.fs.copyTpl(
        this.templatePath('src/base-styles/_project-variables.scss'),
        this.destinationPath(
          this.props.src + '/base-styles/_project-variables.scss'
        ),
        {options: this.props}
      );
    }

    if (this.props.storybook) {
      this.fs.copyTpl(
        this.templatePath('.storybook/config.js'),
        this.destinationPath('.storybook/config.js'),
        {options: this.props}
      );

      this.fs.copyTpl(
        this.templatePath('stories/index.js'),
        this.destinationPath('stories/index.js'),
        {options: this.props}
      );
    }

    this.config.set(Object.assign({}, this.config.getAll(), this.props));
  }

  install() {
    if (this.props.react) {
      mkdirp(`${this.props.src}/components`);
    }

    this.npmInstall(this.packages, {'save-dev': true});
    this.npmInstall(this.projectPackages, {'save-dev': false});
  }
};
