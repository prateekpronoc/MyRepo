(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('CreateMeetingRoomCtrl', CreateMeetingRoomCtrl);

  /* @ngInject */
  function CreateMeetingRoomCtrl($stateParams, _, $modal, $state, notifier, wamsServices, Upload, $timeout) {
    var vm = this;
    vm.title = 'Create Meeting Room';

    vm.ui = {};
    vm.infra = {};
    vm.updateMode = false;
    var serverData = {};
    vm.getLocation = getLocation;
    vm.saveMeetingRoom = saveMeetingRoom;
    vm.reset = reset;
    vm.cancel = cancel;
    vm.locationtext = [];
    vm.getUserById = getUserById;
    vm.addNew = addNew;
    vm.notReadable = false;
    vm.uploadPic = uploadPic;
    activate();

    ////////////////

    function activate() {
      getType();
      getAllusers();
      vm.roomid = $stateParams.roomid;
      if (angular.isDefined($stateParams.roomid) && $stateParams.roomid > 0) {
        getMeetingRoomById($stateParams.roomid);
        vm.updateMode = true;
        vm.page = {
          title: 'Update Meeting Room'
        };
      }
    }

    function uploadPic(file) {
      console.log(file);
      var imageUpload = {
        file: file
      };
      wamsServices.postUpload({
        key: 'upload',
        request: imageUpload
      }).then(function (response) {
        vm.imageId = response.data
        getUploadPic(vm.imageId)
      });
    }

    function getUploadPic(imageId) {
      vm.imageSource = '/api/download?fileName=' + imageId;
    }

    function addNew() {
      vm.notReadable = false;
      vm.ui.adminname = '';
      vm.ui.mobile = '';
      vm.ui.phone = '';
      vm.ui.email = '';
      vm.ui.managerId = '';
    }

    function getMeetingRoomById(entityId) {
      wamsServices.getEntity({
        key: 'meetingRooms',
        request: {
          id: entityId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching meetingroom information');
          return;
        }
        serverData = response.rows[0];
        vm.ui = response.rows[0];
      }, function (error) {
        notifier.error(error.message);
      }).then(function (response) {
        getUserById(vm.ui.managerId);
      });

    }


    function saveMeetingRoom(managerId) {
      var managerid = managerId;
      if (vm.ui.checkbox == true) {
        var createnewuser = {
          name: vm.ui.adminname,
          email: vm.ui.email,
          phone: vm.ui.phone,
          mobile: vm.ui.mobile,
          tenantId: 1
        };
        //createnewuser.userName = createnewuser.email;
        console.log('SaveNewUser' + JSON.stringify(createnewuser));
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
              save(response.id);
            }
          }
        }, function (error) {
          notifier.error('Problem encountered while saving data :' + error.message);
        });
      } else {
        save(managerId);
      }
    }

    function save(managerId) {
      vm.meetingroomDetails = {
        name: vm.ui.name,
        location: vm.ui.location,
        typeId: vm.ui.typeId,
        description: vm.ui.description,
        capacity: vm.ui.capacity,
        status: 0,
        managerId: managerId,
        buildingId: vm.infra.buildingId,
        floorId: vm.infra.floorId,
        floorPartId: vm.infra.floorPartId
      };
      if (vm.updateMode) {
        vm.meetingroomDetails.id = $stateParams.roomid[0];
        vm.meetingroomDetails.buildingId = vm.ui.buildingId
        vm.meetingroomDetails.floorId = vm.ui.floorId
        vm.meetingroomDetails.floorPartId = vm.ui.floorPartId
      }
      console.log(vm.meetingroomDetails);
      if (vm.meetingroomDetails) {
        openConfirmation(vm.meetingroomDetails);
      }
    }

    function openConfirmation(meetinroomDetails) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'meetingroom/createmeetingroom/saveConfirmation.html',
        controller: 'MeetingRoomInfoCtrl as vm',
        size: 'sm',
        resolve: {
          data: function () {
            return meetinroomDetails;
          }
        }
      });

      modalInstance.result.then(function (data) {
        vm.saveconfirmation = data;
        if (vm.saveconfirmation === 'save') {
          console.log(JSON.stringify(vm.meetingroomDetails));
          wamsServices.saveEntity({
            key: 'meetingRooms',
            request: vm.meetingroomDetails
          }).then(function (response) {
            if (response) {
              if (_.has(response, 'statusCode')) {
                notifier.error('Problem encountered while saving data :' + response.message);
                return;
              }
              notifier.success('Meeting Room : ' + response.name + '  saved successfully');
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
          console.log('cancel');
        }
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }

    function reset() {
      if (!vm.updateMode) {
        vm.ui = serverData;
      }
    }


    function cancel() {
      $state.go('wams.meetingrooms');
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
          vm.ui.adminname = vm.managerdetails.name;
          vm.ui.mobile = vm.managerdetails.mobile;
          vm.ui.phone = vm.managerdetails.phone;
          vm.ui.email = vm.managerdetails.email;

        } else {
          vm.ui.adminname = '';
          vm.ui.mobile = '';
          vm.ui.email = '';
          alert('this user is not a manager');
        }
      });
    }

    function getAllusers() {
      vm.allusers = {};
      wamsServices.getEntity({
        request: {},
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

    function getLocation() {
      openLocationModal();
    }

    function openLocationModal() {
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
  }
})();
