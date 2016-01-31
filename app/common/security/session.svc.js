(function () {
  'use strict';

  angular
    .module('hp.common.security')
    .factory('session', session);

  /* @ngInject */
  function session($http, $q, _, $window) {
    var service = {
        login: login,
        hasRole: hasRole,
        getTenantId: getTenantId,
        getUserId: getUserId,
        getUser: getUser,
        getUserName: getUserName,
        getUserInfo: getUserInfo,
        getUserEmail: getUserEmail,
        getCatalogs: getCatalogs
      },

      catalogObj = {},
      catalogMasterObje = {},
      user;
    return service;

    ////////////////

    function login(credentials) {
      var catalogmasters = {},
        responseObj = {},
        catalogvalues = {},
        roles = [];
      return $http.post('/api/users/auth', credentials)
        .then(function (response) {
          if (response.status === 401) {
            return $q.reject();
          }
          if (response.headers('Authorization') !== null) {
            $window.sessionStorage.token = response.headers('Authorization');
          }
          if (response.headers('Authorization') === null || !angular.isDefined(response.headers('Authorization'))) {
            if (response.data.Message) {
              return $q.reject();
            } else {
              return $q.reject();
            }
          }
          console.log(response);
          responseObj.userInfo = response.data;
          setUserInfo(responseObj.userInfo);
          setUserName(response.data.name);
          setUserId(response.data.id);
          setTenantId(response.data.tenantId);
          setUserEmail(response.data.email);
          return $http.get('/api/catalogmasters?name=Role');
        })
        .then(function (response) {
          if (!response) {
            return $q.reject();
          }
          if (response.data.rows && response.data.rows.length === 0) {
            return $q.reject();
          }
          catalogmasters = _.zipObject(_.pluck(response.data.rows, 'name'), _.pluck(response.data.rows, 'id'));
          catalogObj = catalogmasters;
          responseObj.catalogMasters = catalogObj;
          return $http.get('/api/catalogvalues?masterId=' + catalogmasters['Role']);
        })
        .then(function (response) {
          if (!response) {
            return $q.reject();
          }
          if (response.data.rows && response.data.rows.length === 0) {
            return $q.reject();
          }
          catalogvalues = _.zipObject(_.pluck(response.data.rows, 'id'), _.pluck(response.data.rows, 'value'));
          return $http.get('/api/userroles?uid=' + responseObj.userInfo.id);
        })
        .then(function (response) {
          for (var i = 0; i < response.data.rows.length; i = i + 1) {
            roles.push(catalogvalues[response.data.rows[i].roleId]);
          }
          roles.push();
          setUserRoles(roles);
          return $http.get('/api/catalogmasters', {
            limit: 100
          });
          //return responseObj;
        }).then(function (response) {
          if (!response) {
            catalogMasterObje = {};
          }
          setCatalogMaster(_.zipObject(_.pluck(response.data.rows, 'id'), _.pluck(response.data.rows, 'name')));
          // console.log(catalogMasterObje);
          return responseObj;

        })
        .catch(function (e) {
          return {
            error: 'The email and password you entered donot match.'
          };
        });
    }

    function setCatalogMaster(argument) {
      $window.sessionStorage.catalogmasters = JSON.stringify(argument);
    }

    function getCatalogs() {
      return $window.sessionStorage.catalogmasters;
    }

    function getUser() {
      var token,
        deferred = $q.defer();

      if (user) {
        deferred.resolve(user);
      } else {
        // token = getToken();
        if (token) {
          $http.get('/users/auth').then(
            function (response) {
              deferred.resolve(response.data);
              if (!response.data) {
                deferred.reject(response.data);
                //service.logout();
              } else {
                deferred.resolve(response.data);
                user = response.data;
                //publishUserPermissions(user);
              }
            },
            function (response) {
              deferred.reject(response.data);
            });
        } else {
          deferred.reject();
          // service.logout();
        }
      }
      return deferred.promise;
    }


    function setUserRoles(roles) {
      $window.sessionStorage.roles = roles;
    }

    function hasRole(role) {
      if (($window.sessionStorage.roles).indexOf(role) > -1) {
        return true;
      }
      return false;
    }

    function setTenantId(tenantId) {
      $window.sessionStorage.tenantId = tenantId;
    }

    function getTenantId() {
      return $window.sessionStorage.tenantId;
    }

    function setUserId(userId) {
      $window.sessionStorage.userId = userId;
    }

    function getUserId() {
      return $window.sessionStorage.userId;
    }

    function setUserName(userName) {
      $window.sessionStorage.userName = userName;
    }

    function getUserName() {
      return $window.sessionStorage.userName;
    }

    function setUserInfo(usrInfo) {
      $window.sessionStorage.userInfo = usrInfo;
    }

    function getUserInfo() {
      return $window.sessionStorage.userInfo;
    }

    function setUserEmail(email) {
      $window.sessionStorage.userEmail = email;
    }

    function getUserEmail() {
      return $window.sessionStorage.userEmail;
    }

  }
})();
