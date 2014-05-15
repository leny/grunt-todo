
/*
 * grunt-todo
 * https://github.com/Leny/grunt-todo
 *
 * Copyright (c) 2013 Leny
 * Licensed under the MIT license.
 */
"use strict";
var chalk, table;

chalk = require("chalk");

table = require("text-table");

module.exports = function(grunt) {
  return grunt.registerMultiTask("todo", "Find TODO, FIXME and NOTE inside project files", function() {
    var aAllowedColors, aLogFileLines, aMarks, oMark, oOptions, sGithubBox;
    oOptions = this.options({
      marks: [
        {
          name: "FIX",
          pattern: /FIXME/,
          color: "red"
        }, {
          name: "TODO",
          pattern: /TODO/,
          color: "yellow"
        }, {
          name: "NOTE",
          pattern: /NOTE/,
          color: "blue"
        }
      ],
      file: false
    });
    aAllowedColors = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white", "gray"];
    sGithubBox = !!oOptions.githubBoxes ? " [ ]" : "";
    aMarks = [];
    aLogFileLines = [];
    if (oOptions.file) {
      aLogFileLines.push("# " + (oOptions.title || "Grunt TODO"));
      aLogFileLines.push("");
    }
    aMarks = (function() {
      var _i, _len, _ref, _results;
      _ref = oOptions.marks;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        oMark = _ref[_i];
        _results.push({
          name: oMark.name || oMark.pattern.toString(),
          color: aAllowedColors.indexOf(oMark.color.toLowerCase()) === -1 ? "cyan" : oMark.color.toLowerCase(),
          regex: oMark.pattern instanceof RegExp ? oMark.pattern : new RegExp(oMark.pattern)
        });
      }
      return _results;
    })();
    this.filesSrc.filter(function(sFilePath) {
      return grunt.file.exists(sFilePath) && grunt.file.isFile(sFilePath);
    }).forEach(function(sFilePath) {
      var aFileResults, aResults;
      aResults = [];
      aFileResults = [];
      grunt.file.read(sFilePath).split(/\r*\n/).map(function(sLine, iIndex) {
        var oResult, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = aMarks.length; _i < _len; _i++) {
          oMark = aMarks[_i];
          if (oResult = oMark.regex.exec(sLine)) {
            sLine = sLine.substring(oResult.index + oResult[0].length);
            aResults.push([chalk.gray("\tline " + (iIndex + 1)), chalk[oMark.color](oMark.name), chalk.white.italic(sLine.trim().length > 80 ? "" + (sLine.trim().substr(0, 80)) + "…" : sLine.trim())]);
            if (oOptions.file) {
              _results.push(aFileResults.push("- " + sGithubBox + " **" + oMark.name + "** `(line " + (iIndex + 1) + ")` " + sLine));
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
      if (aResults.length) {
        grunt.log.writeln();
        grunt.log.writeln(chalk.underline(sFilePath));
        grunt.log.writeln();
        grunt.log.writeln(table(aResults));
      }
      if (oOptions.file && aFileResults.length) {
        aLogFileLines.push("## " + sFilePath);
        aLogFileLines.push("");
        aLogFileLines = aLogFileLines.concat(aFileResults);
        return aLogFileLines.push("");
      }
    });
    if (oOptions.file) {
      grunt.file.write(oOptions.file, aLogFileLines.join("\n"));
      grunt.log.writeln();
      return grunt.log.writeln("Logged in " + (chalk.yellow(oOptions.file)));
    }
  });
};
