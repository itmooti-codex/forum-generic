import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { safeArray, timeAgo, parseDate } from '../src/utils/formatter.js';
import { mergeObjects, mergeLists } from '../src/utils/merge.js';
import { removeRawById, findRawById } from '../src/utils/posts.js';

// Tests for safeArray

describe('safeArray', () => {
  it('returns the original array when an array is provided', () => {
    const arr = [1, 2, 3];
    assert.deepEqual(safeArray(arr), arr);
  });

  it('returns an empty array when a non-array is provided', () => {
    assert.deepEqual(safeArray(null), []);
    assert.deepEqual(safeArray(undefined), []);
    assert.deepEqual(safeArray(5), []);
  });
});

// Tests for parseDate

describe('parseDate', () => {
  it('parses numeric unix timestamps (in seconds)', () => {
    const ts = 1609459200; // 2021-01-01T00:00:00Z
    const d = parseDate(ts);
    assert.equal(d.getUTCFullYear(), 2021);
    assert.equal(d.getUTCMonth(), 0); // January
    assert.equal(d.getUTCDate(), 1);
  });

  it('parses ISO date strings', () => {
    const iso = '2021-06-01T12:34:56Z';
    const d = parseDate(iso);
    // toISOString always outputs milliseconds
    assert.equal(d.toISOString(), '2021-06-01T12:34:56.000Z');
  });

  it('returns null for falsy values', () => {
    assert.equal(parseDate(''), null);
    assert.equal(parseDate(0), null);
  });
});

// Tests for timeAgo

describe('timeAgo', () => {
  let originalNow;
  beforeEach(() => {
    originalNow = Date.now;
  });
  afterEach(() => {
    Date.now = originalNow;
  });

  it('returns seconds ago', () => {
    const now = Date.UTC(2021, 0, 1, 0, 0, 30); // 30 seconds past the minute
    Date.now = () => now;
    const date = new Date(now - 25 * 1000); // 25 seconds ago
    assert.equal(timeAgo(date), '25s ago');
  });

  it('returns minutes ago', () => {
    const now = Date.UTC(2021, 0, 1, 0, 2, 0); // 2 minutes
    Date.now = () => now;
    const date = new Date(now - 65 * 1000); // 1m 5s ago
    assert.equal(timeAgo(date), '1m ago');
  });
});

// Tests for mergeObjects and mergeLists

describe('mergeObjects and mergeLists', () => {
  it('deep merges objects and arrays by id', () => {
    const oldObj = {
      name: 'old',
      details: { count: 1 },
      list: [{ id: 1, val: 1 }]
    };
    const newObj = {
      details: { extra: 2 },
      list: [{ id: 1, val: 2 }, { id: 2, val: 3 }]
    };
    const merged = mergeObjects(oldObj, newObj);
    assert.deepEqual(merged, {
      name: 'old',
      details: { count: 1, extra: 2 },
      list: [
        { id: 1, val: 2 },
        { id: 2, val: 3 }
      ]
    });
  });

  it('merges lists standalone', () => {
    const result = mergeLists(
      [{ id: 1, a: 1 }],
      [{ id: 1, a: 2 }, { id: 2, a: 3 }]
    );
    assert.deepEqual(result, [
      { id: 1, a: 2 },
      { id: 2, a: 3 }
    ]);
  });
});

// Tests for removeRawById and findRawById

describe('posts helpers', () => {
  it('removes raw objects by id', () => {
    const arr = [{ id: 1 }, { id: 2 }];
    const removed = removeRawById(arr, 1);
    assert.equal(removed, true);
    assert.deepEqual(arr, [{ id: 2 }]);
  });

  it('returns false if id not found', () => {
    const arr = [{ id: 1 }];
    const removed = removeRawById(arr, 2);
    assert.equal(removed, false);
    assert.deepEqual(arr, [{ id: 1 }]);
  });

  it('finds raw object by id', () => {
    const arr = [{ id: 1 }, { id: 2 }];
    assert.deepEqual(findRawById(arr, 2), { id: 2 });
    assert.equal(findRawById(arr, 3), null);
  });
});
