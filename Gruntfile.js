/*
 * grunt-codacy
 * https://github.com/cbas/grunt-codacy
 *
 * Copyright (c) 2015 Sebastiaan Deckers
 * Licensed under the ISC license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    codacy: {
      basic_test: {
        src: 'test/fixtures/lcov.info'
      },
      basic_test_force: {
        src: 'test/fixtures/lcov.info',
        options: {
          force: true
        }
      },
      multiple_files_test: {
        src: ['test/fixtures/lcov.info', 'test/fixtures/lcov2.info']
      },
      missing_file_test: {
        src: 'test/fixtures/nonexistent_lcov.info'
      },
      some_missing_files_test: {
          src: ['test/fixtures/lcov.info', 'test/fixtures/nonexistent_lcov.info']
      },
      all_missing_files_test: {
          src: ['test/fixtures/nonexistent_lcov1.info', 'test/fixtures/nonexistent_lcov2.info']
      }
    },

    nodeunit: {
      tests: ['test/*_test.js']
    },

    watch: {
      options: {
        spawn: false
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint']
      },
      lib: {
        files: 'tasks/*.js',
        tasks: ['test']
      },
      test: {
        files: 'test/*js',
        tasks: ['test']
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jshint', 'nodeunit']);

  grunt.registerTask('default', ['test']);
};
