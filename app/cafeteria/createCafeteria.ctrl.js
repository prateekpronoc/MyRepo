(function () {
  'use strict';

  angular
    .module('wams.cafeteria')
    .controller('createCafeteriaCtrl', createCafeteriaCtrl);
  /* @ngInject */
  function createCafeteriaCtrl(wamsServices, notifier, $stateParams, $modal, $state) {
    var vm = this;
    vm.title = 'Create Cafeteria';
    vm.ui = {};
    var serverData = {};
    vm.updateMode = false;
    vm.getBuildings = getBuildings;
    vm.fetchFloors = fetchFloors;
    vm.fetchFloorParts = fetchFloorParts;
    vm.saveCafeteria = saveCafeteria;
    vm.startdateopen = startdateopen;
    vm.enddateopen = enddateopen;
    vm.reset = reset;
    vm.cancel = cancel;

    activate();

    ////////////////

    function activate() {
      if (angular.isDefined($stateParams.cafeteriaId) && $stateParams.cafeteriaId > 0) {
        getCafeById($stateParams.cafeteriaId);
        vm.updateMode = true;
        vm.title = 'Update Cafeteria';
      } else {
        getAllPremises();
        getCusineTypes();
      }
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

    function getCusineTypes() {
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          masterId: 12
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching premises information');
          return;
        }
        vm.cuisines = response.rows;
      }, function (error) {
        notifier.error(error.message);
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
      }).then(function (response) {
        getAllPremises();
        getBuildings();
        fetchFloors();
        fetchFloorParts();
        getCusineTypes();
      });
    }

    function saveCafeteria() {
      vm.cafeteriaDetails = {
        name: vm.ui.name,
        description: vm.ui.description,
        premiseId: vm.ui.premiseId,
        buildingId: vm.ui.buildingId,
        floorId: vm.ui.floorId,
        floorPartId: vm.ui.floorPartId,
        contactId: 47,
        contactName: vm.ui.contactName,
        contactNo: vm.ui.contactNo,
        contactEmail: vm.ui.contactEmail,
        cuisineId: vm.ui.cuisineId
      }
      if (vm.updateMode) {
        vm.cafeteriaDetails.id = vm.ui.id;
      }

      if (vm.cafeteriaDetails) {
        openConfirmation(vm.cafeteriaDetails);
      }

    }

    function openConfirmation(cafeteriaDetails) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'cafeteria/cafeteriaconfirm.html',
        controller: 'cafeteriaConfirmCtrl as vm',
        size: 'sm',
        resolve: {
          data: function () {
            return cafeteriaDetails;
          }
        }
      });

      modalInstance.result.then(function (data) {
          vm.saveconfirmation = data;
          if (vm.saveconfirmation === 'save') {
            console.log(JSON.stringify(vm.cafeteriaDetails));
            wamsServices.saveEntity({
              key: 'cafeteria',
              request: vm.cafeteriaDetails
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
          premiseId: vm.ui.premiseId
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
      wamsServices.getEntity({
        key: 'floors',
        request: {
          buildingId: vm.ui.buildingId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching floor information');
          return;
        }
        vm.floors = response.rows;
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function fetchFloorParts() {
      wamsServices.getEntity({
        key: 'floorparts',
        request: {
          floorId: vm.ui.floorId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching floor part information');
          return;
        }
        vm.floorparts = response.rows;
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function startdateopen($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.startdateopened = true;
    }

    function enddateopen($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.enddateopened = true;
    }
  }
})();
