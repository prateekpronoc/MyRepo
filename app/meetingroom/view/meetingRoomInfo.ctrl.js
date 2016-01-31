(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('MeetingRoomInfoCtrl', MeetingRoomInfoCtrl);

  /* @ngInject */
  function MeetingRoomInfoCtrl($modalInstance, data, wamsServices, notifier) {
    var vm = this;
    vm.title = 'Controller';
    vm.meetinroomDetails = data;
    activate();
    vm.exit = exit;
    vm.save = save;

    function exit() {
      $modalInstance.close('cancel');
    }

    function save() {
      $modalInstance.close('save');
    }
    ////////////////

    function activate() {
      console.log(JSON.stringify(vm.meetinroomDetails));
      if (vm.meetinroomDetails.managerId) {
        getUserById(vm.meetinroomDetails.managerId);
      }
      if (vm.meetinroomDetails.typeId) {
        getTypeId();
      }
      fetchInfraTypeValues();
    }

    function getTypeId() {
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          id: vm.meetinroomDetails.typeId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching premise information');
          return;
        }
        vm.meetinroomDetails.meetingRoomType = response.rows[0].value;
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getUserById(managerId) {
      wamsServices.getEntity({
        request: {
          id: managerId
        },
        key: 'users'
      }).then(function (response) {
        vm.managerdetails = response.rows[0];
        console.log(JSON.stringify(vm.managerdetails));
        // if (vm.managerdetails) {
        //   console.log('data of managersssssssssssssssss' + JSON.stringify(vm.managerdetails));
        //   vm.credentials.adminname = vm.managerdetails.name;
        //   vm.credentials.mobile = vm.managerdetails.mobile;
        //   vm.credentials.email = vm.managerdetails.email;

        // } else {
        //   vm.credentials.adminname = '';
        //   vm.credentials.mobile = '';
        //   vm.credentials.email = '';
        //   alert('this user is not a manager');
        // }
      });
    }

    function fetchInfraTypeValues() {
      var i;
      vm.infraTypes = [];
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          masterId: 3
        }
      }).then(function (response) {
        if (!response) {
          notifier.error('Problem encountered while fetching meeting room');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          notifier.error('Unable to fetch data');
          return;
        }
        vm.infraTypes = response.rows;
        fetchInfraDetails();
      }, function (error) {
        notifier.error('Unable to fetch data : ' + error.message);
      });
    }

    function fetchInfraDetails() {
      var i;
      vm.infraDetails = [];
      wamsServices.getEntity({
        request: {
          meetingRoomId: vm.meetinroomDetails.id
        },
        key: 'getMeetingInfra'
      }).then(function (response) {
          if (vm.infraTypes.length > 0) {
            _.forEach(vm.infraTypes, function (val) {
              vm.infraDetails.push({
                id: val.id,
                name: val.value
              });
            });
            for (i = 0; i < response.rows.length; i = i + 1) {
              _.forEach(vm.infraDetails, function (val) {
                if (val.name == response.rows[i].name) {
                  val.isSelected = true;
                }
              });
            }
          }
          console.log(JSON.stringify(vm.infraDetails));
        },
        function (error) {
          notifier.error(error.message);
        });
    }

  }
})();
