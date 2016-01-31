(function () {
  'use strict';

  angular
    .module('wams.company')
    .controller('tenantConfirmationCtrl', tenantConfirmationCtrl);


  function tenantConfirmationCtrl($modalInstance, wamsServices, notifier, data) {
    var vm = this;
    vm.title = 'tenantConfirmationCtrl';
    vm.saveDetails = data;
    activate();
    vm.exit = exit;
    vm.save = save;

    function exit() {
      $modalInstance.close('cancel');
    }

    function save() {
      $modalInstance.close('save');
    }
    activate();


    function activate() {
      console.log(JSON.stringify(vm.saveDetails));
      if (vm.saveDetails.companyId) {
        gettenantId(vm.saveDetails.companyId);
      }
    }

    function gettenantId(companyId) {
      wamsServices.getEntity({
        key: 'tenants',
        request: {
          id: companyId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching premises data');
          return;
        }
        vm.saveDetails.tenantname = response.rows[0].name;
      }, function (error) {
        notifier.error(error.message);
      });
    }
  }
})();
