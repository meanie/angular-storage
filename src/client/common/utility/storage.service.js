
/**
 * Module definition and dependencies
 */
angular.module('Common.Utility.Storage.Service', [
	'ngCookies'
])

/**
 * Provider definition
 */
.provider('Storage', function StorageProvider() {

	/**
	 * Prefix for local storage
	 */
	this.prefix = '';

	/**
	 * Default storage type
	 */
	this.defaultStorageType = 'local';

	/**
	 * Set prefix
	 */
	this.setPrefix = function(prefix) {
		this.prefix = prefix;
		return this;
	};

	/**
	 * Set storage type
	 */
	this.setDefaultStorageType = function(defaultStorageType) {
		this.defaultStorageType = defaultStorageType;
		return this;
	};

	/**
	 * Service getter
	 */
	this.$get = function($window, $cookies, $parse) {

		//Set configuration vars locally
		var storagePrefix = this.prefix,
			defaultStorageType = this.defaultStorageType;

		//Append dot to prefix if there is one
		if (storagePrefix && storagePrefix.substr(-1) !== '.') {
			storagePrefix += '.';
		}

		/**
		 * Storage engines placeholder
		 */
		var storageEngines = {

			//Local storage
			local: $window.localStorage,

			//Session storage
			session: $window.sessionStorage,

			//Cookie storage
			cookie: {

				/**
				 * Set item
				 */
				setItem: function(key, value) {
					$cookies.put(key, value);
				},

				/**
				 * Get item
				 */
				getItem: function(key) {
					return $cookies.get(key);
				},

				/**
				 * Remove item
				 */
				removeItem: function(key) {
					$cookies.remove(key);
				}
			}
		};

		/**
		 * Helper to derive a qualified key
		 */
		var deriveQualifiedKey = function(key) {
			return storagePrefix + key;
		};

		/**
		 * Check if browser storage is supported
		 */
		(function() {

			//Prepare test key
			var key = deriveQualifiedKey('__' + Math.round(Math.random() * 1e7));

			//Try local storage
			try {
				$window.localStorage.setItem(key, '');
				$window.localStorage.removeItem(key);
			}
			catch(e) {
				storageEngines.local = storageEngines.cookie;
			}

			//Try session storage
			try {
				$window.sessionStorage.setItem(key, '');
				$window.sessionStorage.removeItem(key);
			}
			catch(e) {
				storageEngines.session = storageEngines.cookie;
			}
		}());

		/**
		 * Test if string only contains numbers
		 */
		var isStringNumber = function(string) {
			return  /^-?\d+\.?\d*$/.test(string.replace(/["']/g, ''));
		};

		/**
		 * Helper to parse a value for storage
		 */
		var parseValue = function(value) {

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
		};

		/**
		 * Helper to format a value for usage
		 */
		var formatValue = function(value) {

			//Null values
			if (!value || value === null) {
				return null;
			}

			//Parse from JSON if needed
			if (value.charAt(0) == '{' || value.charAt(0) == '[' || isStringNumber(value)) {
				try {
					return angular.fromJson(value);
				}
				catch (e) {
					return null;
				}
			}

			//Return as is
			return value;
		};

		/**
		 * Storage service
		 */
		var Storage = {

			/**
			 * Get storage engine
			 */
			getStorageEngine: function(storageType) {

				//Determine normalized storage type
				storageType = storageType || defaultStorageType;
				storageType = storageType.replace('Storage', '');

				//Check if present
				if (!storageEngines[storageType]) {
					throw 'Invalid storage engine type specified: ' + storageType;
				}

				//Return
				return storageEngines[storageType];
			},

			/**
			 * Set something in storage
			 */
			set: function(key, value, storageType) {

				//Must have a key
				if (!key) {
					return;
				}

				//Derive qualified key and parse value
				key = deriveQualifiedKey(key);
				value = parseValue(value);

				//Store value
				try {
					this.getStorageEngine(storageType).setItem(key, value);
					return true;
				}
				catch (e) {
					return false;
				}
			},

			/**
			 * Get something from storage
			 */
			get: function(key, storageType) {

				//Must have a key
				if (!key) {
					return null;
				}

				//Derive qualified key
				key = deriveQualifiedKey(key);

				//Get value and return formatted
				try {
					var value = this.getStorageEngine(storageType).getItem(key);
					return formatValue(value);
				}
				catch (e) {
					return null;
				}
			},

			/**
			 * Remove something from storage
			 */
			remove: function(key, storageType) {

				//Must have a key
				if (!key) {
					return false;
				}

				//Derive qualified key
				key = deriveQualifiedKey(key);

				//Remove
				try {
					this.getStorageEngine(storageType).removeItem(key);
					return true;
				}
				catch (e) {
					return false;
				}
			},

			/**
			 * Remove all entries from storage, optionally filtered by a given prefix
			 */
			clear: function(prefix, storageType) {

				//Prefix storage prefix to given prefix
				prefix = storagePrefix + (prefix || '');

				//Keys and regex for prefix
				var keys = [],
					prefixRegex = prefix ? new RegExp('^' + prefix) : new RegExp();

				//Get storage engine
				var storageEngine = this.getStorageEngine(storageType);

				//If this is a cookies storage engine, get keys from the $cookies object
				if (storageEngine === storageEngines.cookie) {
					var cookies = $cookies.getAll();
					keys = cookies ? Object.keys(cookies) : [];
				}
				else {
					keys = Object.keys(storageEngine);
				}

				//Loop keys
				for (var key in keys) {
					if (prefixRegex.test(key)) {
						this.remove(key.substr(prefix.length), storageType);
					}
				}
			},

			/**
			 * Bind a scope variable to local storage
			 */
			bind: function(scope, variable, storageKey, storageType) {

				//Use variable name is storage key not provideed
				storageKey = storageKey || variable;

				//Check if value is present in storage
				var value = this.get(storageKey, storageType);

				//If not present, check if present in scope already
				if (value === null) {
					if (variable in scope) {
						value = scope[variable];
					}
				}

				//Assign to scope
				$parse(variable).assign(scope, value);

				//Set watch
				return scope.$watch(key, function(newValue) {
					Storage.set(storageKey, newValue, storageType);
				}, angular.isObject(scope[variable]));
			}
		};

		//Return
		return Storage;
	};
});