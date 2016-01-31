(function () {
  'use strict';
  angular.module('wams.meetingroom')
    .controller('ViewMeetingRoomCtrl', ViewMeetingRoomCtrl);



  function ViewMeetingRoomCtrl($scope, $stateParams, MeetingRoomService, $state) {
    var vm = this;
    $scope.page = {
      title: ' View Of Meeting Room'
    }
    vm.toggled = toggled;
    vm.ajaxFaker = ajaxFaker;

    function toggled(a) {
      console.log('Dropdown is now: ', a);
    };

    function ajaxFaker() {
      $state.reload();
    };
    function activate() {
      getAllmeetingrooms();
    };
    activate();
    function getAllmeetingrooms() {
      var roomid = $stateParams.roomid;
      console.log('roomid came as: ' + roomid);
      vm.meetingroomdetails = MeetingRoomService.query({
        id: roomid
      }, function (response) {
        vm.meetingroomdetails = response;
        console.log(" room data from response" + JSON.stringify(vm.meetingroomdetails));
       /* loadadmindetails();*/
      });
    }

    /*function loadadmindetails() {

      vm.meetingroomadmindetails = MeetingRoomService.query(function (response) {
        vm.meetingroomadmindetails = response;
        console.log(" room admin data from response" + JSON.stringify(vm.meetingroomadmindetails));
      });
    }*/

  }
})();
