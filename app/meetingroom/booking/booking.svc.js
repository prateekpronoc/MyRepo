(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .factory('bookingService', bookingService);

  function bookingService($http, _) {
    var service = {
      makeBooking: postBooking,
      getBookingByUserId: getBookingByUserId
    };
    return service;

    ////////////////
    function postBooking(request) {
      return $http.post('api/bookings', request).then(function (response) {
          if (response) {
            return response.data;
          }
          alert('No Sent');
        },
        function (error) {
          return error;
        });
    }

    function getBookingByUserId(request) {
      var string = '';
      _.forOwn(request, function (value, key) {
        if (key && value) {
          string = string + key + '=' + value + '&';
        }
      });
      var newstring = string.substr(0, string.length - 1);
      return $http.get('api/bookings?' + newstring).then(function (response) {
          if (response) {
            return response.data;
          }
        },
        function (error) {
          return error;
        });
    }
  }
})();
