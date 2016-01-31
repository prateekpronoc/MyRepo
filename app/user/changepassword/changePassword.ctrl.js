(function () {
  'use strict';

  angular
    .module('wams.user')
    .controller('ChangePasswordCtrl', ChangePasswordCtrl);
  /* @ngInject */
  function ChangePasswordCtrl(session, wamsServices, notifier, $state) {
    var vm = this;
    vm.title = 'Change Password';
    vm.noData = false;
    vm.ui = {};
    activate();
    vm.changePassword = changePassword;
    ////////////////

    function activate() {
      getUserInfo();
    }

    function getUserInfo() {
      wamsServices.getEntity({
        request: {
          id: parseInt(session.getUserId())
        },
        key: 'users'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching user information');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.ui = response.rows[0];
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function changePassword() {
      var json = {
        id: parseInt(session.getUserId()),
        name: vm.ui.name,
        email: vm.ui.email,
        phone: vm.ui.phone,
        mobile: vm.ui.mobile,
        username: vm.ui.username,
        password: vm.ui.newpassword,
        tenantId: vm.ui.tenantId
      };
      if (vm.ui.newpassword === vm.ui.confirmpassword) {
        if (vm.ui.currentpassword !== vm.ui.newpassword) {
          wamsServices.saveEntity({
            key: 'users',
            request: json
          }).then(function (response) {
              if (response) {
                if (_.has(response, 'statusCode')) {
                  notifier.error('Problem encountered while saving data : ' + response.message);
                } else if (response) {
                  notifier.success('Password changed successfully');
                  vm.ui = {};
                  $state.go('wams.dashboard', {}, {
                    reload: true
                  });
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
  }
})();
