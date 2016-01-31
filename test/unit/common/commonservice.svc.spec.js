'use strict';

describe('commonService', function () {
  var commonService;

  beforeEach(module('hp.common'));

  beforeEach(inject(function (_commonService_) {
    commonService = _commonService_;
  }));

  it('processItems should converts the specified keys to Key Value Pair of a JSON', function () {
    expect(commonService.processItems([{
      Id: 1,
      Name: 'A'
    }, {
      Id: 2,
      Name: 'B'
    }, {
      Id: 3,
      Name: 'C'
    }], 'Id', 'Name', {})).toEqual({
      1: 'A',
      2: 'B',
      3: 'C'
    });
    expect(commonService.processItems([{
      Id: 1,
      NameA: 'A'
    }, {
      Id: 2,
      Name: 'B'
    }, {
      Id: 3,
      Name: 'C'
    }], 'Id', 'Name')).toEqual({
      1: undefined,
      2: 'B',
      3: 'C'
    });
    expect(commonService.processItems([{
      Id1: 1,
      Name: 'A'
    }, {
      Id: 2,
      Name: 'B'
    }, {
      Id: 3,
      Name: 'C'
    }], 'Id', 'Name')).toEqual({
      2: 'B',
      3: 'C'
    });
  });

  it('parseInt converts a value to integer', function () {
    expect(commonService.parseInt('4')).toEqual(4);
    expect(commonService.parseInt('a')).toEqual(NaN);
    expect(commonService.parseInt(undefined)).toEqual(0);
  });

  it('getPagingOptions returns the paging Options specified in the service', function () {
    expect(commonService.getPagingOptions()).toEqual({
      rowCount: 1,
      columnCount: 20,
      totalDataRecordCount: 0,
      pageRecordOptionsArray: [],
      recordsPerPage: 0,
      pagingRange: 5,
      currentPage: 1
    });
  });

  it('keyChanger separates the consolidated JSON array to individual objects in an array', function () {
    expect(commonService.keyChanger({
      ObjectId: 'Id'
    }, [{
      Id: 1,
      Name: 'A'
    }, {
      Id: 2,
      Name: 'B'
    }, {
      Id: 3,
      Name: 'C'
    }])).toEqual([Object({
        id: 1,
        name: 'A'
      }),
      Object({
        id: 2,
        name: 'B'
      }), Object({
        id: 3,
        name: 'C'
      })
    ]);
    expect(commonService.keyChanger({
      ObjectId: 'Id'
    }, [{
      Name: 'A'
    }, {
      Id: 2,
      Name: 'B'
    }, {
      Id: 3,
      Name: 'C'
    }])).toEqual([Object({
        name: 'A'
      }),
      Object({
        id: 2,
        name: 'B'
      }), Object({
        id: 3,
        name: 'C'
      })
    ]);
  });

  it('formatDate gets the date object and process the time options.', function () {
    expect(commonService.formatDate(new Date('02/13/2015 11:59 AM'), {
      time: 'hh:mm'
    })).toEqual('13/02/2015 11:59 AM');
    expect(commonService.formatDate(new Date('02/13/2015 12:00 PM'))).toEqual('13/02/2015');
  });

  //Method Dropped due to Parse Issue.
  // it('parseDate convrts the string date time to a Date Object', function() {
  // 	expect(commonService.parseDate('13/02/2015')).toEqual(Date(Fri Feb 13 2015 00:00:00 GMT+0530 (India Standard Time)));
  // });

  it('normalizeField normalizes the given word', function () {
    expect(commonService.normalizeField('ABCDEF')).toEqual('A B C D E F');
    expect(commonService.normalizeField('JASMINE')).toEqual('J A S M I N E');
    expect(commonService.normalizeField('')).toEqual('');
    expect(commonService.normalizeField('abcdef')).toEqual('Abcdef');
  });

  it('normalizeFieldTitles nromalizes the title by capitalization of JSON Array or Object', function () {
    expect(commonService.normalizeFieldTitles([{
      Id: 1,
      Name: 'text1'
    }, {
      Id: 2,
      Name: 'text2'
    }, {
      Id: 3,
      Name: 'text3'
    }], 'Name', 'NewField')).toEqual([
      Object({
        Id: 1,
        Name: 'text1',
        NewField: 'Text1'
      }),
      Object({
        Id: 2,
        Name: 'text2',
        NewField: 'Text2'
      }),
      Object({
        Id: 3,
        Name: 'text3',
        NewField: 'Text3'
      })
    ]);
    expect(commonService.normalizeFieldTitles([{
      Id: 1,
      Name: 'text1'
    }, {
      Id: 2,
      Name: 'text2'
    }, {
      Id: 3,
      Name: 'text3'
    }], 'Name')).toEqual([
      Object({
        Id: 1,
        Name: 'text1',
        undefined: 'Text1'
      }),
      Object({
        Id: 2,
        Name: 'text2',
        undefined: 'Text2'
      }),
      Object({
        Id: 3,
        Name: 'text3',
        undefined: 'Text3'
      })
    ]);
    expect(commonService.normalizeFieldTitles({
      Id: 1,
      Name: 'text1'
    }, 'Name')).toEqual(
      Object({
        Id: 1,
        Name: 'text1',
        undefined: 'Text1'
      }));
    expect(commonService.normalizeFieldTitles({
      Id: 1,
      Name: 'text1'
    }, 'Name', 'NewField')).toEqual(
      Object({
        Id: 1,
        Name: 'text1',
        NewField: 'Text1'
      }));
    expect(commonService.normalizeFieldTitles({}, 'Name', 'NewField')).toEqual({});
    expect(commonService.normalizeFieldTitles([], 'Name', 'NewField')).toEqual([]);
  });

  it('bitwiseOp utilizes the bit shift', function () {
    expect(commonService.bitwiseOp(1231, 151, '&', 1)).toEqual(270);
    expect(commonService.bitwiseOp(1231, 151, '&')).toEqual(135);
    expect(commonService.bitwiseOp(0, 221, '&')).toEqual(0);
    expect(commonService.bitwiseOp(1221, 0, '&')).toEqual(0);
    expect(commonService.bitwiseOp(1221, 1231, '|')).toEqual(1231);
    expect(commonService.bitwiseOp(0, 1231, '|')).toEqual(1231);
    expect(commonService.bitwiseOp(1221, 0, '|')).toEqual(1221);
    expect(commonService.bitwiseOp(1221, 1231, '|', 1)).toEqual(2462);
  });

  it('toFromFormatter returns the range of from and to with a sepearator', function () {
    expect(commonService.toFromFormatter({
      from: 20,
      to: 30,
      defaultValue: 0
    })).toEqual('20 - 30');
    expect(commonService.toFromFormatter({
      from: undefined,
      to: 30,
      defaultValue: 0
    })).toEqual(30);
    expect(commonService.toFromFormatter({
      from: 20,
      to: undefined,
      defaultValue: 0
    })).toEqual(20);
    expect(commonService.toFromFormatter({})).toEqual('');
    expect(commonService.toFromFormatter({
      defaultValue: 0
    })).toEqual(0);
    expect(commonService.toFromFormatter({
      defaultValue: 0,
      defaultFromValue: 0,
      defaultToValue: 0
    })).toEqual(0);
  });
});
