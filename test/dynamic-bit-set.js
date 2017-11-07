/**
 * Mnemonist DynamicBitSet Unit Tests
 * ===================================
 */
var assert = require('assert'),
    DynamicBitSet = require('../dynamic-bit-set.js'),
    obliterator = require('obliterator');

describe('DynamicBitSet', function() {

  it('should be possible to create a dynamic bit set.', function() {
    var set = new DynamicBitSet(74);

    assert.strictEqual(set.length, 74);
    assert.strictEqual(set.array.length, 3);
    assert.strictEqual(set.size, 0);
  });

  it('should be possible to set bits.', function() {
    var set = new DynamicBitSet(17);

    set.set(13);

    assert.strictEqual(set.size, 1);
    assert.strictEqual(set.get(13), 1);
    assert.strictEqual(set.test(13), true);
    assert.strictEqual(set.get(2), 0);
    assert.strictEqual(set.test(2), false);

    set.set(2);
    assert.strictEqual(set.size, 2);

    set.set(2, 0);
    assert.strictEqual(set.size, 1);
    assert.strictEqual(set.test(2), false);

    set.flip(3);
    assert.strictEqual(set.size, 2);
    assert.strictEqual(set.test(3), true);

    set.flip(3);
    assert.strictEqual(set.size, 1);
    assert.strictEqual(set.test(3), false);
  });

  it('should be possible to reset bits.', function() {
    var set = new DynamicBitSet(4);

    set.set(0);
    set.set(1);

    set.reset(0);
    set.reset(1);

    assert.strictEqual(set.get(0), 0);
    assert.strictEqual(set.get(1), 0);
  });

  it('should be possible to use the rank operator.', function() {
    var set = new DynamicBitSet(8010); // Using 8010 not to have a perfect 32bits seq

    var results = [
      [0, 0],
      [2000, 20],
      [4000, 40],
      [6000, 60],
      [8000, 80]
    ];

    var i, j;

    for (i = 0; i < 8000; i += 100)
      set.set(i);

    for (i = j = 0; i <= 8000; i += 8000 / 4, j++)
      assert.strictEqual(set.rank(i), results[j][1]);

    set = new DynamicBitSet(2);

    set.set(1);

    assert.strictEqual(set.rank(0), 0);
    assert.strictEqual(set.rank(1), 0);
    assert.strictEqual(set.rank(2), 1);
  });

  it('should be possible to use the select operator.', function() {
    var set = new DynamicBitSet(11);
    set.set(1);
    set.set(3);
    set.set(4);
    set.set(5);
    set.set(9);
    set.set(10);

    var zeros = set.rank(set.length);
    assert.strictEqual(zeros, 6);

    var results = [null, 1, 3, 4, 5, 9, 10];

    for (var i = 1; i <= zeros; i++)
      assert.strictEqual(set.select(i), results[i]);
  });

  it('should be possible to iterate over bits.', function() {
    var set = new DynamicBitSet(10);

    set.set(2);
    set.set(8);
    set.set(9);

    var array = [0, 0, 1, 0, 0, 0, 0, 0, 1, 1],
        i = 0;

    set.forEach(function(bit, j) {
      assert.strictEqual(bit, array[j]);
      assert.strictEqual(j, i++);
    });

    var indexedArray = array.map(function(bit, j) {
      return [j, bit];
    });

    assert.deepEqual(obliterator.consume(set.values()), array);
    assert.deepEqual(obliterator.consume(set.entries()), indexedArray);
  });

  it('should return undefined on out-of-bound values.', function() {
    var set = new DynamicBitSet(5);

    assert.strictEqual(set.get(17), undefined);
    assert.strictEqual(set.test(17), false);
  });
});