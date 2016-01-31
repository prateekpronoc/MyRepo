(function () {
  'use strict';

  angular
    .module('wams.infrastructure')
    .controller('FloorCtrl', FloorCtrl);

  /* @ngInject */
  function FloorCtrl($stateParams, wamsServices, notifier, _, $state, $modal, session) {
    /*jshint validthis: true */
    var vm = this;
    vm.title = 'Create Floor';
    vm.floorInfo = {};
    var serverData = {};
    vm.updateMode = false;
    vm.createmore = false;
    vm.saveFloor = saveFloor;
    vm.reset = reset;
    vm.cancel = cancel;
    vm.getUserById = getUserById;
    vm.addNew = addNew;
    vm.notReadable = false;
    activate();

    function activate() {
      getAllusers();
      if (angular.isDefined($stateParams.floorId) && $stateParams.floorId > 0) {
        getfloorDetailsById($stateParams.floorId);
        vm.updateMode = true;
        vm.page = {
          title: 'Update Floor'
        };
      } else {
        fetchBuildings();
      }
    }

    function addNew() {
      vm.notReadable = false;
      vm.floorInfo.contactPersonName = '';
      vm.floorInfo.contactNo = '';
      vm.floorInfo.email = '';
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
          vm.floorInfo.contactPersonName = vm.managerdetails.name;
          vm.floorInfo.contactNo = vm.managerdetails.mobile;
          vm.floorInfo.email = vm.managerdetails.email;

        } else {
          vm.floorInfo.contactPersonName = '';
          vm.floorInfo.contactNo = '';
          vm.floorInfo.email = '';
          alert('this user is not a manager');
        }
      });
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


    function fetchBuildings() {
      wamsServices.getEntity({
        key: 'buildings',
        request: {}
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching building data');
          return;
        }
        vm.buildings = response.rows;
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getfloorDetailsById(floorId) {
      wamsServices.getEntity({
        key: 'floors',
        request: {
          id: floorId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching floor details');
          return;
        }
        serverData = response.rows[0];
        vm.floorInfo = response.rows[0];
        fetchBuildings();
      }, function (error) {
        notifier.error(error.message);
        getUserById(vm.floorInfo.managerId);
      });
    }

    function saveFloor() {
      vm.floorDetails = {
        name: vm.floorInfo.name,
        buildingId: vm.floorInfo.buildingId,
        contactPerson: vm.floorInfo.managerId,
        contactPersonName: vm.floorInfo.contactPersonName,
        contactNo: vm.floorInfo.contactNo,
        email: vm.floorInfo.email,
        status: 0
      };

      if (vm.updateMode) {
        vm.floorDetails.id = vm.floorInfo.id;
      }
      if (vm.floorDetails) {
        openConfirmation(vm.floorDetails);
      }
    }

    function openConfirmation(floorDetails) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'infrastructure/saveConfirmation.html',
        controller: 'saveConfirmationCtrl as vm',
        size: 'sm',
        resolve: {
          data: function () {
            return floorDetails;
          }
        }
      });

      modalInstance.result.then(function (data) {
          vm.saveconfirmation = data;
          if (vm.saveconfirmation === 'save') {
            console.log(JSON.stringify(vm.floorDetails));
            wamsServices.saveEntity({
              key: 'floors',
              request: vm.floorDetails
            }).then(function (response) {
              if (response) {
                if (_.has(response, 'statusCode')) {
                  notifier.error('Problem encountered while saving data :' + response.message);
                  return;
                }
                notifier.success('Floor : ' + response.name + '  saved successfully');
                if (vm.createmore) {
                  vm.floorInfo = {};
                } else {
                  $state.go('wams.viewAllFloors', {}, {
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

    function reset() {
      if (!vm.updateMode) {
        vm.floorInfo = serverData;
      }
    }

    function cancel() {
      $state.go('wams.viewAllFloors');
    }
  }
})();
