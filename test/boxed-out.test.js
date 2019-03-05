"use strict";

const jestEach = require('jest-each').default;
const utilTypeFuncs = require('util-type-funcs');
const objEachBreak = require('obj-each-break');
const testUtil = require('./testUtil');
const boxOut = require('boxed-out');
const $_ = boxOut;

const isObjectLike = utilTypeFuncs.isObjectLike;
const isNullOrUndefined = utilTypeFuncs.isNullOrUndefined;
const isArray = utilTypeFuncs.isArray;
const toArrayIndex = utilTypeFuncs.toArrayIndex;
const isArrayIndex = utilTypeFuncs.isArrayIndex;
const isValid = utilTypeFuncs.isValid;
const isFunction = utilTypeFuncs.isFunction;
const isString = utilTypeFuncs.isString;
const isNumeric = utilTypeFuncs.isNumeric;
const toNumber = utilTypeFuncs.toNumber;

const BREAK = objEachBreak.BREAK;
const cloneArrayObject = objEachBreak.cloneArrayObject;
const hasOwnProperties = objEachBreak.hasOwnProperties;

const array = testUtil.array;
const object = testUtil.object;

function simulatedReduceLeft(testValue, callback) {
    const initialValue = arguments[2];
    const hadInitialValue = arguments.length > 2;

    const indexKeys = [];
    const objectKeys = [];
    for (let key in testValue) {
        if (testValue.hasOwnProperty(key)) {
            if (utilTypeFuncs.isArrayIndex(key)) {
                indexKeys.push(utilTypeFuncs.toNumber(key));
            } else {
                objectKeys.push(key);
            }
        }
    }

    indexKeys.sort((a, b) => a - b);
    objectKeys.sort();

    let iMax = indexKeys.length;
    let reduced;
    let first = !hadInitialValue;
    for (let i = 0; i < iMax; i++) {
        const value = testValue[indexKeys[i]];
        if (first) {
            first = false;
            reduced = value;
        } else {
            reduced = callback(reduced, value, indexKeys[i], testValue);
        }
    }

    iMax = objectKeys.length;
    for (let i = 0; i < iMax; i++) {
        const value = testValue[objectKeys[i]];
        if (first) {
            first = false;
            reduced = value;
        } else {
            reduced = callback(reduced, value, indexKeys[i], testValue);
        }
    }
    return reduced;
}

function simulatedReduceRight(testValue, callback) {
    const initialValue = arguments[2];
    const hadInitialValue = arguments.length > 2;

    const indexKeys = [];
    const objectKeys = [];
    for (let key in testValue) {
        if (testValue.hasOwnProperty(key)) {
            if (utilTypeFuncs.isArrayIndex(key)) {
                indexKeys.push(utilTypeFuncs.toNumber(key));
            } else {
                objectKeys.push(key);
            }
        }
    }

    indexKeys.sort((a, b) => a - b);
    objectKeys.sort();

    let iMax = indexKeys.length;
    let reduced;
    let first = !hadInitialValue;
    for (let i = iMax; i--;) {
        const value = testValue[indexKeys[i]];
        if (first) {
            first = false;
            reduced = value;
        } else {
            reduced = callback(reduced, value, indexKeys[i], testValue);
        }
    }

    iMax = objectKeys.length;
    for (let i = iMax; i--;) {
        const value = testValue[objectKeys[i]];
        if (first) {
            first = false;
            reduced = value;
        } else {
            reduced = callback(reduced, value, indexKeys[i], testValue);
        }
    }
    return reduced;
}

