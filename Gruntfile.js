/*
 * grunt-todo
 * https://github.com/Leny/grunt-todo
 *
 * Copyright (c) 2013 Leny
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Configuration to be run.
    todo: {
      default_options: {
        options: {},
        src: [
          'test/*'
        ],
      },
      custom_options: {
        options: {
          marks: [
            {
              pattern: "BURP",
              color: "pink"
            },
            {
              name: "TODO",
              pattern: /TODO/,
              color: "yellow"
            }
          ],
          file: "report.md",
          githubBoxes: true
        },
        src: [
          'test/*'
        ],
      },
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // By default, lint and run todo.
  grunt.registerTask('default', ['jshint', 'todo']);

};
