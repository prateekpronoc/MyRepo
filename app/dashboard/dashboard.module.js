(function () {
  'use strict';

  angular
    .module('wams.dashboard', [
      'ui.router',
      'googlechart',
      'wams.home',
      'wams.eventCalendar'
    ]).config(config);

  /* @ngInject */
  function config($stateProvider) {
    $stateProvider
      .state('wams.dashboard', {
        url: 'dashboard/',
        views: {
          '@': {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardCtrl as vm'
          }
        }
      });
  }
})();
