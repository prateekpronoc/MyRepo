(function () {
  'use strict';

  angular
    .module('wams.userInfo')
    .controller('UserInfoCtrl', UserInfoCtrl);

  /* @ngInject */
  function UserInfoCtrl(session, wamsServices, notifier, $filter, $scope) {
    /*jshint validthis: true */
    var vm = this;
    vm.title = 'Ctrl';
    vm.user = {
      name: 'John Doe',
      email: '',
      phone: '',
      address: 'Mountain View, CA',
      donation: 19.99
    };
    vm.ui = {};
    vm.editMode = false;
    vm.selectedIndex = 0;
    vm.isNextDisable = false;
    vm.picFile = null;
    vm.next = next;
    vm.previous = previous;
    vm.changeMode = changeMode;
    vm.saveData = saveData;
    vm.readURL = readURL;
    vm.uploadFile = {};
    activate();

    function activate() {
      fetchUserInfo();
    }

    function next(argument) {

      vm.selectedIndex = vm.selectedIndex + 1;
    }

    function previous(argument) {
      if (vm.selectedIndex === 0) {
        return;
      }
      vm.selectedIndex = vm.selectedIndex - 1;
    }

    function fetchUserInfo() {
      vm.ui.userId = session.getUserId();
      if (vm.ui.userId) {
        fetchAllUserDetails();
      }
    }

    function fetchAllUserDetails() {
      wamsServices.getEntity({
        key: 'userprofiles',
        request: {
          uid: parseInt(vm.ui.userId)
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while Profile');
          return;
        }
        //console.log(JSON.stringify(response.rows[0]));
        vm.ui = response.rows[0];
        vm.ui.dob = $filter('date')(response.rows[0].dob, 'yyyy-MM-dd');
        vm.ui.joiningDate = $filter('date')(response.rows[0].joiningDate, 'yyyy-MM-dd');
        if (vm.ui.company) {
          //fetchTenantDetails();
        }
        if (vm.ui.image) {
          getUploadPic(vm.ui.image);
        }
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getUploadPic(imageId) {
      vm.imageSource = '/api/download?fileName=' + imageId;
      console.log(vm.imageSource);
    }

    function changeMode() {
      vm.editMode = !vm.editMode;
    }


    vm.stepsModel = [];

    vm.imageUpload = function (element) {
      console.log(vm.files);
      var reader = new FileReader();
      reader.onload = $scope.imageIsLoaded;
      console.log(element.files);
      reader.readAsDataURL(element.files[0]);
    }

    vm.imageIsLoaded = function (e) {
      console.log(e.target.result);
      $scope.$apply(function () {
        vm.stepsModel.push(e.target.result);
      });
    }

    function readURL(input) {
      console.log(vm.files);
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        // reader.onload = function (e) {
        //   angular.element('#blah')
        //     .attr('src', e.target.result)
        //     .width(150)
        //     .height(200);
        // };

        reader.readAsDataURL(input.files[0]);
      }
    }

    function saveData() {
      console.log(vm.picFile);
      // vm.userProfileDetails = {
      //   id: vm.ui.id,
      //   uid: vm.ui.uid,
      //   employeeId: vm.ui.employeeId,
      //   firstName: vm.ui.firstName,
      //   lastName: vm.ui.lastName,
      //   gender: vm.ui.gender,
      //   dob: $filter('date')(vm.ui.dob, 'yyyy-MM-dd'),
      //   personalMail: vm.ui.personalMail,
      //   officialMail: vm.ui.officialMail,
      //   mobile: vm.ui.mobile,
      //   idProof: vm.ui.idpdetails,
      //   level: vm.ui.level,
      //   emergencyNo: vm.ui.emergencyNo,
      //   officeNo: vm.ui.officeNo,
      //   extension: vm.ui.extension,
      //   permAddr: vm.ui.permAddr,
      //   commAddr: vm.ui.commAddr,
      //   joiningDate: vm.ui.joiningDate,
      //   modeOfTransport: vm.ui.modeOfTransport,
      //   image: vm.imageId
      // };
      // var request = {
      //   profile: vm.userProfileDetails

      // };
      // if (vm.fileObj) {
      //   request.fileObj = vm.fileObj;
      // }
      // wamsServices.saveEntity({
      //   key: 'userprofiles',
      //   request: vm.ui
      // }).then(function (response) {
      //   if (response) {
      //     if (_.has(response, 'statusCode')) {
      //       notifier.error('Problem encountered while saving data : ' + response.message);
      //       return;
      //     }
      //     notifier.success('user Profile saved successfully');
      //     vm.editMode = !vm.editMode;
      //     // vm.ui = {};
      //     // vm.ui = response;
      //     // vm.ui.dob = $filter('date')(response.dob, 'yyyy-MM-dd');
      //     // vm.ui.joiningDate = $filter('date')(response.joiningDate, 'yyyy-MM-dd');
      //     // if (vm.ui.company) {
      //     //   fetchTenantDetails();
      //     // }

      //   }
      // }, function (error) {
      //   notifier.error('Problem encountered while saving data :' + error.message);
      // });
    }

  }
})();
