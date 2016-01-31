(function () {
  'use strict';

  angular.module('wams.user').controller('ForgotPassword', ForgotPassword);

  /* @ngInject */
  function ForgotPassword(session, notifier, $state, wamsServices) {
    /* jshint validthis: true */
    var vm = this;

    /*--Variables--*/
    // vm.email = '';
    // vm.tenantAlias = '';
    // vm.loading = false;
    vm.ui = {};

    /*--Methods--*/
    vm.forgotPassword = forgotPassword;
    activate();

    ////////////////
    function activate() {}

    function forgotPassword() {
      var requestData = {
        userName: vm.ui.email
      };
      wamsServices.saveEntity({
        key: 'forgotpassword',
        request: requestData
      }).then(function (response) {
        if (response) {
          if (response == 'User with this emailId does not exist') {
            notifier.error(response);
            return;
          }
          if (_.has(response, 'statusCode')) {
            notifier.error('Problem encountered : ' + response.message);
            return;
          }
          notifier.success('Password is Sent to the specipied mail');
          vm.ui = {};
          $state.go('anon.login');
        }
      }, function (error) {
        notifier.error('Problem encountered while saving data :' + error.message);
      });
      // vm.loading = true;
      // var request = {
      //   MailId: vm.email,
      //   TenantAlias: vm.tenantAlias,
      //   TypeOfUser: 1
      // };
      // session.forgotPassword(request).then(
      //   function (response) {
      //     if (!angular.isUndefined(response)) {
      //       notifier.success('New password has been send to your mail address, please check.');
      //       vm.loading = false;
      //       $state.go('anon.login');
      //     } else {
      //       vm.loading = false;
      //     }
      //   }
      // );
    }

  }
})();
