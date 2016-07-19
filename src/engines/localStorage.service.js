
/**
 * Module definition and dependencies
 */
angular.module('Storage.LocalStorage.Service', [])

/**
 * Local storage engine service
 */
.factory('$localStorage', function $localStorage($window) {

  /**
   * Storage engine interface
   */
  return {

    /**
     * Check if supported
     */
    isSupported: function() {

      //Prepare test key
      let key = '___' + Math.round(Math.random() * 1e7);

      //Try local storage
      try {
        $window.localStorage.setItem(key, '');
        $window.localStorage.removeItem(key);
        return true;
      }
      catch (e) {
        return false;
      }
    },

    /**
     * Get fallback engine
     */
    getFallbackEngine: function() {
      return 'cookie';
    },

    /**
     * Set an item
     */
    set: function(key, value) {
      $window.localStorage.setItem(key, value);
    },

    /**
     * Get an item
     */
    get: function(key) {
      return $window.localStorage.getItem(key);
    },

    /**
     * Remove an item
     */
    remove: function(key) {
      $window.localStorage.removeItem(key);
    },

    /**
     * Clear items
     */
    clear: function(prefix) {

      //Get regex for prefix and keys
      let prefixRegex = prefix ? new RegExp('^' + prefix) : null;
      let keys = Object.keys($window.localStorage);

      //Loop keys
      for (let k = 0; k < keys.length; k++) {
        if (!prefix || prefixRegex.test(keys[k])) {
          $window.localStorage.removeItem(keys[k]);
        }
      }
    },
  };
});
