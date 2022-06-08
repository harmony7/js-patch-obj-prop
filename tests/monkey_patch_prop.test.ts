import * as assert from "assert";
import { MonkeyPatchError, monkeyPatchProp } from "../src";

describe("monkey-patching properties", function() {
  describe("for literal objects", function() {
    it("dies if you try on a non-existent prop", function () {
      const obj = {};
      assert.throws(() => {
        monkeyPatchProp(obj, 'hoge', {
          get: () => {}
        });
      }, (err) => {
        assert.ok(err instanceof MonkeyPatchError);
        return true;
      });
    });

    describe("getters - value", function() {
      let obj: any;
      beforeEach(function() {
        obj = {
          foo: 'bar',
        };
      });
      it("lets you replace getter on own props", function() {
        monkeyPatchProp(obj, 'foo', {
          get: () => {
            return 'baz';
          }
        });
        assert.strictEqual(obj.foo, 'baz');
      });
      it("Still calls original getter", function() {
        let called = false;
        monkeyPatchProp(obj, 'foo', {
          get: (origGetter) => {
            called = true;
            return origGetter();
          }
        });
        assert.strictEqual(obj.foo, 'bar');
        assert.ok(called);
      });
    });

    describe("getters - accessor", function() {
      let obj: any;
      beforeEach(function() {
        obj = {
          _baz: 'bar',
          get foo() {
            return this._baz;
          },
          set foo(value: string) {
            this._baz = value;
          },
        };
      });
      it("lets you replace getter on own accessor", function() {
        monkeyPatchProp<string>(obj, 'foo', {
          get: () => {
            return 'baz';
          }
        });
        assert.strictEqual(obj.foo, 'baz');
      });
      it("Still calls original getter", function() {
        let called = false;
        monkeyPatchProp(obj, 'foo', {
          get: (origGetter) => {
            called = true;
            return origGetter();
          }
        });
        assert.strictEqual(obj.foo, 'bar');
        assert.ok(called);
      });
    });

    describe("setters - value", function() {
      let obj: any;
      beforeEach(function() {
        obj = {
          foo: 'bar',
        };
      });
      it("lets you replace setter on own props", function() {
        let called = false;
        monkeyPatchProp(obj, 'foo', {
          set: (value, setter) => {
            called = true;
          }
        });
        obj.foo = 'baz';
        assert.strictEqual(obj.foo, 'bar');
        assert.ok(called);
      });
      it("Still calls original setter", function() {
        let called = false;
        monkeyPatchProp(obj, 'foo', {
          set: (value, setter) => {
            called = true;
            setter(value);
          }
        });
        obj.foo = 'baz';
        assert.strictEqual(obj.foo, 'baz');
        assert.ok(called);
      });
    });
    describe("setters - accessor", function() {
      let obj: any;
      beforeEach(function() {
        obj = {
          _baz: 'bar',
          get foo() {
            return this._baz;
          },
          set foo(value: string) {
            this._baz = value;
          },
        }      });
      it("lets you replace setter on own accessor", function() {
        let called = false;
        monkeyPatchProp(obj, 'foo', {
          set: (value, setter) => {
            called = true;
          }
        });
        obj.foo = 'baz';
        assert.strictEqual(obj.foo, 'bar');
        assert.ok(called);
      });
      it("Still calls original setter", function() {
        let called = false;
        monkeyPatchProp(obj, 'foo', {
          set: (value, setter) => {
            called = true;
            setter(value);
          }
        });
        obj.foo = 'baz';
        assert.strictEqual(obj.foo, 'baz');
        assert.ok(called);
      });
    });

  });

  describe("for class objects", function() {
    class Foo {
      foo = 'bar';
    }
    class Foo2 {
      _foo = 'bar';
      get foo() {
        return this._foo;
      }
      set foo(value: string) {
        this._foo = value;
      }
    }
    it("dies if you try on a non-existent field", function () {
      const obj = new Foo();
      assert.throws(() => {
        monkeyPatchProp(obj, 'hoge', {
          get: () => {}
        });
      }, (err) => {
        assert.ok(err instanceof MonkeyPatchError);
        return true;
      });
    });
    describe("getters - fields", function() {
      let obj: Foo;
      beforeEach(function() {
        obj = new Foo();
      });
      it("lets you replace getter on own fields", function() {
        monkeyPatchProp(obj, 'foo', {
          get: () => {
            return 'baz';
          }
        });
        assert.strictEqual(obj.foo, 'baz');
      });
      it("Still calls original getter", function() {
        let called = false;
        monkeyPatchProp(obj, 'foo', {
          get: (origGetter) => {
            called = true;
            return origGetter();
          }
        });
        assert.strictEqual(obj.foo, 'bar');
        assert.ok(called);
      });
    });
    describe("getters - accessor", function() {
      let obj: Foo2;
      beforeEach(function() {
        obj = new Foo2();
      })
      it("lets you replace getter on own accessor", function() {
        monkeyPatchProp(obj, 'foo', {
          get: () => {
            return 'baz';
          }
        });
        assert.strictEqual(obj.foo, 'baz');
      });
      it("Still calls original getter", function() {
        let called = false;
        monkeyPatchProp(obj, 'foo', {
          get: (origGetter) => {
            called = true;
            return origGetter();
          }
        });
        assert.strictEqual(obj.foo, 'bar');
        assert.ok(called);
      });
    });
    describe("setters - value", function() {
      let obj: Foo;
      beforeEach(function() {
        obj = new Foo();
      });
      it("lets you replace setter on own fields", function() {
        let called = false;
        monkeyPatchProp(obj, 'foo', {
          set: (value, setter) => {
            called = true;
          }
        });
        obj.foo = 'baz';
        assert.strictEqual(obj.foo, 'bar');
        assert.ok(called);
      });
      it("Still calls original setter", function() {
        let called = false;
        monkeyPatchProp(obj, 'foo', {
          set: (value, setter) => {
            called = true;
            setter(value);
          }
        });
        obj.foo = 'baz';
        assert.strictEqual(obj.foo, 'baz');
        assert.ok(called);
      });
    });
    describe("setters - accessor", function() {
      let obj: Foo2;
      beforeEach(function() {
        obj = new Foo2();
      });
      it("lets you replace setter on own accessor", function() {
        let called = false;
        monkeyPatchProp(obj, 'foo', {
          set: (value, setter) => {
            called = true;
          }
        });
        obj.foo = 'baz';
        assert.strictEqual(obj.foo, 'bar');
        assert.ok(called);
      });
      it("Still calls original setter", function() {
        let called = false;
        monkeyPatchProp(obj, 'foo', {
          set: (value, setter) => {
            called = true;
            setter(value);
          }
        });
        obj.foo = 'baz';
        assert.strictEqual(obj.foo, 'baz');
        assert.ok(called);
      });
    });
  });
});
