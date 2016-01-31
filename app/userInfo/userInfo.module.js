(function () {
  'use strict';

  angular
    .module('wams.userInfo', ['ui.router'])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('wams.userInfo', {
        url: 'myprofile/',
        views: {
          '@': {
            templateUrl: 'userInfo/userInfo.tpl.html',
            controller: 'UserInfoCtrl as vm'
          }
        }
      });

  }

})();
