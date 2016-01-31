(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('OpenAdvanceSearchCtrl', OpenAdvanceSearchCtrl);
  /* @ngInject */
  function OpenAdvanceSearchCtrl(_, wamsServices, $modalInstance, notifier, session, data) {
    var vm = this,
      assignedMeetingRoom = [];
    vm.title = 'Controller';
    vm.premises = [];
    vm.ui = {};
    vm.cancel = cancel;
    vm.reset = reset;
    vm.fetchBuildings = fetchBuildings;
    vm.fetchFloor = fetchFloor;
    vm.fetchFloorPart = fetchFloorPart;
    vm.searchData = searchData;
    activate();

    ////////////////

    function activate() {
      vm.ui = data;
      console.log(vm.ui);
      fetchPremises();
      fetchBuildings();
      fetchFloor();
      fetchFloorPart();
      if (!session.hasRole('SuperAdmin')) {
        fetchTenantMeetingRooms();
      } else {
        fetchAllMeetingRooms();
      }
      getType();
    }

    function fetchTenantMeetingRooms() {
      wamsServices.getEntity({
        request: {
          tenantId: parseInt(session.getTenantId())
        },
        key: 'tenantmeeting'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching meeting-rooms');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }

        assignedMeetingRoom = _.pluck(response.rows, 'meetingroomId');
        //console.log(assignedMeetingRoom);
        fetchAllMeetingRooms();
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function reset() {
      vm.ui = {};
    }

    function getType() {
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          masterId: 2
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching premise information');
          return;
        }
        vm.mrType = response.rows;
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function fetchAllMeetingRooms() {
      vm.entity = [];
      wamsServices.getEntity({
        request: {
          limit: 100,
          offset: 0
        },
        key: 'meetingRooms'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching meeting-rooms');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        if (!session.hasRole('SuperAdmin') && assignedMeetingRoom.length > 0) {
          _.forEach(response.rows, function (val) {
            if (assignedMeetingRoom.indexOf(val.id) > -1) {
              vm.entity.push(val);
            }
          });
        } else {
          vm.entity = response.rows;
        }
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
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

    function searchData() {
      var searchdetails = {
        buildingId: vm.ui.buildingId,
        floorId: vm.ui.floorId,
        floorPartId: vm.ui.floorPartId,
        id: vm.ui.id,
        premisesId: vm.ui.premisesId,
        capacity: vm.ui.capacity,
        typeId: vm.ui.typeId,
        status: vm.ui.status
      };
      $modalInstance.close(searchdetails);
    }
  }
})();
