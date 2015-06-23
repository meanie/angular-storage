
/**
 * Specifications
 */
describe('SessionStorage', function() {

	//Load module and service
	beforeEach(module('Utility.Storage.Engines.SessionStorage.Service'));

	//Inject SessionStorage
	var SessionStorage;
	beforeEach(inject(function(_SessionStorage_) {
		SessionStorage = _SessionStorage_;
	}));

  /**
   * Interface
   */
	describe('interface', function() {
		it('should have a setter', function() {
			expect(typeof SessionStorage.set).toBe('function');
		});
    it('should have a getter', function() {
			expect(typeof SessionStorage.get).toBe('function');
		});
    it('should have a remover', function() {
			expect(typeof SessionStorage.remove).toBe('function');
		});
    it('should have a clearer', function() {
			expect(typeof SessionStorage.clear).toBe('function');
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
			SessionStorage.set(testKey, testValue);
			var storedValue = SessionStorage.get(testKey);
			expect(storedValue).toBe(testValue);
			expect(typeof storedValue).toBe(typeof testValue);
		});

		/**
		 * Overriding values
		 */
		it('should override values set with the same key', function() {
			SessionStorage.set(testKey, 'a');
			SessionStorage.set(testKey, 'b');
			SessionStorage.set(testKey, 'c');
			var storedValue = SessionStorage.get(testKey);
			expect(storedValue).toBe('c');
		});
	});
});
