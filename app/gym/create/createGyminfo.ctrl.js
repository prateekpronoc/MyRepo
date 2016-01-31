(function () {
  'use strict';

  angular
    .module('wams.gym')
    .controller('GymInfoCtrl', GymInfoCtrl);
  /* @ngInject */
  function GymInfoCtrl($modalInstance, data, wamsServices, notifier) {
    var vm = this;
    vm.title = 'Controller';
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

    function exit() {
      $modalInstance.dismiss('cancel');
    };

  }
})();
(function () {
  'use strict';

  angular
    .module('wams.gym')
    .controller('GymInfoCtrl', GymInfoCtrl);
  /* @ngInject */
  function GymInfoCtrl($modalInstance, data, wamsServices, notifier) {
    var vm = this;
    vm.title = 'Controller';
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

    function exit() {
      $modalInstance.dismiss('cancel');
    };

  }
})();
