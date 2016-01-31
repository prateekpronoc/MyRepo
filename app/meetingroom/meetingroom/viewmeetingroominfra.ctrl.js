(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('ViewMRInfraCtrl', ViewMRInfraCtrl);
  /* @ngInject */
  function ViewMRInfraCtrl($modalInstance, mrdata) {
    var vm = this;
    vm.title = 'Controller';
    vm.entity = mrdata;
    vm.exit = exit;

    activate();

    ////////////////

    function activate() {}

    function exit() {
      $modalInstance.dismiss('cancel');
    };

  }
})();