(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('CreateMeetingRoomCtrl1', CreateMeetingRoomCtrl1);

  function CreateMeetingRoomCtrl1(MeetingRoomService, CreateNewUserService, $state) {
    // body...
    var vm = this;
    vm.reset = reset;
    vm.saveMeetingRoom = saveMeetingRoom;
    vm.saveAndCreateMeetingRoom = saveAndCreateMeetingRoom;
    /* vm.CreateNewUser = CreateNewUser;*/
    vm.getManagerid = getManagerid;
    vm.checkbox = checkbox;
    vm.meetingroom = {};
    vm.credentials = {};
    vm.managerdetail = {};
    vm.meetingroom.checkbox = false;

    vm.page = {
      title: 'Create Meeting Room'
    };
    vm.toggled = toggled;
    vm.ajaxFaker = ajaxFaker;

    function toggled(a) {
      console.log('Dropdown is now: ', a);
    }

    function ajaxFaker() {
      $state.reload();
    }
    activate();

    function activate() {
      GetAllManagers();
    }

    function reset() {
      console.log('reset clicked');
      vm.credentials.adminname = '';
      vm.credentials.email = '';
      vm.credentials.phone = '';
      vm.credentials.mobile = '';
      vm.credentials.name = '';
      vm.credentials.location = '';
      vm.credentials.type_id = '';
      vm.credentials.description = '';
      vm.credentials.selectuser = '';
    }

    function checkbox() {
      vm.credentials.adminname = '';
      vm.credentials.email = '';
      vm.credentials.phone = '';
      vm.credentials.mobile = '';
      vm.credentials.selectuser = '';
    }



    function saveMeetingRoom(selectedmanagerid) {
      vm.saveAndCreateMeetingRoom(selectedmanagerid, function (response) {
        $state.go('wams.allmeetingrooms', {}, {
          reload: true
        });
      });
    }


    function saveAndCreateMeetingRoom(selectedmanagerid) {
      console.log('data sent  idddddddd from html' + JSON.stringify(selectedmanagerid));
      if (vm.credentials.checkbox == true) {
        console.log('new user checkbox is checked');
        var createnewuser = new CreateNewUserService({
          'name': vm.credentials.adminname,
          'email': vm.credentials.email,
          'phone': 9177043476,
          'mobile': vm.credentials.mobile
        });
        console.log('SaveNewUser' + JSON.stringify(createnewuser));
        var createduserdetails = CreateNewUserService.post(createnewuser, function (response) {
          // vm.credentials = '';
          /*vm.data = response;
          console.log('SaveNewUser' + vm.data);
          console.log('data sent  iddddddddddddd' + JSON.stringify(vm.data.id));*/
          saveMeetingRoomdetails(vm.data.id);
        }, function (error) {
          console.log('has failed... ' + error);
        });
      } else {
        saveMeetingRoomdetails(selectedmanagerid);
      }
    }

    function saveMeetingRoomdetails(selectedid) {
      console.log('saveMeetingRoom clicked');
      var managerid = selectedid;
      console.log(selectedid);
      var createmeetingroom = new MeetingRoomService({
        'name': vm.svcEntity.name,
        'location': vm.svcEntity.location,
        'typeId': vm.credentials.type_id,
        'description': vm.credentials.description,
        'capacity': 200,
        'status': 0,
        'managerId': managerid,
        'buildingId': 1,
        'floorId': 0,
        'floorPartId': 0
      });
      console.log('entire data form the form' + JSON.stringify(createmeetingroom));
      MeetingRoomService.post(createmeetingroom, function (response) {
        vm.credentials = '';
        vm.datamanagers = response;
        console.log('the reponse after saving the meeting room: ' + JSON.stringify(vm.datamanagers));
      });
    }

    function GetAllManagers() {
      var datamanagers = CreateNewUserService.query(function (response) {
        vm.datamanagers = response;
        /*console.log('the reponse of datamanagers is: ' + JSON.stringify(vm.datamanagers));*/
      });
    }

    function getManagerid(managerid) {
      console.log(managerid);
      vm.managerdetail = CreateNewUserService.get({
        id: managerid
      }, function (response) {
        vm.managerdetails = response;
        if (vm.managerdetails.length != 0) {
          console.log('data of managersssssssssssssssss' + JSON.stringify(vm.managerdetails));
          vm.credentials.adminname = vm.managerdetails.name;
          vm.credentials.mobile = vm.managerdetails.mobile;
          vm.credentials.email = vm.managerdetails.email;
        } else {
          vm.credentials.adminname = '';
          vm.credentials.mobile = '';
          vm.credentials.email = '';
          alert('this user is not a manager');
        }
      });
    }
  }
})();
