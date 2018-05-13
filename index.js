"use strict";

const utilTypeFuncs = require('util-type-funcs');
const objEachBreak = require('obj-each-break');

const isObjectLike = utilTypeFuncs.isObjectLike;

const eachProp = objEachBreak.eachProp;
const hasOwnProperties = objEachBreak.hasOwnProperties;
const each = objEachBreak.each;
const eachRight = objEachBreak.eachRight;
const cloneArrayObject = objEachBreak.cloneArrayObject;
const deleteItems = objEachBreak.deleteItems;
const arrayLength = objEachBreak.arrayLength;
const deepClone = objEachBreak.deepClone;
const mergeDefaults = objEachBreak.mergeDefaults;
const copyFiltered = objEachBreak.copyFiltered;
const copyFilteredNot = objEachBreak.copyFilteredNot;
const objFiltered = objEachBreak.objFiltered;
const objFilter = objEachBreak.objFilter;
const objMapped = objEachBreak.objMapped;
const objMap = objEachBreak.objMap;
const objSome = objEachBreak.objSome;
const objEvery = objEachBreak.objEvery;
const objReduce = objEachBreak.objReduce;
const objReduceLeft = objEachBreak.objReduceLeft;
const objReduceRight = objEachBreak.objReduceRight;

const BoxedOutObject = {};
BoxedOutObject.prototype = Object.create(Object.prototype);
BoxedOutObject.prototype.arrayLength = arrayLength;
BoxedOutObject.prototype.cloneArrayObject = cloneArrayObject;
BoxedOutObject.prototype.copyFiltered = copyFiltered;
BoxedOutObject.prototype.copyFilteredNot = copyFilteredNot;
BoxedOutObject.prototype.deepClone = deepClone;
// BoxedOutObject.prototype.deleteItems = deleteItems;
BoxedOutObject.prototype.each = each;
BoxedOutObject.prototype.eachProp = eachProp;
BoxedOutObject.prototype.eachRight = eachRight;
BoxedOutObject.prototype.every = objEvery;
BoxedOutObject.prototype.everyProp = objEvery;
BoxedOutObject.prototype.filter = objFilter;
BoxedOutObject.prototype.filteredProps = objFiltered;
BoxedOutObject.prototype.filterProps = objFilter;
BoxedOutObject.prototype.forEach = each;
BoxedOutObject.prototype.hasOwnProperties = hasOwnProperties;
BoxedOutObject.prototype.map = objMap;
BoxedOutObject.prototype.mappedProps = objMapped;
BoxedOutObject.prototype.mapProps = objMap;
BoxedOutObject.prototype.mergeDefaults = mergeDefaults;
BoxedOutObject.prototype.reduce = objReduceLeft;
BoxedOutObject.prototype.reduceProps = objReduce;
BoxedOutObject.prototype.reducePropsLeft = objReduceLeft;
BoxedOutObject.prototype.reducePropsRight = objReduceRight;
BoxedOutObject.prototype.reduceRight = objReduceRight;
BoxedOutObject.prototype.some = objSome;
BoxedOutObject.prototype.someProps = objSome;

const BoxedOutArray = [];
BoxedOutArray.prototype = Object.create(Array.prototype);
BoxedOutArray.prototype.arrayLength = arrayLength;
BoxedOutArray.prototype.cloneArrayObject = cloneArrayObject;
BoxedOutArray.prototype.copyFiltered = copyFiltered;
BoxedOutArray.prototype.copyFilteredNot = copyFilteredNot;
BoxedOutArray.prototype.deepClone = deepClone;
BoxedOutArray.prototype.deleteItems = deleteItems;
BoxedOutArray.prototype.each = each;
BoxedOutArray.prototype.eachProp = eachProp;
BoxedOutArray.prototype.eachRight = eachRight;
// BoxedOutArray.prototype.every = objEvery;
BoxedOutArray.prototype.everyProp = objEvery;
// BoxedOutArray.prototype.filter = objFilter;
BoxedOutArray.prototype.filteredProps = objFiltered;
BoxedOutArray.prototype.filterProps = objFilter;
BoxedOutArray.prototype.hasOwnProperties = hasOwnProperties;
// BoxedOutArray.prototype.map = objMap;
BoxedOutArray.prototype.mappedProps = objMapped;
BoxedOutArray.prototype.mapProps = objMap;
BoxedOutArray.prototype.mergeDefaults = mergeDefaults;
// BoxedOutArray.prototype.reduce = objReduce;
BoxedOutArray.prototype.reduceProps = objReduce;
BoxedOutArray.prototype.reducePropsLeft = objReduceLeft;
BoxedOutArray.prototype.reducePropsRight = objReduceRight;
// BoxedOutArray.prototype.reduceRight = objReduceRight;
// BoxedOutArray.prototype.some = objSome;
BoxedOutArray.prototype.someProps = objSome;

function boxOut(obj) {
    if (isObjectLike(obj) && (obj.constructor === Object || obj.constructor === Array)) {
        Object.setPrototypeOf(obj, obj.constructor === Array ? BoxedOutArray.prototype : BoxedOutObject.prototype);
    }
    return obj;
}

module.exports = boxOut;
