(function () {
  'use strict';

  angular
    .module('wams.company')
    .controller('CompanyInfoCtrl', CompanyInfoCtrl);
  /* @ngInject */
  function CompanyInfoCtrl($modalInstance, singleEntity) {
    var vm = this;
    vm.title = 'Controller';
    vm.entity = singleEntity;
    vm.exit = exit;

    activate();

    ////////////////

    function activate() {}

    function exit() {
      $modalInstance.dismiss('cancel');
    };

  }
})();