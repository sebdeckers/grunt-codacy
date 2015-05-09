'use strict';

var Promise = require('promise');
var codacy = require('codacy-coverage');

module.exports = function(grunt) {
  grunt.registerMultiTask('codacy', 'Publish code coverage metrics to Codacy', function() {
    var done = this.async();

    var options = this.options({
      format: undefined,
      token: undefined,
      commit: undefined,
      endpoint: undefined,
      prefix: undefined,
      verbose: undefined,
      debug: undefined
    });

    var outputFiles = this.files.map(function(f) {
      var inputFiles = f.src.map(function(filepath) {
        return grunt.file.read(filepath);
      }).map(function(filedata) {
        return codacy.handleInput(filedata, options);
      });
      return inputFiles.length ? Promise.all(inputFiles) : Promise.reject();
    });
    Promise.all(outputFiles.length ? outputFiles : [Promise.reject()])
      .then(
        function (val) { done(true); },
        function (err) { done(false); }
      );
  });
};
