'use strict';

module.exports = function(grunt) {

  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    ffmpeg: 'tasks/ffmpeg.js'
  });

  grunt.initConfig({
    clean: ['dist'],
    nodeunit: {
      files: ['test/**/*_test.js'],
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['tasks/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      },
    },
    ffmpeg: {
      options: {
        debug: true
      },
      compile: {
        options: {
          videoBitrate: '512k',
          audioBitrate: '64k',
          size: '1000x500',

          onEnd: function (input, output) {
            // console.log(input + ' -> ' + output);
          },
          onError: function (error, input, output) {
            // console.log('error on: ' + input + ' ['+ error +']');
          },
          onCodecData: function (data, input) {
            // console.log(input + ' input is ' + data.audio + ' audio with ' + data.video + ' video');
          }
        },
        files: [{
          expand: true,
          cwd: 'test/assets',
          src: ['*.avi', '*.flv'],
          dest: 'dist',
          ext: '.mp4'
        },{
          expand: true,
          cwd: 'test/assets',
          src: ['*.avi', '*.flv'],
          dest: 'dist',
          ext: '.webm'
        }]
      },
      compile2: {
        options: {
          FFmpegOptions: {
            withAudioChannels: 1,
            withAudioFrequency: 36000
          }
        },
        files: [{
          expand: true,
          cwd: 'test/assets',
          src: ['*.wav'],
          dest: 'dist',
          ext: '.ogg'
        },{
          expand: true,
          cwd: 'test/assets',
          src: ['*.wav'],
          dest: 'dist',
          ext: '.mp3'
        }]
      }
    },
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'clean', 'ffmpeg', 'nodeunit']);

};
