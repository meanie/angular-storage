/*jshint latedef: nofunc */

/**
 * Module definition and dependencies
 */
angular.module('Utility.Storage.Service', [
	'Utility.Storage.Engines.MemoryStorage.Service',
	'Utility.Storage.Engines.CookieStorage.Service',
	'Utility.Storage.Engines.SessionStorage.Service',
	'Utility.Storage.Engines.LocalStorage.Service'
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

		/*****************************************************************************
		 * Initialization
		 ***/

		//Set configuration vars locally
		var storagePrefix = this.prefix,
				enabledStorageEngines = this.enabledStorageEngines,
				defaultStorageEngine = this.defaultStorageEngine;

		//Make sure the default storage engine is enabled
		if (enabledStorageEngines.indexOf(defaultStorageEngine) === -1) {
			throw new Error(
				'Default storage engine', defaultStorageEngine, 'is not enabled.'
			);
		}

		//Validate enabled storage engines
		for (var e = 0; e < enabledStorageEngines; e++) {
			var engineService = getServiceName(enabledStorageEngines[e]);
			if (!$injector.has(engineService)) {
				throw new Error(
					'Storage engine', enabledStorageEngines[e], 'does not exist.',
					'Make sure the service', engineService, 'is included as a dependency.'
				);
			}
		}

		/*****************************************************************************
		 * Helpers
		 ***/

		/**
		 * Get storage engine service name
		 */
		function getServiceName(engine) {
			return engine[0].toUpperCase() + engine.substr(1) + 'Storage';
		}

		/**
		 * Get prefixed key
		 */
		function getPrefixedKey(key) {
			return storagePrefix + key;
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
			if (angular.isUndefined(value)) {
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

			//Null values
			if (!value || value === null) {
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
		 * Storage engine instances class
		 ***/

		/**
		 * Storage engine instance constructor
		 */
		var StorageEngine = function(engine) {
			var engineService = getServiceName(engine);
			this.engine = $injector.get(engineService);
		};

		/**
		 * Setter
		 */
		StorageEngine.prototype.set = function(key, value) {

			//Must have key
			if (!key) {
				return;
			}

			//Get prefixed key and parse value
			key = getPrefixedKey(key);
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
		StorageEngine.prototype.get = function(key) {

			//Must have a key
			if (!key) {
				return null;
			}

			//Get prefixed key
			key = getPrefixedKey(key);

			//Get value and return formatted
			try {
				return formatValue(this.engine.get(key));
			}
			catch (e) {
				return null;
			}
		};

		/**
		 * Remover
		 */
		StorageEngine.prototype.remove = function(key) {

			//Must have a key
			if (!key) {
				return false;
			}

			//Get prefixed key
			key = getPrefixedKey(key);

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
		 * Exposed storage service class
		 ***/

		//Create default storage engine service and initialize cache for other engines
		var Storage = new StorageEngine(defaultStorageEngine),
				StorageEngines = {};

		//Store ourselves in the cache
		StorageEngines[defaultStorageEngine] = Storage;

		//Create dynamic properties for all enabled storage engines
		for (e = 0; e < enabledStorageEngines.length; e++) {
			var engine = enabledStorageEngines[e];
			Object.defineProperty(Storage, engine, {
				/*jshint -W083 */
				get: function() {

					//Cached?
					if (StorageEngines[engine]) {
						return StorageEngines[engine];
					}

					//Load and cache now
					return (StorageEngines[engine] = new StorageEngine(engine));
				}
			});
		}

		//Return
		return Storage;
	};
});
