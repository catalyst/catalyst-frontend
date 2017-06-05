# catalyst-frontend
> A configurable frontend build pipeline that caters for everything from simple SASS compilation only, right through to ES2015 plus React.

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

> Note: currently only the Gulp build configuration is available, Webpack will
be added soon.

## Storing configuration

When you run the generator a `.yo-rc.json` file will be generated that remembers
the answers you provided. If you want to force the project to re-ask you the
questions next time, just re-run with the `--reconfigure` flag set.

```bash
catalyst-frontend --reconfigure
```

## License

GPL-3.0 © [Jen Zajac](https://github.com/jenofdoom)
