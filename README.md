# generator-catalyst-frontend
> A configurable frontend build pipeline that caters for everything from simple SASS compilation only, right through to ES2015 plus React.

## Installation

First, install [Yeoman](http://yeoman.io) (we assume you have pre-installed
[node.js](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions))
and clone this repository:

```bash
sudo npm install -g yo
git clone git@gitlab.catalyst.net.nz:frontend/generator-catalyst-frontend.git
cd generator-catalyst-frontend
```

Now we need to make the generator available globally too:

```bash
sudo npm link
cd ..
```

Then generate your new project:

```bash
yo catalyst-frontend
```

You'll be asked questions about your project and the build pipeline will be
built according to your answers.

## License

MIT © [Jen Zajac](https://github.com/jenofdoom)
