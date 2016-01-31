(function () {
  'use strict';

  angular.module('wams.user').controller('Login', Login);

  /* @ngInject */
  function Login($log, $state, $scope, session, commonService, $window) {
    /* jshint validthis: true */
    var vm = this;

    vm.credentials = {
      un: '',
      pwd: ''
    };

    vm.login = login;
    vm.activate = activate;
    vm.alert = {}; // This will store the error message which will be shown in the UI
    vm.alert.type = 'danger';
    vm.errorMessage = '';
    vm.rememberMe = true;
    activate();

    ////////////////
    function activate() {
      getSavedCredentials();
    }

    function getSavedCredentials() {
      if ($window.localStorage.getItem('rememberedCredentials')) {
        vm.credentials = angular.fromJson($window.localStorage.getItem('rememberedCredentials'));
      }
    }

    function login(ev) {
      //alert(vm.credentials.un);
      vm.logging = true;
      session.login(vm.credentials)
        .then(function (response) {
          if (!response.userInfo) {
            vm.errorMessage = !response.error ? 'The email and password you entered donot match.' : response.error;
            $scope.$apply();
          } else {
            goToHomePage();
            if (vm.rememberMe === true) {
              saveCredentials();
            } else {
              removeSavedCredentials();
            }
          }
        });
    }

    function goToHomePage() {
      $state.go('wams.dashboard');
    }

    function saveCredentials() {
      $window.localStorage.setItem('rememberedCredentials', JSON.stringify(vm.credentials));
    }

    function removeSavedCredentials() {
      $window.localStorage.removeItem('rememberedCredentials');
    }
  }
})();
