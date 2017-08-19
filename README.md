# catalyst-frontend
> A configurable frontend build pipeline that caters for everything from simple SASS compilation only, right through to ES2015 plus React.

## Available functionality

This opinionated tool (as used at [Catalyst](http://catalyst.net.nz/)) aims to
get you up and running with one of two configurable frontend build pipelines. It
generates documentation to get you started and gives you the config files so you
can tweak them further yourself if you like.

### Gulp pipeline

For simple projects where you are not intending to utilise ES6.

#### Basic functionality:

* [SASS](http://sass-lang.com/) (.scss) support
  - [Autoprefixer](https://github.com/postcss/autoprefixer#autoprefixer-)
  - CSS minification with [cssnano](http://cssnano.co/)
  - [PostCSS Flexbugs Fixes](https://github.com/luisrudge/postcss-flexbugs-fixes)
  - CSS sourcemaps
* A basic [.editorconfig](http://editorconfig.org/)
* Choice of project structures
* Tooling for checking project dependencies for [new releases](https://github.com/tjunnone/npm-check-updates)
* Tooling for checking project dependencies for [security issues](https://retirejs.github.io/retire.js/)

#### Optional functionality:

* JS file concatenation and minification
  - JS sourcemaps
* [Bootstrap](http://getbootstrap.com/) CSS - choice of Boostrap 3 or 4
* [jQuery](https://jquery.com/)
* [Bootstrap](http://getbootstrap.com/) JS

### Webpack pipeline

For projects where you want to use ES6 transpilation.

#### Basic functionality:

* ES6 transpilation with [Babel](https://babeljs.io/)
* [SASS](http://sass-lang.com/) (.scss) support
  - [Autoprefixer](https://github.com/postcss/autoprefixer#autoprefixer-)
  - CSS minification with [cssnano](http://cssnano.co/)
  - [PostCSS Flexbugs Fixes](https://github.com/luisrudge/postcss-flexbugs-fixes)
* Webpack build process
  - [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html) with hot reload
  - sourcemaps
  - production build command
* A basic [.editorconfig](http://editorconfig.org/)
* Linting with [eslint](https://eslint.org/)
* Tooling for checking project dependencies for [new releases](https://github.com/tjunnone/npm-check-updates)
* Tooling for checking project dependencies for [security issues](https://retirejs.github.io/retire.js/)

#### Optional functionality:

* [React](https://facebook.github.io/react/)
* [Jest](https://facebook.github.io/jest/) for testing
* [Bootstrap 4](http://getbootstrap.com/)

## Installation

We assume you have pre-installed [node.js](https://nodejs.org/en/download/) (for
a Ubuntu package managed version see [the package manager
instructions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions))
at least version 6.

Install catalyst-frontend for global use (you may need to run this command as
root):

```bash
npm install -g catalyst-frontend
```

## Usage

From the location where you want your project to be located, generate your new
project:

```bash
catalyst-frontend
```

You'll be asked questions about your project and the build pipeline will be
built according to your answers.

## Storing configuration

When you run the generator a `.yo-rc.json` file will be generated that remembers
the answers you provided. If you want to force the project to re-ask you the
questions next time, just re-run with the `--reconfigure` flag set.

```bash
catalyst-frontend --reconfigure
```

## TODO

* Avoid JS minification on dev builds in Gulp pipeline
* Integrate BrowserSync into Gulp pipeline
* Ask for project setup parameters e.g. tabs vs whitespaces
* Add React hot module loader

## License

GPL-3.0 © [Jen Zajac](https://github.com/jenofdoom)
