import assert from "node:assert/strict";
import test from "node:test";

import { getProxyUrl } from "./utils.js";

test("getProxyUrl ignores a missing optional image URL", () => {
  const originalError = console.error;
  const errors = [];
  console.error = (...args) => errors.push(args);

  try {
    assert.equal(getProxyUrl(undefined), undefined);
    assert.deepEqual(errors, []);
  } finally {
    console.error = originalError;
  }
});
