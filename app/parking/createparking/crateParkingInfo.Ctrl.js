(function () {
  'use strict';

  angular
    .module('wams.parking')
    .controller('createParkingInfoCtrl', createParkingInfoCtrl);

  /* @ngInject */
  function createParkingInfoCtrl($modalInstance, data, wamsServices, notifier) {
    var vm = this;
    vm.title = 'controller';
    vm.entity = data;
    vm.exit = exit;
    vm.save = save;

    function exit() {
      $modalInstance.close('cancel');
    }

    function save() {
      $modalInstance.close('save');
    }
    activate();

    ////////////////

    function activate() {
      console.log(JSON.stringify(data));
      if (data.managerId) {
        getUserById();

      }
    }

    function getUserById() {
      wamsServices.getEntity({
        key: 'users',
        request: {
          id: data.managerId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while Profile');
          return;
        }
        console.log(JSON.stringify(response.rows[0]));
        vm.userInfo = response.rows[0];
      }, function (error) {
        notifier.error(error.message);
      });
    }

  }
})();
