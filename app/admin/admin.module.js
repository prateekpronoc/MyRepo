(function () {
  'use strict';

  angular
    .module('wams.admin', [
      'ui.router'
    ]).config(config);

  /* @ngInject */
  function config($stateProvider) {
    $stateProvider
      .state('wams.users', {
        url: 'admin/:userId',
        param: {
          userId: {
            array: true
          }
        },
        views: {
          '@': {
            templateUrl: 'admin/users/view/viewAll.tpl.html',
            controller: 'AllUsersCtrl as vm'
          }
        }
      }).state('wams.createusers', {
        url: 'createuser/',
        views: {
          '@': {
            templateUrl: 'admin/users/create/create.tpl.html',
            controller: 'CreateUserCtrl as vm'
          }
        }
      }).state('wams.sendInvitations', {
        url: 'sendInvitations/',
        views: {
          '@': {
            templateUrl: 'admin/users/sendinvitations/sendInvitations.tpl.html',
            controller: 'SendInvitationsCtrl as vm'
          }
        }
      });

  }
})();
