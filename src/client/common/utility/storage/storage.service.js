
/**
 * Module definition and dependencies
 */
angular.module('Utility.Storage.Service', [
  'Utility.Storage.MemoryStorage.Service',
  'Utility.Storage.CookieStorage.Service',
  'Utility.Storage.SessionStorage.Service',
  'Utility.Storage.LocalStorage.Service'
])

/**
 * Provider definition
 */
.provider('Storage', function StorageProvider() {

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
  this.setPrefix = function(prefix) {

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
  this.setEnabledStorageEngines = function(enabledStorageEngines) {
    if (angular.isArray(enabledStorageEngines)) {
      this.enabledStorageEngines = enabledStorageEngines;
    }
    return this;
  };

  /**
   * Set default storage engine
   */
  this.setDefaultStorageEngine = function(defaultStorageEngine) {
    this.defaultStorageEngine = defaultStorageEngine;
    return this;
  };

  /**
   * Service getter
   */
  this.$get = function($parse, $injector) {

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
      return engine[0].toUpperCase() + engine.substr(1) + 'Storage';
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
        var fallback;
        if (angular.isFunction(engineService.getFallbackEngine)) {
          fallback = engineService.getFallbackEngine();
        }

        //Validate fallback and log warning
        fallback = fallback || 'memory';
        console.warn(
          'Storage engine', engine, 'not supported in this browser.',
          'Using fallback engine', fallback, 'instead.'
        );

        //Get fallback engine
        engineService = getEngineService(fallback);
      }

      //Cache and return the service
      return (engineServices[engine] = engineService);
    }

    /**
     * Get prefixed key
     */
    function getPrefixedKey(key) {
      return key ? (storagePrefix + key) : '';
    }

    /**
     * Test if string only contains numbers
     */
    function isStringNumber(string) {
      return /^-?\d+\.?\d*$/.test(string.replace(/["']/g, ''));
    }

    /**
     * Test if a string is an object/array
     */
    function isStringObject(string) {
      return (string.charAt(0) === '{' || string.charAt(0) === '[');
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
      if (angular.isObject(value) || angular.isArray(value) || angular.isNumber(+value || value)) {
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
      if (isStringObject(value) || isStringNumber(value)) {
        try {
          return angular.fromJson(value);
        }
        catch (e) {
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
      throw new Error(
        'Default storage engine', defaultStorageEngine, 'is not enabled.'
      );
    }

    //Validate enabled storage engines
    angular.forEach(enabledStorageEngines, function(engine) {
      var serviceName = getEngineServiceName(engine);
      if (!$injector.has(serviceName)) {
        throw new Error(
          'Storage engine', engine, 'does not exist.',
          'Make sure the service', serviceName, 'is included as a dependency.'
        );
      }
    });

    /*****************************************************************************
     * Storage engine instances class
     ***/

    /**
     * Storage engine instance constructor
     */
    var StorageEngine = function(engine) {
      this.engine = getEngineService(engine);
    };

    /**
     * Setter
     */
    StorageEngine.prototype.set = function(key, value) {

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
      }
      catch (e) {
        return false;
      }
    };

    /**
     * Getter
     */
    StorageEngine.prototype.get = function(key, defaultValue) {

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
      }
      catch (e) {
        return defaultValue;
      }
    };

    /**
     * Remover
     */
    StorageEngine.prototype.remove = function(key) {

      //Must have a key
      key = getPrefixedKey(key);
      if (!key) {
        return false;
      }

      //Remove
      try {
        this.engine.remove(key);
        return true;
      }
      catch (e) {
        return false;
      }
    };

    /**
     * Clear, optionally prefixed
     */
    StorageEngine.prototype.clear = function(prefix) {
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
    angular.forEach(enabledStorageEngines, function(engine) {
      Object.defineProperty(Storage, engine, {

        /*jshint -W083 */
        get: function() {
          if (StorageEngines[engine]) {
            return StorageEngines[engine];
          }
          return (StorageEngines[engine] = new StorageEngine(engine));
        }
      });
    });

    //Return
    return Storage;
  };
});
