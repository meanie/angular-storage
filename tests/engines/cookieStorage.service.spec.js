
/**
 * Specifications
 */
describe('CookieStorage', function() {

	//Load module and service
	beforeEach(module('ngCookies'));
	beforeEach(module('Utility.Storage.Engines.CookieStorage.Service'));

	//Inject CookieStorage
	var CookieStorage;
	beforeEach(inject(function(_CookieStorage_) {
		CookieStorage = _CookieStorage_;
	}));

  /**
   * Interface
   */
	describe('interface', function() {
		it('should have a setter', function() {
			expect(typeof CookieStorage.set).toBe('function');
		});
    it('should have a getter', function() {
			expect(typeof CookieStorage.get).toBe('function');
		});
    it('should have a remover', function() {
			expect(typeof CookieStorage.remove).toBe('function');
		});
    it('should have a clearer', function() {
			expect(typeof CookieStorage.clear).toBe('function');
		});
	});

	/**
	 * Storing
	 */
	describe('storing functionality', function() {

		//Set test key
		var testKey;
	  beforeEach(function() {
	    testKey = 'test';
	  });

		/**
		 * String values
		 */
		it('should be able to store string values', function() {
			var testValue = 'test';
			CookieStorage.set(testKey, testValue);
			var storedValue = CookieStorage.get(testKey);
			expect(storedValue).toBe(testValue);
			expect(typeof storedValue).toBe(typeof testValue);
		});

		/**
		 * Overriding values
		 */
		it('should override values set with the same key', function() {
			CookieStorage.set(testKey, 'a');
			CookieStorage.set(testKey, 'b');
			CookieStorage.set(testKey, 'c');
			var storedValue = CookieStorage.get(testKey);
			expect(storedValue).toBe('c');
		});
	});
});
