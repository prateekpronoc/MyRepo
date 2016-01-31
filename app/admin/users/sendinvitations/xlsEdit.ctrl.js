(function () {
  'use strict';

  angular
    .module('wams.admin')
    .controller('XlsEditCtrl', XlsEditCtrl);
  /* @ngInject */
  function XlsEditCtrl(data, $modalInstance) {
    var vm = this;
    vm.ui = {};
    vm.title = 'Controller';
    vm.cancel = exit;
    vm.save = save;
    activate();

    ////////////////

    function activate() {
      console.log(JSON.stringify(data));
      vm.ui = data;
    }

    function exit() {
      $modalInstance.close('cancel');
    }

    function save() {
      $modalInstance.close(vm.ui);
    }
  }
})();
