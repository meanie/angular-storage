
/**
 * Specifications
 */
describe('MemoryStorage', function() {

	//Load module and service
	beforeEach(module('Utility.Storage.Engines.MemoryStorage.Service'));

	//Inject MemoryStorage
	var MemoryStorage;
	beforeEach(inject(function(_MemoryStorage_) {
		MemoryStorage = _MemoryStorage_;
	}));

  /**
   * Interface
   */
	describe('interface', function() {
		it('should have a setter', function() {
			expect(typeof MemoryStorage.set).toBe('function');
		});
    it('should have a getter', function() {
			expect(typeof MemoryStorage.get).toBe('function');
		});
    it('should have a remover', function() {
			expect(typeof MemoryStorage.remove).toBe('function');
		});
    it('should have a clearer', function() {
			expect(typeof MemoryStorage.clear).toBe('function');
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
			MemoryStorage.set(testKey, testValue);
			var storedValue = MemoryStorage.get(testKey);
			expect(storedValue).toBe(testValue);
			expect(typeof storedValue).toBe(typeof testValue);
		});

		/**
		 * Overriding values
		 */
		it('should override values set with the same key', function() {
			MemoryStorage.set(testKey, 'a');
			MemoryStorage.set(testKey, 'b');
			MemoryStorage.set(testKey, 'c');
			var storedValue = MemoryStorage.get(testKey);
			expect(storedValue).toBe('c');
		});
	});
});