jestEach([
    // array([]),
    array([], { prop: 'field', "-1": -1 }),
    // array([undefined]),
    // array([undefined], { prop: 'field', "-1": -1 }),
    // array([1]),
    // array([1], { prop: 'field', "-1": -1 }),
    // array([1, 2]),
    // array([1, 2], { prop: 'field', "-1": -1 }),
    // array([1, 2, undefined]),
    // array([1, 2, undefined], { prop: 'field', "-1": -1 }),
    // array([1, 2, undefined, 4]),
    // array([1, 2, undefined, 4], { prop: 'field', "-1": -1 }),
])
    .describe('boxedOut(%s)', (valueText, testValue) => {
        test(`.eachProp(${valueText}) all key values called`, () => {
            const expected = {};

            for (let key in testValue) {
                if (testValue.hasOwnProperty(key)) {
                    expected[key] = {
                        value: testValue[key],
                        key: toArrayIndex(key),
                        collection: testValue,
                    };
                }
            }

            const accum = {};

            boxOut(testValue).eachProp((value, key, collection) => {
                accum[key] = { value: value, key: key, collection: collection };
            });

            expect(accum).toEqual(expected);
        });

        test(`.eachProp(${valueText}) break`, () => {
            const expected = [];

            const accum = [];

            const result = boxOut(testValue).eachProp((value, key, collection) => {
                accum.push({ value: value, key: key, collection: collection });
                return BREAK(key);
            });
            accum.push(result);

            expected.push(accum[0]);
            if (accum[0]) expected.push(accum[0].key);

            expect(accum).toEqual(expected);
        });

        test(`.each(${valueText}) called in order`, () => {
            const expected = [];

            const indexKeys = [];
            const objectKeys = [];
            for (let key in testValue) {
                if (testValue.hasOwnProperty(key)) {
                    if (utilTypeFuncs.isArrayIndex(key)) {
                        indexKeys.push(utilTypeFuncs.toNumber(key));
                    } else {
                        objectKeys.push(key);
                    }
                }
            }

            indexKeys.sort((a, b) => a - b);
            objectKeys.sort();

            let iMax = indexKeys.length;
            for (let i = 0; i < iMax; i++) {
                expected.push({
                    value: testValue[indexKeys[i]],
                    key: toArrayIndex(indexKeys[i]),
                    collection: testValue,
                });
            }

            iMax = objectKeys.length;
            for (let i = 0; i < iMax; i++) {
                expected.push({
                    value: testValue[objectKeys[i]],
                    key: toArrayIndex(objectKeys[i]),
                    collection: testValue,
                });
            }

            const accum = [];

            boxOut(testValue).each((value, key, collection) => {
                accum.push({ value: value, key: key, collection: collection });
            });

            expect(accum).toEqual(expected);
        });

        test(`.reducePropsLeft(${valueText}) called in order`, () => {
            const expected = [];

            const indexKeys = [];
            const objectKeys = [];
            for (let key in testValue) {
                if (testValue.hasOwnProperty(key)) {
                    if (utilTypeFuncs.isArrayIndex(key)) {
                        indexKeys.push(utilTypeFuncs.toNumber(key));
                    } else {
                        objectKeys.push(key);
                    }
                }
            }

            indexKeys.sort((a, b) => a - b);
            objectKeys.sort();

            let iMax = indexKeys.length;
            let reduced;
            let first = true;
            for (let i = 0; i < iMax; i++) {
                const value = testValue[indexKeys[i]];
                if (first) {
                    first = false;
                    reduced = value;
                } else {
                    expected.push({
                        value: value,
                        key: toArrayIndex(indexKeys[i]),
                        collection: testValue,
                        reduced: reduced,
                    });
                    reduced = reduced !== undefined ? reduced + "," + value : value;
                }
            }

            iMax = objectKeys.length;
            for (let i = 0; i < iMax; i++) {
                const value = testValue[objectKeys[i]];
                if (first) {
                    first = false;
                    reduced = value;
                } else {
                    expected.push({
                        value: value,
                        key: toArrayIndex(objectKeys[i]),
                        collection: testValue,
                        reduced: reduced,
                    });
                    reduced = reduced !== undefined ? reduced + "," + value : value;
                }
            }

            const accum = [];

            if (!hasOwnProperties.call(testValue)) {
                expect(() => {
                    boxOut(testValue).reducePropsLeft((reduced, value, key, collection) => {
                        accum.push({
                            value: value,
                            key: key,
                            collection: collection,
                            reduced: reduced,
                        });
                        return reduced !== undefined ? reduced + "," + value : value;
                    });
                }).toThrowError(TypeError);
            } else {
                boxOut(testValue).reducePropsLeft((reduced, value, key, collection) => {
                    accum.push({
                        value: value,
                        key: key,
                        collection: collection,
                        reduced: reduced,
                    });
                    return reduced !== undefined ? reduced + "," + value : value;
                });

                expect(accum).toEqual(expected);
            }

        });

        test(`.eachRight(${valueText}) called in order`, () => {
            const expected = [];

            const indexKeys = [];
            const objectKeys = [];
            for (let key in testValue) {
                if (testValue.hasOwnProperty(key)) {
                    if (utilTypeFuncs.isArrayIndex(key)) {
                        indexKeys.push(utilTypeFuncs.toNumber(key));
                    } else {
                        objectKeys.push(key);
                    }
                }
            }

            indexKeys.sort((a, b) => b - a);
            objectKeys.sort().reverse();
            let iMax;

            iMax = objectKeys.length;
            for (let i = 0; i < iMax; i++) {
                expected.push({
                    value: testValue[objectKeys[i]],
                    key: toArrayIndex(objectKeys[i]),
                    collection: testValue,
                });
            }

            iMax = indexKeys.length;
            for (let i = 0; i < iMax; i++) {
                expected.push({
                    value: testValue[indexKeys[i]],
                    key: toArrayIndex(indexKeys[i]),
                    collection: testValue,
                });
            }

            const accum = [];

            boxOut(testValue).eachRight((value, key, collection) => {
                accum.push({ value: value, key: key, collection: collection });
            });

            expect(accum).toEqual(expected);
        });

        test(`.reducePropsRight(${valueText}) called in order`, () => {
            const expected = [];

            const indexKeys = [];
            const objectKeys = [];
            for (let key in testValue) {
                if (testValue.hasOwnProperty(key)) {
                    if (utilTypeFuncs.isArrayIndex(key)) {
                        indexKeys.push(utilTypeFuncs.toNumber(key));
                    } else {
                        objectKeys.push(key);
                    }
                }
            }

            indexKeys.sort((a, b) => b - a);
            objectKeys.sort().reverse();
            let iMax;

            iMax = objectKeys.length;
            let reduced;
            let first = true;
            for (let i = 0; i < iMax; i++) {
                const value = testValue[objectKeys[i]];
                if (first) {
                    first = false;
                    reduced = value;
                } else {
                    expected.push({
                        value: value,
                        key: toArrayIndex(objectKeys[i]),
                        collection: testValue,
                        reduced: reduced,
                    });

                    reduced = reduced !== undefined ? reduced + "," + value : value;
                }
            }

            iMax = indexKeys.length;
            for (let i = 0; i < iMax; i++) {
                const value = testValue[indexKeys[i]];
                if (first) {
                    first = false;
                    reduced = value;
                } else {
                    expected.push({
                        value: value,
                        key: toArrayIndex(indexKeys[i]),
                        collection: testValue,
                        reduced: reduced,
                    });

                    reduced = reduced !== undefined ? reduced + "," + value : value;
                }
            }

            const accum = [];

            if (!hasOwnProperties.call(testValue)) {
                expect(() => {
                    boxOut(testValue).reducePropsRight((reduced, value, key, collection) => {
                        accum.push({
                            value: value,
                            key: key,
                            collection: collection,
                            reduced: reduced,
                        });
                        return reduced !== undefined ? reduced + "," + value : value;
                    });
                }).toThrowError(TypeError);
            } else {
                boxOut(testValue).reducePropsRight((reduced, value, key, collection) => {
                    accum.push({
                        value: value,
                        key: key,
                        collection: collection,
                        reduced: reduced,
                    });
                    return reduced !== undefined ? reduced + "," + value : value;
                });

                expect(accum).toEqual(expected);
            }
        });
    });

