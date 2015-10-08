'use strict';

module.exports = {
  "name": "blue-leaf",
  "description": "Physics-like animations for pretty particles",
  "main": [
    "js/motion.js",
    "sass/motion.scss"
  ],
  "dependencies": {
    "get-size": "~1.2.2",
    "eventEmitter": "~4.2.11"
  },
  "devDependencies": {
    "qunit": "~1.16.0"
  },
  "moduleType": [
    "amd",
    "globals",
    "node"
  ],
  "keywords": [
    "motion",
    "physics",
    "particles"
  ],
  "authors": [
    "Betty Beta "
  ],
  "license": "MIT",
  "ignore": [
    "**/.*",
    "node_modules",
    "bower_components",
    "test",
    "tests"
  ],
  "private": true
};