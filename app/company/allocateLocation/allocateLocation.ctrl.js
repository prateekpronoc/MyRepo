(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('AllocateLocationCtrl', AllocateLocationCtrl);

  /* @ngInject */
  function AllocateLocationCtrl(_, wamsServices, $modalInstance, notifier, data) {
    var vm = this;
    vm.title = 'Controller';
    vm.premises = [];
    vm.ui = {
      buildingId: 0,
      premisesId: 0
    };
    vm.cancel = cancel;
    vm.fetchBuildings = fetchBuildings;
    vm.fetchFloor = fetchFloor;
    vm.fetchFloorPart = fetchFloorPart;
    vm.allocateLocation = allocateLocation;
    activate();

    ////////////////

    function activate() {
      fetchPremises();
    }

    function cancel() {
      $modalInstance.close('cancel');
    }

    function fetchPremises() {
      wamsServices.getEntity({
        request: {
          limit: 100,
          offset: 0
        },
        key: 'premises'
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
        vm.premises = response.rows;
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function fetchBuildings() {
      wamsServices.getEntity({
        request: {
          premiseId: vm.ui.premisesId
        },
        key: 'buildings'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching buildings');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.buildings = response.rows;
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function fetchFloor() {
      wamsServices.getEntity({
        request: {
          buildingId: vm.ui.buildingId
        },
        key: 'floors'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching floors');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.floors = response.rows;
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function fetchFloorPart() {
      wamsServices.getEntity({
        request: {
          floorId: vm.ui.floorId
        },
        key: 'floorparts'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching floor parts');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.floorpart = response.rows;
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function allocateLocation() {
      var locationdetails = {
        premiseId: vm.ui.premisesId,
        buildingId: vm.ui.buildingId,
        floorId: vm.ui.floorId,
        floorPartId: vm.ui.floorpartid,
        tenantId: data[0]
      };
      console.log(locationdetails);
      wamsServices.saveEntity({
        key: 'tenantpremises',
        request: locationdetails
      }).then(function (response) {
        if (response) {
          if (_.has(response, 'statusCode')) {
            notifier.error('Problem encountered while saving data :' + response.message);
            return;
          }
          notifier.success('Tenant location is added successfully');
          $modalInstance.close();
        }
      }, function (error) {
        notifier.error('Problem encountered while saving data :' + error.message);
      });
    }
  }
})();
