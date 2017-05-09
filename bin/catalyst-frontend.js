#!/usr/bin/env node

'use strict';

var yeoman = require('yeoman-environment');
var options = require('yargs').argv;
var env = yeoman.createEnv();

env.lookup(function () {
  env.run('catalyst-frontend', options, function (err) {
    if (err) {
      console.log(err);
    }
  });
});
