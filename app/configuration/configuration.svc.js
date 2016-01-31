(function () {
  'use strict';

  angular
    .module('wams.configuration')
    .factory('configurationService', configurationService);
  /* @ngInject */
  function configurationService($http) {
    var service = {
      getAllCatalog: fetchAllCatalog
    };
    return service;

    ////////////////

    function fetchAllCatalog() {
      return $http.get('/api/catalogvalues').then(function (response) {
        if (response.data) {
          return response.data;
        }
      });
    }
  }
})();
