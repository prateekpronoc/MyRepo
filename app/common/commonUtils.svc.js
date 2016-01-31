(function () {
  'use strict';

  angular
    .module('hp.common')
    .factory('commonUtils', commonUtils);

  /* @ngInject */
  function commonUtils(appConfig, $location, session) {
    var service = {
      convertArrayToObject: convertArrayToObject,
      jsonSize: objectSize,
      keys: objectKeys,
      exclusiveList: exclusiveList,
      nonEmptyElements: nonEmptyElements,
      isInvalid: isInvalid,
      copy: copy,
      arrayCopy: arrayCopy,
      union: union,
      isValidArray: isValidArray,
      isValidObject: isValidObject,
      objectValues: objectValues,
      convertToTextIds: convertToTextIds,
      convertToNumberIds: convertToNumberIds,
      valuesArray: valuesArray,
      removeKeys: removeKeys,
      addKeys: addKeys,
      sortCollection: sortCollection,
      refreshUI: refreshUI,
      contains: contains,
      notContains: notContains,
      filterElements: filterElements,
      compare: compare,
      stripOffAttribute: stripOffAttribute,
      containsKeys: containsKeys,
      isDuplicate: isDuplicate,
      convertIdsToString: convertIdsToString,
      endsWith: endsWith,
      getWebUrlPrefix: getWebUrlPrefix,
      containsObject: containsObject,
      getBaseUrl: getBaseUrl,
      difference: difference,
      session: session
    };
    return service;

    ////////////////
    function difference(a, b) {
      var key, keys = [];
      for (key in a) {
        if (a.hasOwnProperty(key) && (b.hasOwnProperty(key) && a[key] !== b[key]) || !b.hasOwnProperty(key)) {
          keys.push(key);
        }
      }
      return keys;
    }

    function stripOffAttribute(array, key) {
      if (!array || !angular.isArray(array) || array.length === 0) {
        return array;
      }
      for (var i = 0; i < array.length; i += 1) {
        if (angular.isObject(array[i]) && angular.isDefined(array[i][key])) {
          delete array[i][key];
        }
      }
      return array;
    }

    function valuesArray(object) {
      var key, array = [];
      for (key in object) {
        if (object.hasOwnProperty(key)) {
          array.push(object[key]);
        }
      }
      return array;
    }

    function convertToTextIds(array) {
      var i, dest = [];
      for (i = 0; i < array.length; i += 1) {
        dest[i] = array[i] + '';
      }
      return dest;
    }

    function convertToNumberIds(array) {
      var i, dest = [];
      for (i = 0; i < array.length; i += 1) {
        dest[i] = parseInt(array[i]);
      }
      return dest;
    }

    function containsKeys(object, keys) {
      if (!object || !angular.isObject(object)) {
        return false;
      }
      if (!keys || !angular.isArray(keys) || keys.length === 0) {
        return true;
      }
      for (var i = 0; i < keys.length; i += 1) {
        if (!object.hasOwnProperty(keys[i]) || isInvalid(object[keys[i]].toString())) {
          return false;
        }
      }
      return true;
    }

    function objectSize(object) {
      if (!object || !angular.isObject(object)) {
        return 0;
      }
      var key, size = 0;
      for (key in object) {
        if (object.hasOwnProperty(key)) {
          size += 1;
        }
      }
      return size;
    }

    function objectKeys(object) {
      if (!object || !angular.isObject(object)) {
        return [];
      }
      var keys = [],
        key;
      for (key in object) {
        if (object.hasOwnProperty(key)) {
          keys.push(key);
        }
      }
      return keys;
    }

    function objectValues(object) {
      if (!object || !angular.isObject(object)) {
        return [];
      }
      var values = [],
        key;
      for (key in object) {
        if (object.hasOwnProperty(key)) {
          values.push(object[key]);
        }
      }
      return values;
    }

    function copy(array1, array2) {
      if (angular.isUndefined(array2) || !angular.isArray(array2) || array2.length === 0) {
        return array1;
      }
      for (var i = 0; i < array2.length; i += 1) {
        if (array1.indexOf(array2[i]) === -1) {
          array1.push(array2[i]);
        }
      }
      return array1;
    }

    function arrayCopy(obj) {
      return angular.copy(obj);
    }

    function union(x, y) {
      var obj = {},
        i, res = [];
      for (i = x.length - 1; i >= 0; i = i - 1) {
        obj[x[i]] = x[i];
      }
      for (i = y.length - 1; i >= 0; i = i - 1) {
        obj[y[i]] = y[i];
      }
      for (i in obj) {
        if (obj.hasOwnProperty(i)) {
          res.push(obj[i]);
        }
      }
      return res;
    }

    function convertArrayToObject(array, keyAttribute, object) {
      if (!object) {
        object = {};
      }
      if (!angular.isArray(array) || array.length === 0) {
        return object;
      }
      for (var i = 0; i < array.length; i += 1) {
        if (array[i] && array[i][keyAttribute]) {
          object[array[i][keyAttribute]] = array[i];
        }
      }
      return object;
    }

    function exclusiveList(array1, array2, contain, primaryKey) {
      var i, dest = [];
      if (!array2 || !angular.isArray(array2) || array2.length === 0) {
        return array1;
      }
      if (!array1 || !angular.isArray(array1) || array1.length === 0) {
        return dest;
      }
      dest = angular.copy(array1);
      if (!contain) {
        for (i = 0; i < array1.length; i += 1) {
          if (array2.indexOf(array1[i]) > -1) {
            dest.splice(dest.indexOf(array1[i]), 1);
          }
        }
      } else {
        for (i = 0; i < dest.length; i += 1) {
          if (dest[i] && contain(dest[i], array2, primaryKey)) {
            dest.splice(i, 1);
            i -= 1;
          }
        }
      }
      return dest;
    }

    function contains(obj, array, key) {
      key = key ? key : 'Id';
      return angular.isDefined(obj[key]) && !isInvalid(obj[key].toString());
    }

    function notContains(obj, array, key) {
      key = key ? key : 'Id';
      return angular.isUndefined(obj[key]) || isInvalid(obj[key].toString());
    }

    function containsObject(obj, array, primaryKey) {
      if (!obj || !array && array.length === 0) {
        return false;
      }
      for (var i = 0; i < array.length; i += 1) {
        if (array[i] && array[i][primaryKey] && obj[primaryKey] && array[i][primaryKey].toString() === obj[
            primaryKey].toString()) {
          return true;
        }
      }
      return false;
    }

    function filterElements(array1, array2, contain, compare, keys, primaryKeyAttribute) {
      var i, modified = [];
      for (i = 0; i < array1.length; i += 1) {
        if (contain(array1[i], array2, primaryKeyAttribute) && !compare(array1[i], array2, keys,
            primaryKeyAttribute)) {
          modified.push(array1[i]);
        }
      }
      return modified;
    }

    function compare(object1, array2, keys, primaryKey) {
      var i;
      if (!object1 || !angular.isArray(array2) || array2.length === 0) {
        return false;
      }
      if (angular.isUndefined(object1[primaryKey])) {
        return false;
      }
      primaryKey = primaryKey ? primaryKey : 'Id';
      for (i = 0; i < array2.length; i += 1) {
        if (array2[i][primaryKey] && array2[i][primaryKey].toString() === object1[primaryKey].toString()) {
          return compareKeys(object1, array2[i], keys);
        }
      }
      return false;
    }

    function compareKeys(object1, object2, keys) {
      var i;
      for (i = 0; i < keys.length; i += 1) {
        if (!object1[keys[i]] && object2[keys[i]] && !isInvalid(object2[keys[i].toString()])) {
          return false;
        }
        if (object1[keys[i]] && !object2[keys[i]] && !isInvalid(object1[keys[i]].toString())) {
          return false;
        }
        if (object1[keys[i]] && !isInvalid(object1[keys[i]].toString()) && object2[keys[i]] && !isInvalid(object2[
            keys[i]].toString()) &&
          object1[keys[i]].toString() !== object2[keys[i]].toString()) {
          return false;
        }
      }
      return true;
    }

    function isInvalid(dataValue) {
      return !(dataValue && dataValue !== null && dataValue.toString().trim().length > 0);
    }

    function isValidObject(obj) {
      return obj && angular.isObject(obj);
    }

    function isValidArray(array) {
      return array && angular.isArray(array);
    }

    function nonEmptyElements(array) {
      if (!angular.isArray(array) || array.length === 0) {
        return [];
      } else {
        var i, arr = [];
        for (i = 0; i < array.length; i += 1) {
          if (array[i].trim().length > 0) {
            arr.push(array[i].trim());
          }
        }
        return arr;
      }
    }

    function sortCollection(sortBy, collection) {
      var tempArray = [],
        finalArray = [];
      angular.forEach(collection, function (item) {
        if (!angular.isUndefined(item[sortBy])) {
          tempArray.push(item[sortBy]);
        }
      });
      tempArray.sort();
      angular.forEach(tempArray, function (value) {
        angular.forEach(collection, function (item) {
          if (item[sortBy] === value) {
            finalArray.push(item);
          }
        });
      });
      return finalArray;
    }

    function removeKeys(object, array) {
      var i;
      if (isValidObject(object) && isValidArray(array)) {
        for (i = 0; i < array.length; i += 1) {
          delete object[array[i]];
        }
      }
      return object;
    }

    function addKeys(destinationObject, keys, sourceObject) {
      var i;
      if (angular.isUndefined(destinationObject)) {
        destinationObject = {};
      }
      if (isValidArray(keys) && isValidObject(sourceObject)) {
        for (i = 0; i < keys.length; i += 1) {
          if (sourceObject.hasOwnProperty(keys[i])) {
            destinationObject[keys[i]] = sourceObject[keys[i]];
          }
        }
      }
      return destinationObject;
    }

    function refreshUI(scope, data) {
      if (scope && !scope.$$phase) {
        return data ? scope.$apply(data) : scope.$apply();
      }
      return null;
    }

    function isDuplicate(object, array, keys, index) {
      if (angular.isUndefined(object) || !angular.isObject(object) || !angular.isArray(array) || array.length ===
        0) {
        return false;
      }
      if (!angular.isArray(keys) || keys.length === 0) {
        keys = objectKeys(object);
      }
      if (angular.isUndefined(index)) {
        index = -1;
      }
      for (var i = 0; i < array.length; i += 1) {
        if (index !== i && angular.isObject(array[i]) && compareKeys(object, array[i], keys)) {
          return true;
        }
      }
      return false;
    }

    function convertIdsToString(array, keySuffix) {
      if (angular.isUndefined(keySuffix)) {
        keySuffix = 'Id';
      }
      var i, key, dest = [];
      if (angular.isArray(array) && array.length > 0) {
        for (i = 0; i < array.length; i += 1) {
          dest.push(convertIdsToString(array[i], keySuffix));
        }
        return dest;
      } else if (angular.isObject(array)) {
        for (key in array) {
          if (array.hasOwnProperty(key) && endsWith(key, keySuffix) && array[key]) {
            array[key] = array[key].toString();
          }
        }
      }
      return array;
    }

    function endsWith(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    function getWebUrlPrefix() {
      return $location.protocol() + '://' + $location.host() + ':' + $location.port() + appConfig.mappedTo;
    }

    function getBaseUrl() {
      return $location.protocol() + '://' + $location.host() + ':' + $location.port() + appConfig.mappedTo;
    }
  }
})();
