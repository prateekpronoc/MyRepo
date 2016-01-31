(function () {
  'use strict';

  angular
    .module('wams.infrastructure')
    .factory('BuildingService', BuildingService);
  /* @ngInject */
  function BuildingService($http) {
    var service = {
      createBuilding: postBuilding,
      getAllBuildings: fetchAllBuildings,
      getPremiseById: fetchPremiseById,
      getBuildingById: fetchBuildingById
    };
    return service;

    ////////////////

    function postBuilding(request) {
      return $http.post('api/buildings', request).then(function (response) {
          if (response) {
            return response;
          }
        },
        function (error) {
          return error;
        });
    }

    function fetchAllBuildings(request) {
      return $http.get('/api/buildings', {
        params: request
      }).then(function (response) {
          if (response) {
            return response.data.entity;
          }
        },
        function (error) {
          return error;
        });
    }

    function fetchPremiseById(request) {
      return $http.get('api/premises', {
        params: {
          id: request
        }
      }).then(function (response) {
          if (response) {
            return response.data.entity;
          }
        },
        function (error) {
          return error;
        });
    }

    function fetchBuildingById(request) {
      return $http.get('api/buildings', {
        params: {
          id: request
        }
      }).then(function (response) {
          if (response) {
            return response.data.entity;
          }
        },
        function (error) {
          return error;
        });
    }
  }
})();
