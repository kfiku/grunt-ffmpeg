'use strict';

var fs = require('fs');
var _ = require('lodash-node');

var notEmptyFile = function (file) {
  return fs.existsSync(file) && fs.statSync(file).size > 0;
};

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.ffmpeg = {
  setUp: function(done) {
    // setup here
    done();
  },
  'dist files not empty': function(test) {
    var files = [
      'dist/test-with-audio.mp4',
      'dist/test-with-audio.webm',
      'dist/testaudio-one.mp3',
      'dist/testaudio-one.ogg',
      'dist/testaudio-three.mp3',
      'dist/testaudio-three.ogg',
      'dist/testaudio-two.mp3',
      'dist/testaudio-two.ogg',
      'dist/testvideo-43.mp4',
      'dist/testvideo-43.webm',
      'dist/testvideo-169.mp4',
      'dist/testvideo-169.webm'
    ];
    test.expect(files.length);

    _.forEach(files, function (file) {
      test.ok(notEmptyFile(file), 'generated file ['+file+'] not exist or it\'s empty');
    }.bind(this));

    test.done();
  },
};
