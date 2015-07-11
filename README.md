# Meanie - Angular Storage

[![npm version](https://img.shields.io/npm/v/meanie-angular-storage.svg)](https://www.npmjs.com/package/meanie-angular-storage)
[![node dependencies](https://david-dm.org/meanie/angular-storage.svg)](https://david-dm.org/meanie/angular-storage)
[![github issues](https://img.shields.io/github/issues/meanie/angular-storage.svg)](https://github.com/meanie/angular-storage/issues)
[![codacy](https://img.shields.io/codacy/52a227e315104dc48b9e8d715e23f088.svg)](https://www.codacy.com/app/meanie/angular-storage)
[![Join the chat at https://gitter.im/meanie/meanie](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/meanie/meanie?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

An Angular service for [Meanie](https://github.com/meanie/meanie) projects for easy interaction with local storage, session storage or cookie storage.

The storage service automatically parses objects or arrays to and from JSON, and preserves numbers and integers as well.

## Installation
Install using the [Meanie CLI](https://www.npmjs.com/package/meanie):
```shell
meanie install angular-storage
```

## Usage
Include the service as a dependency and inject it into your modules:
```js
angular.module('App.MyModule', [
  'Utility.Storage.Service'
]).controller('MyController', function($storage) {
  //Use the $storage service
});
```
Configure if needed:
```js
angular.module('App').config(function($storageProvider, App) {

  //Set global prefix for stored keys
  $storageProvider.setPrefix(App.name.toLowerCase());

  //Change the default storage engine
  //Defaults to 'local'
  $storageProvider.setDefaultStorageType('session');

  //Change the enabled storage engines
  //Defaults to ['memory', 'cookie', 'session', 'local']
  $storageProvider.setEnabledStorageEngines(['local', 'session', 'custom']);
});
```
Use it in your modules:
```js
//Set item in storage
$storage.set('user', user); //Set in default storage
$storage.local.set('user', user); //Set in local storage
$storage.session.set('user', user); //Set in session storage

//Get item from storage
$storage.get('user'); //Get from default storage
$storage.local.get('user'); //Get from local storage
$storage.session.get('user'); //Get from session storage

//Get with default value in case requested value is not set or null
$storage.get('user', defaultUser);

//Remove an item from storage
$storage.remove('user'); //Remove from default storage
$storage.local.remove('user'); //Remove from local storage
$storage.session.remove('user'); //Remove from session storage

//Clear items from storage
$storage.clear(); //Clear default storage
$storage.local.clear(); //Clear local storage
$storage.session.clear(); //Clear session storage

//Clear items with a certain prefix only
$storage.clear('defaults.');
```

## Issues & feature requests
Please report any bugs, issues, suggestions and feature requests in the appropriate issue tracker:
* [Meanie Angular Storage issue tracker](https://github.com/meanie/angular-storage/issues)
* [Meanie Boilerplate issue tracker](https://github.com/meanie/boilerplate/issues)
* [Meanie CLI issue tracker](https://github.com/meanie/meanie/issues)

## Contributing
If you would like to contribute to Meanie, please check out the [Meanie contributing guidelines](https://github.com/meanie/meanie/blob/master/CONTRIBUTING.md).

## License
(MIT License)

Copyright 2015, [Adam Buczynski](http://adambuczynski.com)
