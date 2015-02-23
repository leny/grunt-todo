###
 * grunt-todo
 * https://github.com/Leny/grunt-todo
 *
 * Copyright (c) 2013 Leny
 * Licensed under the MIT license.
###

"use strict"

chalk = require "chalk"
table = require "text-table"

module.exports = ( grunt ) ->

    grunt.registerMultiTask "todo", "Find TODO, FIXME and NOTE inside project files", ->
        oOptions = @options
            marks: [
                    name: "FIX"
                    pattern: /FIXME/
                    color: "red"
                ,
                    name: "TODO"
                    pattern: /TODO/
                    color: "yellow"
                ,
                    name: "NOTE"
                    pattern: /NOTE/
                    color: "blue"
            ]
            githubBoxes: no
            file: no
            title: no
            colophon: no
            usePackage: no
            logOutput: yes
        aAllowedColors = [
            "black"
            "red"
            "green"
            "yellow"
            "blue"
            "magenta"
            "cyan"
            "white"
            "gray"
        ]
        sGithubBox = if !!oOptions.githubBoxes then " [ ]" else ""
        aMarks = []
        aLogFileLines = []
        sDefaultTitle = "Grunt TODO"

        if oOptions.usePackage
            try
                oProjectPackage = grunt.file.readJSON "#{ process.cwd() }/package.json"
            catch oError
                grunt.log.writeln ""
                grunt.log.writeln chalk.yellow.bold( "Oops:" ), "No #{ chalk.cyan( 'package.json' ) } file found. Disabling #{ chalk.green( 'usePackage' ) } option."
                oOptions.usePackage = no

        if oOptions.file
            if sTitle = ( oOptions.title or ( if oOptions.usePackage and oProjectPackage.name then oProjectPackage.name else no ) or sDefaultTitle )
                if oOptions.usePackage
                    if sHomePage = oProjectPackage.homepage
                        aLogFileLines.push "# [#{ sTitle }]( #{ sHomePage } )"
                    else
                        aLogFileLines.push "# #{ sTitle }"
                    aLogFileLines.push ""
                    if sVersion = oProjectPackage.version
                        aLogFileLines.push "**Version:** `#{ sVersion }`"
                        aLogFileLines.push ""
                    if sDescription = oProjectPackage.description
                        aLogFileLines.push "> #{ sDescription }"
                        aLogFileLines.push ""
                        aLogFileLines.push "* * *"
                        aLogFileLines.push ""
                else
                    aLogFileLines.push "# #{ sTitle }"
                    aLogFileLines.push ""
                aLogFileLines.push "## TODO" unless sTitle is sDefaultTitle
            else
                aLogFileLines.push "# #{ sDefaultTitle }"
            aLogFileLines.push ""

        aMarks = for oMark in oOptions.marks
            name: oMark.name or oMark.pattern.toString()
            color: if aAllowedColors.indexOf( oMark.color.toLowerCase() ) is -1 then "cyan" else oMark.color.toLowerCase()
            regex: if oMark.pattern instanceof RegExp then oMark.pattern else new RegExp oMark.pattern

        @filesSrc
            .filter ( sFilePath ) ->
                grunt.file.exists( sFilePath ) and grunt.file.isFile( sFilePath )
            .forEach ( sFilePath ) ->
                aResults = []
                aFileResults = []
                grunt.file
                    .read sFilePath
                    .split /\r*\n/
                    .map ( sLine, iIndex ) ->
                        for oMark in aMarks
                            if oResult = oMark.regex.exec sLine
                                sLine = sLine.substring oResult.index + oResult[ 0 ].length

                                aResults.push [
                                    chalk.gray "\tline #{ iIndex + 1 }"
                                    chalk[ oMark.color ] oMark.name
                                    chalk.white.italic if sLine.trim().length > 80 then "#{ sLine.trim().substr( 0, 80 ) }…" else sLine.trim()
                                ]

                                aFileResults.push "- #{ sGithubBox } **#{ oMark.name }** `(line #{ iIndex + 1 })` #{ sLine }" if oOptions.file

                if aResults.length and oOptions.logOutput
                    grunt.log.writeln()
                    grunt.log.writeln chalk.underline sFilePath
                    grunt.log.writeln()
                    grunt.log.writeln table aResults

                if oOptions.file and aFileResults.length
                    aLogFileLines.push "## #{ sFilePath }"
                    aLogFileLines.push ""
                    aLogFileLines = aLogFileLines.concat aFileResults
                    aLogFileLines.push ""

        if oOptions.file

            if oOptions.colophon
                aLogFileLines.push ""
                aLogFileLines.push "* * *"
                aLogFileLines.push ""
                aLogFileLines.push "Last generated: #{ grunt.template.today() } by [grunt-todo](https://github.com/leny/grunt-todo)."
                aLogFileLines.push ""

            grunt.file.write oOptions.file, aLogFileLines.join "\n"
            grunt.log.writeln()
            grunt.log.writeln "Logged in #{ chalk.yellow( oOptions.file ) }"
