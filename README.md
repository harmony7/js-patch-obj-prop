# patch-obj-prop

Patch an object instance's property at runtime with a getter and/or setter.

```javascript
import { monkeyPatchProp } from "patch-obj-prop";

const obj = {
  foo: 'bar',
};

// Replace with a getter
monkeyPatchProp(obj, 'foo', {
  get() {
    return 'baz';
  }
});

console.log(obj.foo); // baz

// Replace with a getter, and get a reference to the original getter
// Note that the "original" getter at this point is the one that was
// set in the above call.
let called = false;
monkeyPatchProp(obj, 'foo', {
  get(origGetter) {
    called = true;
    return origGetter();
  }
});

console.log(obj.foo); // baz
console.log(called); // true
```

Setters work in a very similar way:


```javascript
import { monkeyPatchProp } from "patch-obj-prop";

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
console.log(x); // baz
console.log(obj.foo); // bar

// Replace with a setter, and get a reference to the original setter
// Note that the "original" setter at this point is the one that was
// set in the above call.
let called = false;
monkeyPatchProp(obj, 'foo', {
  set(value, origSetter) {
    called = true;
    return origSetter(value);
  }
});

obj.foo = 'baz';
console.log(obj.foo); // bar
console.log(called); // true
```

### License

[MIT](./LICENSE.md)