jestEach([
    object([]),
    object([], { prop: 'field', "-1": -1 }),
    object([undefined]),
    object([undefined], { prop: 'field', "-1": -1 }),
    object([1]),
    object([1], { prop: 'field', "-1": -1 }),
    object([1, 2]),
    object([1, 2], { prop: 'field', "-1": -1 }),
    object([1, 2, undefined]),
    object([1, 2, undefined], { prop: 'field', "-1": -1 }),
    object([1, 2, undefined, 4]),
    object([1, 2, undefined, 4], { prop: 'field', "-1": -1 }),
])
    .describe('boxedOut(%s)', (valueText, testValue) => {
        test(`.eachProp(${valueText}) all key values called`, () => {
            const expected = {};

            for (let key in testValue) {
                if (testValue.hasOwnProperty(key)) {
                    expected[key] = {
                        value: testValue[key],
                        key: toArrayIndex(key),
                        collection: testValue,
                    };
                }
            }

            const accum = {};

            boxOut(testValue).eachProp((value, key, collection) => {
                accum[key] = { value: value, key: key, collection: collection };
            });

            expect(accum).toEqual(expected);
        });

        test(`.eachProp(${valueText}) break`, () => {
            const expected = [];

            const accum = [];

            const result = boxOut(testValue).eachProp((value, key, collection) => {
                accum.push({ value: value, key: key, collection: collection });
                return BREAK(key);
            });
            accum.push(result);

            expected.push(accum[0]);
            if (accum[0]) expected.push(accum[0].key);

            expect(accum).toEqual(expected);
        });

        test(`.each(${valueText}) called in order`, () => {
            const expected = [];

            const indexKeys = [];
            const objectKeys = [];
            for (let key in testValue) {
                if (testValue.hasOwnProperty(key)) {
                    if (utilTypeFuncs.isArrayIndex(key)) {
                        indexKeys.push(utilTypeFuncs.toNumber(key));
                    } else {
                        objectKeys.push(key);
                    }
                }
            }

            indexKeys.sort((a, b) => a - b);
            objectKeys.sort();

            let iMax = indexKeys.length;
            for (let i = 0; i < iMax; i++) {
                expected.push({
                    value: testValue[indexKeys[i]],
                    key: toArrayIndex(indexKeys[i]),
                    collection: testValue,
                });
            }

            iMax = objectKeys.length;
            for (let i = 0; i < iMax; i++) {
                expected.push({
                    value: testValue[objectKeys[i]],
                    key: toArrayIndex(objectKeys[i]),
                    collection: testValue,
                });
            }

            const accum = [];

            boxOut(testValue).each((value, key, collection) => {
                accum.push({ value: value, key: key, collection: collection });
            });

            expect(accum).toEqual(expected);
        });

        test(`.reducePropsLeft(${valueText}) called in order`, () => {
            const expected = [];

            const indexKeys = [];
            const objectKeys = [];
            for (let key in testValue) {
                if (testValue.hasOwnProperty(key)) {
                    if (utilTypeFuncs.isArrayIndex(key)) {
                        indexKeys.push(utilTypeFuncs.toNumber(key));
                    } else {
                        objectKeys.push(key);
                    }
                }
            }

            indexKeys.sort((a, b) => a - b);
            objectKeys.sort();

            let iMax = indexKeys.length;
            let reduced;
            let first = true;
            for (let i = 0; i < iMax; i++) {
                const value = testValue[indexKeys[i]];
                if (first) {
                    first = false;
                    reduced = value;
                } else {
                    expected.push({
                        value: value,
                        key: toArrayIndex(indexKeys[i]),
                        collection: testValue,
                        reduced: reduced,
                    });

                    reduced = reduced !== undefined ? reduced + "," + value : value;
                }
            }

            iMax = objectKeys.length;
            for (let i = 0; i < iMax; i++) {
                const value = testValue[objectKeys[i]];
                if (first) {
                    first = false;
                    reduced = value;
                } else {
                    expected.push({
                        value: value,
                        key: toArrayIndex(objectKeys[i]),
                        collection: testValue,
                        reduced: reduced,
                    });

                    reduced = reduced !== undefined ? reduced + "," + value : value;
                }
            }

            const accum = [];

            if (!hasOwnProperties.call(testValue)) {
                expect(() => {
                    boxOut(testValue).reducePropsLeft((reduced, value, key, collection) => {
                        accum.push({
                            value: value,
                            key: key,
                            collection: collection,
                            reduced: reduced,
                        });
                        return reduced !== undefined ? reduced + "," + value : value;
                    });
                }).toThrowError(TypeError);
            } else {
                boxOut(testValue).reducePropsLeft((reduced, value, key, collection) => {
                    accum.push({
                        value: value,
                        key: key,
                        collection: collection,
                        reduced: reduced,
                    });
                    return reduced !== undefined ? reduced + "," + value : value;
                });

                expect(accum).toEqual(expected);
            }
        });

        test(`.eachRight(${valueText}) called in order`, () => {
            const expected = [];

            const indexKeys = [];
            const objectKeys = [];
            for (let key in testValue) {
                if (testValue.hasOwnProperty(key)) {
                    if (utilTypeFuncs.isArrayIndex(key)) {
                        indexKeys.push(utilTypeFuncs.toNumber(key));
                    } else {
                        objectKeys.push(key);
                    }
                }
            }

            indexKeys.sort((a, b) => b - a);
            objectKeys.sort().reverse();
            let iMax;

            iMax = objectKeys.length;
            for (let i = 0; i < iMax; i++) {
                expected.push({
                    value: testValue[objectKeys[i]],
                    key: toArrayIndex(objectKeys[i]),
                    collection: testValue,
                });
            }

            iMax = indexKeys.length;
            for (let i = 0; i < iMax; i++) {
                expected.push({
                    value: testValue[indexKeys[i]],
                    key: toArrayIndex(indexKeys[i]),
                    collection: testValue,
                });
            }

            const accum = [];

            boxOut(testValue).eachRight((value, key, collection) => {
                accum.push({ value: value, key: key, collection: collection });
            });

            expect(accum).toEqual(expected);
        });

        test(`.reducePropsRight(${valueText}) called in order`, () => {
            const expected = [];

            const indexKeys = [];
            const objectKeys = [];
            for (let key in testValue) {
                if (testValue.hasOwnProperty(key)) {
                    if (utilTypeFuncs.isArrayIndex(key)) {
                        indexKeys.push(utilTypeFuncs.toNumber(key));
                    } else {
                        objectKeys.push(key);
                    }
                }
            }

            indexKeys.sort((a, b) => b - a);
            objectKeys.sort().reverse();
            let iMax;

            iMax = objectKeys.length;
            let reduced;
            let first = true;
            for (let i = 0; i < iMax; i++) {
                const value = testValue[objectKeys[i]];
                if (first) {
                    first = false;
                    reduced = value;
                } else {
                    expected.push({
                        value: value,
                        key: toArrayIndex(objectKeys[i]),
                        collection: testValue,
                        reduced: reduced,
                    });

                    reduced = reduced !== undefined ? reduced + "," + value : value;
                }
            }

            iMax = indexKeys.length;
            for (let i = 0; i < iMax; i++) {
                const value = testValue[indexKeys[i]];
                if (first) {
                    first = false;
                    reduced = value;
                } else {
                    expected.push({
                        value: value,
                        key: toArrayIndex(indexKeys[i]),
                        collection: testValue,
                        reduced: reduced,
                    });

                    reduced = reduced !== undefined ? reduced + "," + value : value;
                }
            }

            const accum = [];

            if (!hasOwnProperties.call(testValue)) {
                expect(() => {
                    boxOut(testValue).reduceRight((reduced, value, key, collection) => {
                        accum.push({
                            value: value,
                            key: key,
                            collection: collection,
                            reduced: reduced,
                        });
                        return reduced !== undefined ? reduced + "," + value : value;
                    });
                }).toThrowError(TypeError);
            } else {
                boxOut(testValue).reduceRight((reduced, value, key, collection) => {
                    accum.push({
                        value: value,
                        key: key,
                        collection: collection,
                        reduced: reduced,
                    });
                    return reduced !== undefined ? reduced + "," + value : value;
                });

                expect(accum).toEqual(expected);
            }
        });
    });

