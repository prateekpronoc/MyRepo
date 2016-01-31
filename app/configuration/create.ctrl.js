(function () {
  'use strict';

  angular
    .module('wams.configuration')
    .controller('EnableMRoomCtrl', EnableMRoomCtrl);


  function EnableMRoomCtrl(wamsServices, notifier) {
    var vm = this;
    vm.title = 'Enable Meeting Room';
    vm.fetchBuildings = fetchBuildings;
    vm.fetchTenants = fetchTenants;
    vm.fetchAllResourcesTypes = fetchAllResourcesTypes;
    vm.fetchAllResources = fetchAllResources;
    vm.premises = [];
    vm.ui = {
      buildingId: 0,
      premisesId: 0
    };
    vm.enableMeetingRoom = enableMeetingRoom;

    activate();

    ////////////////

    function activate() {
      // fetchMRooms();
      fetchPremises();
      getAllTenants();
      fetchAllResourcesTypes();
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

    function fetchAllResourcesTypes() {
      wamsServices.getEntity({
        request: {
          masterId: 1
        },
        key: 'catalogValues'
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
        vm.resourceTypes = response.rows;
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function fetchAllResources() {
      if (vm.ui.resourceTypeId) {
        switch (vm.ui.resourceTypeId) {
        case 89:
          serviceCall('gym');
          break;
        case 35:
          serviceCall('cafeteria');
          break;
        case 34:
          serviceCall('meetingRooms');
          break;
        }
      }
    }

    function serviceCall(key) {
      console.log(key);
      wamsServices.getEntity({
        request: {
          buildingId: vm.ui.buildingId
        },
        key: key
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
        vm.resourceNames = response.rows;
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function getAllTenants() {
      wamsServices.getEntity({
        request: {
          limit: 100,
          offset: 0
        },
        key: 'tenants'
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
        vm.tenantDetails = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'name'));
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }
    vm.tObj = {};

    function fetchTenants() {
      wamsServices.getEntity({
        request: {
          premiseId: vm.ui.premisesId,
          buildingId: vm.ui.buildingId
        },
        key: 'tenantpremises'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching buildings');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Tenants are not able to the particular premise and building');
          return;
        }
        console.log(JSON.stringify(response.rows));
        var tenantIds = _.pluck(response.rows, 'tenantId');
        for (var i = 0; i < tenantIds.length; i++) {
          if (vm.tenantDetails.hasOwnProperty(tenantIds[i])) {
            vm.tObj[tenantIds[i]] = vm.tenantDetails[tenantIds[i]];
            //vm.tDetails.push(vm.tenantDetails[tenantIds[i]]);
          }
        };
        console.log(vm.tObj);
        // _.forEach(response.rows, function (data) {
        //   getTenantName(data.tenantId);
        // });
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function enableMeetingRoom() {
      vm.enableMR = {
        tenantId: parseInt(vm.ui.tenantId),
        resourceId: vm.ui.resourceId,
        resourceType: vm.ui.resourceTypeId
      };
      console.log(JSON.stringify(vm.enableMR));
      wamsServices.saveEntity({
        key: 'tenantresource',
        request: vm.enableMR
      }).then(function (response) {
        if (response) {
          if (_.has(response, 'statusCode')) {
            notifier.error('Problem encountered while saving data :' + response.message);
            return;
          }
          notifier.success('meetingroom is allocated to the tenant');
          vm.ui = {};
        }
      }, function (error) {
        notifier.error('Problem encountered while saving data :' + error.message);
      });
    }

    // function getTenantName(tenantId) {
    //   vm.tenantDetails = [];
    //   wamsServices.getEntity({
    //     request: {
    //       id: tenantId
    //     },
    //     key: 'tenants'
    //   }).then(function (response) {
    //     if (!response) {
    //       vm.noData = true;
    //       notifier.error('Problem encountered while fetching tenants');
    //       return;
    //     }
    //     if (response.rows && response.rows.length === 0) {
    //       vm.noData = true;
    //       notifier.error('Unable to fetch data');
    //       return;
    //     }
    //     //vm.tenantObj = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'name'));
    //     vm.tenantDetails.push({
    //       id: _.pluck(response.rows, 'id')[0],
    //       name: _.pluck(response.rows, 'name')[0]
    //     });
    //     console.log(JSON.stringify(vm.tenantDetails));
    //   }, function (error) {
    //     notifier.error('Unable to fetch data' + error.message);
    //   });
    // }

  }
})();
