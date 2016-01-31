(function () {
  'use strict';

  angular
    .module('wams.parking')
    .controller('createParkingCtrl', createParkingCtrl);

  function createParkingCtrl($modal, wamsServices, notifier, session) {
    var vm = this;
    vm.title = 'create parking';
    vm.ui = {};
    vm.infra = {};
    vm.addNew = addNew;
    vm.session = session;
    vm.reset = reset;
    vm.cancel = cancel;
    vm.totalSlots = totalSlots;
    vm.saveParking = saveParking;
    vm.getUserById = getUserById;
    vm.getLocation = getLocation;

    activate();

    ////////////////
    function activate() {
      getUsersRole();
    }

    function getUsersRole() {
      wamsServices.getEntity({
        request: {},
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

    function totalSlots() {
      vm.ui.totalSlots = parseInt(vm.ui.noOfTwoWheelerSlots) + parseInt(vm.ui.noOfFourWheelerSlots) + parseInt(vm.ui.noOfGuestTwoWheelerSlots) +
        parseInt(vm.ui.noOfGuestFourWheelerSlots);
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

    function saveParking() {
      if (vm.ui.checkbox == true) {
        var createnewuser = {
          name: vm.ui.adminname,
          email: vm.ui.email,
          phone: vm.ui.phone,
          mobile: vm.ui.mobile,
          tenantId: parseInt(session.getTenantId()),
          roleId: 102
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
      vm.parkingDetails = {
        location: vm.ui.location,
        noOfTwoWheelerSlots: vm.ui.noOfTwoWheelerSlots,
        noOfFourWheelerSlots: vm.ui.noOfFourWheelerSlots,
        noOfGuestTwoWheelerSlots: vm.ui.noOfGuestTwoWheelerSlots,
        noOfGuestFourWheelerSlots: vm.ui.noOfGuestFourWheelerSlots,
        totalSlots: vm.ui.totalSlots,
        description: vm.ui.description,
        status: 0,
        managerId: managerId,
        premiseId: vm.infra.premisesId,
        buildingId: vm.infra.buildingId,
        floorId: vm.infra.floorId,

      };
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'parking/createparking/createParkingInfo.tpl.html',
        controller: 'createParkingInfoCtrl as vm',
        size: 'lg',
        resolve: {
          data: function () {
            return vm.parkingDetails;
          }
        }
      });
      modalInstance.result.then(function (data) {
        vm.saveconfirmation = data;
        if (vm.saveconfirmation === 'save') {
          console.log(JSON.stringify(vm.parkingDetails));
          wamsServices.saveEntity({
            key: 'parkings',
            request: vm.ParkingDetails
          }).then(function (response) {
            if (response) {
              if (_.has(response, 'statusCode')) {
                notifier.error('Problem encountered while saving data :' + response.message);
                return;
              }
              notifier.success('parking : ' + response.name + '  saved successfully');
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

    function reset() {
      vm.ui = {};
    }

    function cancel() {
      $state.go('wams.createparking');

    }

  }
})();
