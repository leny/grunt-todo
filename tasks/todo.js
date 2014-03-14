/*
 * grunt-todo
 * https://github.com/Leny/grunt-todo
 *
 * Copyright (c) 2013 Leny
 * Licensed under the MIT license.
 */

"use strict";

var chalk = require( "chalk" );
var table = require( "text-table" );

module.exports = function( grunt ) {

  grunt.registerMultiTask( "todo", "Find TODO, FIXME and NOTE inside project files", function() {
    var options = this.options( {
        marks: [
          {
            name: "FIX",
            pattern: /FIXME/,
            color: "red"
          },
          {
            name: "TODO",
            pattern: /TODO/,
            color: "yellow"
          },
          {
            name: "NOTE",
            pattern: /NOTE/,
            color: "blue"
          }
        ],
        file: false
      } ),
      allowed_colors = [ "black", "red", "green", "yellow", "blue", "magenta", "cyan", "white", "gray" ],
      marks = [],
      logFileLines = [];

    if( options.file ) {
      logFileLines.push( "# Grunt TODO" );
      logFileLines.push( "" );
    }

    for( var mark, i = -1; mark = options.marks[ ++i ] ; ) {
      marks.push( {
        name: mark.name || mark.pattern.toString(),
        color: ( allowed_colors.indexOf( mark.color.toLowerCase() ) === -1 ) ? "cyan" : mark.color.toLowerCase(),
        regex: ( mark.pattern instanceof RegExp ) ? mark.pattern : new RegExp( mark.pattern ),
      } );
    }

    this.filesSrc.filter( function( filepath ) {

      return grunt.file.exists( filepath ) && grunt.file.isFile( filepath );

    } ).forEach( function( filepath ) {
      var results = [],
          fileResults = [];
      grunt.file.read( filepath ).split( /\r*\n/ ).map( function( line, index ) {

        marks.forEach( function( mark ) {
          var result;
          if( result = mark.regex.exec( line ) ) {

            line = line.substring(result.index + result[0].length);

            results.push( [
              chalk.gray( "\tline " + ( index + 1 ) ),
              chalk[ mark.color ]( mark.name ),
              chalk.white.italic( line.trim().length > 80 ? ( line.trim().substr( 0, 80 ) + "…" ) : line.trim() )
            ] );

            if( options.file ) {
              fileResults.push( "* **" + mark.name + "** `(line " + ( index + 1 ) + ")` " + line );
            }
          }
        } );
      } );

      if( results.length ) {
        grunt.log.writeln();
        grunt.log.writeln( chalk.underline( filepath ) );
        grunt.log.writeln();
        grunt.log.writeln( table( results ) );
      }

      if( options.file && fileResults.length ) {
        logFileLines.push( "## " + filepath );
        logFileLines.push( "" );
        logFileLines = logFileLines.concat( fileResults );
        logFileLines.push( "" );
      }

    } );

    if( options.file ) {
      grunt.file.write( options.file, logFileLines.join( "\n" ) );
      grunt.log.writeln();
      grunt.log.writeln( "Logged in " + chalk.yellow( options.file ) );
    }
  } );

};
