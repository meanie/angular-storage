
/**
 * Module definition and dependencies
 */
angular.module('Storage.CookieStorage.Service', [])

/**
 * Cookie storage engine service
 */
.factory('$cookieStorage', function $cookieStorage($injector, $log) {

  //Get cookies service
  let $cookies;
  if ($injector.has('$cookies')) {
    $cookies = $injector.get('$cookies');
  }
  else {
    $log.warn('Cookie storage requires the `ngCookies` module as a dependency');
  }

  /**
   * Storage engine interface
   */
  return {

    /**
     * Check if supported
     */
    isSupported: function() {
      return !!$cookies;
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
      $cookies.put(key, value);
    },

    /**
     * Get an item
     */
    get: function(key) {
      return $cookies.get(key);
    },

    /**
     * Remove an item
     */
    remove: function(key) {
      $cookies.remove(key);
    },

    /**
     * Clear items
     */
    clear: function(prefix) {

      //Get all the cookies and corresponding keys
      let prefixRegex = prefix ? new RegExp('^' + prefix) : null;
      let cookies = $cookies.getAll();
      let keys = cookies ? Object.keys(cookies) : [];

      //Loop keys
      for (let k = 0; k < keys.length; k++) {
        if (!prefix || prefixRegex.test(keys[k])) {
          $cookies.remove(keys[k]);
        }
      }
    },
  };
});
