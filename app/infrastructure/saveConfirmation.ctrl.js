(function () {
  'use strict';

  angular
    .module('wams.infrastructure')
    .controller('saveConfirmationCtrl', saveConfirmationCtrl);

  /* @ngInject */
  function saveConfirmationCtrl($modalInstance, data, wamsServices, notifier, catalogServices) {
    var vm = this;
    vm.title = 'Controller';
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
    ////////////////

    function activate() {
      console.log(JSON.stringify(vm.responseDetails));
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
        vm.responseDetails.buildingName = response.rows[0].name;
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function fetchCatalogs() {
      catalogServices.fetchCatalogValues({
        request: {
          masterId: catalogServices.fetchMasterCatalogCode('state')
        }
      }).then(function (response) {
        vm.responseDetails.state = response;
      }, function (error) {
        console.log(error);
      });
    }

    function getCityId(cityId) {
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          id: cityId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching data');
          return;
        }
        vm.responseDetails.city = response.rows[0].value;
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getpremiseId(premiseId) {
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
        vm.responseDetails.premisename = response.rows[0].name;
      }, function (error) {
        notifier.error(error.message);
      });
    }
  }
})();
