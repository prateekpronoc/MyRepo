(function () {
  'use strict';

  angular
    .module('hp.common')
    .factory('fetchEntity', fetchEntity);

  /* @ngInject */
  function fetchEntity($http, _) {
    var service = {
      getById: fetchEntityById,
      getByValues: getByValues,
      filterEntity: filterEntity
    };
    return service;

    ////////////////
    function fetchEntityById(object) {
      console.log(object);
      return $http.get('/api/' + object.key, {
        params: {
          id: object.request.id
        }
      }).then(function (response) {
        if (response) {
          if (response.data !== null) {
            if (_.has(response.data, 'entity')) {
              return response.data.entity;
            } else {
              return response.data;
            }
          }
        }

        //        console.log(response.data.entity);
        return response.data.entity;
      }, function (response) {
        // console.log('Error : ');
        // console.log(response);
      });
    }

    function filterEntity(object) {
      return $http.get('/api/' + object.key, {
        params: object.request
      }).then(function (response) {
        if (response.data !== null) {
          if (_.has(response.data, 'entity')) {
            return response.data.entity;
          } else {
            return response.data;
          }
        }
      }, function (error) {
        console.log(error);
      });
    }

    function getByValues(object) {
      return $http.get('/api/' + object.key + '?' + object.value + '=' + object.request.id).then(function (response) {
        if (response) {
          if (response.data !== null) {
            if (_.has(response.data, 'entity')) {
              return response.data.entity;
            } else {
              return response.data;
            }
          }
        }

        // console.log(response.data.entity);
        return response.data.entity;
      }, function (response) {
        //console.log('Error : ');
        // console.log(response);
      });
    }
  }
})();
