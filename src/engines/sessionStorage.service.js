
/**
 * Module definition and dependencies
 */
angular.module('Storage.SessionStorage.Service', [])

/**
 * Session storage engine service
 */
.factory('$sessionStorage', function $sessionStorage($window) {

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

      //Try session storage
      try {
        $window.sessionStorage.setItem(key, '');
        $window.sessionStorage.removeItem(key);
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
      return 'memory';
    },

    /**
     * Set an item
     */
    set: function(key, value) {
      $window.sessionStorage.setItem(key, value);
    },

    /**
     * Get an item
     */
    get: function(key) {
      return $window.sessionStorage.getItem(key);
    },

    /**
     * Remove an item
     */
    remove: function(key) {
      $window.sessionStorage.removeItem(key);
    },

    /**
     * Clear items
     */
    clear: function(prefix) {

      //Get regex for prefix and keys
      let prefixRegex = prefix ? new RegExp('^' + prefix) : null;
      let keys = Object.keys($window.sessionStorage);

      //Loop keys
      for (let k = 0; k < keys.length; k++) {
        if (!prefix || prefixRegex.test(keys[k])) {
          $window.sessionStorage.removeItem(keys[k]);
        }
      }
    },
  };
});
