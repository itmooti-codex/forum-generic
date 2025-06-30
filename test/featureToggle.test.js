import test from 'node:test';
import assert from 'node:assert/strict';

import { isFeaturePostEnabled } from '../src/utils/featureToggle.js';

test('isFeaturePostEnabled reflects checkbox state', () => {
  global.document = { getElementById: () => ({ checked: true }) };
  assert.strictEqual(isFeaturePostEnabled(), true);

  global.document = { getElementById: () => ({ checked: false }) };
  assert.strictEqual(isFeaturePostEnabled(), false);

  global.document = { getElementById: () => null };
  assert.strictEqual(isFeaturePostEnabled(), false);

  delete global.document;
});
