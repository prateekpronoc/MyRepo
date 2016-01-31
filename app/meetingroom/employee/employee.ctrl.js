(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('MrBooking1Ctrl', MrBooking1Ctrl)
    .controller('MrBooking2Ctrl', MrBooking2Ctrl)
    .controller('EmployeeMeetingDetails', EmployeeMeetingDetails);

  function MrBooking1Ctrl($scope) {
    $scope.page = {
      title: 'Meeting Room Booking Model 1'
    }

  }

  function MrBooking2Ctrl($scope) {
    $scope.page = {
      title: 'Meeting Room Booking Model 2'
    }

  }

  function EmployeeMeetingDetails($scope) {
    $scope.page = {
      title: 'Meeting On Wams With Himalaya'
    }
  }


})();
