(function () {
  'use strict';

  angular
    .module('wams.user')
    .controller('UserProfileCtrl', UserProfileCtrl);

  /* @ngInject */
  function UserProfileCtrl(session, wamsServices, notifier, $filter, $state, commonUtils, Upload, $timeout,
    fileUpload) {
    var vm = this;
    vm.title = 'User Profile';
    vm.ui = {};
    vm.save = save;
    vm.notReadable = true;
    vm.edit = edit;
    vm.steps = {
      step1: true,
      step2: false,
      step3: false,
      step4: false,
      step5: false
    };
    vm.nextTab = nextTab;
    vm.uploadPic = processUpload;
    vm.uploadFile = {};
    //vm.uploadPic = uploadPic;
    // vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    // vm.format = vm.formats[0];
    vm.startdateopen = startdateopen;

    activate();

    ////////////////

    function activate() {
      fetchUserInfo();
    }

    function fetchUserInfo() {
      vm.ui.userId = session.getUserId();
      //console.log(JSON.stringify(vm.ui.userId));
      if (vm.ui.userId) {
        fetchAllUserDetails();
      }
    }

    function processUpload() {
      fileUpload.uploadFile('/api/files/fileupload',
        vm.uploadFile
      ).then(function (fileResponse) {
          if (fileResponse.data.Error === 'true') {
            // vm.IsProcessing = vm.IsProcessing - 1;
            // notifier.error('Error : ' + fileResponse.data.ErrorMessage);
            return false;
          }
          console.log(fileResponse);
          vm.imageId = fileResponse.data;
          getUploadPic(vm.imageId);
          // uploadCandidateTemplate(fileResponse.data);
        },
        function () {
          // notifier.error('Unable to upload file.');
          // vm.IsProcessing = vm.IsProcessing - 1;
          return false;
        });
      vm.disableNext = false;
      // vm.IsProcessing = vm.IsProcessing - 1;
    }
    // function uploadPic(file) {
    //   console.log(file);
    //   var imageUpload = {
    //     file: file
    //   };
    //   wamsServices.postUpload({
    //     key: 'upload',
    //     request: imageUpload
    //   }).then(function (response) {
    //     console.log(response);
    //     vm.imageId = response.data
    //       // getUploadPic(vm.imageId)
    //   });
    // }

    function getUploadPic(imageId) {
      vm.imageSource = '/api/download?fileName=' + imageId;
    }

    function nextTab(tabId) {
      angular.forEach(vm.steps, function (val, key) {
        if (key !== tabId) {
          val = false;
        }
      });
      vm.steps[tabId] = true;
      vm.notReadable = true;
    }



    function edit() {
      vm.notReadable = false;
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
          fetchTenantDetails();
        }
        if (vm.ui.image) {
          getUploadPic(vm.ui.image)
        }
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function fetchTenantDetails() {
      wamsServices.getEntity({
        key: 'tenants',
        request: {
          id: parseInt(vm.ui.company)
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching Tenant Details');
          return;
        }
        //console.log(JSON.stringify(response.rows[0]));
        vm.ui.tenantDetails = response.rows[0];

      }, function (error) {
        notifier.error(error.message);
      });
    }

    function save() {
      vm.userProfileDetails = {
        id: vm.ui.id,
        uid: vm.ui.uid,
        employeeId: vm.ui.employeeId,
        firstName: vm.ui.firstName,
        lastName: vm.ui.lastName,
        gender: vm.ui.gender,
        dob: $filter('date')(vm.ui.dob, 'yyyy-MM-dd'),
        personalMail: vm.ui.personalMail,
        officialMail: vm.ui.officialMail,
        mobile: vm.ui.mobile,
        idProof: vm.ui.idpdetails,
        level: vm.ui.level,
        emergencyNo: vm.ui.emergencyNo,
        officeNo: vm.ui.officeNo,
        extension: vm.ui.extension,
        permAddr: vm.ui.permAddr,
        commAddr: vm.ui.commAddr,
        joiningDate: vm.ui.joiningDate,
        modeOfTransport: vm.ui.modeOfTransport,
        image: vm.imageId
      };
      var request = {
        profile: vm.userProfileDetails

      };
      if (vm.fileObj) {
        request.fileObj = vm.fileObj;
      }
      //console.log(JSON.stringify(request));

      wamsServices.saveEntity({
        key: 'userprofiles',
        request: vm.userProfileDetails
      }).then(function (response) {
        if (response) {
          if (_.has(response, 'statusCode')) {
            notifier.error('Problem encountered while saving data : ' + response.message);
            return;
          }
          notifier.success('user Profile saved successfully');
          $state.go('wams.userProfile', {}, {
            reload: true
          });
          // vm.ui = {};
          // vm.ui = response;
          // vm.ui.dob = $filter('date')(response.dob, 'yyyy-MM-dd');
          // vm.ui.joiningDate = $filter('date')(response.joiningDate, 'yyyy-MM-dd');
          // if (vm.ui.company) {
          //   fetchTenantDetails();
          // }

        }
      }, function (error) {
        notifier.error('Problem encountered while saving data :' + error.message);
      });
    }
    /***************for date picker********************/
    function today() {
      vm.dt = new Date();
      vm.minDate = new Date();
    }

    function clear() {
      vm.dt = null;
    }

    function startdateopen($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.startdateopened = true;
    }

  }
})();
