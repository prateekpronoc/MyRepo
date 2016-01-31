(function () {
  'use strict';

  angular
    .module('hp.common')
    .factory('catalogServices', catalogServices);

  /* @ngInject */
  function catalogServices($http) {
    var service = {
        fetchCatalogValues: fetchCatalogValues,
        fetchMasterCatalogCode: fetchMasterCatalogCode
      },
      catalogCodes = {
        meetingRooms: 1,
        meetingRoomInfra: 2,
        country: 3,
        state: 4,
        city: 5,
        resourceType: 6,
        accountType: 7,
        factors: 8,
        roles: 11,
        actions: 12
      };
    return service;

    ////////////////

    function fetchMasterCatalogCode(request) {
      return catalogCodes[request];
    }

    function fetchCatalogValues(req) {
      var catalogValues = {};
      return $http.get('/api/catalogvalues', {
        params: req.request
      }).then(function (response) {
        if (response && response.data) {
          if (response.data.rows) {
            angular.forEach(response.data.rows, function (val) {
              catalogValues[val.id] = val.value;
            });
          }
        }
        return catalogValues;
      }, function (error) {
        return error;
      });
    }
  }
})();
