(function () {
  'use strict';
  angular.module('wams.meetingroom')
    .controller('AddMrInfraCtrl', AddMrInfraCtrl);

  function AddMrInfraCtrl(MeetingRoomInfraService, $state, $stateParams, $timeout, toaster) {
    var vm = this;
    vm.infrastructure = {};
    vm.SaveInfrastructureDetails = SaveInfrastructureDetails;
    vm.SaveAndCreateInfrastructureDetails = SaveAndCreateInfrastructureDetails;
    vm.page = {
      title: 'Create Meeting Room Infrastructure'
    };
    vm.toggled = toggled;
    vm.ajaxFaker = ajaxFaker;

    activate();

    function activate() {
      getInfraTypes();
    }

    function toggled(a) {}

    function ajaxFaker() {
      $state.reload();
    }

    function getInfraTypes() {
      MeetingRoomInfraService.getInfraTypeCatalog().then(function (response) {
        vm.types = response;
      });
    }

    function SaveAndCreateInfrastructureDetails() {
      var infrastructuredetails = {
        name: vm.infrastructure.name,
        description: vm.infrastructure.description,
        code: vm.infrastructure.code,
        meetingRoomId: $stateParams.roomid,
        typeId: vm.infrastructure.infratypename,
        image: 'files.jpg'
      };
      MeetingRoomInfraService.createMeetingRoomInfra(infrastructuredetails).then(function (response) {
        vm.postinfrastructuredetails = response;
        console.log('postinfrastructuredetails' + JSON.stringify(vm.postinfrastructuredetails));
        if (!response.data.msg) {
          toaster.success({
            title: '',
            body: 'Infrastructure is Added'
          });
          vm.infrastructure = {};
        } else {
          toaster.error({
            title: '',
            body: response.data.msg
          });
        }
      });
    }


    function SaveInfrastructureDetails() {
      vm.SaveAndCreateInfrastructureDetails();
      $timeout(function () {
        $state.go('wams.allmeetingroominfra', {}, {
          reload: true
        });
      }, 3000);
    }
  }
})();
