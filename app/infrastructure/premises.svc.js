(function () {
  'use strict';

  angular
    .module('wams.infrastructure')
    .factory('premisesServices', premisesServices);

  /* @ngInject */
  function premisesServices($http) {
    var service = {
      createPremises: createPremises,
      getAllPremises: fetchAllPremises,
      getPremisesById: fetchPremiseById,
      getPremiseStateCatalog: fetchStateCatalog,
      getPremiseCityCatalog: fetchCityCatalog
    };
    return service;

    ////////////////
    function fetchCityCatalog() {
      return $http.get('api/catalogvalues?masterId=' + 5).then(function (response) {
          if (response) {
            return response.data.rows;
          }
          alert('No Data found');
        },
        function (error) {
          return error;
        });
    }

    function fetchStateCatalog() {
      return $http.get('api/catalogvalues?masterId=' + 4).then(function (response) {
          if (response) {
            return response.data.rows;
          }
          alert('No Data found');
        },
        function (error) {
          alert('No Data found' + error);
        });
    }

    function createPremises(request) {
      return $http.post('api/premises', request).then(function (response) {
          if (response) {
            return response;
          }
        },
        function (error) {
          return error;
        });
    }

    function fetchAllPremises(request) {
      return $http.get('/api/premises', {
        params: request
      }).then(function (response) {
          if (response) {
            return response.data.entity;
          }
        },
        function (error) {
          //to .. the basic 
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
  }
})();




// (function () {
//   'use strict';

//   angular
//     .module('wams.infrastructure')
//     .factory('premisesServices', premisesServices);

//   function premisesServices($resource) {
//     return $resource('api/premises', {
//       id: '@id'
//     }, {
//       get: {
//         method: 'GET'
//       },
//       query: {
//         method: 'GET',
//         isArray: false
//       },
//       post: {
//         method: 'POST'
//       },
//       remove: {
//         method: 'DELETE'
//       }

//     });
//   }
// })();

// (function () {
//   'use strict';
//   angular.module('wams.infrastructure')
//     .factory('premisesServices', premisesServices)
//     .factory('statesServices', statesServices);

//   function premisesServices($resource, $q) {
//     var resource = $resource('http://10.0.3.76:9090/api/premises/:id', {
//         id: '@id'
//       }, {
//         get: {
//           method: 'GET',
//           isArray: true
//         },
//         query: {
//           method: 'GET',
//           isArray: true
//         },
//         post: {
//           method: 'POST'
//         },
//         remove: {
//           method: 'DELETE'
//         }

//       }),
//       deferredObject = $q.defer();

//     resource.query().$promise.then(function (response) {
//       deferredObject.resolve(response);
//       return deferredObject.promise;

//     }, function (errorMsg) {
//       deferredObject.reject(errorMsg);
//       return deferredObject.promise;
//     });

//     resource.get().$promise.then(function (response) {
//       deferredObject.resolve(response);
//       return deferredObject.promise;

//     }, function (errorMsg) {
//       deferredObject.reject(errorMsg);
//       return deferredObject.promise;
//     });

//     return resource;
//   }

//   function statesServices($resource, $q) {
//     var resource = $resource('http://10.0.3.76:9090/api/states/:id', {
//         id: '@id'
//       }, {
//         get: {
//           method: 'GET',
//           isArray: true
//         },
//         query: {
//           method: 'GET',
//           isArray: true
//         }
//       }),
//       deferredObject = $q.defer();

//     resource.query().$promise.then(function (response) {
//       deferredObject.resolve(response);
//       return deferredObject.promise;

//     }, function (errorMsg) {
//       deferredObject.reject(errorMsg);
//       return deferredObject.promise;
//     });
//     resource.get().$promise.then(function (response) {
//       deferredObject.resolve(response);
//       return deferredObject.promise;

//     }, function (errorMsg) {
//       deferredObject.reject(errorMsg);
//       return deferredObject.promise;
//     });

//     return resource;
//   }
// })();
