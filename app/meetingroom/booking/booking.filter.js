(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .filter('bookingFilter', bookingFilter);

  function bookingFilter(meetingRoomService) {
    var vm = this;
    return fetchAllMeetingRooms;

    ////////////////

    // function filterFilter(params) {

    //     return params;
    // }

    function fetchAllMeetingRooms(entity) {
      vm.entity = [];
      meetingRoomService.getAllMeetingRooms().then(function (response) {
        console.log(response);
        vm.entity = response.rows;
        return entity;
      }, function (response) {
        console.log(response);
      });
    }
  }
})();
