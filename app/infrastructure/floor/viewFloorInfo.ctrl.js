(function () {
  'use strict';

  angular
    .module('wams.infrastructure')
    .controller('viewFloorInfoCtrl', viewFloorInfoCtrl);

  /* @ngInject */
  function viewFloorInfoCtrl($modalInstance, viewFloorInfo) {
    var vm = this;
    vm.title = 'Controller';
    vm.entity = viewFloorInfo;
    vm.exit = exit;

    activate();

    ////////////////

    function activate() {}

    function exit() {
      $modalInstance.dismiss('cancel');
    };
  }
})();
