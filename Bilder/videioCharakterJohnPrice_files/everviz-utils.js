"use strict";

if (!window['everviz']) window['everviz'] = {};
window['everviz'].isMapBubbleOrPoint = function (data) {
  return data && data.some(function (series) {
    return series.type === 'mapbubble' || series.type === 'mappoint';
  });
};
window['everviz'].isNull = function (what) {
  return typeof what === 'undefined' || what === null;
};
window['everviz'].isStr = function (what) {
  return typeof what === 'string' || what instanceof String;
};
window['everviz'].isNum = function (what) {
  return !isNaN(parseFloat(what)) && isFinite(what);
};
window['everviz'].isFn = function (what) {
  return what && typeof what === 'function' || what instanceof Function;
};
window['everviz'].isArr = function (what) {
  return !window['everviz'].isNull(what) && what.constructor.toString().indexOf('Array') > -1;
};
window['everviz'].isBool = function (what) {
  return what === !0 || what === !1;
};
window['everviz'].isBasic = function (what) {
  return !window['everviz'].isArr(what) && (window['everviz'].isStr(what) || window['everviz'].isNum(what) || window['everviz'].isBool(what) || window['everviz'].isFn(what));
};
window['everviz'].isObj = function (what) {
  return what && what.constructor.toString().indexOf('Object') > -1;
};
window['everviz'].isEmptyObjectArray = function (arr) {
  return window['everviz'].isObj(arr[0]) && arr.some(function (b) {
    return Object.keys(b).length === 0;
  });
};
window['everviz'].merge = function (a, b) {
  if (!a || !b) return a || b;
  Object.keys(b).forEach(function (bk) {
    if (window['everviz'].isNull(b[bk]) || window['everviz'].isBasic(b[bk])) {
      a[bk] = b[bk];
    } else if (window['everviz'].isArr(b[bk])) {
      if (window['everviz'].isEmptyObjectArray(b[bk])) return;
      a[bk] = [];
      b[bk].forEach(function (i) {
        if (window['everviz'].isNull(i) || window['everviz'].isBasic(i)) {
          a[bk].push(i);
        } else {
          a[bk].push(window['everviz'].merge(window['everviz'].isArr(i) ? [] : {}, i));
        }
      });
    } else {
      if (window['everviz'].isObj(b[bk]) && window['everviz'].isStr(a[bk])) {
        a[bk] = b[bk];
        return;
      }
      a[bk] = a[bk] || {};
      window['everviz'].merge(a[bk], b[bk]);
    }
  });
  return a;
};
window['everviz'].getAttr = function (obj, path, index) {
  var current = obj,
    result = undefined;
  if (!current) return result;
  if (Array.isArray(obj)) {
    obj.forEach(function (thing) {
      result = getAttr(thing, path);
    });
    return result;
  }
  path = path.replace(/\-\-/g, '.').replace(/\-/g, '.').split('.');
  path.forEach(function (p, i) {
    if (i === path.length - 1) {
      if (typeof current !== 'undefined') {
        result = current[p];
      }
    } else {
      if (typeof current[p] === 'undefined') {
        current = current[p] = {};
      } else {
        current = current[p];
        if (Array.isArray(current) && index >= 0 && index < current.length) {
          current = current[index];
        }
      }
    }
  });
  return result;
};