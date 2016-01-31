(function () {
  'use strict';
  angular.module('wams.meetingroom')
    .controller('DetailsOfMrCtrl', DetailsOfMrCtrl);

  function DetailsOfMrCtrl($scope, $stateParams, MeetingRoomService, $state) {
    var vm = this;
    $scope.page = {
      title: 'Edit details of meetingroom'
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
      });
    }
  }
})();
