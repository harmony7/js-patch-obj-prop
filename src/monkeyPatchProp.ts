export class MonkeyPatchError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

type Getter<TValue> = () => TValue;
type Setter<TValue> = (value: TValue) => void;

type MonkeyPatchPropParams<TValue, TObj> = {
  get?: (this: TObj, origGetter: Getter<TValue>) => TValue;
  set?: (this: TObj, value: TValue, origSetter: Setter<TValue>) => void;
};

export function monkeyPatchProp<
  TValue,
  TObj = any
>(
  obj: TObj,
  key: PropertyKey,
  params: MonkeyPatchPropParams<TValue, TObj>
) {

  let desc;
  // look for the key on the prototype chain, starting with obj
  for (let o = obj; o != Object.prototype && o != null; o = Object.getPrototypeOf(o)) {
    desc = Object.getOwnPropertyDescriptor(o, key);
    if(desc != null) {
      break;
    }
  }

  // if not exist or not configurable then we bail
  if(desc == null || !desc.configurable) {
    throw new MonkeyPatchError();
  }

  let setter: Setter<TValue>;
  let getter: Getter<TValue>;

  if(desc.get == null && desc.set == null) {
    // If this does not have getter or setter
    // then it means it's a prop that is a
    // direct value.

    // Turn it into a prop with a getter/setter
    // Initialize backing value with the current value
    let _value: TValue = desc.value;
    setter = (value) => { _value = value; };
    getter = () => { return _value; }
  } else {
    // This has a getter or setter, so it's a prop that is defined by
    // accessors.
    if(desc.get != null) {
      getter = desc.get.bind(obj);
    } else {
      getter = () => {
        throw new MonkeyPatchError('Original object has no get() accessor.');
      };
    }
    if(desc.set != null) {
      setter = desc.set.bind(obj);
    } else {
      setter = () => {
        throw new MonkeyPatchError('Original object has no set() accessor.');
      };
    }
  }

  // Replace the prop
  Object.defineProperty(obj, key, {
    get: () => {
      if(params.get == null) {
        return getter();
      }
      return params.get.call(obj, getter);
    },
    set: (value: TValue) => {
      if(params.set == null) {
        setter(value);
        return;
      }
      params.set.call(obj, value, setter);
    }
  });

}
