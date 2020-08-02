const path = require('path');
const rimraf = require('rimraf');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

describe('generator:gulp', () => {
  afterEach(() => {
    rimraf.sync(path.join(__dirname, 'tmp'));
  });

  it('no index.html by default', () => {
    return helpers
      .run(path.join(__dirname, '../generators/gulp'))
      .inDir(path.join(__dirname, 'tmp'))
      .withPrompts({
        buildType: 'gulp',
        index: false
      })
      .then(function () {
        assert.file([path.join(__dirname, 'tmp/gulpfile.js')]);

        assert.noFile([path.join(__dirname, './tmp/index.html')]);
      });
  });

  it('creates index.html file with prompt', () => {
    return helpers
      .run(path.join(__dirname, '../generators/gulp'))
      .inDir(path.join(__dirname, 'tmp'))
      .withPrompts({
        newFolder: true,
        buildType: 'gulp',
        index: true,
        js: false,
        flatStructure: true
      })
      .then(function () {
        assert.file([path.join(__dirname, 'tmp/index.html')]);
      });
  });
});
