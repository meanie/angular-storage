# meanie-angular-storage

[![npm version](https://img.shields.io/npm/v/meanie-angular-storage.svg)](https://www.npmjs.com/package/meanie-angular-storage)
[![node dependencies](https://david-dm.org/meanie/angular-storage.svg)](https://david-dm.org/meanie/angular-storage)
[![github issues](https://img.shields.io/github/issues/meanie/angular-storage.svg)](https://github.com/meanie/angular-storage/issues)
[![codacy](https://img.shields.io/codacy/52a227e315104dc48b9e8d715e23f088.svg)](https://www.codacy.com/app/meanie/angular-storage)
[![Join the chat at https://gitter.im/meanie/meanie](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/meanie/meanie?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

An Angular service for interacting with local storage, session storage and cookie storage

The storage service automatically parses objects or arrays to and from JSON, and preserves numbers and integers as well.

![Meanie](https://raw.githubusercontent.com/meanie/meanie/master/meanie-logo-full.png)

## Installation

You can install this package using `npm` or `bower`.

### npm

```shell
npm install meanie-angular-storage --save
```

Include the script `node_modules/meanie-angular-storage/release/meanie-angular-storage.js` in your build process, or add it via a `<script>` tag to your `index.html`:

```html
<script src="node_modules/meanie-angular-storage/release/meanie-angular-storage.js"></script>
```

Add `Storage.Service` as a dependency for your app.

### bower

```shell
bower install meanie-angular-storage
```

Include the script `bower_components/meanie-angular-storage/release/meanie-angular-storage.js` in your build process, or add it via a `<script>` tag to your `index.html`:

```html
<script src="bower_components/meanie-angular-storage/release/meanie-angular-storage.js"></script>
```

Add `Storage.Service` as a dependency for your app.

## Configuration

```js
angular.module('App', [
  'Storage.Serice'
]).config(function($storageProvider, App) {

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

## Usage

```js
angular.module('App.MyModule').controller('MyController', function($storage) {

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
});
```

## Issues & feature requests

Please report any bugs, issues, suggestions and feature requests in the [meanie-angular-storage issue tracker](https://github.com/meanie/angular-storage/issues).

## Contributing

Pull requests are welcome! If you would like to contribute to Meanie, please check out the [Meanie contributing guidelines](https://github.com/meanie/meanie/blob/master/CONTRIBUTING.md).

## Credits

* Meanie logo designed by [Quan-Lin Sim](mailto:quan.lin.sim+meanie@gmail.com)

## License

(MIT License)

Copyright 2015-2016, [Adam Buczynski](http://adambuczynski.com)
