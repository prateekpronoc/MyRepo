(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .factory('meetingRoomService', meetingRoomService);

  /* @ngInject */
  function meetingRoomService($http, commonUtils, $window) {
    var service = {
      createMeetingRoom: createMeetingRoom,
      getAllMeetingRooms: fetchMeetingRooms,
      getMeetingRoomById: fetchMRoomById,
      getMRoomTypeCatalog: fetchMRoomTypeCatalog,
      getAllBuildings: getAllBuildings,
      getFloorById: getFloorById,
      getFloorPart: getFloorPart,
      getAllUsers: fetchAllUser,
      getUserById: fetchUserById,
      getAllPremises: getAllPremises,
      getMeetingRoomInfra: fetchMeetignRoomInfaByMRoomId,
      getAllTenantUsers: fetchAllTenantUsers,
      getCatalogValueById: getCatalogValueById
    };

    return service;


    ////////////////

    function getCatalogValueById (requestId) {
      return $http.get('/api/catalogvalues?id=' + requestId).then(function (response) {
        if (response.data) {
          return response.data.rows;
        }

        //return $q.resolve(commonUtils.convertArrayToObject(response.data.rows, 'id', 'name'));
      });
    }

    function fetchAllTenantUsers(requestId) {
      return $http.get('/api/users?tenantId=' + requestId).then(function (response) {
        if (response.data) {
          return response.data.rows;
        }

        //return $q.resolve(commonUtils.convertArrayToObject(response.data.rows, 'id', 'name'));
      });
    }

    function fetchMeetignRoomInfaByMRoomId(request) {
      return $http.get('api/meetingroominfras', {
        params: {
          meetingRoomId: request
        }
      }).then(function (response) {
        if (response) {
          return response.data.rows;
        }
      }, function (error) {
        return error;
      });
    }

    function fetchUserById(request) {
      return $http.get('api/users', {
        params: {
          id: request
        }
      }).then(function (response) {
        if (response) {
          return response.data.rows[0];
        }
      }, function (error) {
        console.log(error);
      });
    }

    function fetchAllUser(request) {
      return $http.get('/api/users', request).then(function (response) {
        if (response.data) {
          return response.data.rows;
        }
      });
    }

    function createMeetingRoom(request) {
      return $http.post('api/meetingrooms', request).then(function (response) {
          if (response) {
            return response;
          }
        },
        function (error) {
          return error;
        });
    }

    function fetchMRoomById(request) {
      return $http.get('api/meetingrooms', {
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


    function getAllBuildings() {
      return $http.get('api/buildings').then(function (response) {
          if (response) {
            return response.data.entity;
          }
        },
        function (error) {
          return error;
        });
    }

    function fetchMeetingRooms(request) {
      var string = '';
      _.forOwn(request, function (value, key) {
        if (key && value) {
          string = string + key + '=' + value + '&';
        }
      });
      var newstring = string.substr(0, string.length - 1);
      return $http.get('api/meetingrooms?' + newstring).then(
        function (response) {
          if (response) {
            console.log(response.data);
            return response.data;
          } else {
            console.log(error);
          }
        });
    
    }

    function getFloorById(requestId) {
      return $http.get('api/floors?buildingId=' + requestId).then(function (response) {
          if (response) {
            if (angular.isDefined(response.data) && angular.isDefined(response.data.rows)) {
              return response.data.rows;
            }
            //alert('No Data found');
          }
        },
        function (error) {
          return error;
        });
    }

    function getFloorPart(request) {
      return $http.get('api/floorparts', request).then(function (response) {
          if (response) {
            if (angular.isDefined(response.data) && angular.isDefined(response.data.rows)) {
              return response.data.rows;
            }
            // alert('No Data found');
          }
        },
        function (error) {
          alert('No Data found' + error);
        });
    }

    function fetchMRoomTypeCatalog() {
      return $http.get('api/catalogvalues?masterId=' + 1).then(function (response) {
          if (response) {
            if (angular.isDefined(response.data) && angular.isDefined(response.data.rows)) {
              return response.data.rows;
            }
            //alert('No Data found');
          }
        },
        function (error) {
          alert('No Data found' + error);
        });
    }

    function getAllPremises(request) {
      return $http.get('api/premises', request).then(function (response) {
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