const sum = (reduced, value, key, collection) => {
    if (utilTypeFuncs.isArray(reduced)) {
        // first element
        reduced = boxOut(reduced).reduce(sum);
    }

    if (utilTypeFuncs.isArray(value)) {
        const summed = boxOut(value).reduce(sum);
        return (reduced || 0) + summed;
    } else {
        return (reduced || 0) + value;
    }
};

const sumKeys = (reduced, value, key, collection) => {
    if (utilTypeFuncs.isArray(reduced)) {
        // first element
        reduced = boxOut(reduced).reduce(sumKeys);
    }

    if (utilTypeFuncs.isArray(value)) {
        const summed = boxOut(value).reduce(sumKeys);
        return (reduced || 0) + summed;
    } else {
        return (reduced || 0) + value;
    }
};

const sumLeft = (reduced, value, key, collection) => {
    if (utilTypeFuncs.isArray(reduced)) {
        // first element
        reduced = boxOut(reduced).reduce(sumLeft);
    }

    if (utilTypeFuncs.isArray(value)) {
        const summed = boxOut(value).reduce(sumLeft);
        return (reduced || 0) + summed;
    } else {
        return (reduced || 0) + value;
    }
};

const sumRight = (reduced, value, key, collection) => {
    if (utilTypeFuncs.isArray(reduced)) {
        // first element
        reduced = boxOut(reduced).reduce(sumRight);
    }

    if (utilTypeFuncs.isArray(value)) {
        const summed = boxOut(value).reduce(sumRight);
        return (reduced || 0) + summed;
    } else {
        return (reduced || 0) + value;
    }
};

