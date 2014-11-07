/*
 * grunt-ffmpeg
 * https://github.com/kfiku/grunt-ffmpeg
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var eachAsync = require('each-async');
var FFmpeg = require('fluent-ffmpeg');
var _ = require('lodash-node');

var log;

// Function to get file extention
var getExtension =function (filename) {
  var i = filename.lastIndexOf('.');
  return (i < 0) ? '' : filename.substr(i);
};

var gruntFFmpeg = {
  command: function (input, output, options, callback) {
    // Debault options
    var ff = new FFmpeg({ source: input })
        .withAudioBitrate('128k')
        .withAudioChannels(2)
        .on('start', function(commandLine) {
          if(options.debug) {
            log('FFmpeg command: ' + commandLine.yellow);
          }
        })
        .on('error', function(err) {
          log('An error occurred: ' + err.message + ' ['+ input + '->' + output +']');
          callback();
        })
        .on('end', function() {
          log(' ✓ '.green + input + ' » ' + output.cyan);
          callback();
        });

    var outputExtenstion = getExtension(output);

    // Detect output extention and set defaults for them
    if(outputExtenstion === '.mp4') {
      ff.withVideoCodec('libx264')
        .withAudioCodec('libmp3lame');
    } else if(outputExtenstion === '.webm') {
      ff.toFormat('webm');
    } else if(outputExtenstion === '.mp3') {
      ff.withAudioCodec('libmp3lame');
    }

    // match option helpers
    if(options.videoBitrate) {
      ff.withVideoBitrate(options.videoBitrate);
    }
    if(options.audioBitrate) {
      ff.withAudioBitrate(options.audioBitrate);
    }
    if(options.size) {
      ff.withSize(options.size);
    }

    // match option events
    // onEnd
    if(_.isFunction(options.onEnd)) {
      ff.on('end', function() {
        options.onEnd(input, output);
      });
    }
    // onError
    if(_.isFunction(options.onError)) {
      ff.on('error', function(error) {
        options.onError(error, input, output);
      });
    }
    // onCodecData
    if(_.isFunction(options.onCodecData)) {
      ff.on('codecData', function(codecData) {
        options.onCodecData(codecData, input);
      });
    }

    // auto merging options.FFmpegOptions with current set
    _.forEach(options.FFmpegOptions, function (i, key) {
      if(_.isFunction(ff[key])) {
        ff[key](i);
      }
    });

    // fix some mp3 generation issues
    if(outputExtenstion === '.mp3') {
      // mp3 and withAudioFrequency don't work, so remove it
      if(ff.withAudioFrequency) {
        ff.withAudioFrequency('');
      }
    }

    // start encoding and save file
    ff.saveToFile(output);
  }
};

module.exports = function(grunt) {
  grunt.registerMultiTask('ffmpeg', 'grunt FFmpeg wrapper', function () {
    var defaults = grunt.config.get('ffmpeg').options;
    var options = this.options({
      debug: false
    });

    if(defaults && defaults.FFmpegOptions && options.FFmpegOptions) {
      options.FFmpegOptions = _.extend(defaults.FFmpegOptions, options.FFmpegOptions);
    }

    log = grunt.log.writeln;

    eachAsync(this.files, function (el, i, next) {
      if(fs.existsSync(el.src[0])) {
        if(!fs.existsSync(el.dest)) {
          // creating empty file
          // ffmpeg have problem when dest dir don't exist
          grunt.file.write(el.dest, '');
        }

        gruntFFmpeg.command(el.src[0], el.dest, options, next);

      } else {
        log(i + '. input file not found: '.red + el.src[0]);
        next();
      }

    }, this.async());
  });
};
