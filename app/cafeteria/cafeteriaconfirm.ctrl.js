(function () {
  'use strict';

  angular
    .module('wams.company')
    .controller('cafeteriaConfirmCtrl', cafeteriaConfirmCtrl);


  function cafeteriaConfirmCtrl($modalInstance, wamsServices, notifier, data) {
    var vm = this;
    vm.title = 'cafeteriaConfirmCtrl';
    vm.responseDetails = data;
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
      console.log(JSON.stringify(vm.responseDetails));
      if (vm.responseDetails.cafeteriaId) {
        getCafeId(vm.responseDetails.cafeteriaId);
      }
      if (vm.responseDetails.premiseId) {
        vm.pageName = 'Building';
        getpremiseId(vm.responseDetails.premiseId);
      }
      if (vm.responseDetails.cityId) {
        vm.pageName = 'Premises';
        fetchCatalogs();
        getCityId(vm.responseDetails.cityId);
      }
      if (vm.responseDetails.buildingId) {
        vm.pageName = 'Floor';
        getBuildingId(vm.responseDetails.buildingId);
      }
      if (vm.responseDetails.floorId) {
        vm.pageName = 'Floor Part';
        getFloorId(vm.responseDetails.floorId);
      }
    }

    function getCafeId(cafeteriaId) {
      wamsServices.getEntity({
        key: 'cafeteria',
        request: {
          id: cafeteriaId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching cafeteria data');
          return;
        }
        vm.responseDetails.cafename = response.rows[0].name;
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getFloorId(floorId) {
      vm.responseFloorDetails = {};
      wamsServices.getEntity({
        key: 'floors',
        request: {
          id: floorId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching floor information');
          return;
        }
        vm.responseFloorDetails.floorname = response.rows[0].name;
        vm.responseFloorDetails.floorlocation = response.rows[0].buildingsName;
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getBuildingId(buildingId) {
      vm.responseBuildingDetails = {};
      wamsServices.getEntity({
        key: 'buildings',
        request: {
          id: buildingId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching building data');
          return;
        }
        vm.responseBuildingDetails.buildingName = response.rows[0].name;
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getpremiseId(premiseId) {
      vm.responsePremiseDetails = {};
      wamsServices.getEntity({
        key: 'premises',
        request: {
          id: premiseId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching premises data');
          return;
        }
        vm.responsePremiseDetails.premiseName = response.rows[0].name;
      }, function (error) {
        notifier.error(error.message);
      });
    }

  }
})();