test(`reduce first reduced is first element, value second`, () => {
    let first = true;
    const accum = boxOut([[1, 2, 3], [10, 20, 30], [100, 200, 300]]).reduce((reduced, value, key, collection) => {
        if (first) {
            expect(reduced).toEqual([1, 2, 3]);
            expect(value).toEqual([10, 20, 30]);
            first = false;
            // return BREAK;
        } else {
            // expect('').toBe('should not be here');
        }
    });
});

/*
 // order not guaranteed
 test(`reduceProps first reduced is first element, value second`, () => {
 let first = true;
 const accum = boxOut([[1, 2, 3], [10, 20, 30], [100, 200, 300]]).reduceProps((reduced, value, key, collection) => {
 if (first) {
 expect(reduced).toEqual([1, 2, 3]);
 expect(value).toEqual([10, 20, 30]);
 first = false;
 return BREAK;
 } else {
 expect('').toBe('should not be here');
 }
 });
 });
 */

test(`reducePropsLeft first reduced is first element, value second`, () => {
    let first = true;
    const accum = boxOut([[1, 2, 3], [10, 20, 30], [100, 200, 300]]).reducePropsLeft((reduced, value, key, collection) => {
        if (first) {
            expect(reduced).toEqual([1, 2, 3]);
            expect(value).toEqual([10, 20, 30]);
            first = false;
            return BREAK;
        } else {
            expect('').toBe('should not be here');
        }
    });
});

