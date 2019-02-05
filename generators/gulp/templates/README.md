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

<% if (options.browsersync) { -%>
This will start Browsersync, which will watch for changes in your files and
reload your browser for you automatically, and Gulp, which will recompile your
files for you. `control-c` will quit the watch process. You may want to further
customise which files Browsersync watches by editing the BROWSERSYNCOPTS object
in `gulpfile.js`.
<% } else { -%>
This will run a watch process that keeps an eye on your files and recompiles
whenever you save changes. `control-c` will quit the watch process.
<% } %>
## Project structure & build process features

```
├── .editorconfig
├── .gitignore
├── gulpfile.js
├── package.json
├── README.md
<% if (options.flatStructure) { -%>
└── <%= options.src %>
<% } else { -%>
└── <%= options.src %>
    ├── fonts
    ├── img<% if (options.js) { %>
    ├── js<% } %>
    └── scss
<% } %>
```

To learn about `.editorconfig` and to see if there is a plugin for your code
editor, see [the EditorConfig website](http://editorconfig.org/).

### SCSS compilation

All `.scss` files in the <% if (options.flatStructure) { %>`<%= options.src %>/`<% }
else { %>`<%= options.src %>/scss/`<% } %> folder will be compiled. Use the
[underscore import functionality](http://sass-lang.com/guide#topic-5) to create
includes of module files so you don't end up with more than one `.css` file
in <% if (options.flatStructure) { %>`<%= options.dist %>/`<% }
else { %>`<%= options.dist %>/css/`<% } %>.

[Autoprefixer](https://github.com/postcss/autoprefixer#autoprefixer-) (so you
don't need to write vendor prefixes) and CSS minification is included in the
compile process, when you run `npm run build`.

<% if (options.bootstrap) { %>[Bootstrap](http://getbootstrap.com/) is included,
as well as a file for you to put in your overrides of its variables, at <% if
(options.flatStructure) { %>`<%= options.src %>/_variables-bootstrap.scss`<% }
else { %>`<%= options.src %>/scss/_variables-bootstrap.scss`<% } %>.<% } -%>

<% if (options.js) { -%>
### JS concatenation and minification

The JavaScript files in your `<%= options.src %>` folder will all be concatenated into
one minified file named `bundle.js` in your `<%= options.dist %>` folder. You can name
them whatever you like.

<% if (options.jquery) { %>[jQuery](https://jquery.com/) will also be included
in the bundle file<% } %><% if (options.bootstrapjs) { %>, as will [Bootstrap's JS](https://v4-alpha.getbootstrap.com/getting-started/javascript/#data-attributes)<% } %><% if (options.tooltips && options.bootstrap4) { %> and [Popper.js](https://popper.js.org/)<% } else if  (options.tooltips) { %> and [Tether](http://tether.io/)<% } %>.
<% } -%>

<% if (!options.flatStructure) { -%>
### Other static files are copied

Any other files you have in your `<%= options.src %>` folder (like images, fonts,
favicons etc) will be copied across to the `<%= options.dist %>` folder so you can
include them as normal. As well as the pre-configured `img` and `fonts` folders,
you can create any other subfolders as you please (or just put files in the root
of `<%= options.src %>`).
<% } -%>

### Linting

### JavaScript

Use `npm run lint` to run the JS linter. The configuration file for the linter
is at `.eslintrc.json`, where you can tweak you configuration as you please -
refer to the [eslint
documentation](https://eslint.org/docs/user-guide/configuring). By default the
[Airbnb JavaScript style guide](https://github.com/airbnb/javascript) is used
(with a few tweaks). You can also run `npm run lint:fix` to fix any
automatically fixable errors directly.

### SCSS

Use `npm run stylelint` to run the SCSS/CSS linter. The configuration file is at
`.stylelintrc` - refer to the [stylelint docs](https://stylelint.io/) to see how
you can tweak configuration if you would like. Some errors can be automatically
fixed - use the `npm run stylelint:fix` command for that.

## Deploying

To generate the compiled static files, from this directory run:

```
npm run build
```

Note that by default these files are __not__ kept in version control (to avoid
conflicts), so your project deployment process should include this build
process.

## Extending the build process

If you want to alter the build process you should modify `gulpfile.js`. The
training materials for the
[js-build-pipelines-training](https://github.com/jenofdoom/js-build-pipelines-training#gulp)
course may be helpful in this regard, or refer to the [gulp plugins
directory](http://gulpjs.com/plugins/). Don't forget you need to restart the
watch process whenever you alter the build configuration.
