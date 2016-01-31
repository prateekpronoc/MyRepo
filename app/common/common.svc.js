(function () {
  'use strict';

  angular
    .module('hp.common')
    .factory('commonService', commonService);

  /* @ngInject */
  function commonService($http, $window, commonUtils, notifier, $q, $location, $anchorScroll, catalogService) {
    var service = {
      pagingCriteria: {
        MaxResults: 25,
        PageNo: 1,
        IsSpecificToUser: false,
        ObjectState: 0,
        SortParameter: '0',
        SortOrder: '0',
        IsRefresh: false
      },
      pagingOptions: {
        rowCount: 1,
        columnCount: 20,
        totalDataRecordCount: 0,
        pageRecordOptionsArray: [],
        recordsPerPage: 0,
        pagingRange: 5,
        currentPage: 1
      },
      roleNames: {},
      formatDate: formatDate,
      keyChanger: keyChanger,
      getAllRoles: getAllRoles,
      getRoleDetailsByConstant: getRoleDetailsByConstant,
      parseDate: parseDate,
      normalizeFieldTitles: normalizeFieldTitles,
      normalizeField: normalizeField,
      getPagingOptions: getPagingOptions,
      parseInt: parseInteger,
      processItems: processItems,
      bitwiseOp: bitwiseOp,
      toFromFormatter: toFromFormatter,
      getApplicationPreferences: getApplicationPreferences,
      saveApplicationPreferences: saveApplicationPreferences,
      scrollToBottom: scrollToBottom,
      getSelectedCount: getSelectedCount,
      parseXlsData: parseXlsData,
      getCatalogMaster: getCatalogMaster,
      processCatalogs: processCatalogs,
      getBaseUrl: commonUtils.getBaseUrl,
      utils: commonUtils,
      getAllCurrency: getAllCurrency,
      session: commonUtils.session,
      http: deferredPost,
      _: $window._,
      notifier: notifier,
      catalogs: catalogService
    };
    addMixins();
    return service;

    ////////////////

    function addMixins() {
      service._.mixin({
        arrayToObject: commonUtils.convertArrayToObject,
        convertToObject: processItems,
        processCatalogs: processCatalogs
      });
    }

    function processCatalogs(object) {
      return service._.transform(object, function (result, value, key) {
        result[key] = processItems(value, 'CatalogValueId', 'Name');
      });
    }

    function deferredPost(url, jsonRequest, responseHandler, errorHandler) {
      var deferred = $q.defer();
      $http.post(url, jsonRequest).then(function (response) {
        var resp = responseHandler ? responseHandler(response) : response;
        if (service._.isObject(resp)) {
          deferred.resolve(resp);
        } else {
          deferred.reject(resp);
        }
      }, function (response) {
        deferred.reject(errorHandler ? errorHandler(response) : response);
      });
      return deferred.promise;
    }

    function getPagingOptions() {
      return angular.copy(service.pagingOptions);
    }

    function bitwiseOp(x, y, operation, bitsShifted, isRighShift) {
      /*jshint bitwise: false */
      var value = 0;
      if (operation === '&') {
        value = x & y;
      } else if (operation === '|') {
        value = x | y;
      }
      if (bitsShifted > 0) {
        if (isRighShift) {
          value = value >> bitsShifted;
        } else {
          value = value << bitsShifted;
        }
      }
      return value;
    }

    function formatDate(dt, options) {
      var formattedDate = '',
        tempDate, tempTime = {};
      if (dt) {
        tempDate = new Date(dt);
        formattedDate = tempDate.getDate();
        formattedDate += '/';
        formattedDate += parseInt(tempDate.getMonth() + 1) < 10 ? '0' + parseInt(tempDate.getMonth() + 1) :
          parseInt(tempDate.getMonth() + 1);
        formattedDate += '/' + tempDate.getFullYear();
        if (angular.isDefined(options) && angular.isDefined(options.time)) {
          if (options.time === 'hh:mm' || options.time === 'hh:mm:ss') {
            if (tempDate.getHours() > 12) {
              tempTime.hours = tempDate.getHours() - 12;
              tempTime.formate = 'PM';
            } else if (tempDate.getHours() === 0) {
              tempTime.hours = 12;
              tempTime.formate = 'AM';
            } else {
              tempTime.hours = tempDate.getHours();
              tempTime.formate = 'AM';
            }
          } else {
            tempTime.hours = tempDate.getHours();
            tempTime.formate = '';
          }
          tempTime.minutes = tempDate.getMinutes();
          formattedDate += ' ';
          formattedDate += tempTime.hours < 10 ? '0' + tempTime.hours : tempTime.hours;
          formattedDate += ':';
          formattedDate += tempTime.minutes < 10 ? '0' + tempTime.minutes : tempTime.minutes;
          formattedDate += ' ' + tempTime.formate;
        }
      }
      return formattedDate;
    }

    function processItems(items, idField, nameField, processedJson, preProcessor, alternativeField) {
      if (!processedJson) {
        processedJson = {};
      }
      if (!commonUtils.isValidArray(items) || items.length === 0) {
        return processedJson;
      }
      var i, nameFields = nameField.split('.');
      for (i = 0; i < items.length; i += 1) {
        if (items[i] && ((preProcessor && preProcessor(items[i])) || !preProcessor) && items[i][idField]) {
          processedJson['' + items[i][idField]] = nameFields.length === 1 ? items[i][nameField] ?
            items[i][nameField] : alternativeField ? items[i][alternativeField] : null :
            getFieldValue(items[i], nameFields);
        }
      }
      return processedJson;
    }

    function getFieldValue(item, fields) {
      if (!fields || fields.length === 0) {
        return null;
      }
      var i, obj = item;
      for (i = 0; i < fields.length; i += 1) {
        if (!obj[fields[i]]) {
          return null;
        }
        obj = obj[fields[i]];
      }
      return obj;
    }

    function keyChanger(keys, collection) {
      var newCollection = [];
      angular.forEach(collection, function (key) {
        var tempObj = {},
          tempKeyName;
        angular.forEach(key, function (a, b) {
          if (!angular.isUndefined(keys[b])) {
            tempObj[keys[b]] = a;
          } else {
            tempKeyName = '';
            tempKeyName = (b.substring(0, 1)).toLowerCase() + b.substring(1);
            tempObj[tempKeyName] = null;
            tempObj[tempKeyName] = a;
          }
        });
        newCollection.push(tempObj);
      });
      return newCollection;
    }

    function getAllRoles() {
      var json = {
        MethodName: 'GetAllRoleNames'
      };
      return $http.post('/JSONServices/JSONUserManagementService.svc/GetAllRoleNames', json).then(
        function (response) {
          if (angular.isDefined(response) && angular.isDefined(response.data) && angular.isDefined(response.data
              .AllRoleNames) && response.data.AllRoleNames.length > 0) {
            $window.localStorage.roleNames = JSON.stringify(commonUtils.convertArrayToObject(
              keyChanger({
                ObjectId: 'id'
              }, response.data.AllRoleNames),
              'name'));
          }
          return true;
        },
        function (response) {
          return response;
        }
      );
    }

    function getRoleDetailsByConstant(key) {
      var roles = {},
        deferred = $q.defer();
      if (!angular.isUndefined(key)) {
        if (angular.isDefined($window.localStorage.roleNames) && $window.localStorage.roleNames !== '') {
          roles = JSON.parse($window.localStorage.roleNames);
          deferred.resolve({
            roleDetails: roles[key] !== null || angular.isDefined(roles[key]) ? roles[key] : null
          });
        } else {
          getAllRoles().then(function () {
            roles = JSON.parse($window.localStorage.roleNames);
            deferred.resolve({
              roleDetails: roles[key] !== null || angular.isDefined(roles[key]) ? roles[key] : null
            });
          });
        }
        return deferred.promise;
      }
    }

    function parseDate(dtText, format) {
      if (angular.isUndefined(dtText) || dtText.length === 0) {
        return null;
      }
      var separator = '/',
        y, m, d, findex, sindex, t;
      if (dtText.indexOf('-') > -1) {
        separator = '-';
      }
      if (angular.isUndefined(format)) {
        format = 'dd-mm-yyyy';
      }
      if (dtText.indexOf(separator) === -1) {
        return null;
      }
      findex = dtText.indexOf(separator);
      sindex = dtText.slice(findex + 1).indexOf(separator) + findex + 1;
      d = parseInt(dtText.slice(0, findex));
      m = parseInt(dtText.slice(findex + 1, sindex));
      y = parseInt(dtText.slice(sindex + 1));
      if (format.toUpperCase().indexOf('DD') === 3) {
        t = m;
        m = d;
        d = t;
      }
      // $log.log('Text = ' + dtText + ' ' + dtText.slice(findex + 1) + ' fIndex = ' + findex + ' sIndex = ' +
      //   sindex + ' D = ' + d + ' M = ' + m +
      //   ' y = ' + y);
      return new Date(y, m - 1, d);
    }

    function parseInteger(value) {
      if (angular.isDefined(value)) {
        return parseInt('' + value);
      } else {
        return 0;
      }
    }

    function normalizeFieldTitles(data, idField, generatedField) {
      if (angular.isUndefined(data)) {
        return data;
      }
      if (angular.isArray(data)) {
        for (var i = 0; i < data.length; i += 1) {
          if (angular.isObject(data[i]) && angular.isDefined(data[i][idField]) && angular.isUndefined(data[i]
              [
                generatedField
              ])) {
            data[i][generatedField] = normalizeField(data[i][idField]);
          }
        }
      } else if (angular.isObject(data) && angular.isDefined(data[idField]) && angular.isUndefined(data[
          generatedField
        ])) {
        data[generatedField] = normalizeField(data[idField]);
      }
      return data;
    }

    function normalizeField(text) {
      if (!text || text.length === 0) {
        return '';
      }
      var modifiedText = '' + text.charAt(0),
        i;
      modifiedText = modifiedText.toUpperCase();
      for (i = 1; i < text.length; i += 1) {
        if (isUpperCase(text.charAt(i))) {
          modifiedText += ' ';
        }
        modifiedText += text.charAt(i);
      }
      return modifiedText;
    }

    function isUpperCase(ch) {
      return ch && ch >= 'A' && ch <= 'Z';
    }

    //json should have to,from,seprator,defaultValue,defaultToValue,defaultFromValue
    // if default value is not given then 'NA' will be taken as default value
    //if seprator is not send then '-' will be taken as seprator
    function toFromFormatter(json) {
      if (!angular.isUndefined(json)) {
        var to,
          from,
          defaultToValue,
          defaultFromValue,
          seprator,
          defaultValue,
          finalValue;
        if (!angular.isUndefined(json.seprator) && json.seprator !== null) {
          seprator = json.seprator;
        } else {
          seprator = ' - ';
        }
        if (!angular.isUndefined(json.defaultValue) && json.defaultValue !== null) {
          defaultValue = json.defaultValue;
        } else {
          defaultValue = '';
        }
        if (!angular.isUndefined(json.defaultToValue) && json.defaultToValue !== null) {
          defaultToValue = json.defaultToValue;
        } else {
          defaultToValue = 0;
        }
        if (!angular.isUndefined(json.defaultFromValue) && json.defaultFromValue !== null) {
          defaultFromValue = json.defaultFromValue;
        } else {
          defaultFromValue = 0;
        }
        if (!angular.isUndefined(json.to) && json.to !== null) {
          to = json.to;
        } else {
          to = defaultToValue;
        }
        if (!angular.isUndefined(json.from) && json.from !== null) {
          from = json.from;
        } else {
          from = defaultFromValue;
        }
        if (!angular.isUndefined(to) && !angular.isUndefined(from)) {
          if (from === defaultFromValue && to !== defaultToValue) {
            finalValue = to;
          } else if (to === defaultToValue && from !== defaultFromValue) {
            finalValue = from;
          } else if (to === defaultToValue && from === defaultFromValue) {
            finalValue = defaultValue;
          } else {
            finalValue = from + seprator + to;
          }
        } else {
          finalValue = defaultValue;
        }
        return json.prefix ? json.prefix + ' ' + finalValue.toString() : finalValue;
      }
    }

    function getApplicationPreferences(request) {
      return $http.post('/JSONServices/JSONSystemService.svc/GetAllAppPreference',
          request)
        .then(
          function (response) {
            if (angular.isUndefined(response.data) || (angular.isDefined(response.data.IsException) &&
                response.data.IsException)) {
              notifier.error('Error encounter while fetching application preference settings : ' + JSON.stringify(
                response.data.Message));
            }
            return response;
          },
          function (response) {
            notifier.error('Error encounter while fetching application preference settings : ' + JSON.stringify(
              response.data.Message));
          });
    }

    function saveApplicationPreferences(request) {
      return $http.post('/JSONServices/JSONSystemService.svc/SaveAppPreference',
          request)
        .then(
          function (response) {
            if (angular.isUndefined(response.data) || (angular.isDefined(response.data.IsException) &&
                response.data
                .IsException)) {
              notifier.error('Error encounter while saving application preference settings : ' + JSON.stringify(
                response.data.Message));
            }
            return response;
          },
          function (response) {
            notifier.error('Error encounter while saving application preference settings  : ' + JSON.stringify(
              response.data.Message));
          });
    }

    function scrollToBottom($scope) {
      $location.hash('bottom');
      $anchorScroll();
      commonUtils.refreshUI($scope);
    }

    function getSelectedCount(obj) {
      if (!obj) {
        return 0;
      }
      var key, count = 0;
      for (key in obj) {
        if (obj.hasOwnProperty(key) && obj[key]) {
          count = count + 1;
        }
      }
      return count;
    }

    function parseXlsData(request) {
      return $http.post('/JSONServices/JSONSystemService.svc/ParseExcelData',
          request)
        .then(
          function (response) {
            if (angular.isUndefined(response.data) || (angular.isDefined(response.data.IsException) &&
                response.data
                .IsException)) {
              notifier.error('Error encounter while uploading excel : ' + JSON.stringify(
                response.data.Message));
            }
            return response;
          },
          function (response) {
            notifier.error('Error encounter while uploading excel  : ' + JSON.stringify(
              response.data.Message));
          });
    }

    function getCatalogMaster() {
      return $http.post('/JSONServices/JSONCommonManagementService.svc/getCatalogMaster', {})
        .then(
          function (response) {
            if (angular.isUndefined(response.data) || (angular.isDefined(response.data.IsException) &&
                response.data
                .IsException)) {
              notifier.error('Error encounter while fetching catalog master : ' + JSON.stringify(
                response.data.Message));
            }
            return response;
          },
          function (response) {
            notifier.error('Error encounter while fetching catalog master  : ' + JSON.stringify(
              response.data.Message));
          });
    }

    function getAllCurrency() {
      var deferred = $q.defer();
      if ($window.localStorage.currency) {
        deferred.resolve(JSON.parse($window.localStorage.currency));
      } else {
        $http.post('/JSONServices/JSONCommonManagementService.svc/GetAllCurrency', {}).then(
          function (rs) {
            if (angular.isDefined(rs) && angular.isDefined(rs.data) && angular.isDefined(rs.data
                .CurrencyCollection) && rs.data.CurrencyCollection.length > 0) {
              var x = {};
              service._.forOwn(rs.data.CurrencyCollection, function (v) {
                (x[v.ISOSymbol] = (v.ISOSymbol + '-' + v.Name + '-' + v.CountryName + ' (' + v.Symbol + ')'));
              });
              $window.localStorage.currency = JSON.stringify(x);
              deferred.resolve(JSON.parse($window.localStorage.currency));
            }
          });
      }
      return deferred.promise;
    }

  }
})();
