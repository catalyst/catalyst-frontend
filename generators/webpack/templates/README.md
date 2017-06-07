# <%= name %> frontend

## Before you start

If you don't yet have the frontend dependencies installed (if there's no
`node_modules` folder in this directory) you need to install them. It's a good
idea to also make sure we're using a recent version of
[Node.js](https://nodejs.org/en/) installed - in a terminal run:

```
node --version
```

If it's less than 6, follow [these instructions for installing version 6](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions).

Once that's done, in a terminal in this directory, run:

```
npm install
```

## Developing

From this directory:

```
npm start
```

This will run a watch process that keeps an eye on your files and recompiles
whenever you save changes. `control-c` will quit the watch process. It also
starts a development server at `http://localhost:8080` which auto-reloads
whenever there are changes.

## Project structure & build process features

```
├── .babelrc
├── .editorconfig
├── .eslintrc.json
├── .retireignore.json
├── .gitignore
<% if (options.jest) { -%>
├── jest-mock-files.js
├── jest-mock-styles.js
<% } -%>
├── package.json
├── README.md
├── webpack.config.js
└── <%= options.src %>
    ├── index.html
    ├── index.js<% if (options.react) { %>x<% } %>
    ├── index.scss
<% if (options.react) { -%>
    ├── components
<% } -%>
    └── base-styles
        ├── _base.scss
<% if (options.bootstrap) { -%>
        ├── _custom-bootstrap.scss
        ├── _project-variables.scss
<% } -%>
        └── _variables.scss
```

To learn about `.editorconfig` and to see if there is a plugin for your code
editor, see [the EditorConfig website](http://editorconfig.org/).

### Webpack compilation features

#### HTML template

`<%= options.src %>/index.html` can be customised as you see fit. It has no CSS
or JS files included - these are dynamically added with cache busting
functionality at build time.

#### SCSS compilation

All `.scss` files that are imported either into `<%= options.src %>/index.scss`
or into a JS file directly will be compiled.
[Autoprefixer](https://github.com/postcss/autoprefixer#autoprefixer-) is
included (so you don't need to write vendor prefixes) in the build process.

<% if (options.bootstrap) { %>[Bootstrap](http://getbootstrap.com/)
is included, as well as a file for you to put in your overrides of its
variables, in `<%= options.src %>/base-styles/_custom-bootstrap.scss`.<% } -%>

#### File loader

Any other static assets like image files, font files etcetera, can either be
included from your CSS (treat paths as being relative to `<%= options.src %>`)
or directly imported and used in your JS files. During the build process they
will be given a unique hash name.

So for example if you have a file at `<%= options.src
%>/assets/img/myimage.png`, you could include it from a CSS file like:

```
background: url(assets/img/myimage.png);
```

or from a JS file like:

```
import myImage from 'assets/img/myimage.png';
```

### Linting

Use `npm run lint` to run the linter. The configuration file for the linter is at
`.eslintrc.json`, where you can tweak you configuration as you please - refer
to the [eslint documentation](https://eslint.org/docs/user-guide/configuring).

<% if (options.jest) { -%>
### Testing with Jest

Running `npm run test` will invoke [Jest](https://facebook.github.io/jest/), or you can
use the interactive watch mode with `npm run test:watch`. You can also use the
built-in coverage tool via `npm run test:coverage`. The test runner will look
for any files in a `__tests__` folder, or any files with a `.spec.js` or
`.test.js` suffix.
<% } -%>

## Deploying

To generate the compiled static files, from this directory run:

```
npm run build
```

Note that by default these files are __not__ kept in version control (to avoid
conflicts), so your project deployment process should include this build
process.

## Keeping project dependencies up to date

It's a good idea to keep up to date with the latest versions of your
dependencies (although you'll need to manually vet if an upgrade has breaking
changes to your application, usually by looking at their release log - hopefully
you have automated tests to help detect regressions).

There is a command you can run to figure out if your project dependencies are
behind the latest versions:

```
npm run deps:check
```

There is also a command to force update all your dependencies (this is the one
you need to think about before running) by updating your `package.json` and
updating:

```
npm run deps:update
```

Both of these commands will also run a security check
against all of your dependencies, telling you if there are any security
advisories, using [retire.js](http://retirejs.github.io/retire.js/).

If there are packages that `retire` indicates have security issues but you have
determined that those security issues don't affect you, you can create a
`.retireignore.json` file in your project root which documents exceptions (a
default one to document some exceptions for webpack-dev-server  has already been
added). For example:

```
[
  {
    "component": "bootstrap",
    "identifiers" : { "issue": "20184" },
    "justification" : "User data should never be used in a data- attribute."
  },
  {
    "path" : "node_modules/webpack-dev-server",
    "justification" : "Only used in dev. This avoids the reporting of some minor jQuery issues."
  }
]
```

## Extending the build process

If you want to alter the build process you should modify `webpack.config.js`.
The training materials for the
[js-build-pipelines-training](https://github.com/jenofdoom/js-build-pipelines-training#webpack)
course may be helpful in this regard, or refer to the [webpack
documentation](https://webpack.js.org/). Don't forget you need to restart the
dev server process whenever you alter the build configuration.
