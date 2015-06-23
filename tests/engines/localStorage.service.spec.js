
/**
 * Specifications
 */
describe('LocalStorage', function() {

	//Load module and service
	beforeEach(module('Utility.Storage.Engines.LocalStorage.Service'));

	//Inject LocalStorage
	var LocalStorage;
	beforeEach(inject(function(_LocalStorage_) {
		LocalStorage = _LocalStorage_;
	}));

  /**
   * Interface
   */
	describe('interface', function() {
		it('should have a setter', function() {
			expect(typeof LocalStorage.set).toBe('function');
		});
    it('should have a getter', function() {
			expect(typeof LocalStorage.get).toBe('function');
		});
    it('should have a remover', function() {
			expect(typeof LocalStorage.remove).toBe('function');
		});
    it('should have a clearer', function() {
			expect(typeof LocalStorage.clear).toBe('function');
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
			LocalStorage.set(testKey, testValue);
			var storedValue = LocalStorage.get(testKey);
			expect(storedValue).toBe(testValue);
			expect(typeof storedValue).toBe(typeof testValue);
		});

		/**
		 * Overriding values
		 */
		it('should override values set with the same key', function() {
			LocalStorage.set(testKey, 'a');
			LocalStorage.set(testKey, 'b');
			LocalStorage.set(testKey, 'c');
			var storedValue = LocalStorage.get(testKey);
			expect(storedValue).toBe('c');
		});
	});
});
