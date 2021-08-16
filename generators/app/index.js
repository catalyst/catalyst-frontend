"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const mkdirp = require("mkdirp");
const path = require("path");
const kebabCase = require("lodash.kebabcase");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option("reconfigure");

    this.props = this.options.reconfigure ? {} : this.config.getAll();
  }

  prompting() {
    this.log(
      chalk.blue("\nWelcome to the"),
      chalk.red("catalyst-frontend"),
      chalk.blue("build pipeline generator.\n")
    );

    if (!this.props.buildType) {
      this.log("We just need to ask you some questions to get started!\n");
    }

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "What is the name of your project?",
        default: kebabCase(path.basename(this.destinationPath())),
        filter: (input) => kebabCase(input),
        when: !this.props.name,
      },
      {
        type: "list",
        name: "newFolder",
        message: "Where do you want your build process to be installed?",
        default: true,
        choices: (answers) => {
          return [
            {
              name: "In the current directory",
              short: "Current directory",
              value: false,
            },
            {
              name: "In a new directory",
              short: `New directory '${answers.name}' created`,
              value: true,
            },
          ];
        },
        when: typeof this.props.newFolder !== "boolean",
      },
      {
        type: "list",
        name: "buildType",
        message: "What kind of build process do you need?",
        choices: [
          {
            name: "Catalyst - default stack (React, Typescript, Webpack and Sass)",
            short: "react-catalyst",
            value: "react-catalyst",
          },
          {
            name: "Gulp: for SASS compilation, with options for jQuery and/or Bootstrap integration",
            short: "Gulp",
            value: "gulp",
          },
          {
            name: "Webpack: for ES6 JS projects, with options for React integration",
            short: "Webpack",
            value: "webpack",
          },
        ],
        when: !this.props.buildType,
      },
    ];

    return this.prompt(prompts).then((props) => {
      this.props = Object.assign({}, this.props, props);
    });
  }

  default() {
    if (this.props.newFolder && !this.props.ignoreNewFolderSettings) {
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }

    if (this.props.buildType === "gulp") {
      this.composeWith(require.resolve("../gulp"), {
        name: this.props.name, // used in package.json template
        reconfigure: this.options.reconfigure,
      });
    } else if (this.props.buildType === "webpack") {
      this.composeWith(require.resolve("../webpack"), {
        name: this.props.name, // used in package.json template
        reconfigure: this.options.reconfigure,
      });
    } else if (this.props.buildType === "react-catalyst") {
      this.composeWith(require.resolve("../react-project"), {
        name: this.props.name, // used in package.json template
        reconfigure: this.options.reconfigure,
      });
    } else {
      // should never come here
      throw new Error('Unregistered type');
    }

    this.composeWith(require.resolve("../cleanup"), {
      props: this.props,
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath(".editorconfig"),
      this.destinationPath(".editorconfig")
    );

    this.config.set(Object.assign({}, this.config.getAll(), this.props));
  }
};
