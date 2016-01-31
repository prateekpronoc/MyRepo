(function () {
  'use strict';

  angular
    .module('wams.infrastructure')
    .controller('FloorPartsCtrl', FloorPartsCtrl);

  /* @ngInject */
  function FloorPartsCtrl(wamsServices, notifier, $stateParams, $state, $modal, session) {
    /*jshint validthis: true */
    var vm = this;
    vm.title = 'Create Floorpart';
    vm.fpInfo = {};
    vm.getBuildings = getBuildings;
    vm.fetchFloors = fetchFloors;
    vm.saveFloorpart = saveFloorpart;
    vm.updateMode = false;
    vm.createmore = false;
    vm.serverData = {};
    vm.reset = reset;
    vm.cancel = cancel;
    vm.notReadable = false;
    vm.getUserById = getUserById;
    vm.addNew = addNew;
    activate();

    function activate() {
      if (angular.isDefined($stateParams.floorId) && $stateParams.floorId > 0) {
        vm.floorId = $stateParams.floorId[0];
        fetchFloors();
      }
      if (angular.isDefined($stateParams.fpId) && $stateParams.fpId > 0) {
        getfPartssById($stateParams.fpId);
        vm.updateMode = true;
        vm.page = {
          title: 'Update Floor Parts'
        };
      } else {
        getAllPremises();
      }
      getAllusers();
    }

    function addNew() {
      vm.notReadable = false;
      vm.fpInfo.contactPerson = '';
      vm.fpInfo.contactPersonName = '';
      vm.fpInfo.contactNo = '';
      vm.fpInfo.email = '';
    }

    function getAllusers() {
      vm.allusers = {};
      wamsServices.getEntity({
        request: {
          tenantId: parseInt(session.getTenantId())
        },
        key: 'users'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching users');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        //vm.allusers = response.rows;
        angular.forEach(response.rows, function (val) {
          vm.allusers[val.id] = val.name;
        });
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function getUserById(id) {
      console.log('Selected Id ' + id);
      vm.notReadable = true;
      wamsServices.getEntity({
        request: {
          id: id
        },
        key: 'users'
      }).then(function (response) {
        vm.managerdetails = response.rows[0];
        if (vm.managerdetails) {
          vm.fpInfo.contactPersonName = vm.managerdetails.name;
          vm.fpInfo.contactNo = vm.managerdetails.mobile;
          vm.fpInfo.email = vm.managerdetails.email;

        } else {
          vm.fpInfo.contactPersonName = '';
          vm.fpInfo.contactNo = '';
          vm.fpInfo.email = '';
          alert('this user is not a manager');
        }
      });
    }


    function saveFloorpart() {
      vm.Floorpartdetails = {
        name: vm.fpInfo.location,
        floorId: vm.fpInfo.floorId,
        location: vm.fpInfo.location,
        //contactPerson: vm.fpInfo.contactPerson,
        contactPersonName: vm.fpInfo.contactPersonName,
        contactNo: vm.fpInfo.contactNo,
        email: vm.fpInfo.email,
        status: 0
      };
      if (vm.fpInfo.checkbox) {
        vm.Floorpartdetails.contactPerson = 0;
      } else {
        vm.Floorpartdetails.contactPerson = vm.fpInfo.contactPerson;
      }
      if (angular.isDefined($stateParams.floorId) && $stateParams.floorId > 0) {
        vm.Floorpartdetails.floorId = vm.floorId;
      } else {
        vm.Floorpartdetails.floorId = vm.fpInfo.floorId;
      }

      if (vm.updateMode) {
        vm.Floorpartdetails.id = vm.fpInfo.id;
      }
      if (vm.Floorpartdetails) {
        openConfirmation(vm.Floorpartdetails);
      }

    }

    function openConfirmation(Floorpartdetails) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'infrastructure/saveConfirmation.html',
        controller: 'saveConfirmationCtrl as vm',
        size: 'sm',
        resolve: {
          data: function () {
            return Floorpartdetails;
          }
        }
      });

      modalInstance.result.then(function (data) {
          vm.saveconfirmation = data;
          if (vm.saveconfirmation === 'save') {
            console.log(JSON.stringify(vm.Floorpartdetails));
            wamsServices.saveEntity({
              key: 'floorparts',
              request: vm.Floorpartdetails
            }).then(function (response) {
              if (response) {
                if (_.has(response, 'statusCode')) {
                  notifier.error('Problem encountered while saving data : ' + response.message);
                  return;
                }
                notifier.success('Floor Part : ' + response.name + '  saved successfully');
                if (vm.createmore) {
                  vm.fpInfo = {};
                } else {
                  $state.go('wams.viewAllFloorParts', {}, {
                    reload: true
                  });
                }
              }
            }, function (error) {
              notifier.error('Problem encountered while saving data :' + error.message);
            });
          } else {
            console.log('cancel');
          }
        },
        function () {
          console.log('Modal dismissed at: ' + new Date());
        });
    }

    function getAllPremises() {
      wamsServices.getEntity({
        key: 'premises',
        request: {}
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching premises information');
          return;
        }
        vm.premises = response.rows;
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getBuildings() {
      wamsServices.getEntity({
        key: 'buildings',
        request: {
          premiseId: vm.fpInfo.premisesId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching building information');
          return;
        }
        vm.buildings = response.rows;
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function fetchFloors() {
      var request = {};
      if (vm.floorId) {
        request = {
          id: vm.floorId
        };
      } else {
        request = {
          buildingId: vm.fpInfo.buildingId
        };
      }
      wamsServices.getEntity({
        key: 'floors',
        request: request
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching floor information');
          return;
        }
        if (vm.floorId) {
          vm.floors = response.rows;
          vm.fpInfo.floorId = response.rows[0].name;
        } else {
          vm.floors = response.rows;
        }
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getfPartssById(fpId) {
      wamsServices.getEntity({
        key: 'floorparts',
        request: {
          id: fpId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching floor part information');
          return;
        }
        vm.serverData = response.rows[0];
        vm.fpInfo = response.rows[0];
        vm.fpInfo.name = response.rows[0].name;
        vm.fpInfo.contactNo = response.rows[0].contactNo;
        vm.fpInfo.floorId = response.rows[0].floorId;
        vm.fpInfo.location = response.rows[0].location;
        getAllPremises();
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function reset() {
      if (vm.updateMode) {
        vm.fpInfo = vm.serverData;
      } else {
        vm.fpInfo = {};
      }
    }

    function cancel() {
      $state.go('wams.viewAllbuildings');
    }
  }
})();
// (function () {
//   'use strict';

//   angular
//     .module('wams.infrastructure')
//     .controller('AddFloorpartCtrl', AddFloorpartCtrl);

//   /* @ngInject */
//   function AddFloorpartCtrl(meetingRoomService, premisesServices, $timeout, $state) {
//     var vm = this;
//     vm.title = 'Create Floorpart';
//     vm.Floorpart = {};
//     vm.getUserById = getUserById;
//     vm.getCityCatalog = getCityCatalog;
//     vm.saveAndCreateFloorpart = saveAndCreateFloorpart;
//     vm.saveFloorpart = saveFloorpart;
//     vm.reset = reset;
//     vm.cancel = cancel;
//     vm.getBuildings = getBuildings;
//     vm.fetchFloor = fetchFloor;

//     activate();

//     ////////////////

//     function activate() {
//       getAllusers();
//       getPremises();
//       getStatesCatalog();
//     }

//     function saveAndCreateFloorpart() {
//       var Floorpartdetails = {
//         name: vm.Floorpart.floorpartname,
//         floorId: 1,
//         location: vm.Floorpart.location,
//         contactPerson: 1,
//         contactNo: vm.Floorpart.mobile,
//         email: vm.Floorpart.email,
//         tenantId: 1,
//         status: 0
//       };
//       FloorpartService.createFloorpart(Floorpartdetails).then(function (response) {
//         if (response) {
//           console.log(response);
//           vm.Floorpart = '';
//           alertMessage();
//         }
//       }, function (error) {
//         console.log(error);
//       });
//     }

//     function saveFloorpart() {
//       saveAndCreateFloorpart();
//       $timeout(function () {
//         $state.go('wams.viewAllFloorparts', {}, {
//           reload: true
//         });
//       }, 3000);
//     }

//     function reset() {
//       vm.Floorpart = '';
//     }

//     function cancel() {
//       $state.go('wams.viewAllFloorparts', {}, {
//         reload: true
//       });
//     }
//     // for calling alert after posting the data
//     vm.alerts = [];

//     function alertMessage() {
//       var alert = {
//         msg: 'Floorpart is Created.'
//       };
//       vm.alerts.push(alert);

//       $timeout(function () {
//         vm.alerts.splice(0, 1);
//       }, 3000);
//     }

//     function getAllusers() {
//       meetingRoomService.getAllUsers().then(function (response) {
//         vm.allusers = response;
//       });
//     }

//     function getUserById(id) {
//       meetingRoomService.getUserById(id).then(function (response) {
//         vm.managerdetails = response;
//         if (vm.managerdetails) {
//           vm.Floorpart.name = vm.managerdetails.name;
//           vm.Floorpart.mobile = vm.managerdetails.mobile;
//           vm.Floorpart.phone = vm.managerdetails.phone;
//           vm.Floorpart.email = vm.managerdetails.email;
//         } else {
//           vm.Floorpart.name = '';
//           vm.Floorpart.mobile = '';
//           vm.Floorpart.email = '';
//         }
//       });
//     }

//     function getPremises() {
//       vm.premises = [];
//       meetingRoomService.getAllPremises().then(function (response) {
//         vm.premises = response.rows;
//       });
//     }

//     function getBuildings(id) {
//       console.log(id);
//       vm.buildings = [];
//       meetingRoomService.getAllBuildings().then(function (response) {
//         angular.forEach(response.rows, function (data) {
//           if (id === data.premiseId) {
//             vm.buildings.push({
//               id: data.id,
//               name: data.name
//             });
//           }
//         });
//       });
//     }

//     function fetchFloor(Id) {
//       vm.floors = [];
//       console.log(Id);
//       meetingRoomService.getFloorById(Id).then(function (response) {
//         angular.forEach(response, function (data) {
//           if (Id === data.buildingId) {
//             vm.floors.push({
//               id: data.id,
//               name: data.name
//             });
//           }
//         });
//       });
//     }

//     function getStatesCatalog() {
//       premisesServices.getPremiseStateCatalog().then(function (response) {
//         vm.states = response;
//       });
//     }

//     function getCityCatalog() {
//       premisesServices.getPremiseCityCatalog().then(function (response) {
//         vm.cities = response;
//       });
//     }
//   }
// })();