test(`reducePropsRight first reduced is last element, value second to last`, () => {
    let first = true;
    const accum = boxOut([[1, 2, 3], [10, 20, 30], [100, 200, 300], [1000, 2000, 3000]]).reducePropsRight((reduced, value, key, collection) => {
        if (first) {
            expect(reduced).toEqual([1000, 2000, 3000]);
            expect(value).toEqual([100, 200, 300]);
            first = false;
            return BREAK;
        } else {
            expect('').toBe('should not be here');
        }
    });
});

describe('Nested loops', () => {
    test(`Nested reduce returns value`, () => {
        const accum = boxOut([undefined, undefined, [1, 2, 3], [10, 20, 30], [100, 200, 300]]).reduce(sum);
        const expected = 666;

        expect(accum).toEqual(expected);
    });

    test(`Nested reduce returns value`, () => {
        const accum = boxOut([[1, 2, 3], [10, 20, 30], [100, 200, 300]]).reduce(sum);
        const expected = 666;

        expect(accum).toEqual(expected);
    });

    test(`Nested reduceProps returns value`, () => {
        const accum = boxOut([[1, 2, 3], [10, 20, 30], [100, 200, 300]]).reduceProps(sumKeys);
        const expected = 666;

        expect(accum).toEqual(expected);
    });

    test(`Nested reducePropsLeft returns value`, () => {
        const accum = boxOut([[1, 2, 3], [10, 20, 30], [100, 200, 300]]).reducePropsLeft(sumLeft);
        const expected = 666;

        expect(accum).toEqual(expected);
    });

    test(`Nested reduceRight returns value`, () => {
        const accum = boxOut([[1, 2, 3], [10, 20, 30], [100, 200, 300]]).reduceRight(sumRight);
        const expected = 666;

        expect(accum).toEqual(expected);
    });

});
describe('Nested loop break returns default', () => {
    test(`Nested reduce returns value`, () => {
        const accum = boxOut([undefined, undefined, [1, 2, 3], [10, 20, 30], [100, 200, 300]]).reduceProps((reduced, value, key, collection) => {
            if (value !== undefined) {
                BREAK.setDefault(0);
                if (utilTypeFuncs.isArray(value)) {
                    let inner = boxOut(value).reduceProps((reduced, value, key, collection) => {
                        BREAK.setDefault(100);
                        return BREAK;
                    });

                    expect(inner).toBe(100);
                }
                return BREAK;
            }
        });
        const expected = 666;

        expect(accum).toEqual(0);
    });
});

