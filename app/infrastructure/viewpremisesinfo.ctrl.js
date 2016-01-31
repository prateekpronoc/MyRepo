(function () {
  'use strict';

  angular
    .module('wams.infrastructure')
    .controller('viewPremisesInfo', viewPremisesInfo);

  /* @ngInject */
  function viewPremisesInfo($modalInstance, viewpremisesinfo) {
    var vm = this;
    vm.title = 'Controller';
    vm.entity = viewpremisesinfo;
    vm.exit = exit;

    activate();

    ////////////////

    function activate() {}

    function exit() {
      $modalInstance.dismiss('cancel');
    }
  }
})();
