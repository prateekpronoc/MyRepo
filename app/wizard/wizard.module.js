(function () {
  'use strict';

  angular
    .module('wizard', ['ui.router', 'wams.home'])
    .config(config);

  /* @ngInject */
  function config($stateProvider) {
    $stateProvider
      .state('wams.wizard', {
        url: 'bookingWizard/',
        views: {
          '@': {
            templateUrl: 'wizard/entityWizard.html',
            controller: 'MRBookingWizardCtrl as vm'
          }
        }
      }).state('wams.wizard.checkAvailability', {
        url: 'checkAvailability/',
        templateUrl: 'wizard/wizard.filterTemplate.html'
      }).state('wams.wizard.booking', {
        url: 'booking',
        templateUrl: 'wizard/wizard.bookingTemplate.html'
      }).state('wams.wizard.invitation', {
        url: 'invitation',
        templateUrl: 'wizard/wizard.InvitesTemplate.html'
      }).state('wams.wizard.transaction', {
        url: 'transaction',
        templateUrl: 'wizard/wizard.transactionTemplate.html'
      }).state('wams.wizard.invoice', {
        url: 'inovice',
        templateUrl: 'wizard/wizard.invoiceTemplate.html'
      });

  }
})();
