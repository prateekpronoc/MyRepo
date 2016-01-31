(function () {
  'use strict';

  angular
    .module('hp.common')
    .factory('responseInterceptor', responseInterceptor)
    .config(['$httpProvider',
      function ($httpProvider) {
        $httpProvider.interceptors.push('responseInterceptor');
      }
    ]);

  /* @ngInject */
  function responseInterceptor() {
    var service = {
        response: handleResponse
      },
      reverseReplacements = {
        SalaryPackageTypes: 'list',
        GetAllEligibilityCriteriaTypes: 'list',
        DepartmentCollection: 'list',
        GetAllSubJobNameTypes: 'list',
        AllCampusSubJobs: 'list',
        InterviewPanel: 'list',
        CollegeGroupCollection: 'list',
        Departments: 'list',
        JsonUserCollection: 'list',
        SelectionProcess: 'list',
        RecordCount: 'TotalItemCount'
      };
    return service;

    function handleResponse(response) {
      if (angular.isDefined(response.data) && angular.isObject(response.data)) {
        response.data = processResponseAttributes(response.data);
      }
      return response;
    }

    function processResponseAttributes(data) {
      var dest = {};
      angular.forEach(data, function (item, key) {
        if (angular.isDefined(reverseReplacements[key])) {
          this[reverseReplacements[key]] = item;
        } else {
          this[key] = item;
        }
      }, dest);
      if (dest.length === 0) {
        return data;
      } else {
        return dest;
      }
    }
  }
})();
