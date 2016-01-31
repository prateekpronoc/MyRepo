(function () {
  'use strict';

  angular
    .module('wams.company')
    .factory('CompaniesService', CompaniesService);

  /* @ngInject */
  function CompaniesService($http) {
    var service = {
      createCompany: createCompany,
      getAllCompanies: fetchAllCompanies,
      getCompanyById: fetchCompanyById
    };
    return service;

    ////////////////

    function createCompany(request) {
      return $http.post('api/tenants', request).then(function (response) {
          if (response) {
            return response;
          }
        },
        function (error) {
          return error;
        });
    }

    function fetchAllCompanies(request) {
      return $http.get('api/tenants', {
        params: request
      }).then(function (response) {
          if (response) {
            return response.data;
          }
        },
        function (error) {
          return error;
        });
    }

    function fetchCompanyById(request) {
      return $http.get('api/tenants', {
        params: {
          id: request
        }
      }).then(function (response) {
          if (response) {
            return response.data.rows;
          }
        },

        function (error) {
          return error;
        });
    }
  }
})();


