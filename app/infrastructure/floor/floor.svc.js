(function () {
  'use strict';

  angular
    .module('wams.infrastructure')
    .factory('FloorService', FloorService);
  /* @ngInject */
  function FloorService($http) {
    var service = {
      createFloor: postFloor,
      getAllFloors: fetchAllFloors,
      getFloorById: fetchFloorById
    };
    return service;

    ////////////////

    function postFloor(request) {
      return $http.post('api/floors', request).then(function (response) {
          if (response) {
            return response;
          }
        },
        function (error) {
          return error;
        });
    }

    function fetchAllFloors(request) {
      return $http.get('/api/floors', {
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

    function fetchFloorById(request) {
      return $http.get('api/floors', {
        params: {
          id: request
        }
      }).then(function (response) {
        if (response) {
          return response.data;
        }
      }, function (error) {
        return error;
      });
    }
  }
})();
