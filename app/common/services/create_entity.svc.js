(function () {
  'use strict';

  angular
    .module('hp.common')
    .factory('saveEntityService', saveEntityService);

  /* @ngInject */
  function saveEntityService($http) {
    var service = {
      createEntity: createEntity
    };
    return service;

    ////////////////

    function createEntity(object) {
      return $http.post('/api/' + object.key, object.request)
        .then(function (response) {
          return response;
        }, function (response) {
          return response;
        });
    }
  }
})();
