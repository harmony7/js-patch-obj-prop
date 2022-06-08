import * as assert from "assert";
import { monkeyPatchProp } from "../src";

describe("example usages in README", function() {
  it("getter", function() {
    const obj = {
      foo: 'bar',
    };

    // Replace with a getter
    monkeyPatchProp(obj, 'foo', {
      get() {
        return 'baz';
      }
    });

    assert.strictEqual(obj.foo, 'baz');

    // Replace with a getter, and get a reference to the original getter
    let called = false;
    monkeyPatchProp(obj, 'foo', {
      get(origGetter) {
        called = true;
        return origGetter();
      }
    });

    assert.strictEqual(obj.foo, 'baz');
    assert.ok(called);
  });

  it("setter", function() {
    const obj = {
      foo: 'bar',
    };

    // Replace with a setter
    let x = null;
    monkeyPatchProp(obj, 'foo', {
      set(value) {
        x = value;
      }
    });

    obj.foo = 'baz';
    assert.strictEqual(x, 'baz');
    assert.strictEqual(obj.foo, 'bar');

    // Replace with a setter, and get a reference to the original setter
    let called = false;
    monkeyPatchProp(obj, 'foo', {
      set(value, origSetter) {
        called = true;
        return origSetter(value);
      }
    });

    obj.foo = 'baz';
    assert.strictEqual(obj.foo, 'bar');
    assert.ok(called);
  });
});

