'use strict';

describe('CommonUtils', function () {
  var commonUtils;

  beforeEach(module('hp.common'));

  beforeEach(inject(function (_commonUtils_) {
    commonUtils = _commonUtils_;
  }));

  it('arrayCopy method should copy the array of elements', function () {
    expect(angular.equals(commonUtils.arrayCopy([122, 132, 1290]), [122, 132, 1290])).toEqual(true);
  });

  it('stripOffAttribute method should delete the specified attribute from given object', function () {
    expect(commonUtils.stripOffAttribute({
      Id: 1212,
      Value: 'Test'
    }, 'Id').Id).toBeDefined(undefined);
  });

  it('convertToTextIds method should return integer array to string array', function () {
    expect(commonUtils.convertToTextIds([120, 129, 190])).toEqual(['120', '129', '190']);
    expect(commonUtils.convertToTextIds([])).toEqual([]);
  });

  it('convertToNumberIds method should return integer array to string array', function () {
    expect(commonUtils.convertToNumberIds(['120', '129', '190'])).toEqual([120, 129, 190]);
    expect(commonUtils.convertToNumberIds([])).toEqual([]);
  });

  it('jsonSize should return keys size of the object', function () {
    expect(commonUtils.jsonSize({})).toBe(0);
    expect(commonUtils.jsonSize(undefined)).toBe(0);
    expect(commonUtils.jsonSize(null)).toBe(0);
    expect(commonUtils.jsonSize({
      Id: 1,
      Value: 'test'
    })).toBe(2);
  });

  it('keys should return keys of the object passed in', function () {
    expect(commonUtils.keys({})).toEqual([]);
    expect(commonUtils.keys(undefined)).toEqual([]);
    expect(commonUtils.keys(null)).toEqual([]);
    expect(commonUtils.keys({
      Id: 1,
      Value: 'test'
    })).toEqual(['Id', 'Value']);
  });

  it('objectValues should return values array for the given object', function () {
    expect(commonUtils.objectValues({})).toEqual([]);
    expect(commonUtils.objectValues(undefined)).toEqual([]);
    expect(commonUtils.objectValues(null)).toEqual([]);
    expect(commonUtils.objectValues({
      Id: 1,
      Value: 'test'
    })).toEqual([1, 'test']);
    expect(commonUtils.objectValues({
      Id: 'test',
      Value: 'test'
    })).toEqual(['test', 'test']);
    expect(commonUtils.objectValues({
      Id: null,
      Value: 'test'
    })).toEqual([null, 'test']);
  });

  it('endsWith should check string\'s endsWith suffix', function () {
    expect(commonUtils.endsWith('ABCD', 'CD')).toBe(true);
    expect(commonUtils.endsWith('ABCD', 'cd')).toBe(false);
  });

  it('convertIdsToString should convert integer values to strings for keys which ends with a suffix', function () {
    expect(commonUtils.convertIdsToString({
      Id: 121,
      Value: 'text'
    }, 'Id')).toEqual({
      Id: '121',
      Value: 'text'
    });
    expect(commonUtils.convertIdsToString({
      AnotherId: 121,
      Value: 'text'
    }, 'Id')).toEqual({
      AnotherId: '121',
      Value: 'text'
    });
    expect(commonUtils.convertIdsToString({
      Id: 121,
      Value: 'text'
    }, 'id')).toEqual({
      Id: 121,
      Value: 'text'
    });
    expect(commonUtils.convertIdsToString({
      AnotherId: 121,
      Value: 'text'
    }, 'id')).toEqual({
      AnotherId: 121,
      Value: 'text'
    });
    expect(commonUtils.convertIdsToString({}, 'id')).toEqual({});
    expect(commonUtils.convertIdsToString([{
      Id: 121,
      Value: 'text'
    }], 'Id')).toEqual([{
      Id: '121',
      Value: 'text'
    }]);
  });

  it('isDuplicate should check whether an object is a duplicate in an array', function () {
    var array = [{
      Id: 112,
      Value: 'text1'
    }, {
      Id: 113,
      Value: 'text1',
      defined: true
    }, {
      Id: 114,
      Value: 'text1',
      extra: 'yes'
    }];
    expect(commonUtils.isDuplicate({
      Id: 112,
      Value: 'text1'
    }, array, ['Id', 'Value'])).toBe(true);
    expect(commonUtils.isDuplicate({
      Id: 112,
      Value: 'text2'
    }, array, ['Id', 'Value'])).toBe(false);
    expect(commonUtils.isDuplicate({
      Id: 112,
      Value: 'text2'
    }, array, ['Id', 'Value', 'defined'])).toBe(false);
    expect(commonUtils.isDuplicate({
      Id: 112,
      Value: 'text1'
    }, array)).toBe(true);
    expect(commonUtils.isDuplicate({
      Id: 112,
      Value: 'text2'
    }, [])).toBe(false);
    expect(commonUtils.isDuplicate({}, [])).toBe(false);
  });

  it('addKeys should add specified keys (and value) from source to destination object', function () {
    expect(commonUtils.addKeys({}, ['Id', 'Value'], {
      Id: 12,
      Value: 'text',
      another: 'Doesn\'t Matter'
    })).toEqual({
      Id: 12,
      Value: 'text'
    });
  });

  it('convertArrayToObject should convert an array of objects to a single object', function () {
    expect(commonUtils.convertArrayToObject([{
      Id: 2,
      Value: 'X'
    }, {
      Id: 3,
      Value: 'Y'
    }, {}], 'Id', {})).toEqual({
      2: {
        Id: 2,
        Value: 'X'
      },
      3: {
        Id: 3,
        Value: 'Y'
      }
    });
    expect(commonUtils.convertArrayToObject([{
      Id: 2,
      Value: 'X'
    }, {
      Id: 3,
      Value: 'Y'
    }], 'Id')).toEqual({
      2: {
        Id: 2,
        Value: 'X'
      },
      3: {
        Id: 3,
        Value: 'Y'
      }
    });
    expect(commonUtils.convertArrayToObject([], 'Id')).toEqual({});
    expect(commonUtils.convertArrayToObject([], 'Id')).toEqual({});
    expect(commonUtils.convertArrayToObject([])).toEqual({});
    //All blank
    expect(commonUtils.convertArrayToObject()).toEqual({});
    //All Valid
    expect(commonUtils.convertArrayToObject([{
      Id: '2',
      Value: 'Text 1'
    }, {
      Id: '3',
      Value: 'Text 3'
    }], 'Id')).toEqual({
      2: {
        Id: '2',
        Value: 'Text 1'
      },
      3: {
        Id: '3',
        Value: 'Text 3'
      }
    });
    //Invalid Key Attr
    expect(commonUtils.convertArrayToObject([{
      Id: '2',
      Value: 'Text 1'
    }, {
      Id: '3',
      Value: 'Text 3'
    }], 'A', {})).toEqual({});
    //Blank/Invalid Array
    expect(commonUtils.convertArrayToObject([], 'Id', {})).toEqual({});
    //Key Attr blank
    expect(commonUtils.convertArrayToObject([{
      Id: '2',
      Value: 'Text 1'
    }, {
      Id: '3',
      Value: 'Text 3'
    }], '', {})).toEqual({});
    //Undefined Object
    expect(commonUtils.convertArrayToObject([{
      Id: '2',
      Value: 'Text 1'
    }, {
      Id: '3',
      Value: 'Text 3'
    }], 'Id')).toEqual({
      2: {
        Id: '2',
        Value: 'Text 1'
      },
      3: {
        Id: '3',
        Value: 'Text 3'
      }
    });
  });

  it('isInvalid checks for element and its value', function () {
    //Undefined Element
    expect(commonUtils.isInvalid()).toBe(true);
    //null value
    expect(commonUtils.isInvalid(null)).toBe(true);
    //null value
    expect(commonUtils.isInvalid('Value')).toBe(false);
  });

  it('isValidObject checks whether the object is valid', function () {
    //Undefined Element
    expect(commonUtils.isValidObject()).toBe(undefined);
    //Blank value
    expect(commonUtils.isValidObject({})).toBe(true);
    //Invalid Value
    expect(commonUtils.isValidObject(12)).toBe(false);
    //Valid value
    expect(commonUtils.isValidObject({
      Value: 'Text1'
    })).toBe(true);
  });

  it('isValidArray checks whether the array is valid', function () {
    //Undefined Element
    expect(commonUtils.isValidArray()).toBe(undefined);
    //Blank value
    expect(commonUtils.isValidArray([])).toBe(true);
    //Invalid Value
    expect(commonUtils.isValidArray({
      Value: 'Text1'
    })).toBe(false);
    //Valid values
    expect(commonUtils.isValidArray([1, 2, 3, 4])).toBe(true);
  });

  it('containsKeys checks whether the keys given are present in object', function () {
    //Undefined Object & keys
    expect(commonUtils.containsKeys()).toBe(false);
    //Blank Key
    expect(commonUtils.containsKeys({
      Id: '1',
      Value: 'Text'
    }, [])).toBe(true);
    //Blank Object
    expect(commonUtils.containsKeys({}, ['Value'])).toBe(false);
    //Vlid Keys & Object
    expect(commonUtils.containsKeys({
      Id: '1',
      Value: 'Text'
    }, ['Value'])).toBe(true);
  });

  it('copy used to copy the elements from array', function () {
    expect(commonUtils.copy([1, 2, 3, 4], [5, 6, 7, 2])).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('union used to get the union of elements from arrays', function () {
    expect(commonUtils.union([1, 2, 3, 4], [5, 6, 7, 2])).toEqual([4, 3, 2, 1, 7, 6, 5]);
  });

  it('valuesArray should return keys of the object passed in', function () {
    expect(commonUtils.valuesArray({})).toEqual([]);
    expect(commonUtils.valuesArray(undefined)).toEqual([]);
    expect(commonUtils.valuesArray(null)).toEqual([]);
    expect(commonUtils.valuesArray({
      Id: 1,
      Value: 'test'
    })).toEqual([1, 'test']);
  });

  it('sortCollection sorts the given collection with the provided Attribute', function () {
    //All Valid Params
    expect(commonUtils.sortCollection('Id', [{
      Id: '2',
      Value: 'Text 2'
    }, {
      Id: '3',
      Value: 'Text 3'
    }, {
      Id: '1',
      Value: 'Text 1'
    }])).toEqual([{
      Id: '1',
      Value: 'Text 1'
    }, {
      Id: '2',
      Value: 'Text 2'
    }, {
      Id: '3',
      Value: 'Text 3'
    }]);
    //Invalid Sort By
    expect(commonUtils.sortCollection('Id1', [{
      Id: '2',
      Value: 'Text 2'
    }, {
      Id: '3',
      Value: 'Text 3'
    }, {
      Id: '1',
      Value: 'Text 1'
    }])).toEqual([]);
    //Invalid Collection
    expect(commonUtils.sortCollection('Id', [])).toEqual([]);
  });

  it('removeKeys removes the given keys from a collection', function () {
    //All Valid Params
    expect(commonUtils.removeKeys({
      Id: '2',
      Value: 'Text 2'
    }, ['Id'])).toEqual({
      Value: 'Text 2'
    });
    //Invalid Collection
    expect(commonUtils.removeKeys({
      Value: 'Text 2'
    }, ['Id'])).toEqual({
      Value: 'Text 2'
    });
    // Invalid Keys
    expect(commonUtils.removeKeys({
      Id: '2',
      Value: 'Text 2'
    }, ['Id1'])).toEqual({
      Id: '2',
      Value: 'Text 2'
    });
  });

  it('nonEmptyElements gets the non empty elements in the given array', function () {
    //All Valid Params
    expect(commonUtils.nonEmptyElements(['A', 'B', 'C', 'D'])).toEqual(['A', 'B', 'C', 'D']);
    //Empty Array
    expect(commonUtils.nonEmptyElements([])).toEqual([]);
    //Undefined Array
    expect(commonUtils.nonEmptyElements()).toEqual([]);
  });

  it('exclusiveList gets the difference between two arrays', function () {
    //Valid Params without primary key and contain
    expect(commonUtils.exclusiveList([1, 2, 3, 4, 5], [5, 6, 7, 8, 9])).toEqual([1, 2, 3, 4]);
    //Valid Params with primary key and contain(contains function)
    expect(commonUtils.exclusiveList([{
      Id: '2',
      Value: 'Text 2'
    }, {
      Id: '1',
      Value: 'Text 2'
    }, {
      Id: '3',
      Value: 'Text 3'
    }], [{
      Id: '2',
      Value: 'Text 2'
    }, {
      Id: '5',
      Value: 'Text 2'
    }, {
      Id: '3',
      Value: 'Text 3'
    }], commonUtils.contains, 'Id')).toEqual([]);
    //Valid Params with primary key and contain(notContains function)
    expect(commonUtils.exclusiveList([{
      Id: '2',
      Value: 'Text 2'
    }, {
      Id: '1',
      Value: 'Text 2'
    }, {
      Id: '3',
      Value: 'Text 3'
    }], [{
      Id: '2',
      Value: 'Text 2'
    }, {
      Id: '5',
      Value: 'Text 2'
    }, {
      Id: '3',
      Value: 'Text 3'
    }], commonUtils.notContains, 'Id')).toEqual([{
      Id: '2',
      Value: 'Text 2'
    }, {
      Id: '1',
      Value: 'Text 2'
    }, {
      Id: '3',
      Value: 'Text 3'
    }]);
  });

  it('contains used to check for the element\'s existance', function () {
    //Valid Params
    expect(commonUtils.contains({
      Id: '2',
      Value: 'Text 2'
    }, [], 'Id')).toEqual(true);
    //InValid key
    expect(commonUtils.contains({
      Id: '2',
      Value: 'Text 2'
    }, [], 'Id1')).toEqual(false);
    //InValid key
    expect(commonUtils.contains({}, [], 'Id')).toEqual(false);
  });

  it('notContains used to check for the element\'s existance', function () {
    //Valid Params
    expect(commonUtils.notContains({
      Id: '2',
      Value: 'Text 2'
    }, [], 'Id')).toEqual(false);
    //InValid key
    expect(commonUtils.notContains({
      Id: '2',
      Value: 'Text 2'
    }, [], 'Id1')).toEqual(true);
    //InValid Object
    expect(commonUtils.notContains({}, [], 'Id1')).toEqual(true);
  });

  it('filterElements used to check for differences between two array of Objects', function () {
    //Same Objects
    expect(commonUtils.filterElements([{
      Id: '2',
      Value: 'Text 2'
    }, {
      Id: '1',
      Value: 'Text 2'
    }, {
      Id: '3',
      Value: 'Text 3'
    }], [{
      Id: '2',
      Value: 'Text 2'
    }, {
      Id: '1',
      Value: 'Text 2'
    }, {
      Id: '3',
      Value: 'Text 3'
    }], commonUtils.contains, commonUtils.compare, ['Id'], 'Id')).toEqual([]);
    //Different Objects
    expect(commonUtils.filterElements([{
      Id: '2',
      Value: 'Text 2'
    }, {
      Id: '1',
      Value: 'Text 2'
    }, {
      Id: '3',
      Value: 'Text 3'
    }], [{
      Id: '2',
      Value: 'Text 2'
    }, {
      Id: '5',
      Value: 'Text 2'
    }, {
      Id: '3',
      Value: 'Text 3'
    }], commonUtils.contains, commonUtils.compare, ['Id'], 'Id')).toEqual([{
      Id: '1',
      Value: 'Text 2'
    }]);
    //Without primaryKey
    expect(commonUtils.filterElements([{
      Id: '2',
      Value: 'Text 2'
    }, {
      Id: '1',
      Value: 'Text 2'
    }, {
      Id: '3',
      Value: 'Text 3'
    }], [{
      Id: '2',
      Value: 'Text 2'
    }, {
      Id: '5',
      Value: 'Text 2'
    }, {
      Id: '3',
      Value: 'Text 3'
    }], commonUtils.notContains, commonUtils.compare, ['Id'], 'Id')).toEqual([]);
  });

  it('compare used to check for differences between an object and array of Objects', function () {
    expect(commonUtils.filterElements({
      Id: '2',
      Value: 'Text 2'
    }, [{
      Id: '4',
      Value: 'Text 2'
    }, {
      Id: '1',
      Value: 'Text 2'
    }, {
      Id: '3',
      Value: 'Text 3'
    }], ['Id'], 'Id')).toEqual([]);

    expect(commonUtils.filterElements({
      Id: '2',
      Value: 'Text 5'
    }, [{
      Id: '4',
      Value: 'Text 2'
    }, {
      Id: '1',
      Value: 'Text 2'
    }, {
      Id: '3',
      Value: 'Text 3'
    }], ['Value'], 'Value')).toEqual([]);
  });

  it('difference used to get the difference between two objects by value', function () {
    expect(commonUtils.difference({

    }, {
      Id: '3',
      Value: 'Text 2'
    })).toEqual(['Id']);
  });
});
