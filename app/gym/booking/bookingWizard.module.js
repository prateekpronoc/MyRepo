(function () {
  'use strict';

  angular
    .module('gymWizard', ['ui.router', 'wams.home'])
    .config(config);

  /* @ngInject */
  function config($stateProvider) {
    $stateProvider
      .state('wams.gymWizard', {
        url: 'bookingGym/',
        views: {
          '@': {
            templateUrl: 'gym/booking/gymEntityWizard.tpl.html',
            controller: 'BookingGymCtrl as vm'
          }
        }
      }).state('wams.gymWizard.checkAvailability', {
        url: 'checkAvailability/',
        templateUrl: 'gym/booking/gymWizard.filterTemplate.html'
      })
      .state('wams.gymWizard.checkAvailability.cardview', {
        url: 'card',
        templateUrl: 'gym/booking/allgyms.cardview.html'
      })
      .state('wams.gymWizard.checkAvailability.listview', {
        url: 'list',
        templateUrl: 'gym/booking/allgyms.listview.html'
      }).state('wams.gymWizard.booking', {
        url: 'booking',
        templateUrl: 'gym/booking/gymWizard.bookingTemplate.html'
      }).state('wams.gymWizard.transaction', {
        url: 'transaction',
        templateUrl: 'gym/booking/gymWizard.transactionTemplate.html'
      }).state('wams.gymWizard.invoice', {
        url: 'inovice',
        templateUrl: 'gym/booking/gymWizard.invoiceTemplate.html'
      });

  }
})();
