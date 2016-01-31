(function () {
  'use strict';

  angular
    .module('wams.admin')
    .factory('userService', userService);

  /* @ngInject */
  function userService($resource, $http) {

    var service = {
      getAllUsers: fetchAllUser,
      getUserById: fetchUserById,
      createUser: saveUser
    };

    function saveUser(request) {
      return $http.post('/api/users', request).then(function (response) {
        return response;
      }, function (error) {
       // console.log(error);
      //  console.log(error);
      });
    }

    function fetchAllUser(request) {
      return $http.get('/api/users', {
        params: request
      }).then(function (response) {
        if (response.data) {
          return response.data;
        }
      });
    }

    function fetchUserById(request) {
      return $http.get('api/users', {
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
    return service;
  }
})();
