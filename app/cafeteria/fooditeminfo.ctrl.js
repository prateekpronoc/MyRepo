(function () {
  'use strict';

  angular
    .module('wams.cafeteria')
    .controller('foodItemInfoCtrl', foodItemInfoCtrl);

  function foodItemInfoCtrl($modalInstance, fooddata, wamsServices) {
    var vm = this;
    vm.title = 'Food Item Info';
    vm.cancel = cancel;
    vm.entity = fooddata;
    activate();

    ////////////////

    function activate() {
      getCusineTypes();
      getFoodTypes();

    }

    function cancel() {
      $modalInstance.close('cancel');
    }

    function getCusineTypes() {
      vm.cuisines = {};
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          masterId: 12
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching cuisines information');
          return;
        }
        angular.forEach(response.rows, function (val) {
          vm.cuisines[val.id] = val.value;
        });
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getFoodTypes() {
      vm.foodtype = {};
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          masterId: 13
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching food types information');
          return;
        }
        angular.forEach(response.rows, function (val) {
          vm.foodtype[val.id] = val.value;
        });
      }, function (error) {
        notifier.error(error.message);
      });
    }
  }
})();
