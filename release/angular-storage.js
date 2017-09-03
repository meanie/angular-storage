/**
 * @meanie/angular-storage * https://github.com/meanie/angular-storage
 *
 * Copyright (c) 2017 Adam Reis <adam@reis.nz>
 * License: MIT
 */
(function (window, angular, undefined) {
  'use strict';

  /**
   * Module definition and dependencies
   */

  angular.module('Storage.Service', ['Storage.MemoryStorage.Service', 'Storage.CookieStorage.Service', 'Storage.SessionStorage.Service', 'Storage.LocalStorage.Service'])

  /**
   * Provider definition
   */
  .provider('$storage', function $storageProvider() {

    /**
     * Global prefix
     */
    this.prefix = '';

    /**
     * Enabled storage engines
     */
    this.enabledStorageEngines = ['local', 'session', 'cookie', 'memory'];

    /**
     * Default storage engine
     */
    this.defaultStorageEngine = 'local';

    /**
     * Set prefix
     */
    this.setPrefix = function (prefix) {

      //Append dot if there isn't one
      if (prefix && prefix.substr(-1) !== '.') {
        prefix += '.';
      }

      //Set prefix
      this.prefix = prefix;
      return this;
    };

    /**
     * Set enabled storage engines
     */
    this.setEnabledStorageEngines = function (enabledStorageEngines) {
      if (angular.isArray(enabledStorageEngines)) {
        this.enabledStorageEngines = enabledStorageEngines;
      }
      return this;
    };

    /**
     * Set default storage engine
     */
    this.setDefaultStorageEngine = function (defaultStorageEngine) {
      this.defaultStorageEngine = defaultStorageEngine;
      return this;
    };

    /**
     * Service getter
     */
    this.$get = ['$parse', '$injector', '$log', function ($parse, $injector, $log) {

      //Set configuration vars locally
      var storagePrefix = this.prefix;
      var enabledStorageEngines = this.enabledStorageEngines;
      var defaultStorageEngine = this.defaultStorageEngine;

      //Cached engine service instances
      var engineServices = {};

      /**
       * Get storage engine service name
       */
      function getEngineServiceName(engine) {
        return '$' + engine + 'Storage';
      }

      /**
       * Get storage engine service instance
       */
      function getEngineService(engine) {

        //Cached?
        if (engineServices[engine]) {
          return engineServices[engine];
        }

        //Get the engine service
        var serviceName = getEngineServiceName(engine);
        var engineService = $injector.get(serviceName);

        //Not supported
        if (engine !== 'memory' && !engineService.isSupported()) {

          //Determine fallback
          var fallback = void 0;
          if (angular.isFunction(engineService.getFallbackEngine)) {
            fallback = engineService.getFallbackEngine();
          }

          //Validate fallback and log warning
          fallback = fallback || 'memory';
          $log.warn('Storage engine', engine, 'not supported in this browser.', 'Using fallback engine', fallback, 'instead.');

          //Get fallback engine
          engineService = getEngineService(fallback);
        }

        //Cache and return the service
        return engineServices[engine] = engineService;
      }

      /**
       * Get prefixed key
       */
      function getPrefixedKey(key) {
        return key ? storagePrefix + key : '';
      }

      /**
       * Test if string only contains numbers
       */
      function isStringNumber(string) {
        return (/^-?\d+\.?\d*$/.test(string.replace(/["']/g, ''))
        );
      }

      /**
       * Test if string is a boolean
       */
      function isStringBoolean(string) {
        return string === 'false' || string === 'true';
      }

      /**
       * Test if a string is an object/array
       */
      function isStringObject(string) {
        return string.charAt(0) === '{' || string.charAt(0) === '[';
      }

      /**
       * Helper to parse a value for storage
       */
      function parseValue(value) {

        //Normalize undefined values
        if (angular.isUndefined(value) || value === null) {
          return null;
        }

        //Convert to JSON if not a string
        if (angular.isObject(value) || angular.isArray(value) || typeof value === 'boolean' || angular.isNumber(Number(value) || value)) {
          return angular.toJson(value);
        }

        //Use as is
        return value;
      }

      /**
       * Helper to format a value from storage
       */
      function formatValue(value) {

        //Null values (also convert string null value)
        if (!value || value === null || value === 'null') {
          return null;
        }

        //Parse from JSON if needed
        if (isStringObject(value) || isStringBoolean(value) || isStringNumber(value)) {
          try {
            return angular.fromJson(value);
          } catch (e) {
            return null;
          }
        }

        //Return as is
        return value;
      }

      /*****************************************************************************
       * Initialization
       ***/

      //Make sure the default storage engine is enabled
      if (enabledStorageEngines.indexOf(defaultStorageEngine) === -1) {
        throw new Error('Default storage engine', defaultStorageEngine, 'is not enabled.');
      }

      //Validate enabled storage engines
      angular.forEach(enabledStorageEngines, function (engine) {
        var serviceName = getEngineServiceName(engine);
        if (!$injector.has(serviceName)) {
          throw new Error('Storage engine', engine, 'does not exist.', 'Make sure the service', serviceName, 'is included as a dependency.');
        }
      });

      /*****************************************************************************
       * Storage engine instances class
       ***/

      /**
       * Storage engine instance constructor
       */
      var StorageEngine = function StorageEngine(engine) {
        this.engine = getEngineService(engine);
      };

      /**
       * Setter
       */
      StorageEngine.prototype.set = function (key, value) {

        //Must have a key
        key = getPrefixedKey(key);
        if (!key) {
          return false;
        }

        //Parse value
        value = parseValue(value);

        //Store value
        try {
          this.engine.set(key, value);
          return true;
        } catch (e) {
          return false;
        }
      };

      /**
       * Getter
       */
      StorageEngine.prototype.get = function (key, defaultValue) {

        //Default value of default value is set to null (defaultvalueception!)
        if (typeof defaultValue === 'undefined') {
          defaultValue = null;
        }

        //Must have a key
        key = getPrefixedKey(key);
        if (!key) {
          return defaultValue;
        }

        //Get value and return formatted
        try {
          var value = this.engine.get(key);
          if (value === null) {
            return defaultValue;
          }
          return formatValue(value);
        } catch (e) {
          return defaultValue;
        }
      };

      /**
       * Remover
       */
      StorageEngine.prototype.remove = function (key) {

        //Must have a key
        key = getPrefixedKey(key);
        if (!key) {
          return false;
        }

        //Remove
        try {
          this.engine.remove(key);
          return true;
        } catch (e) {
          return false;
        }
      };

      /**
       * Clear, optionally prefixed
       */
      StorageEngine.prototype.clear = function (prefix) {
        prefix = storagePrefix + (prefix || '');
        this.engine.clear(prefix);
      };

      /*****************************************************************************
       * Exposed storage service
       ***/

      //Create default storage engine service and initialize engines cache
      var Storage = new StorageEngine(defaultStorageEngine);
      var StorageEngines = {};

      //Store ourselves in the cache as the default storage engine
      StorageEngines[defaultStorageEngine] = Storage;

      //Create dynamic properties for all enabled storage engines
      angular.forEach(enabledStorageEngines, function (engine) {
        Object.defineProperty(Storage, engine, {

          /*jshint -W083 */
          get: function get() {
            if (StorageEngines[engine]) {
              return StorageEngines[engine];
            }
            return StorageEngines[engine] = new StorageEngine(engine);
          }
        });
      });

      //Return
      return Storage;
    }];
  });
})(window, window.angular);
(function (window, angular, undefined) {
  'use strict';

  /**
   * Module definition and dependencies
   */

  angular.module('Storage.CookieStorage.Service', [])

  /**
   * Cookie storage engine service
   */
  .factory('$cookieStorage', ['$injector', '$log', function $cookieStorage($injector, $log) {

    //Get cookies service
    var $cookies = void 0;
    if ($injector.has('$cookies')) {
      $cookies = $injector.get('$cookies');
    } else {
      $log.warn('Cookie storage requires the `ngCookies` module as a dependency');
    }

    /**
     * Storage engine interface
     */
    return {

      /**
       * Check if supported
       */
      isSupported: function isSupported() {
        return !!$cookies;
      },

      /**
       * Get fallback engine
       */
      getFallbackEngine: function getFallbackEngine() {
        return 'memory';
      },

      /**
       * Set an item
       */
      set: function set(key, value) {
        $cookies.put(key, value);
      },

      /**
       * Get an item
       */
      get: function get(key) {
        return $cookies.get(key);
      },

      /**
       * Remove an item
       */
      remove: function remove(key) {
        $cookies.remove(key);
      },

      /**
       * Clear items
       */
      clear: function clear(prefix) {

        //Get all the cookies and corresponding keys
        var prefixRegex = prefix ? new RegExp('^' + prefix) : null;
        var cookies = $cookies.getAll();
        var keys = cookies ? Object.keys(cookies) : [];

        //Loop keys
        for (var k = 0; k < keys.length; k++) {
          if (!prefix || prefixRegex.test(keys[k])) {
            $cookies.remove(keys[k]);
          }
        }
      }
    };
  }]);
})(window, window.angular);
(function (window, angular, undefined) {
  'use strict';

  /**
   * Module definition and dependencies
   */

  angular.module('Storage.LocalStorage.Service', [])

  /**
   * Local storage engine service
   */
  .factory('$localStorage', ['$window', function $localStorage($window) {

    /**
     * Storage engine interface
     */
    return {

      /**
       * Check if supported
       */
      isSupported: function isSupported() {

        //Prepare test key
        var key = '___' + Math.round(Math.random() * 1e7);

        //Try local storage
        try {
          $window.localStorage.setItem(key, '');
          $window.localStorage.removeItem(key);
          return true;
        } catch (e) {
          return false;
        }
      },

      /**
       * Get fallback engine
       */
      getFallbackEngine: function getFallbackEngine() {
        return 'cookie';
      },

      /**
       * Set an item
       */
      set: function set(key, value) {
        $window.localStorage.setItem(key, value);
      },

      /**
       * Get an item
       */
      get: function get(key) {
        return $window.localStorage.getItem(key);
      },

      /**
       * Remove an item
       */
      remove: function remove(key) {
        $window.localStorage.removeItem(key);
      },

      /**
       * Clear items
       */
      clear: function clear(prefix) {

        //Get regex for prefix and keys
        var prefixRegex = prefix ? new RegExp('^' + prefix) : null;
        var keys = Object.keys($window.localStorage);

        //Loop keys
        for (var k = 0; k < keys.length; k++) {
          if (!prefix || prefixRegex.test(keys[k])) {
            $window.localStorage.removeItem(keys[k]);
          }
        }
      }
    };
  }]);
})(window, window.angular);
(function (window, angular, undefined) {
  'use strict';

  /**
   * Module definition and dependencies
   */

  angular.module('Storage.MemoryStorage.Service', [])

  /**
   * Memory storage engine service
   */
  .factory('$memoryStorage', function $memoryStorage() {

    /**
     * Store
     */
    var memoryStore = {};

    /**
     * Storage engine interface
     */
    return {

      /**
       * Always supported
       */
      isSupported: function isSupported() {
        return true;
      },

      /**
       * Get fallback engine
       */
      getFallbackEngine: function getFallbackEngine() {
        return '';
      },

      /**
       * Set an item
       */
      set: function set(key, value) {
        memoryStore[key] = value;
      },

      /**
       * Get an item
       */
      get: function get(key) {
        if (typeof memoryStore[key] === 'undefined') {
          return null;
        }
        return memoryStore[key];
      },

      /**
       * Remove an item
       */
      remove: function remove(key) {
        if (typeof memoryStore[key] !== 'undefined') {
          delete memoryStore[key];
        }
      },

      /**
       * Clear items
       */
      clear: function clear(prefix) {

        //Get regex for prefix and keys
        var prefixRegex = prefix ? new RegExp('^' + prefix) : null;
        var keys = Object.keys(memoryStore);

        //Loop keys
        for (var k = 0; k < keys.length; k++) {
          if (!prefix || prefixRegex.test(keys[k])) {
            delete memoryStore[keys[k]];
          }
        }
      }
    };
  });
})(window, window.angular);
(function (window, angular, undefined) {
  'use strict';

  /**
   * Module definition and dependencies
   */

  angular.module('Storage.SessionStorage.Service', [])

  /**
   * Session storage engine service
   */
  .factory('$sessionStorage', ['$window', function $sessionStorage($window) {

    /**
     * Storage engine interface
     */
    return {

      /**
       * Check if supported
       */
      isSupported: function isSupported() {

        //Prepare test key
        var key = '___' + Math.round(Math.random() * 1e7);

        //Try session storage
        try {
          $window.sessionStorage.setItem(key, '');
          $window.sessionStorage.removeItem(key);
          return true;
        } catch (e) {
          return false;
        }
      },

      /**
       * Get fallback engine
       */
      getFallbackEngine: function getFallbackEngine() {
        return 'memory';
      },

      /**
       * Set an item
       */
      set: function set(key, value) {
        $window.sessionStorage.setItem(key, value);
      },

      /**
       * Get an item
       */
      get: function get(key) {
        return $window.sessionStorage.getItem(key);
      },

      /**
       * Remove an item
       */
      remove: function remove(key) {
        $window.sessionStorage.removeItem(key);
      },

      /**
       * Clear items
       */
      clear: function clear(prefix) {

        //Get regex for prefix and keys
        var prefixRegex = prefix ? new RegExp('^' + prefix) : null;
        var keys = Object.keys($window.sessionStorage);

        //Loop keys
        for (var k = 0; k < keys.length; k++) {
          if (!prefix || prefixRegex.test(keys[k])) {
            $window.sessionStorage.removeItem(keys[k]);
          }
        }
      }
    };
  }]);
})(window, window.angular);