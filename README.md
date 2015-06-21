# Meanie - Angular Storage

[![npm version](https://img.shields.io/npm/v/meanie-angular-storage.svg)](https://www.npmjs.com/package/meanie-angular-storage)
[![node dependencies](https://david-dm.org/meanie/angular-storage.svg)](https://david-dm.org/meanie/angular-storage)
[![github issues](https://img.shields.io/github/issues/meanie/angular-storage.svg)](https://github.com/meanie/angular-storage/issues)
[![Join the chat at https://gitter.im/meanie/meanie](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/meanie/meanie?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

An Angular service for [Meanie](https://github.com/meanie/meanie) projects for easy interaction with local storage, session storage or cookie storage.

The storage service automatically parses objects or arrays to and from JSON, and preserves numbers and integers as well.

## Installation
Install using the [Meanie CLI](https://www.npmjs.com/package/meanie):
```shell
meanie install angular-storage
```

## Usage
Include the service as a dependency:
```js
angular.module('App.YourModule', [
  'Common.Utility.Storage.Service'
]);
```
Configure if needed:
```js
angular.module('App').config(function(App, StorageProvider) {

  //Set global prefix for stored keys
  StorageProvider.setPrefix(App.name.toLowerCase());

  //Change the default storage engine (defaults to local storage)
  StorageProvider.setDefaultStorageType('session');
});
```
Use it in your modules:
```js
//Save item in storage, optionally specifying a storage engine
Storage.set('user', user);
Storage.set('user', user, 'session');

//Read item from storage, optionally specifying a storage engine
var user = Storage.get('user');
var user = Storage.get('user', 'session');

//Remove an item from storage, optionally specifying a storage engine
Storage.remove('user');
Storage.remove('user', 'session');

//Clear items from storage, optionally only with a
//certain prefix or only from a specific storage engine
Storage.clear();
Storage.clear('defaults.');
Storage.clear('defaults.', 'session');
```

## Issues and feature requests
Please report all bugs, issues, suggestions and feature requests in the project [issue tracker](https://github.com/meanie/angular-storage/issues).

## What is Meanie?
Meanie is a boilerplate for developing, testing and building full-stack modular javascript applications using MEAN (MongoDB, Express, AngularJS and Node.js). Meanie is powered by the Gulp task runner.

* [Meanie @ npm](https://www.npmjs.com/package/meanie)
* [Meanie @ github](https://github.com/meanie/meanie)

If you would like to contribute to Meanie, please check out the [Meanie contributing guidelines](https://github.com/meanie/meanie/blob/master/CONTRIBUTING.md).

## License
(MIT License)

Copyright 2015, [Adam Buczynski](http://adambuczynski.com)
