# generator-catalyst-frontend
> A configurable frontend build pipeline that caters for everything from simple SASS compilation only, right through to ES2015 plus React.

## Installation

We assume you have pre-installed
[node.js](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) -
now clone this repository (note: later on this will be replaced by just npm
installing it - needs to be published first):

```bash
git clone git@gitlab.catalyst.net.nz:frontend/generator-catalyst-frontend.git
cd generator-catalyst-frontend
```

Now we need to make the generator available globally too:

```bash
sudo npm link
cd ..
```

Then generate your new project (do this from the location where you want your
project to be located):

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
yo catalyst-frontend --reconfigure
```

## License

MIT © [Jen Zajac](https://github.com/jenofdoom)
