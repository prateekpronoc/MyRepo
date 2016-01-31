(function () {
  'use strict';

  angular
    .module('wams.infrastructure')
    .controller('BuildingCtrl', BuildingCtrl);

  /* @ngInject */
  function BuildingCtrl(wamsServices, notifier, _, $state, $stateParams, $modal, session) {
    /*jshint validthis: true */
    var vm = this;
    vm.title = 'Create Building';
    vm.buildingInfo = {};
    vm.updateMode = false;
    vm.createmore = false;
    vm.fetchPremisesAddress = fetchPremisesAddress;
    vm.saveBuildingDetails = saveBuildingDetails;
    vm.serverData = {};
    vm.reset = reset;
    vm.cancel = cancel;
    vm.notReadable = false;
    vm.getUserById = getUserById;
    vm.addNew = addNew;
    activate();

    function activate() {
      if (angular.isDefined($stateParams.buildingId) && $stateParams.buildingId > 0) {
        getBuildingInfoById($stateParams.buildingId);
        vm.updateMode = true;
        vm.title = 'Update Building';
      } else {
        fetchAllPremises();
        getAllusers();
      }
    }

    function addNew() {
      vm.notReadable = false;
      vm.buildingInfo.contactPerson = '';
      vm.buildingInfo.contactPersonName = '';
      vm.buildingInfo.contactNo = '';
      vm.buildingInfo.email = '';
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
          vm.buildingInfo.contactPersonName = vm.managerdetails.name;
          vm.buildingInfo.contactNo = vm.managerdetails.mobile;
          vm.buildingInfo.email = vm.managerdetails.email;
        } else {
          vm.buildingInfo.contactPerson = '';
          vm.buildingInfo.contactNo = '';
          vm.buildingInfo.email = '';
          alert('this user is not a manager');
        }
      });
    }

    function getBuildingInfoById(entityId) {
      wamsServices.getEntity({
        key: 'buildings',
        request: {
          id: entityId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching building information');
          return;
        }
        vm.serverData = response.rows[0];
        vm.buildingInfo = response.rows[0];
        fetchAllPremises();
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function fetchAllPremises() {
      wamsServices.getEntity({
        key: 'premises',
        request: {}
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching premises data');
          return;
        }
        vm.premises = response.rows;
        if (vm.updateMode) {
          fetchPremisesAddress();
        }
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function fetchPremisesAddress() {
      var premisesDetails = _.filter(vm.premises, {
        id: vm.buildingInfo.premiseId
      })[0];
      vm.buildingInfo.cityName = premisesDetails.cityName;
      vm.buildingInfo.address = premisesDetails.address;
    }

    function saveBuildingDetails() {
      vm.buildingdetails = {
        name: vm.buildingInfo.name,
        premiseId: vm.buildingInfo.premiseId,
        location: vm.buildingInfo.location,
        address: vm.buildingInfo.cityName + ' ' + vm.buildingInfo.address,
        //contactPerson: vm.buildingInfo.contactPerson,
        contactPersonName: vm.buildingInfo.contactPersonName,
        contactNo: vm.buildingInfo.contactNo,
        email: vm.buildingInfo.email,
        status: 0
      };
      if (vm.buildingInfo.checkbox) {
        vm.buildingdetails.contactPerson = 0;
      } else {
        vm.buildingdetails.contactPerson = vm.buildingInfo.contactPerson;
      }
      if (vm.updateMode) {
        vm.buildingdetails.id = vm.buildingInfo.id;
      }
      if (vm.buildingdetails) {
        openConfirmation(vm.buildingdetails);
      }
    }

    function openConfirmation(buildingdetails) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'infrastructure/saveConfirmation.html',
        controller: 'saveConfirmationCtrl as vm',
        size: 'sm',
        resolve: {
          data: function () {
            return buildingdetails;
          }
        }
      });

      modalInstance.result.then(function (data) {
          vm.saveconfirmation = data;
          if (vm.saveconfirmation === 'save') {
            console.log(JSON.stringify(vm.buildingdetails));
            wamsServices.saveEntity({
              key: 'buildings',
              request: vm.buildingdetails
            }).then(function (response) {
              if (response) {
                if (_.has(response, 'statusCode')) {
                  notifier.error('Problem encountered while saving data : ' + response.message);
                  return;
                }
                notifier.success('Building : ' + response.name + '  saved successfully');
                if (vm.createmore) {
                  vm.buildingInfo = {};
                } else {
                  // $state.go('wams.viewAllbuildings');
                  $state.go('wams.viewAllbuildings', {}, {
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
      console.log(JSON.stringify(vm.serverData));
      if (!vm.updateMode) {
        vm.buildingInfo = vm.serverData;
      }
    }

    function cancel() {
      $state.go('wams.viewAllbuildings');
    }

  }
})();
