(function () {
  'use strict';

  angular
    .module('wams.gym')
    .controller('CreateGymCtrl', CreateGymCtrl);
  /* @ngInject */
  function CreateGymCtrl($modal, $state, notifier, wamsServices, session, $stateParams) {
    var vm = this;
    vm.title = 'Create Gym';
    vm.ui = {};
    vm.infra = {};
    vm.session = session;
    vm.getLocation = getLocation;
    vm.saveGym = savegym;
    vm.reset = reset;
    vm.cancel = cancel;
    vm.locationtext = [];
    vm.getUserById = getUserById;
    vm.addNew = addNew;
    vm.notReadable = false;
    vm.createmore = false;
    vm.updateMode = false;
    vm.uploadPic = uploadPic;

    activate();

    ////////////////

    function activate() {
      getGymRoleUsers();
      if (angular.isDefined($stateParams.gymId) && $stateParams.gymId > 0) {
        getGymById($stateParams.gymId);
        vm.updateMode = true;
        vm.title = 'Update Gym';
      }
    }

    function getGymRoleUsers() {
      wamsServices.getEntity({
        request: {
          roleId: 98
        },
        key: 'userroles'
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
        vm.assignedUsers = _.pluck(response.rows, 'uid');
        getAllusers();
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function getAllusers() {
      vm.allusers = {};
      var i, temp = [];
      var req = {
        limit: 20,
        offset: 0
      };
      if (session.hasRole('TenantAdmin')) {
        req.company = parseInt(session.getTenantId());
      }
      wamsServices.getEntity({
        request: req,
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
        if (vm.assignedUsers.length > 0) {
          for (i = 0; i < vm.assignedUsers.length; i = i + 1) {
            _.forEach(response.rows, function (val) {
              if (val.id == vm.assignedUsers[i]) {
                temp.push(val);
              }
            });
          }
          angular.forEach(temp, function (val) {
            vm.allusers[val.id] = val.name;
          });
        }
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function getLocation() {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'meetingroom/createmeetingroom/mrLocation.tpl.html',
        controller: 'MRoomLocationCtrl as vm',
        size: 'lg'
      });
      modalInstance.result.then(function (data) {
        vm.infra = data;
        console.log('Infra' + JSON.stringify(vm.infra));
        vm.ui.location = data.locationtext.toString();
        // console.log(JSON.stringify(data));
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }

    function getUserById(id) {
      vm.notReadable = true;
      wamsServices.getEntity({
        request: {
          id: id
        },
        key: 'users'
      }).then(function (response) {
        if (response.rows.length > 0) {
          vm.ui.adminname = response.rows[0].name;
          vm.ui.mobile = response.rows[0].mobile;
          vm.ui.phone = response.rows[0].phone;
          vm.ui.email = response.rows[0].email;

        } else {
          vm.ui.adminname = '';
          vm.ui.mobile = '';
          vm.ui.email = '';
          alert('this user is not a manager');
        }
      });
    }

    function addNew() {
      vm.notReadable = false;
      vm.ui.adminname = '';
      vm.ui.mobile = '';
      vm.ui.phone = '';
      vm.ui.email = '';
      vm.ui.managerId = '';
    }

    function savegym() {
      if (vm.ui.checkbox == true) {
        var createnewuser = {
          name: vm.ui.adminname,
          email: vm.ui.email,
          phone: vm.ui.phone,
          mobile: vm.ui.mobile,
          tenantId: parseInt(session.getTenantId()),
          roleId: 98
        };
        //console.log('SaveNewUser' + JSON.stringify(createnewuser));
        wamsServices.saveEntity({
          key: 'users',
          request: createnewuser
        }).then(function (response) {
          if (response) {
            if (_.has(response, 'statusCode')) {
              notifier.error('Problem encountered while saving data :' + response.message);
              return;
            }
            notifier.success('User : ' + response.name + '  saved successfully');
            if (response.id) {
              finalSave(response.id);
            }
          }
        }, function (error) {
          notifier.error('Problem encountered while saving data :' + error.message);
        });
      } else {
        finalSave(vm.ui.managerId);
      }
    }

    function finalSave(managerId) {
      vm.gymDetails = {
        name: vm.ui.name,
        location: vm.ui.location,
        description: vm.ui.description,
        capacity: vm.ui.capacity,
        status: 0,
        managerId: managerId,
        premiseId: vm.infra.premisesId,
        buildingId: vm.infra.buildingId,
        floorId: vm.infra.floorId,
        floorPartId: vm.infra.floorPartId
      };
      //console.log(JSON.stringify(vm.gymDetails));
      if (vm.gymDetails) {
        openConfirmation(vm.gymDetails);
      }
    }

    function openConfirmation(gymDetails) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'gym/create/createGymInfo.tpl.html',
        controller: 'GymInfoCtrl as vm',
        size: 'sm',
        resolve: {
          data: function () {
            return vm.gymDetails;
          }
        }
      });

      modalInstance.result.then(function (data) {
        vm.saveconfirmation = data;
        if (vm.saveconfirmation === 'save') {
          console.log(JSON.stringify(vm.gymDetails));
          wamsServices.saveEntity({
            key: 'gym',
            request: vm.gymDetails
          }).then(function (response) {
            if (response) {
              if (_.has(response, 'statusCode')) {
                notifier.error('Problem encountered while saving data :' + response.message);
                return;
              }
              notifier.success('gym : ' + response.name + '  saved successfully');
              if (vm.createmore) {
                vm.ui = {};
              } else {
                vm.cancel();
              }
            }
          }, function (error) {
            notifier.error('Problem encountered while saving data :' + error.message);
          });
        } else {
          vm.ui = {};
        }
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }

    function uploadPic() {

    }

    function reset() {
      vm.ui = {};
    }


    function cancel() {
      $state.go('wams.allgyms');
    }

    function getGymById(gymId) {
      wamsServices.getEntity({
        key: 'gym',
        request: {
          id: gymId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching gym information');
          return;
        }
        vm.ui.capacity = response.rows[0].capacity.toString();
        vm.ui = response.rows[0];
      }, function (error) {
        notifier.error(error.message);
      }).then(function (response) {
        getUserById(vm.ui.managerId);
      });
    }
  }
})();
