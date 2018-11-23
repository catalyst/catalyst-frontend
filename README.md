# catalyst-frontend
> A configurable frontend build pipeline that caters for everything from simple SASS compilation only, right through to ES2015 plus React.

![catalyst-frontend preview](https://raw.githubusercontent.com/catalyst/catalyst-frontend/master/catalyst-frontend.gif)

## Available functionality

This opinionated tool (as used at [Catalyst](http://catalyst.net.nz/)) aims to
get you up and running with **one of two configurable frontend build pipelines** 
([Gulp](https://gulpjs.com/) or [Webpack](https://webpack.js.org/)). It
generates documentation to get you started and gives you the config files so you
can tweak them further yourself if you like.

### Gulp pipeline

For simple projects where you are not intending to utilise ES2015.

#### Basic functionality:

* [SASS](http://sass-lang.com/) (.scss) support
  - [Autoprefixer](https://github.com/postcss/autoprefixer#autoprefixer-)
  - CSS minification with [cssnano](http://cssnano.co/)
  - [PostCSS Flexbugs Fixes](https://github.com/luisrudge/postcss-flexbugs-fixes)
  - CSS sourcemaps
* A basic [.editorconfig](http://editorconfig.org/)
* Choice of project structures

#### Optional functionality:

* [Browsersync](https://browsersync.io/) integration for auto-reloading
* JS file concatenation and minification
  - sourcemaps
* [jQuery](https://jquery.com/)
* [Bootstrap](http://getbootstrap.com/) CSS - choice of Boostrap 3 or 4
* [Bootstrap](http://getbootstrap.com/) JS

### Webpack pipeline

For projects where you want to use ES6 transpilation.

#### Basic functionality:

* ES2015 transpilation with [Babel](https://babeljs.io/) (plus plugin-proposal-object-rest-spread)
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
* [babel-polyfill](https://babeljs.io/docs/en/babel-polyfill), [whatwg-fetch](https://github.com/whatwg/fetch) and [es6-promise](https://www.npmjs.com/package/es6-promise) support for older browsers

#### Optional functionality:

* [React](https://facebook.github.io/react/) and hot loading
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

* Ask for project setup parameters e.g. tabs vs whitespaces, semicolons or not
* Webpack TypeScript option

## License

GPL-3.0 © [Catalyst](https://catalyst.net.nz/)
