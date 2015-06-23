
/**
 * Specifications
 */
describe('Storage', function() {

	//Load module and service
	beforeEach(module('Utility.Storage.Engines.Storage.Service'));

	//Inject Storage
	var Storage;
	beforeEach(inject(function(_Storage_) {
		Storage = _Storage_;
	}));

  /**
   * Interface
   */
	describe('interface', function() {
		it('should have a setter', function() {
			expect(typeof Storage.set).toBe('function');
		});
    it('should have a getter', function() {
			expect(typeof Storage.get).toBe('function');
		});
    it('should have a remover', function() {
			expect(typeof Storage.remove).toBe('function');
		});
    it('should have a clearer', function() {
			expect(typeof Storage.clear).toBe('function');
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
			Storage.set(testKey, testValue);
			var storedValue = Storage.get(testKey);
			expect(storedValue).toBe(testValue);
			expect(typeof storedValue).toBe(typeof testValue);
		});

		/**
		 * Overriding values
		 */
		it('should override values set with the same key', function() {
			Storage.set(testKey, 'a');
			Storage.set(testKey, 'b');
			Storage.set(testKey, 'c');
			var storedValue = Storage.get(testKey);
			expect(storedValue).toBe('c');
		});

		/**
		 * Integer values
		 */
		it('should be able to store integer values', function() {
			var testValues = [1, -1, 0];
			for (var i = 0; i < testValues.length; i++) {
				Storage.set(testKey, testValues[i]);
				var storedValue = Storage.get(testKey);
				expect(storedValue).toBe(testValues[i]);
				expect(typeof storedValue).toBe(typeof testValues[i]);
			}
		});

		/**
		 * Float values
		 */
		it('should be able to store float values', function() {
			var testValues = [1.234, -1.234, 0.0];
			for (var i = 0; i < testValues.length; i++) {
				Storage.set(testKey, testValues[i]);
				var storedValue = Storage.get(testKey);
				expect(storedValue).toBe(testValues[i]);
				expect(typeof storedValue).toBe(typeof testValues[i]);
			}
		});

		/**
		 * Undefined/null values
		 */
		it('should return null for undefined and null values', function() {
			var testValues = [undefined, null];
			for (var i = 0; i < testValues.length; i++) {
				Storage.set(testKey, testValues[i]);
				var storedValue = Storage.get(testKey);
				expect(storedValue).toBeNull();
			}
		});

		/**
		 * Arrays
		 */
		it('should be able to store arrays', function() {
			var testValue = ['a', 1, 1.234, null];
			Storage.set(testKey, testValue);
			var storedValue = Storage.get(testKey);
			expect(storedValue).toEqual(testValue);
			for (var i = 0; i < testValue.length; i++) {
				expect(storedValue).toContain(testValue[i]);
			}
		});

		/**
		 * Nested arrays
		 */
		it('should be able to store nested arrays', function() {
			var testValue = ['a', 1, ['b', 2, 3.456]];
			Storage.set(testKey, testValue);
			var storedValue = Storage.get(testKey);
			expect(storedValue).toEqual(testValue);
			expect(storedValue[2]).toEqual(testValue[2]);
			for (var i = 0; i < testValue[2].length; i++) {
				expect(storedValue[2]).toContain(testValue[2][i]);
			}
		});

		/**
		 * Object values
		 */
		it('should be able to store objects', function() {
			var testValue = {
				a: 'a',
				b: 1,
				c: 1.234,
				d: null,
				e: {
					f: 'b',
					g: 2,
					h: ['c', 3, 3.456, null]
				}
			};
			Storage.set(testKey, testValue);
			var storedValue = Storage.get(testKey);
			expect(storedValue).toEqual(testValue);
			expect(typeof storedValue).toBe(typeof testValue);
		});
	});
});
