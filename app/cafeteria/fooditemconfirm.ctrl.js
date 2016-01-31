(function () {
  'use strict';

  angular
    .module('wams.cafeteria')
    .controller('foodConfirmCtrl', foodConfirmCtrl);

  function foodConfirmCtrl($modalInstance, data, wamsServices) {
    var vm = this;
    vm.title = 'foodConfirmCtrl';
    vm.itemDetails = data;
    vm.exit = exit;
    vm.save = save;
    activate();

    function exit() {
      $modalInstance.close('cancel');
    }

    function save() {
      $modalInstance.close('save');
    }

    function activate() {
      getCusineTypes();
      getFoodTypes();
      if (data.image) {
        getUploadPic(data.image);
      }
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

    function getUploadPic(imageId) {
      vm.imageSource = '/api/download?fileName=' + imageId;
    }
  }
})();
