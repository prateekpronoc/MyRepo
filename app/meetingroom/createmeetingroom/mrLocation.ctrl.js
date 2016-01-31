(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('MRoomLocationCtrl', MRoomLocationCtrl);

  /* @ngInject */
  function MRoomLocationCtrl(_, wamsServices, $modalInstance, notifier) {
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
    vm.addLocation = addLocation;
    activate();

    ////////////////

    function activate() {
      fetchPremises();
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

    function cancel() {
      $modalInstance.close('cancel');
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

    function addLocation() {
      var premisesDetails = _.filter(vm.premises, {
          id: vm.ui.premisesId
        })[0],
        buildingDetails = _.filter(vm.buildings, {
          id: vm.ui.buildingId
        })[0],
        floorDetails = _.filter(vm.floors, {
          id: vm.ui.floorId
        })[0],
        floorpartsDetails = _.filter(vm.floorpart, {
          id: vm.ui.floorpartid
        })[0];

      var locationdetails = {
        premisesId: vm.ui.premisesId,
        buildingId: vm.ui.buildingId,
        floorId: vm.ui.floorId,
        floorPartId: vm.ui.floorpartid,
        locationtext: premisesDetails.name + '-' + buildingDetails.name
      };
      if (vm.ui.floorId) {
        locationdetails.locationtext = locationdetails.locationtext + '-' + floorDetails.name
      }
      if (vm.ui.floorpartid) {
        locationdetails.locationtext = locationdetails.locationtext + '-' + floorpartsDetails.name
      }
      console.log(locationdetails.locationtext);
      $modalInstance.close(locationdetails);
    }

    // function fetchFloorPart(floorid) {
    //   console.log(floorid);
    //   vm.floorpart = [];
    //   meetingRoomService.getFloorPart().then(function (response) {
    //     console.log(JSON.stringify(response));
    //     angular.forEach(response, function (data) {
    //       if (floorid === data.floorId) {
    //         vm.floorpart.push({
    //           id: data.id,
    //           name: data.name
    //         });
    //         //console.log("sucesss" + JSON.stringify(vm.floorpart));
    //       }
    //     });
    //   });
    // }

    // function fetchFloor(Id) {
    //   vm.floors = [];
    //   console.log(Id);
    //   meetingRoomService.getFloorById(Id).then(function (response) {
    //     // console.log(JSON.stringify(response));
    //     angular.forEach(response, function (data) {
    //       if (Id === data.buildingId) {
    //         vm.floors.push({
    //           id: data.id,
    //           name: data.name
    //         });
    //         //console.log("sucesss" + JSON.stringify(vm.floors));
    //       }
    //     });
    //   });
    // }

    // function getBuildings(id) {
    //   console.log(id);
    //   vm.buildings = [];
    //   meetingRoomService.getAllBuildings().then(function (response) {
    //     angular.forEach(response.rows, function (data) {
    //       if (id === data.premiseId) {
    //         vm.buildings.push({
    //           id: data.id,
    //           name: data.name
    //         });
    //       }
    //     });
    //   });
    // }

    // function getPremises() {
    //   meetingRoomService.getAllPremises().then(function (response) {
    //     angular.forEach(response.rows, function (val) {
    //       vm.premises.push({
    //         id: val.id,
    //         name: val.name
    //       });
    //     });
    //   });
    // }
  }
})();
