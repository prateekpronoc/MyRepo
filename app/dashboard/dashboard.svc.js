(function () {
  'use strict';

  angular
    .module('wams.dashboard')
    .factory('dashboardService', dashboardService);

  /* @ngInject */
  function dashboardService($http) {

    var service = {
      getAllTenants: fetchAllTenants,
      getAllPremises: fetchAllPremises,
      getAllMeetingRoom: fetchAllMeetingRoom
    };
    return service;

    function fetchAllTenants() {
      return $http.get('api/tenants').then(function (response) {
        if (response.data) {
          return response.data;
        }
      });
    }

    function fetchAllPremises() {
      return $http.get('api/premises').then(function (response) {
        if (response.data) {
          return response.data.entity;
        }
      });
    }

    function fetchAllMeetingRoom() {
      return $http.get('api/meetingrooms').then(function (response) {
        if (response.data) {
          return response.data;
        }
      });
    }
  }
})();
