(function () {
  'use strict';

  angular
    .module('wams.admin')
    .controller('SendInvitationsCtrl', SendInvitationsCtrl);

  /* @ngInject */

  function SendInvitationsCtrl(wamsServices, notifier, Upload, $timeout, fileUpload, session, $window, $modal) {

    var vm = this;
    vm.title = 'Send Invitations ';
    vm.ui = {};
    vm.session = session;
    vm.sendInvitation = sendInvitation;
    vm.uploadPic = processxlsUpload;
    vm.uploadFile = {};
    vm.columnCollection = [{
      id: 'employeeId',
      title: 'Employee Id',
      isAction: true
    }, {
      id: 'firstName',
      title: 'First Name',
      isAction: false
    }, {
      id: 'lastName',
      title: 'Last Name',
      isAction: false
    }, {
      id: 'officialMail',
      title: 'Email-Id',
      isAction: false
    }, {
      id: 'mobile',
      title: 'Mobile No',
      isAction: false
    }, {
      id: 'designation',
      title: 'Designation',
      isAction: false
    }, {
      id: 'gender',
      title: 'Gender',
      isAction: false
    }];
    vm.processExcelData = processExcelData;
    vm.downloadTemplate = downloadTemplate;
    vm.getById = getById;
    activate();
    ////////////////
    function activate() {}

    function processxlsUpload() {
      vm.fileObj = [];
      fileUpload.uploadFile('/api/sheet',
        vm.uploadFile
      ).then(function (fileResponse) {
          if (fileResponse.data.Error === 'true') {
            return false;
          }
          if (fileResponse.status === 404) {
            notifier.error(fileResponse.data);
            return;
          }
          _.forEach(fileResponse.data, function (val) {
            vm.fileObj.push(val);
          });
          _.forEach(vm.fileObj, function (val) {
            if (_.has(val, 'employeeId') && _.has(val, 'firstName') && _.has(val, 'lastName') &&
              _.has(val, 'officialMail') && _.has(val, 'mobile') && _.has(val, 'designation') && _.has(val,
                'gender')
            ) {
              val.isSelected = true;
            }
          });
          //console.log(JSON.stringify(vm.fileObj));
          //  processExcelData();
          vm.InvaildDataCount = (vm.fileObj.length) - (_.filter(vm.fileObj, {
            'isSelected': true
          }).length);
        },
        function () {
          return false;
        });
      vm.disableNext = false;
    }

    function processExcelData() {
      var reqmails = [],
        reqdata = [];
      _.forEach(vm.fileObj, function (val) {
        if (_.has(val, 'employeeId') && _.has(val, 'firstName') && _.has(val, 'lastName') &&
          _.has(val, 'officialMail') && _.has(val, 'mobile') && _.has(val, 'designation') && _.has(val, 'gender')
        ) {
          var req = {
            name: val.firstName,
            email: val.officialMail,
            mobile: val.mobile,
            phone: val.mobile,
            username: val.officialMail,
            tenantId: parseInt(session.getTenantId()),
          };
          reqdata.push(req);
          //serviceCall(request, 'useruploadExcel');
        } else {
          reqmails.push(val.officialMail);
          // var req = {
          //   emailIds: _.pluck(reqmails, 'officialMail')
          // };
          // serviceCall(req, 'sendInvitations');
        }
      });
      if (reqdata.length > 0) {
        serviceCall({
          data: reqdata
        }, 'useruploadExcel');
      }
      if (reqmails.length > 0) {
        console.log(reqmails);
        serviceCall({
          emailIds: reqmails
        }, 'sendInvitations');
      }
    }

    function sendInvitation() {
      vm.emails = [];
      if (vm.ui.emails) {
        vm.emails = vm.ui.emails.split(",");
      }
      var req = {
        emailIds: vm.emails
      };
      console.log(JSON.stringify(req));
      serviceCall(req, 'sendInvitations');
    }

    function serviceCall(request, key) {
      wamsServices.saveEntity({
        key: key,
        request: request
      }).then(function (response) {
        console.log(response);
        if (response) {
          if (_.has(response, 'err')) {
            notifier.error('Problem encountered while sending invitations: ' + response.msg);
            return;
          }
          if (_.has(response, 'statusCode')) {
            notifier.error('Problem encountered while sending invitations: ' + response.message);
            return;
          }
          if (_.has(response, 'duplicateData')) {
            notifier.error('User creation error');
            return;
          }
          notifier.success('Invitations have been sent successfully');
          vm.ui = {}
        }
      }, function (error) {
        notifier.error('Problem encountered while sending invitations:' + error.message);
      });
    }

    function downloadTemplate() {
      $window.open('http://10.0.3.76/WAMStemplate.xlsx');
      // var urlPrefix = commonUtils.getWebUrlPrefix();
      // console.log(urlPrefix);
    }

    function getById(userData) {
      // vm.userDetails = _.filter(vm.fileObj, {
      //   officialMail: userData
      // })[0];
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'admin/users/sendinvitations/xlsEdit.tpl.html',
        controller: 'XlsEditCtrl as vm',
        size: 'sm',
        resolve: {
          data: function () {
            return _.filter(vm.fileObj, {
              officialMail: userData
            })[0];
          }
        }
      });

      modalInstance.result.then(function (data) {
        console.log(JSON.stringify(data));
        _.forEach(vm.fileObj, function (val) {
          if (_.has(val, 'employeeId') && _.has(val, 'firstName') && _.has(val, 'lastName') &&
            _.has(val, 'officialMail') && _.has(val, 'mobile') && _.has(val, 'designation') && _.has(val,
              'gender')
          ) {
            val.isSelected = true;
          }
        });
        vm.InvaildDataCount = (vm.fileObj.length) - (_.filter(vm.fileObj, {
          'isSelected': true
        }).length);
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }



    function upload(file) {
      console.log(file);
      fileUpload.uploadFile('/api/files/fileupload', file)
        .then(function (response) {
          console.log(response);
        }, function (eror) {
          console.log(error);
        })
        // var fileUpload = {
        //   file: file
        // };
        // wamsServices.postUpload({
        //   key: 'upload',
        //   request: fileUpload
        // }).then(function (response) {
        //   console.log(response);
        // });
    }

    function uploadPic(file) {

      file.upload = Upload.upload({
        url: '/api/files/uploadImages',
        data: {
          file: file
        }
      });
      console.log(file);
      // file.upload.then(function (response) {
      //   $timeout(function () {
      //     file.result = response.data;
      //   });
      // }, function (response) {
      //   if (response.status > 0) {
      //     //$scope.errorMsg = response.status + ': ' + response.data;
      //   }
      // }, function (evt) {
      //   // Math.min is to fix IE which reports 200% sometimes
      //   file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      // });
    }

    //console.info('uploader', uploader);



    // function uploadPic(file) {
    //   console.log(file);
    //   wamsServices.saveEntity({
    //     key: 'imageUpload',
    //     request: file
    //   }).then(function (response) {
    //     if (response) {
    //       if (_.has(response, 'statusCode')) {
    //         notifier.error('Problem encountered while sending invitations: ' + response.message);
    //         return;
    //       }
    //       notifier.success('Invitations have been sent successfully');
    //       vm.ui = {}
    //     }
    //   }, function (error) {
    //     notifier.error('Problem encountered while sending invitations:' + error.message);
    //   });
    // }
    // function processxlsUpload() {
    //   fileUpload.uploadFile('/api/files/fileupload',
    //     vm.uploadFile
    //   ).then(function (fileResponse) {
    //       if (fileResponse.data.Error === 'true') {
    //         // vm.IsProcessing = vm.IsProcessing - 1;
    //         // notifier.error('Error : ' + fileResponse.data.ErrorMessage);
    //         return false;
    //       }
    //       console.log(fileResponse);
    //       vm.fileObj = fileResponse.data;
    //       // uploadCandidateTemplate(fileResponse.data);
    //     },
    //     function () {
    //       // notifier.error('Unable to upload file.');
    //       // vm.IsProcessing = vm.IsProcessing - 1;
    //       return false;
    //     });
    //   vm.disableNext = false;
    //   // vm.IsProcessing = vm.IsProcessing - 1;
    // }
  }
})();
