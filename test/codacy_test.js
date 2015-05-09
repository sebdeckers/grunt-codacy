'use strict';

var codacy = require('codacy-coverage');
var grunt = require('grunt');
var sinon = require('sinon');

function runGruntTask(taskName, callback) {
  var task = grunt.task._taskPlusArgs(taskName);
  task.task.fn.apply({
    nameArgs: task.nameArgs,
    name: task.task.name,
    args: task.args,
    flags: task.flags,
    async: function() { return callback; }
  }, task.args);
}

exports.codacy = {
  setUp: function(done) {
    sinon.stub(codacy, 'handleInput');
    done();
  },
  tearDown: function (callback) {
    codacy.handleInput.restore();
    callback();
  },
  submits_file_to_codacy: function (test) {
    runGruntTask('codacy:basic_test', function (result) {
      test.ok(result, 'Should be successful');

      test.ok(codacy.handleInput.calledOnce);
      test.equal(codacy.handleInput.getCall(0).args[0], 'lcov.info content', 'Should send lcov data');
      test.done();
    });
  },
  submits_nothing_if_the_file_is_missing: function (test) {
    runGruntTask('codacy:missing_file_test', function (result) {
      test.ok(!result, 'Should fail');

      test.ok(!codacy.handleInput.called);
      test.done();
    });
  },
  submits_multiple_files: function (test) {
    runGruntTask('codacy:multiple_files_test', function (result) {
      test.ok(result, 'Should be successful');

      test.ok(codacy.handleInput.calledTwice);
      sinon.assert.calledWith(codacy.handleInput, 'lcov.info content');
      sinon.assert.calledWith(codacy.handleInput, 'lcov2.info content');
      test.done();
    });
  },
  submits_present_files_only_if_some_are_missing: function (test) {
    runGruntTask('codacy:some_missing_files_test', function (result) {
      test.ok(result, 'Should be successful');

      test.ok(codacy.handleInput.calledOnce);
      sinon.assert.calledWith(codacy.handleInput, 'lcov.info content');
      test.done();
    });
  },
  fails_if_multiple_files_listed_and_all_files_are_missing: function (test) {
    runGruntTask('codacy:all_missing_files_test', function (result) {
      test.ok(!result, 'Should fail');

      test.ok(!codacy.handleInput.called);
      test.done();
    });
  }
};
