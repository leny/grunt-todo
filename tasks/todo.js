
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
    var aAllowedColors, aLogFileLines, aMarks, oError, oMark, oOptions, oProjectPackage, sDefaultTitle, sDescription, sGithubBox, sHomePage, sTitle, sVersion;
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
      githubBoxes: false,
      file: false,
      title: false,
      colophon: false,
      usePackage: false,
      logOutput: true
    });
    aAllowedColors = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white", "gray"];
    sGithubBox = !!oOptions.githubBoxes ? " [ ]" : "";
    aMarks = [];
    aLogFileLines = [];
    sDefaultTitle = "Grunt TODO";
    if (oOptions.usePackage) {
      try {
        oProjectPackage = grunt.file.readJSON((process.cwd()) + "/package.json");
      } catch (_error) {
        oError = _error;
        grunt.log.writeln("");
        grunt.log.writeln(chalk.yellow.bold("Oops:"), "No " + (chalk.cyan('package.json')) + " file found. Disabling " + (chalk.green('usePackage')) + " option.");
        oOptions.usePackage = false;
      }
    }
    if (oOptions.file) {
      if (sTitle = oOptions.title || (oOptions.usePackage && oProjectPackage.name ? oProjectPackage.name : false) || sDefaultTitle) {
        if (oOptions.usePackage) {
          if (sHomePage = oProjectPackage.homepage) {
            aLogFileLines.push("# [" + sTitle + "]( " + sHomePage + " )");
          } else {
            aLogFileLines.push("# " + sTitle);
          }
          aLogFileLines.push("");
          if (sVersion = oProjectPackage.version) {
            aLogFileLines.push("**Version:** `" + sVersion + "`");
            aLogFileLines.push("");
          }
          if (sDescription = oProjectPackage.description) {
            aLogFileLines.push("> " + sDescription);
            aLogFileLines.push("");
            aLogFileLines.push("* * *");
            aLogFileLines.push("");
          }
        } else {
          aLogFileLines.push("# " + sTitle);
          aLogFileLines.push("");
        }
        if (sTitle !== sDefaultTitle) {
          aLogFileLines.push("## TODO");
        }
      } else {
        aLogFileLines.push("# " + sDefaultTitle);
      }
      aLogFileLines.push("");
    }
    aMarks = (function() {
      var i, len, ref, results;
      ref = oOptions.marks;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        oMark = ref[i];
        results.push({
          name: oMark.name || oMark.pattern.toString(),
          color: aAllowedColors.indexOf(oMark.color.toLowerCase()) === -1 ? "cyan" : oMark.color.toLowerCase(),
          regex: oMark.pattern instanceof RegExp ? oMark.pattern : new RegExp(oMark.pattern)
        });
      }
      return results;
    })();
    this.filesSrc.filter(function(sFilePath) {
      return grunt.file.exists(sFilePath) && grunt.file.isFile(sFilePath);
    }).forEach(function(sFilePath) {
      var aFileResults, aResults;
      aResults = [];
      aFileResults = [];
      grunt.file.read(sFilePath).split(/\r*\n/).map(function(sLine, iIndex) {
        var i, len, oResult, results;
        results = [];
        for (i = 0, len = aMarks.length; i < len; i++) {
          oMark = aMarks[i];
          if (oResult = oMark.regex.exec(sLine)) {
            sLine = sLine.substring(oResult.index + oResult[0].length);
            aResults.push([chalk.gray("\tline " + (iIndex + 1)), chalk[oMark.color](oMark.name), chalk.white.italic(sLine.trim().length > 80 ? (sLine.trim().substr(0, 80)) + "…" : sLine.trim())]);
            if (oOptions.file) {
              results.push(aFileResults.push("- " + sGithubBox + " **" + oMark.name + "** `(line " + (iIndex + 1) + ")` " + sLine));
            } else {
              results.push(void 0);
            }
          } else {
            results.push(void 0);
          }
        }
        return results;
      });
      if (aResults.length && oOptions.logOutput) {
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
      if (oOptions.colophon) {
        aLogFileLines.push("");
        aLogFileLines.push("* * *");
        aLogFileLines.push("");
        aLogFileLines.push("Last generated: " + (grunt.template.today()) + " by [grunt-todo](https://github.com/leny/grunt-todo).");
        aLogFileLines.push("");
      }
      grunt.file.write(oOptions.file, aLogFileLines.join("\n"));
      grunt.log.writeln();
      return grunt.log.writeln("Logged in " + (chalk.yellow(oOptions.file)));
    }
  });
};