jestEach([
    array([]),
    array([1]),
    array([1, 2, 3]),
    array([1, 2, 3]),
    array([0]),
    array([0, 1]),
    array([0, 1, 2, 3]),
    array([0, 1, 2, 3]),
])
    .describe('some/every', (valueText, testValue) => {
        let testObject;
        let objectText;

        beforeEach(()=>{
            const t = object(testValue);
            testObject = t[1];
            objectText = t[0];
        });

        test(`$_(${valueText}).some((value,key)=>value > 0) === ${testValue.some((value, key) => value > 0)}`, () => {
            expect($_(testValue).some((value, key) => value > 0)).toBe(testValue.some((value, key) => value > 0));
        });
        test(`$_(${valueText}).every((value,key)=>value > 0) === ${testValue.every((value, key) => value > 0)}`, () => {
            expect($_(testValue).every((value, key) => value > 0)).toBe(testValue.every((value, key) => value > 0));
        });
        test(`$_(${valueText}).some((value,key) => !(value > 0)) === ${testValue.some((value, key) => !(value > 0))}`, () => {
            expect($_(testValue).some((value, key) => !(value > 0))).toBe(testValue.some((value, key) => !(value > 0)));
        });
        test(`$_(${valueText}).every((value,key) => !(value > 0)) === ${testValue.every((value, key) => value > 0)}`, () => {
            expect($_(testValue).every((value, key) => !(value > 0))).toBe(testValue.every((value, key) => !(value > 0)));
        });

        // same for object
        test(`$_(${objectText}).some((value,key)=>value > 0) === ${testValue.some((value, key) => value > 0)}`, () => {
            expect($_(testObject).some((value, key) => value > 0)).toBe(testValue.some((value, key) => value > 0));
        });
        test(`$_(${objectText}).every((value,key)=>value > 0) === ${testValue.every((value, key) => value > 0)}`, () => {
            expect($_(testObject).every((value, key) => value > 0)).toBe(testValue.every((value, key) => value > 0));
        });
        test(`$_(${objectText}).some((value,key) => !(value > 0)) === ${testValue.some((value, key) => !(value > 0))}`, () => {
            expect($_(testObject).some((value, key) => !(value > 0))).toBe(testValue.some((value, key) => !(value > 0)));
        });
        test(`$_(${objectText}).every((value,key) => !(value > 0)) === ${testValue.every((value, key) => value > 0)}`, () => {
            expect($_(testObject).every((value, key) => !(value > 0))).toBe(testValue.every((value, key) => !(value > 0)));
        });
    });


