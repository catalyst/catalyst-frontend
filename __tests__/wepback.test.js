const path = require('path');
const rimraf = require('rimraf');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

describe('generator:webpack', () => {
  beforeEach(() => {
    return helpers
      .run(path.join(__dirname, '../generators/webpack'))
      .inDir(path.join(__dirname, 'tmp'))
      .withPrompts({
        buildType: 'webpack'
      });
  });

  afterEach(() => {
    rimraf.sync(path.join(__dirname, 'tmp'));
  });

  it('works', () => {
    assert.file(path.join(__dirname, 'tmp/README.md'));

    // Should have typescript by default
    assert.file(path.join(__dirname, 'tmp/tsconfig.json'));
    assert.fileContent(path.join(__dirname, 'tmp/.babelrc'), 'typescript');

    // eslint includes prettier
    assert.fileContent(path.join(__dirname, 'tmp/.eslintrc.json'), 'prettier');
  });
});
