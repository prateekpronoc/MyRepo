(function () {
  'use strict';

  angular
    .module('wams.configuration')
    .controller('CostConfigCtrl', CostConfigCtrl);

  /* @ngInject */
  function CostConfigCtrl(wamsServices, _, notifier, commonService) {
    var vm = this;
    vm.title = 'Cost Configuration';
    vm.cf = {};
    vm.entity = {};
    vm.saveCostConfig = saveCostConfig;
    vm.getcost = getcost;
    vm.getEntity = fetchEntity;
    vm.columnCollection = [{
      id: 'id',
      title: 'Id',
      isAction: true
    }, {
      id: 'id',
      title: 'Resource Name',
      isAction: false
    }, {
      id: 'points',
      title: 'Cost',
      isAction: false
    }, {
      id: 'id',
      title: 'Factor',
      isAction: false
    }];
    vm.searchText = '';
    vm.noData = false;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    vm.costDetails = {};
    vm.noData = false;
    vm.pagingOptions = commonService.getPagingOptions();
    vm.pageChanged = pageChanged;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    activate();

    ////////////////

    function activate() {
      fetchAllMeetingRooms();
      getResourceType();
      fetchFactors();
      fetchAllCostConfig();
    }

    function getcost() {
      vm.cf.cost = '';
      vm.costConfigEntity = '';
      wamsServices.getEntity({
        key: 'costconfigurations',
        request: {
          resourceId: parseInt(vm.cf.selectedEntity)
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Cost has not been Configured');
          return;
        }
        if (_.has(response.rows[0], 'points')) {
          vm.configDetails = response.rows;
          vm.costConfigEntity = vm.configDetails;
          vm.cf.cost = response.rows[0].points;
          vm.pagingOptions.totalDataRecordCount = response.count;
          vm.pagingOptions.rowCount = 1;
          vm.pagingOptions.columnCount = 10;
          if (response.count < 10) {
            vm.shownCount = response.count;
          }
          vm.count = response.count;
          return;
        }
      });
    }

    function getResourceType() {
      wamsServices.getEntity({
        request: {
          masterId: 1
        },
        key: 'catalogValues'
      }).then(function (response) {
        vm.resourceType = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'value'));
        console.log(vm.resourceType);
      });
    }

    function fetchEntity() {
      wamsServices.getEntity({
        request: {},
        key: _.camelCase(vm.resourceType[vm.cf.resourceId]) + 's'
      }).then(function (response) {
        vm.entityType = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'name'));
        console.log(vm.entityType);
      });
    }

    function fetchAllCostConfig() {
      vm.costConfigEntity = [];
      wamsServices.getEntity({
        request: {
          limit: 10,
          offset: 0
        },
        key: 'costconfigurations'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching configuration');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.costConfigEntity = response.rows;
        vm.costDetails = response.rows[0];
        vm.pagingOptions.totalDataRecordCount = response.count;
        vm.pagingOptions.rowCount = 1;
        vm.pagingOptions.columnCount = 10;
        if (response.count < 10) {
          vm.shownCount = response.count;
        }
        vm.count = response.count;
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function fetchFactors() {
      vm.cf.factorVal = {};
      wamsServices.getEntity({
        request: {
          masterId: 9
        },
        key: 'catalogValues'
      }).then(function (response) {
        vm.factors = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'value'));
        _.forEach(vm.costConfigEntity, function (val) {
          vm.cf.factorVal = vm.factors[val.factor];
        });
        console.log(vm.factors);
      });
    }

    function saveCostConfig() {
      vm.costDetails = {
        resourceId: vm.cf.selectedEntity,
        resourceType: vm.cf.resourceId,
        points: vm.cf.cost,
        factor: vm.cf.factor,
      }
      console.log(vm.costDetails);
      wamsServices.saveEntity({
        key: 'costconfigurations',
        request: vm.costDetails
      }).then(function (response) {
        if (response) {
          if (_.has(response, 'statusCode')) {
            notifier.error('Problem encountered while saving data :' + response.message);
            return;
          }
          notifier.success('Cost Configured successfully');
          vm.cf = {};
        }
      }, function (error) {
        notifier.error('Problem encountered while saving data :' + error.message);
      });
    }

    function fetchAllMeetingRooms() {
      vm.cf.meetingrooms = {};
      wamsServices.getEntity({
        key: 'meetingRooms',
        request: {
          limit: 50,
          offset: 0
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching Meeting Rooms');
          return;
        }
        _.forEach(response.rows, function (val) {
          vm.cf.meetingrooms[val.id] = val.name;
        });
        console.log(vm.cf.meetingrooms);
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function pageChanged(pageNo) {
      pageNo -= 1;

      wamsServices.getEntity({
        request: {
          limit: vm.maxSize,
          offset: pageNo * vm.maxSize
        },
        key: 'costconfigurations'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching configuration');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.costConfigEntity = response.rows;
        vm.costDetails = response.rows[0];
        vm.pagingOptions.totalDataRecordCount = response.count;
        vm.pagingOptions.rowCount = 1;
        vm.pagingOptions.columnCount = 10;
        if (response.count < 10) {
          vm.shownCount = response.count;
        }
        vm.count = response.count;
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });

    }
  }
})();

// (function () {
//   'use strict';

//   angular
//     .module('wams.configuration')
//     .controller('costConfigureCtrl', costConfigureCtrl);

//   function costConfigureCtrl(wamsServices, notifier, _, $state, $stateParams, commonService, $filter) {
//     var vm = this;
//     vm.title = 'Cost Configuration';
//     vm.costFor = {};
//     vm.toggled = toggled;
//     vm.columnCollection = [{
//       id: 'id',
//       title: 'Id',
//       isAction: true
//     }, {
//       id: 'resourceId',
//       title: 'Name',
//       isAction: false
//     }, {
//       id: 'points',
//       title: 'Cost',
//       isAction: false
//     }, {
//       id: 'factor',
//       title: 'Factor',
//       isAction: false
//     }];

//     vm.getEntity = getEntity;
//     vm.costfactor = {};
//     vm.cf = {};
//     vm.cf.selectedresourceType = null;
//     vm.entity = {};
//     vm.saveConfiguration = saveConfiguration;
//     vm.searchText = '';
//     vm.noData = false;
//     vm.shownCount = 10;
//     vm.maxSize = 10;
//     vm.pageNo = 0;
//     vm.pagingOptions = commonService.getPagingOptions();
//     vm.pageChanged = pageChanged;
//     vm.shownCount = 10;
//     vm.maxSize = 10;
//     vm.pageNo = 0;
//     activate();

//     function toggled(a) {
//       console.log('Dropdown is now: ', a);
//     }

//     function activate() {
//       getAllCostConfiguration();
//       // getFactorName();
//       // getResourceType();
//       // getFactorCatalog();
//       // if (angular.isDefined($stateParams.roomids) || $stateParams.roomids > 0) {
//       //   vm.selectedMRIds = $stateParams.roomids;
//       // }
//     }


//     function saveConfiguration() {
//       wamsServices.getEntity({
//         request: {
//           id: vm.cf.selectedresourceType
//         },
//         key: 'catalogValues'
//       }).then(function (response) {
//         vm.resourceType = response.rows[0].value;
//       }).then(function (response) {
//         var request = {
//           resourceId: vm.cf.selectedEntity,
//           resourceType: vm.resourceType,
//           points: vm.cf.cost,
//           factor: vm.cf.factor,
//         };
//         console.log(request);
//         wamsServices.saveEntity({
//           key: 'costconfigurations',
//           request: request
//         }).then(function (response) {
//           console.log(JSON.stringify(response.rows));
//           if (response) {
//             if (_.has(response, 'statusCode')) {
//               notifier.error('Problem encountered while saving data : ' + response.message);
//               return;
//             }
//             notifier.success('configuration for ' + response.resourceType + '  saved successfully');
//             vm.cf = {};
//           }
//         }, function (error) {
//           notifier.error('Problem encountered while saving data :' + error.message);
//         });
//       });
//     }

//     function getEntity() {
//       vm.entity = [];
//       if (vm.cf.selectedresourceType === null) {
//         console.log('Please select entity type');
//         return;
//       }
//       _.forEach(vm.costFor, function (argument) {
//         console.log(argument);
//       });
//       if (vm.selectedMRIds) {
//         angular.forEach(vm.selectedMRIds, function (value) {
//           wamsServices.getEntity({
//             request: {
//               id: value
//             },
//             key: _.camelCase(vm.costFor[vm.cf.selectedresourceType]) + 's'
//           }).then(function (response) {
//             if (!response || response.rows.length === 0) {
//               notifier.error('Problem encountered while fetching meetingrooms information');
//               return;
//             }
//             vm.entity.push(response.rows[0])
//           }, function (error) {
//             notifier.error(error.message);
//           });
//         });
//       } else {
//         wamsServices.getEntity({
//           request: {},
//           key: _.camelCase(vm.costFor[vm.cf.selectedresourceType]) + 's'
//         }).then(function (response) {
//           if (!response || response.rows.length === 0) {
//             notifier.error('Problem encountered while fetching meetingrooms information');
//             return;
//           }
//           vm.entity = response.rows;
//         }, function (error) {
//           notifier.error(error.message);
//         });
//       }
//       // _.forEach(vm.entity, function (resp) {
//       //   vm.entity[resp.id] = resp.name;
//       // });
//     }

//     function getResourceType() {
//       wamsServices.getEntity({
//         request: {
//           id: 34
//         },
//         key: 'catalogValues'
//       }).then(function (response) {
//         angular.forEach(response.rows, function (val) {
//           vm.costFor[val.id] = val.value;
//         });
//       });
//     }

//     function getFactorCatalog() {
//       wamsServices.getEntity({
//         key: 'catalogValues',
//         request: {
//           masterId: 9
//         }
//       }).then(function (response) {
//         angular.forEach(response.rows, function (val) {
//           vm.costfactor[val.id] = val.value;
//         });
//       });
//     }

//     function getAllCostConfiguration() {
//       vm.entity = [];
//       wamsServices.getEntity({
//         request: {
//           limit: 10,
//           offset: 0
//         },
//         key: 'costconfigurations'
//       }).then(function (response) {
//         vm.entity = response.rows;
//         vm.count = response.count;
//         vm.pagingOptions.totalDataRecordCount = response.count;
//         vm.pagingOptions.rowCount = 1;
//         vm.pagingOptions.columnCount = 10;
//         if (response.count < 10) {
//           vm.shownCount = response.count;
//         }

//         // angular.forEach(vm.entity, function (val) {
//         //   vm.costId = val.id;
//         //   vm.points = val.points;
//         //   vm.factor = val.factor;
//         //   getMRName(val.resourceId, vm.costId, vm.points, vm.factor);
//         // });
//         vm.count = response.count;
//       }, function (error) {
//         notifier.error('Unable to fetch data' + error.message);
//       });
//     }

//     function getMRName(mrid, costid, points, factor) {
//       console.log(vm.costfactor);
//       vm.meetingroomentity = [];
//       vm.entityName = [];
//       wamsServices.getEntity({
//         request: {
//           id: mrid
//         },
//         key: 'meetingRooms'
//       }).then(function (response) {
//         vm.meetingroomentity.push(response.rows[0]);
//       }).then(function (response) {
//         angular.forEach(vm.meetingroomentity, function (data) {
//           vm.mrname = data.name;
//         });
//         vm.entityName.push({
//           resourceId: vm.mrname,
//           id: costid,
//           points: points,
//           factor: vm.costfactor[factor]
//         });
//       });
//     }

//     function getFactorName() {
//       wamsServices.getEntity({
//         key: 'catalogValues',
//         request: {
//           masterId: 9
//         }
//       }).then(function (response) {
//         angular.forEach(response.rows, function (val) {
//           vm.costfactor[val.id] = val.value;
//         });
//       });
//     }

//     function pageChanged(pageNo) {
//       pageNo -= 1;

//       wamsServices.getEntity({
//         request: {
//           limit: vm.maxSize,
//           offset: pageNo * vm.maxSize
//         },
//         key: 'costconfigurations'
//       }).then(function (response) {
//         if (!response) {
//           vm.noData = true;
//           notifier.error('Problem encountered while fetching premises');
//           return;
//         }
//         if (response.rows && response.rows.length === 0) {
//           vm.noData = true;
//           notifier.error('Unable to fetch data');
//           return;
//         }
//         vm.entity = response.rows;
//         vm.pagingOptions.totalDataRecordCount = response.count;
//         vm.pagingOptions.rowCount = 1;
//         vm.pagingOptions.columnCount = 10;
//         if (response.count < 10) {
//           vm.shownCount = response.count;
//         }
//         angular.forEach(vm.entity, function (val) {
//           vm.costId = val.id;
//           vm.points = val.points;
//           vm.factor = val.factor;
//           getMRName(val.resourceId, vm.costId, vm.points, vm.factor);
//         });
//         vm.count = response.count;
//       }, function (error) {
//         notifier.error('Unable to fetch data' + error.message);
//       });
//     }
//   }
// })();
