# grunt-ffmpeg [![Build Status](https://secure.travis-ci.org/kfiku/grunt-ffmpeg.png?branch=master)](http://travis-ci.org/kfiku/grunt-ffmpeg)

Grunt task to wrap ffmpeg using [node-fluent-ffmpeg](https://github.com/schaermu/node-fluent-ffmpeg)

## Getting Started
You need FFmpeg >= 0.9 installed to work with this plugin.
Read about it [here](https://github.com/schaermu/node-fluent-ffmpeg#prerequisites)

### Install the plugin with:
```
npm install grunt-ffmpeg --save-dev
```


## Documentation

### Options

#### debug
Type: `Boolien`   
Default: `false`

debug mode (now only for displaying ffmpeg command)


#### videoBitrate
Type: `String`  
Default: `undefined`  
Example: `'1000k'` - 1000 kbps

Generated video bitrate


#### audioBitrate
Type: `String`  
Default: `undefined`  
Example: `'64k'` - 64 kbps

Generated audio bitrate


#### size
Type: `String`  
Default: `undefined` (don't chage size)  
Example: `'800x600'`

Generated video size `WIDTH x HEIGHT`


#### FFmpegOptions
Type: `Object`  
Default: `undefined`  
Example:
```
{
  withAudioChannels: 1
}
```

Object of extra `node-fluent-ffmpeg` options. Full list [here](https://github.com/schaermu/node-fluent-ffmpeg#supplying-ffmpeg-options)


### Options Events


#### onEnd (input, output)
Type: `Function`  
Default: `undefined`

##### Args
input: `String` input file name  
ouptut: `String` output file name

Triggers when single file decoding is finished


#### onError (error, input, output)
Type: `Function`  
Default: `undefined`

##### Args
err: `String` error message  
input: `String` input file name  
ouptut: `String` output file name

Triggers when single file decoding has an error


#### onCodecData(data, input)
Type: `Function`  
Default: `undefined`

##### Args
data: `Object` codec data object  
input: `String` input file name

Triggers on single file and give codec info object



## Examples

### Simple Video Example

Generate `*.mp4` files from `*.avi` and `*.flv` source files

```javascript
grunt.initConfig({
  ffmpeg: {
    video: {
      files: [{
        expand: true,
        cwd: 'video_source',
        src: ['*.avi', '*.flv'],
        dest: 'dist',
        ext: '.mp4'
      }]
    }
  }
});

grunt.loadNpmTasks('grunt-ffmpeg');
grunt.registerTask('default', ['ffmpeg']);
```

### Simple Audio Example

Generate `*.ogg` and `*.mp3` files from `*.wav` source files

```javascript
grunt.initConfig({
  ffmpeg: {
    audio: {
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
  }
});

grunt.loadNpmTasks('grunt-ffmpeg');
grunt.registerTask('default', ['ffmpeg']);
```

### Full Example

Generate `*.ogg` and `*.mp3` files from `*.wav` source files

```javascript
grunt.initConfig({
  ffmpeg: {
    compile: {
      options: {
        videoBitrate: '1000k',
        audioBitrate: '64k',
        size: '1920x1080',

        onEnd: function (input, output) {
          console.log(input + ' -> ' + output);
        },
        onError: function (error, input, output) {
          console.log('error on: ' + input + ' ['+ error +']');
        },
        onCodecData: function (data, input) {
          console.log(input + ' input is ' + data.audio + ' audio with ' + data.video + ' video');
        },
        FFmpegOptions: {
          // Specify video codec
          withVideoCodec: 'libx624'

          // Auto-pad video, defaulting to black padding
          applyAutopadding: true

          // Set aspect ratio
          withAspectRatio: 1.33

          // Keep aspect ratio
          keepPixelAspect: true

          // more at https://github.com/schaermu/node-fluent-ffmpeg#supplying-ffmpeg-options
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
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
### 2014-05-01 v0.1.0
 * init release

## License
Copyright (c) 2014
Licensed under the MIT license.
