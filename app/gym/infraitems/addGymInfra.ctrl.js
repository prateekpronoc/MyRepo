(function () {
  'use strict';

  angular
    .module('wams.gym')
    .controller('AddGymInfraCtrl', AddGymInfraCtrl);
  /* @ngInject */
  function AddGymInfraCtrl(wamsServices, _, notifier, $stateParams, $state, fileUpload) {
    var vm = this;
    vm.title = 'Add GymInfra';
    vm.createmore = false;
    vm.ui = {};
    vm.saveInfra = saveInfra;
    vm.cancel = cancel;
    vm.reset = reset;
    vm.uploadPic = processUpload;

    activate();

    ////////////////

    function activate() {}



    function cancel() {
      $state.go('wams.allGymInfras');
    }

    function reset() {
      vm.ui = {};
    }

    function processUpload() {
      fileUpload.uploadFile('/api/files/fileupload',
        vm.ui.uploadFile
      ).then(function (fileResponse) {
          if (fileResponse.data.Error === 'true') {
            return false;
          }
          console.log(fileResponse);
          vm.imageId = fileResponse.data;
          getUploadPic(vm.imageId);
        },
        function () {
          return false;
        });
    }

    function getUploadPic(imageId) {
      vm.imageSource = '/api/download?fileName=' + imageId;
    }

    function saveInfra() {
      var request = {
        name: vm.ui.name,
        image: vm.imageId
      };
      console.log(JSON.stringify(request));
      wamsServices.saveEntity({
        key: 'gyminfras',
        request: request
      }).then(function (response) {
        console.log(response);
        if (response) {
          if (_.has(response, 'statusCode')) {
            notifier.error('Problem encountered while saving data :' + response.message);
            return;
          }
          notifier.success('Gym Infra : ' + response.name + '  saved successfully');
          if (vm.createmore) {
            vm.ui = {};
          } else {
            $state.go('wams.allGymInfras', {}, {
              reload: true
            });
          }
        }
      }, function (error) {
        notifier.error('Unable to fetch data : ' + error.message);
      });
    }

  }
})();
