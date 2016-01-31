(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('UpdateInfraCtrl', UpdateInfraCtrl);

  /* @ngInject */
  function UpdateInfraCtrl($modalInstance, singleEntity, MeetingRoomInfraService) {
    var vm = this;
    vm.credentials = {};
    vm.credentials = singleEntity;
    vm.Update = Update;
    vm.cancel = cancel;
    activate();

    ////////////////

    function activate() {
      console.log('updated data' + JSON.stringify(vm.credentials));
      vm.credentials.name = vm.credentials[0].name;
      vm.credentials.description = vm.credentials[0].description;
    }

    function Update() {
      var updateddata = {
        id: vm.credentials[0].id,
        name: vm.credentials.name,
        description: vm.credentials.description
      };
      console.log(JSON.stringify(updateddata));
      MeetingRoomInfraService.createMeetingRoomInfra(updateddata).then(function (response) {
        console.log('updated data data' + JSON.stringify(response));
        $modalInstance.close();
      });
    };

    function cancel() {
      $modalInstance.dismiss('cancel');
    };
  }
})();
