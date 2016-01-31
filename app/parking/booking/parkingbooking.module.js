(function () {
  'use strict';

  angular
    .module('parkingWizard', ['ui.router', 'wams.home'])
    .config(config);

  /* @ngInject */
  function config($stateProvider) {
    $stateProvider
      .state('wams.parkingWizard', {
        url: 'bookingparking/',
        views: {
          '@': {
            templateUrl: 'parking/booking/bookParking.tpl.html',
            controller: 'BookParkingCtrl as vm'
          }
        }
      }).state('wams.parkingWizard.checkAvailability', {
        url: 'checkAvailability/',
        templateUrl: 'parking/booking/parkingWizard.filterTemplate.html'
      }).state('wams.parkingWizard.booking', {
        url: 'booking',
        templateUrl: 'parking/booking/parkingWizard.bookingTemplate.html'
      }).state('wams.parkingWizard.transaction', {
        url: 'transaction',
        templateUrl: 'parking/booking/parkingWizard.transactionTemplate.html'
      }).state('wams.parkingWizard.invoice', {
        url: 'inovice',
        templateUrl: 'parking/booking/parkingWizard.invoiceTemplate.html'
      });

  }
})();
