
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
	 * Functionality
	 */
	describe('functionality', function() {

	
	});
});
