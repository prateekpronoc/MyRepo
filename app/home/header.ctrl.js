(function () {
  'use strict';

  angular
    .module('wams.home')
    .controller('Header', Header);

  /* @ngInject */
  function Header(wamsServices, $scope, $state, session, $interval, $modal, notifier, $window, commonUtils,
    $mdSidenav) {
    /*jshint validthis: true */
    var vm = this;
    vm.testFlow = false;
    vm.tenantLogo = {};
    vm.tenantLogo.path = '';
    vm.tenantLogo.width = '150px';
    vm.tenantLogo.height = '50px';
    vm.session = session;
    vm.showChangePasswordModal = showChangePasswordModal;
    vm.changePassword = changePassword;
    vm.progressBarInnerStyle = {
      color: 'red'
    };
    vm.progressBarOutterStyle = {
      color: 'red'
    };
    vm.color = ['red', 'green', 'yellow'];
    vm.widthPercentage = 0;
    vm.colorIndex = 0;
    vm.stop = undefined;
    vm.logout = logout;
   // vm.toggleLeft = toggleLeft;
    vm.ui = {};

    // vm.userDropdown = [{
    //   text: 'Change Password',
    //   click: 'vm.showChangePasswordModal()'
    // }, {
    //   divider: true
    // }, {
    //   text: 'Logout',
    //   click: 'vm.logout()'
    // }];

    active();

    ////////////////

    function active() {
      displayTenantLogo();
      loading();
      vm.ui.userId = session.getUserId();
      fetchAllUserDetails();
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
        vm.currentUserName = response.rows[0].firstName + response.rows[0].lastName;
        if (response.rows[0].image) {
          getUploadPic(response.rows[0].image)
        }
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getUploadPic(imageId) {
      vm.imageSource = '/api/download?fileName=' + imageId;
    }

    function loading() {
      if (angular.isDefined(vm.stop)) {
        return;
      }
      vm.stop = $interval(function () {
        vm.progressBarInnerStyle = {
          width: vm.widthPercentage + 'px',
          'background-color': vm.color[vm.colorIndex]
        };
        vm.widthPercentage = (vm.widthPercentage + 6) % screen.width;
        if (vm.widthPercentage === 0) {
          vm.progressBarOutterStyle = {
            'background-color': vm.color[vm.colorIndex]
          };
          vm.colorIndex = (vm.colorIndex + 1) % 3;
          loadingStop();
        }
      }, 1);
    }

    function loadingStop() {
      if (angular.isDefined(vm.stop)) {
        $interval.cancel(vm.stop);
        vm.stop = undefined;
      }
      vm.progressBarInnerStyle = {
        'background-color': '#c6dfea'
      };
    }

    function showChangePasswordModal() {
      $modal({
        scope: $scope,
        template: 'home/changePassword.html',
        placement: 'center',
        backdrop: 'static',
        controller: 'SalaryPackageCtrl',
        show: true
      });
    }

    function changePassword() {
      if (vm.newPassword === vm.confirmPassword) {
        if (vm.oldPassword !== vm.newPassword) {
          var json = {
            NewPassword: vm.newPassword,
            OldPassword: vm.oldPassword
          };
          session.changePassword(json).then(
            function (response) {
              if (response.data) {
                if (response.data.IsException || response.data.IsFailure) {
                  notifier.error('Incorrect current password');
                } else if (response.data.IsPasswordChanged) {
                  notifier.success('Password changed successfully');
                  $scope.$$childTail.$hide();
                }
              }
            },
            function (response) {
              notifier.error(response.data.Message);
            });
        } else {
          notifier.error('New password is same as old password');
        }
      } else {
        notifier.error('New password and confirm password doesn\'t match');
      }
    }

    function logout() {
      //$window.sessionStorage.clear();
      $state.go('anon.login', {});
      // session.logout().then(
      //   function () {
      //     vm.currentUserName = undefined;
      //     $state.go('anon.login');
      //     $window.location.reload();
      //   }
      // );
    }

    function displayTenantLogo() {
      var img = new Image(),
        actualWidth = 0,
        actualHeigth = 0,
        targetWigth = 0,
        targetHeigth = 0,
        percentage = 0;

      //getting the Image path is exist else default image path.
      if (angular.isDefined($window.sessionStorage.tenantLogo) && $window.sessionStorage.tenantLogo !== '') {
        img.src = commonUtils.getWebUrlPrefix() + '/App_Themes/Client/' + $window.sessionStorage.tenantAlias +
          '/images/' + $window.sessionStorage.tenantLogo;
      } else {
        img.src = commonUtils.getWebUrlPrefix() + '/Images/Default_Logo.gif';
      }

      actualWidth = img.width;
      actualHeigth = img.height;
      //maintaining the aspect ratio of the image.
      if (actualWidth === 0 || actualHeigth === 0) {
        vm.tenantLogo.width = '150px';
        vm.tenantLogo.height = '50px';
      } else if (actualWidth > actualHeigth) {
        percentage = (actualWidth / actualHeigth);
        targetHeigth = (actualHeigth / percentage);
        targetWigth = (actualWidth / percentage);
        vm.tenantLogo.width = targetWigth + 'px';
        vm.tenantLogo.height = targetHeigth + 'px';
      } else if (actualWidth < actualHeigth) {
        percentage = (actualHeigth / actualWidth);
        targetHeigth = (actualWidth / percentage);
        targetWigth = (actualHeigth / percentage);
        vm.tenantLogo.width = targetWigth + 'px';
        vm.tenantLogo.height = targetHeigth + 'px';
      } else if (actualHeigth === actualWidth) {
        if (actualHeigth > 50) {
          vm.tenantLogo.width = 50 + 'px';
          vm.tenantLogo.height = 50 + 'px';
        } else {
          vm.tenantLogo.width = actualHeigth + 'px';
          vm.tenantLogo.height = actualHeigth + 'px';
        }
      }
      if (targetWigth > 150) {
        vm.tenantLogo.width = '150px';
      }
      if (targetHeigth > 50) {
        vm.tenantLogo.height = '50px';
      }
      vm.tenantLogo.path = img.src;
    }
  }
})();
