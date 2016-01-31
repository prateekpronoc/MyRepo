(function () {
  'use strict';

  angular
    .module('wams.parking', ['ui.router', 'wams.home'])
    .config(config);

  /* @ngInject */
  function config($stateProvider) {
    $stateProvider
      .state('wams.createparking', {
        url: 'createparking',
        views: {
          '@': {
            templateUrl: 'parking/createparking/createParking.tpl.html',
            controller: 'createParkingCtrl as vm'
          }
        }
      });
  }
})();
