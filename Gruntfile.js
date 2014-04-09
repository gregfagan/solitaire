'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        // configuration files
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            tmp: {
                src: [ 'tmp' ]
            },

            build: {
                src: [ 'build' ]
            },

            compress: {
                src: [ 
                    'build/**/*.js',
                    '!**/main.js',
                    '!**/require.js',
                    '!**/react.js'
                ]
            },
        },

        jshint: {
            js: {
                expand: true,
                cwd: 'app',
                src: [ '**/*.js', '!**/debug.js']
            }
        },

        react: {
            jsx: {
                dest: 'tmp/js',
                cwd: 'app',
                src: [ '**/*.jsx' ],
                ext: '.js',
                expand: true,
                flatten: true
            }
        },

        copy: {
            build: {
                cwd: 'app',
                src: [
                    '**',
                    '!**/*.styl',
                    '!index.html',
                    '!jsx/**'
                ],
                dest: 'tmp',
                expand: true
            },
            bower: {
                cwd: 'bower_components',
                src: [ 
                    'requirejs/require.js',
                    'react/react-with-addons.js',
                    'underscore/underscore.js'
                ],
                dest: 'tmp/js',
                flatten: true,
                expand: true
            },
            index: {
                src: 'app/index.html',
                dest: 'tmp/index.html',
                options: {
                    process: function(content, srcpath) {
                        return grunt.template.process(content);
                    }
                }
            },
            tmp: {
                cwd: 'tmp',
                src: '**',
                dest: 'build',
                expand: true
            }
        },

        stylus: {
            build: {
                cwd: 'app',
                src: '**/*.styl',
                dest:'tmp',
                expand: true,
                ext: '.css'
            }
        },

        requirejs: {
            compress: {
                options: {
                    baseUrl: 'app/js',
                    name: 'main',
                    out: 'tmp/js/main.js'
                }
            },
        },

        aws: grunt.file.readJSON('aws.json'),
        s3: {
            options: {
                accessKeyId: '<%= aws.key %>',
                secretAccessKey: '<%= aws.secret %>',
                bucket: 'gregfagan.com',
                region: 'us-west-2',
            },

            deploy: {
                cwd: 'build',
                src: '**',
                dest: 'react-solitaire'
            }
        },

        watch: {
            development: {
                files: [ 'app/**' ],
                tasks: [ 'default' ]
            }
        }
    });

    grunt.registerTask(
        'build',
        'Compiles all files to human readable and browser renderable.',
         function(target) {
            if (target === 'development') {
                grunt.config.set('livereload', "<script>document.write('<script src=\"http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1\"></' + 'script>')</script>");    
            }
            grunt.task.run([ 'jshint', 'react', 'copy:build', 'copy:bower', 'copy:index', 'stylus', 'clean:build', 'copy:tmp', 'clean:tmp' ]);
        }
     );

    grunt.registerTask(
        'compress',
        'Concats and minifies files for minimum file size.',
        [ 'requirejs', 'clean:compress' ]
    );

    grunt.registerTask(
        'release',
        'Prepares build for deployment.',
        [ 'build', 'compress' ]
    );

    grunt.registerTask(
        'deploy',
        'Clean build and deploy to S3.',
        ['release', 's3']
    );

    grunt.registerTask('default', [
        'build:development'
    ]);

    require('load-grunt-tasks')(grunt);
};