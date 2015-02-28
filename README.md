# grunt-todo

![NPM version](http://img.shields.io/npm/v/grunt-todo.svg) ![Dependency Status](https://david-dm.org/leny/grunt-todo.svg) ![Downloads counter](http://img.shields.io/npm/dm/grunt-todo.svg)

> Find TODO, FIXME and NOTE inside project files.

* * *

## Getting Started

This plugin requires Grunt `~0.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-todo --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-todo');
```

## The "todo" task

### Overview

In your project's Gruntfile, add a section named `todo` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  todo: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.marks

Type: `Array`  
Default value:  
```js
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
```

An Array of objects representing the marks to find inside the files.  
`pattern` can be a string or a `RegExp`.
`color` is a color-name string allowed by [chalk](https://npmjs.org/package/chalk). If the color is not one of these, *grunt-todo* will use **cyan**.

#### options.file

Type: `String` (file path)  
Default value: `false`

A file path to log the founded marks, in *markdown* format.  
If `false` is given, the file will not be written.

#### options.githubBoxes

Type: `Boolean`  
Default value: `false`

When logging the found marks to a file, add a [github flavoured markdown](https://github.com/blog/1825-task-lists-in-all-markdown-documents) checkbox for each mark.

#### options.title

Type: `String`  
Default value: `Grunt TODO`

When logging the founded marks to file, use this as title of the markdown document.

#### options.colophon

Type: `Boolean`  
Default value: `false`

When logging the found marks to file, use colophon and timestamp as footer of the markdown document.

#### options.usePackage

Type: `Boolean`  
Default value: `false`

When enabled, if you launch your grunt-todo task from a folder containing a `package.json` file (like 99% of use cases), grunt-todo will use some of the package's informations to make the report file a little more informative (use project's name as title, show version and description, links to the homepage…).

#### options.logOutput

Type: `Boolean`  
Default value: `true`

You can disable the task to output the marks on the console by setting this to `false`.

### Usage Examples

#### Default Options

In this example, the default options are used to shows the *TODO*, *FIXME* and *NOTE* marks founded in the given files.

```js
grunt.initConfig({
  todo: {
    options: {},
    src: [
      'test/*'
    ],
  },
});
```

#### Custom Options

In this example, custom options are used to shows the *TODO* and *BURP* marks founded in the given files, and write the results on a file named `report.md`

```js
grunt.initConfig({
  todo: {
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
      githubBoxes: true,
      colophon: true,
      usePackage: true
    },
    src: [
      'test/*'
    ]
  }
});
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.  
Lint and test your code using [Grunt](http://gruntjs.com/).

### Contributors

* [brutalhonesty](https://github.com/brutalhonesty)
* [zachwolf](https://github.com/zachwolf)
* [edwellbrook](https://github.com/edwellbrook)
* [furzeface](https://github.com/furzeface)
* [mstrutt](https://github.com/mstrutt)

Many thanks to them. :)

## Release History

* **2015/02/28** : v0.5.0
* **2014/08/07** : v0.4.0
* **2014/07/15** : v0.3.1
* **2014/05/15** : v0.3.0
* **2014/04/28** : v0.2.3
* **2014/04/27** : v0.2.2
* **2014/04/27** : v0.2.1
* **2014/03/14** : v0.2.0
* **2014/01/26** : v0.1.2
* **2014/01/26** : v0.1.1
* **2013/12/29** : v0.1.0
