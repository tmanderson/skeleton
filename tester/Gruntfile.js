module.exports = function(grunt) {
  'use strict';
  
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    watch: {
      dev: {
        files: [ './src/**/*.js', './src/**/*.config.js', './assets/styles/**/*.scss' ],
        tasks: [ 'default' ],
        options: {
          spawn: true,
          livereload: 35730
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 4000,
          hostname: 'localhost'
        }
      }
    },

    sass: {
      options: {
          sourceMap: true
      },
      dist: {
        files: {
            'assets/styles/main.css': 'assets/styles/main.scss'
        }
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },

      all: [ 'src/**/*.js' ]
    },

    injector: {
      options: {
        addRootSlash: false
      },
      app: {
        files: {
          'index.html': [ 'bower.json', 'src/**/*.js', 'assets/**/*.css' ]
        }
      }
    },
  });

  grunt.registerTask('default', [ 'sass', 'jshint', 'injector' ]);
  grunt.registerTask('serve', [ 'connect', 'watch' ]);
};
