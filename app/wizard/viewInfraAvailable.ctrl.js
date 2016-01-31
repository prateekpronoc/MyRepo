(function () {
  'use strict';

  angular
    .module('wizard')
    .controller('ViewInfraAvailableCtrl', ViewInfraAvailableCtrl);
  /* @ngInject */
  function ViewInfraAvailableCtrl($modalInstance, data, wamsServices, notifier) {
    var vm = this;
    vm.title = 'Controller';
    vm.exit = exit;

    activate();

    ////////////////
    function exit() {
      $modalInstance.close('cancel');
    }

    function activate() {
      vm.infraDetails = data;
      // fetchInfraTypeValues();
    }

    // function fetchInfraTypeValues() {
    //   var i;
    //   wamsServices.getEntity({
    //     key: 'catalogValues',
    //     request: {
    //       masterId: 3
    //     }
    //   }).then(function (response) {
    //     if (!response) {
    //       notifier.error('Problem encountered while fetching meeting room');
    //       return;
    //     }
    //     if (response.rows && response.rows.length === 0) {
    //       notifier.error('Unable to fetch data');
    //       return;
    //     }
    //     vm.infraType = response.rows;
    //     if (vm.infraDetails.length > 0) {
    //       for (i = 0; i < vm.infraDetails.length; i = i + 1) {
    //         _.forEach(vm.infraType, function (val) {
    //           if (val.value == vm.infraDetails[i].name) {
    //             val.isSelected = true;
    //             val.code = vm.infraDetails[i].code
    //           }
    //         });
    //       }
    //     }
    //     console.log(JSON.stringify(vm.infraType));
    //   }, function (error) {
    //     notifier.error('Unable to fetch data : ' + error.message);
    //   });
    // }
  }
})();
