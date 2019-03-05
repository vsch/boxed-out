# boxed-out

[![experimental](https://badges.github.io/stability-badges/dist/experimental.svg)](https://github.com/badges/stability-badges)

Small utility library wrapping plain `Array` or `Object` to extend with each, map, filter,
reduce using indeterminate ordering, left to right, right to left that operate on own properties
of array or object.

To simulate break return `BREAK` or `RETURN`, to simulate `return` return `BREAK(value)` or
`RETURN(value)` both are equivalent but the one communicating the right intent should be used.

#### boxOut(array|object)

```javascript
const boxOut = require('boxed-immutable').boxOut;
const boxedOut = boxOut(arg);
```

Used to construct a boxed-out object or array that has the extra prototype functions for
iterating over own properties. Does not provide immutability or modification tracking, only
prototype convenience functions. This adds ability to use the same functions on regular objects
and arrays. It also enables using filter, map, reduce, etc to be used on Object properties and
on Array properties, not just integer indexed properties.

| argument | default | Description                                                 |
|:---------|:--------|:------------------------------------------------------------|
| arg      | none    | object or array to enhance with **boxed-out** proxy methods |

Functions available on boxed-out argument:

| Method             | Object Arg                     | Array Arg                     | Description                                                                                                                                                     |
|:-------------------|:-------------------------------|:------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `filteredProps`    | yes                            | yes                           | property extraction to new object/array using filter value, array, object or function, this is copyFiltered applied to a new instance with `this` as the source |
| `filterProps`      | yes                            | yes                           | `.filter` equivalent for objects, takes same argument: callback(value,key,object) and thisArg                                                                   |
| `mappedProps`      | yes                            | yes                           | object property value mapping, similar to `map` for arrays except builds object with original property name and mapped value                                    |
| `mapProps`         | yes                            | yes                           | builds an array of values returned from callback applied to array/object properties, order of property iteration given by `each`                                |
| `copyFiltered`     | yes                            | yes                           | copying of selected properties, filter provides inclusion predicate                                                                                             |
| `copyFilteredNot`  | yes                            | yes                           | copying of not selected properties. ie. filter provides exclusion predicate                                                                                     |
| `eachProp`         | yes                            | yes                           | `forEach` like for object and array properties. Order of property iteration not guaranteed.                                                                     |
| `each`             | yes                            | yes                           | `forEach` like for objects with Array index type properties iterated first (in increasing order) then non-indexed properties sorted by `sort()`                 |
| `eachRight`        | yes                            | yes                           | `each` but properties iterated in reverse order                                                                                                                 |
| `cloneArrayObject` | yes                            | yes                           | shallow copy array/object, but array's non-indexed properties are also copied                                                                                   |
| `deleteItems`      | no                             | yes                           | delete array simple (not object or array, etc) items by value, given in array or object properties                                                              |
| `arrayLength`      | yes                            | yes                           | equivalent to array `length` property for objects. Will find the maximum array index property of an object, for arrays it is just `length`                      |
| `deepClone`        | yes                            | yes                           | deepClone array/object, with argument for number of levels                                                                                                      |
| `mergeDefaults`    | yes                            | yes                           | mergeDefaults, with options for levels, whether current object is immutable and whether to deepClone source when copying its values                             |
| `someProps`        | yes                            | yes                           | `some` equivalent for object properties                                                                                                                         |
| `everyProp`        | yes                            | yes                           | `every` equivalent for object properties                                                                                                                        |
| `reduceProps`      | yes                            | yes                           | `reduce` equivalent for object properties, order of iteration not guaranteed, same as `eachProp`                                                                |
| `reducePropsLeft`  | yes                            | yes                           | `reduce` equivalent with order given by `each`                                                                                                                  |
| `reducePropsRight` | yes                            | yes                           | `reduceRight` equivalent for object properties                                                                                                                  |
| `hasOwnProperties` | yes                            | yes                           | returns `true` if object array has own properties, optionally takes an argument for properties to be ignored                                                    |
| `filter`           | synonym for `filterProps`      | `Array.prototype.filter`      | corresponding method for object properties                                                                                                                      |
| `map`              | synonym for `mapProps`         | `Array.prototype.map`         | corresponding method for object properties                                                                                                                      |
| `forEach`          | synonym for `each`             | `Array.prototype.forEach`     | corresponding method for object properties                                                                                                                      |
| `some`             | synonym for `someProps`        | `Array.prototype.some`        | corresponding method for object properties                                                                                                                      |
| `every`            | synonym for `everyProp`        | `Array.prototype.every`       | corresponding method for object properties                                                                                                                      |
| `reduce`           | synonym for `reducePropsLeft`  | `Array.prototype.reduce`      | corresponding method for object properties                                                                                                                      |
| `reduceRight`      | synonym for `reducePropsRight` | `Array.prototype.reduceRight` | corresponding method for object properties                                                                                                                      |


### Iteration over properties

The iteration functions all implement a mechanism for the `callback` function to break out of
the loop similar to how it can be done in a regular loop. Lambda iteration is a `PITA` for some
applications without the ability to cut the iteration short.

To break out of an iteration the callback can return `BREAK` a value defined in the
`boxedImmutable.util` library. `eachProp`, `each` and `eachRight` also have a mechanism to return
a value which the callback can set by returning `BREAK(arg)`. With these two mechanisms it is
possible to break out of an iteration and have these iterators return a value the same way it
can be done in regular looping constructs.

To prepare a default return value before invoking a callback which can potentially use the
simple `BREAK` return value, you can use `BREAK.setDefault(arg)`, returning `BREAK` will then be
equivalent to returning `BREAK(arg)`.

Some iterators define the default value that will be returned if a callback `BREAKs` our of a
loop or ignore the value returned through BREAK where their return value is determined by their
operation.

[React]: https://reactjs.org
[Redux]: https://redux.js.org

## Install

Use [npm](https://npmjs.com/) to install.

```
npm install boxed-out --save
```

## Usage

[![NPM](https://nodei.co/npm/boxed-out.png)](https://www.npmjs.com/package/boxed-out)

## License

MIT, see [LICENSE.md](https://github.com/vsch/boxed-out/raw/master/LICENSE.md) for details.

