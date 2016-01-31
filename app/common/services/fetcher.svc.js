(function () {
  'use strict';

  angular
    .module('hp.common')
    .factory('fetcher', fetcher);

  /* @ngInject */
  function fetcher($http, _) {
    var service = {
        get: get
      },
      entities = {
        premises: 'premises',
        meetingRooms: 'meetingrooms',
        users: 'users',
        tenants: 'tenants',
        buildings: 'buildings',
        floors: 'floors',
        floorparts: 'floorparts',
        meetingroominfras: 'meetingroominfras',
        transactions: 'transactions',
        accounts: 'accounts'
      };
    return service;

    ////////////////

    function get(object) {
      //  console.log(object);

      return $http.get(apiUrl(object.key), {
        params: object.request
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

        console.log(response.data.entity);
        return response.data.entity;
      }, function (response) {
        return response;
      });
    }

    function apiUrl(key) {
      return '/api/' + entities[key];
    }

  }
})();
