(function () {
  'use strict';

  angular
    .module('wams.mrbookingwizard', ['ui.router'])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('wams.mrbookingwizard', {
        url: 'bookMRooms/:mrId',
        params: {
          mrId: {
            array: true
          }
        },
        views: {
          '@': {
            templateUrl: 'meetingroombookingwizard/mrbooking.tpl.html',
            controller: 'MrBookingCtrl as vm'
          }
        }
      });
  }
})();
