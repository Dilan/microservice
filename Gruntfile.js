module.exports = function(grunt) {

    var checkFiles = [
                'config/**/*.js',
                'models/**/*.js',
                'modules/**/*.js',
                'routes/**/*.js',
                'test/**/**/*.js',
                '*.js'
            ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jscs: {
            default: {
                src: checkFiles,
                options: {
                    config: '.jscs.json'
                }
            }
        },
        jshint: {
            default: {
                src: checkFiles,
                options: {
                    jshintrc: '.jshintrc'
                }
            }
        },
        mochaTest: {
            integration: {
                options: {
                    timeout: 5000,
                    reporter: 'spec'
                },
                src: ['test/spechelper.js', 'test/integration/**/*.spec.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-jscs-checker');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('check', ['jshint:default', 'jscs:default']);
    grunt.registerTask('test', ['check', 'mochaTest:integration']);
};
