(function () {
  'use strict';

  angular
    .module('wams.admin')
    .controller('UserInfoCtrl', UserInfoCtrl);
  /* @ngInject */
  function UserInfoCtrl($modalInstance, userdata) {
    var vm = this;
    vm.title = 'Controller';
    vm.entity = userdata;
    vm.exit = exit;

    activate();

    ////////////////

    function activate() {}

    function exit() {
      $modalInstance.dismiss('cancel');
    };

  }
})();