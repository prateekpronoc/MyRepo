(function () {
  'use strict';

  angular
    .module('wams.cafeteria')
    .controller('createMenuCtrl', createMenuCtrl);
  /* @ngInject */
  function createMenuCtrl(wamsServices, notifier, $stateParams, $modal, $state) {
    var vm = this;
    vm.title = 'Create Menu ';
    vm.ui = {};
    var serverData = {};
    vm.updateMode = false;
    vm.saveMenu = saveMenu;
    vm.reset = reset;
    vm.cancel = cancel;

    activate();

    ////////////////

    function activate() {
      if (angular.isDefined($stateParams.cafeteriaId) && $stateParams.cafeteriaId > 0) {
        getCafeById($stateParams.cafeteriaId);
        vm.updateMode = true;
        vm.title = 'Update Cafeteria';
      }
      getAllCafeterias();

    }

    function getAllCafeterias() {
      vm.entity = [];
      wamsServices.getEntity({
        request: {},
        key: 'cafeteria'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching premises');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.entity = response.rows;

      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function reset() {
      if (!vm.updateMode) {
        vm.ui = serverData;
      }
    }

    function cancel() {
      $state.go('wams.allCafeterias', {}, {
        reload: true
      });
    }


    function getCafeById(cafeteriaId) {
      wamsServices.getEntity({
        key: 'cafeteria',
        request: {
          id: cafeteriaId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching cafeteria information');
          return;
        }
        serverData = response.rows[0];
        vm.ui = response.rows[0];
        console.log(JSON.stringify(vm.ui));

      }, function (error) {
        notifier.error(error.message);
      });
    }

    function saveMenu() {
      vm.menuDetails = {
        cafeteriaId: vm.ui.cafeteriaId,
        description: vm.ui.description,
        status: 0
      }
      if (vm.updateMode) {
        vm.cafeteriaDetails.id = vm.ui.id;
      }
      wamsServices.saveEntity({
        key: 'menus',
        request: vm.menuDetails
      }).then(function (response) {
        if (response) {
          if (_.has(response, 'statusCode')) {
            notifier.error('Problem encountered while saving data :' + response.message);
            return;
          }
          notifier.success('Cafeteria: ' + response.name + '  saved successfully');
          if (vm.createmore) {
            vm.ui = {};;
          } else {
            vm.cancel();
          }
        }
      }, function (error) {
        notifier.error('Problem encountered while saving data :' + error.message);
      });
      // if (vm.cafeteriaDetails) {
      //   openConfirmation(vm.cafeteriaDetails);
      // }

    }

    // function openConfirmation(cafeteriaDetails) {
    //   var modalInstance = $modal.open({
    //     animation: true,
    //     templateUrl: 'cafeteria/cafeteriaconfirm.html',
    //     controller: 'cafeteriaConfirmCtrl as vm',
    //     size: 'sm',
    //     resolve: {
    //       data: function () {
    //         return cafeteriaDetails;
    //       }
    //     }
    //   });

    //   modalInstance.result.then(function (data) {
    //       vm.saveconfirmation = data;
    //       if (vm.saveconfirmation === 'save') {
    //         console.log(JSON.stringify(vm.cafeteriaDetails));

    //       } else {
    //         console.log('cancel');
    //       }
    //     },
    //     function () {
    //       console.log('Modal dismissed at: ' + new Date());
    //     });
    // }

  }
})();
