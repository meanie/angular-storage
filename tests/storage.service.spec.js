/* global inject */

/**
 * Specifications
 */
describe('Storage', function() {

  //Load module and service
  beforeEach(module('Storage.Service'));
  beforeEach(module('ngCookies'));

  //Inject storage
  let $storage;
  beforeEach(inject(function(_$storage_) {
    $storage = _$storage_;
  }));

  //Storage engines
  let engines = ['memory', 'session', 'local', 'cookie'];

  //Loop each engine
  for (let i = 0; i < engines.length; i++) {

    //Get engine
    let engine = engines[i];
    let StorageEngine;
    beforeEach(function() {
      StorageEngine = $storage[engine];
    });

    /**
     * Test each engine
     */
    describe('engine ' + engine, function() {

      /**
      * Private interface
      */
      describe('private interface', function() {
        it('should have a setter', function() {
          expect(typeof StorageEngine.engine.set).toBe('function');
        });
        it('should have a getter', function() {
          expect(typeof StorageEngine.engine.get).toBe('function');
        });
        it('should have a remover', function() {
          expect(typeof StorageEngine.engine.remove).toBe('function');
        });
        it('should have a clearer', function() {
          expect(typeof StorageEngine.engine.clear).toBe('function');
        });
      });

      /**
       * Public interface
       */
      describe('public interface', function() {
        it('should have a setter', function() {
          expect(typeof StorageEngine.set).toBe('function');
        });
        it('should have a getter', function() {
          expect(typeof StorageEngine.get).toBe('function');
        });
        it('should have a remover', function() {
          expect(typeof StorageEngine.remove).toBe('function');
        });
        it('should have a clearer', function() {
          expect(typeof StorageEngine.clear).toBe('function');
        });
      });

      /**
       * Storage
       */
      describe('storage', function() {

        //Set test key
        let testKey;
        beforeEach(function() {
          testKey = 'test';
        });

        /**
         * String values
         */
        it('should be able to store string values', function() {
          let testValue = 'test';
          StorageEngine.set(testKey, testValue);
          let storedValue = StorageEngine.get(testKey);
          expect(storedValue).toBe(testValue);
          expect(typeof storedValue).toBe(typeof testValue);
        });

        /**
         * Overriding values
         */
        it('should override values set with the same key', function() {
          StorageEngine.set(testKey, 'a');
          StorageEngine.set(testKey, 'b');
          StorageEngine.set(testKey, 'c');
          let storedValue = StorageEngine.get(testKey);
          expect(storedValue).toBe('c');
        });

        /**
         * Integer values
         */
        it('should be able to store integer values', function() {
          let testValues = [1, -1, 0];
          for (let i = 0; i < testValues.length; i++) {
            StorageEngine.set(testKey, testValues[i]);
            let storedValue = StorageEngine.get(testKey);
            expect(storedValue).toBe(testValues[i]);
            expect(typeof storedValue).toBe(typeof testValues[i]);
          }
        });

        /**
         * Boolean values
         */
        it('should be able to store boolean values', function() {
          let testValues = [true, false];
          for (let i = 0; i < testValues.length; i++) {
            StorageEngine.set(testKey, testValues[i]);
            let storedValue = StorageEngine.get(testKey);
            expect(storedValue).toBe(testValues[i]);
            expect(typeof storedValue).toBe(typeof testValues[i]);
          }
        });

        /**
         * Float values
         */
        it('should be able to store float values', function() {
          let testValues = [1.234, -1.234, 0.0];
          for (let i = 0; i < testValues.length; i++) {
            StorageEngine.set(testKey, testValues[i]);
            let storedValue = StorageEngine.get(testKey);
            expect(storedValue).toBe(testValues[i]);
            expect(typeof storedValue).toBe(typeof testValues[i]);
          }
        });

        /**
         * Undefined/null values
         */
        it('should return null for undefined and null values', function() {
          let testValues = [undefined, null];
          for (let i = 0; i < testValues.length; i++) {
            StorageEngine.set(testKey, testValues[i]);
            let storedValue = StorageEngine.get(testKey);
            expect(storedValue).toBeNull();
          }
        });

        /**
         * Arrays
         */
        it('should be able to store arrays', function() {
          let testValue = ['a', 1, 1.234, null];
          StorageEngine.set(testKey, testValue);
          let storedValue = StorageEngine.get(testKey);
          expect(storedValue).toEqual(testValue);
          for (let i = 0; i < testValue.length; i++) {
            expect(storedValue).toContain(testValue[i]);
          }
        });

        /**
         * Nested arrays
         */
        it('should be able to store nested arrays', function() {
          let testValue = ['a', 1, ['b', 2, 3.456]];
          StorageEngine.set(testKey, testValue);
          let storedValue = StorageEngine.get(testKey);
          expect(storedValue).toEqual(testValue);
          expect(storedValue[2]).toEqual(testValue[2]);
          for (let i = 0; i < testValue[2].length; i++) {
            expect(storedValue[2]).toContain(testValue[2][i]);
          }
        });

        /**
         * Object values
         */
        it('should be able to store objects', function() {
          let testValue = {
            a: 'a',
            b: 1,
            c: 1.234,
            d: null,
            e: {
              f: 'b',
              g: 2,
              h: ['c', 3, 3.456, null],
            },
          };
          StorageEngine.set(testKey, testValue);
          let storedValue = StorageEngine.get(testKey);
          expect(storedValue).toEqual(testValue);
          expect(typeof storedValue).toBe(typeof testValue);
        });
      });

      /**
       * Removal
       */
      describe('removal', function() {

        //Set test key
        let testKey;
        beforeEach(function() {
          testKey = 'test';
        });

        /**
         * Removal
         */
        it('should be able to remove stored values of all types', function() {
          let testValues = ['a', 1, 1.234, null, {a: 'a'}, ['a', 1]];
          for (let i = 0; i < testValues.length; i++) {
            StorageEngine.set(testKey, testValues[i]);
            StorageEngine.remove(testKey);
            let storedValue = StorageEngine.get(testKey);
            expect(storedValue).toBeNull();
          }
        });
      });

      /**
       * Clearing
       */
      describe('clearing', function() {

        /**
         * All values
         */
        it('should clear all set values', function() {
          let testValue = 'test';
          let testKeys = ['a', 'b', 'c'];
          let i;
          for (i = 0; i < testKeys.length; i++) {
            StorageEngine.set(testKeys[i], testValue);
          }
          StorageEngine.clear();
          for (i = 0; i < testKeys.length; i++) {
            let storedValue = StorageEngine.get(testKeys[i]);
            expect(storedValue).toBeNull();
          }
        });

        /**
         * Prefixed values
         */
        it('should clear prefixed values', function() {
          let testValue = 'test';
          let testKeys = ['pre.a', 'pre.b', 'pre.c'];
          let i;
          for (i = 0; i < testKeys.length; i++) {
            StorageEngine.set(testKeys[i], testValue);
          }
          StorageEngine.clear('pre.');
          for (i = 0; i < testKeys.length; i++) {
            let storedValue = StorageEngine.get(testKeys[i]);
            expect(storedValue).toBeNull();
          }
        });

        /**
         * Prefixed values
         */
        it('should only clear prefixed values', function() {
          let testValue = 'test';
          let testKeys = ['pre.a', 'pre.b', 'pre.c', 'a', 'b', 'c'];
          let i;
          for (i = 0; i < testKeys.length; i++) {
            StorageEngine.set(testKeys[i], testValue);
          }
          StorageEngine.clear('pre.');
          for (i = 0; i < testKeys.length; i++) {
            let storedValue = StorageEngine.get(testKeys[i]);
            if (testKeys[i].length === 1) {
              expect(storedValue).toBe(testValue);
            }
            else {
              expect(storedValue).toBeNull();
            }
          }
        });
      });
    });
  }
});
