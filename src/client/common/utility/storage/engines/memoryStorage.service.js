
/**
 * Module definition and dependencies
 */
angular.module('Utility.Storage.Engines.MemoryStorage.Service', [])

/**
 * Memory storage engine service
 */
.factory('MemoryStorage', function MemoryStorage() {

  /**
   * Store
   */
  var memoryStore = {};

  /**
   * Storage engine interface
   */
  return {

    /**
     * Check if supported
     */
    isSupported: function() {
      return true;
    },

    /**
     * Set an item
     */
    set: function(key, value) {
      memoryStore[key] = value;
    },

    /**
     * Get an item
     */
    get: function(key) {
      if (typeof memoryStore[key] === 'undefined') {
        return null;
      }
      return memoryStore[key];
    },

    /**
     * Remove an item
     */
    remove: function(key) {
      if (typeof memoryStore[key] !== 'undefined') {
        delete memoryStore[key];
      }
    },

    /**
     * Clear items
     */
    clear: function(prefix) {

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
