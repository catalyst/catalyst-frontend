#!/usr/bin/env node

'use strict';

var yeoman = require('yeoman-environment');
var options = require('yargs').argv;
var env = yeoman.createEnv();

if (options.reconfigure) {
  options = { 'reconfigure': true };
} else {
  options = {};
}

env.lookup(function () {
  env.run('catalyst-frontend', options, function (err) {
    if (err) {
      console.log(err);
    }
  });
});
