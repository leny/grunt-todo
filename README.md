# grunt-todo

[![NPM version](https://badge.fury.io/js/grunt-todo.png)](http://badge.fury.io/js/grunt-todo) [![Dependency Status](https://david-dm.org/leny/grunt-todo.png)](https://david-dm.org/leny/grunt-todo)

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

When logging the founded marks to file, add an *github's markdown* checkbox for each mark.
When logging the found marks to a file, add a [github flavoured markdown](https://github.com/blog/1825-task-lists-in-all-markdown-documents) checkbox for each mark.

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
      githubBoxes: true
    },
    src: [
      'test/*'
    ],
  },
});
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

### Contributors

* [brutalhonesty](https://github.com/brutalhonesty)
* [zachwolf](https://github.com/zachwolf)
* [edwellbrook](https://github.com/edwellbrook)

Many thanks to them. :)

## Release History

* **2013/12/29** : v0.1.0
* **2014/01/26** : v0.1.1
* **2014/01/26** : v0.1.2
* **2014/03/14** : v0.2.0
* **2014/04/27** : v0.2.1
* **2014/04/27** : v0.2.2

## Notes

This is my first grunt plugin, *quick & dirty* coded for using in one of my personal projects.  
I'm completely aware that I can write this plugin better... and I will. :)

## TODO

* Review & refactor
* Writing Unit tests ;)
