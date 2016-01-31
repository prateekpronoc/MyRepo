(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .factory('MeetingRoomInfraService', MeetingRoomInfraService);
  /* @ngInject */
  function MeetingRoomInfraService($http) {
    var service = {
      getAllMeetingRoomInfra: fetchAllMeetingInfra,
      getMeetingRoomInfraById: fetchMeetingInfraById,
      createMeetingRoomInfra: save,
      getInfraTypeCatalog: fetchInfraTypeCatalog
    };
    return service;

    ////////////////
    function fetchInfraTypeCatalog() {
      return $http.get('api/catalogvalues?masterId=' + 2).then(function (response) {
          if (response) {
            return response.data.rows;
          }
          alert('No Data found');
        },
        function (error) {
          return error;
        });
    }

    function fetchAllMeetingInfra(request) {
      return $http.get('api/meetingroominfras', {
        params: request
      }).then(function (response) {
        if (response) {
          return response.data;
        }
      });
    }

    function fetchMeetingInfraById(request) {
      return $http.get('api/meetingroominfras', {
        params: {
          id: request
        }
      }).then(function (response) {
        if (response) {
          return response.data.rows;
        }
      }, function (error) {
        console.log(error);
      });
    }

    function save(request) {
      return $http.post('api/meetingroominfras', request).then(function (response) {
          if (response) {
            return response.data;
          }
          alert('No Sent');
        },
        function (error) {
          return error;
        });
    }
  }
})();
// (function () {
//   'use strict';

//   angular
//     .module('wams.meetingroom')
//     .factory('MeetingRoomInfraService', MeetingRoomInfraService);

//   function MeetingRoomInfraService($resource) {
//     return $resource('api/meetingroominfras', {
//       id: '@id'
//     }, {
//       post: {
//         method: 'POST'
//       },
//       get: {
//         method: 'GET',
//         isArray: false
//       },
//       query: {
//         method: 'GET',
//         isArray: false
//       }
//     });
//   }
// })();
