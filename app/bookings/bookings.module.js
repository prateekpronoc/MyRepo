(function () {
  'use strict';

  angular
    .module('wams.bookings', ['ui.router', 'wams.home'])
    .config(config);

  /* @ngInject */
  function config($stateProvider) {
    // $stateProvider
    //   .state('wams.mybookings', {
    //     url: 'mybookings/',
    //     views: {
    //       '@': {
    //         templateUrl: 'bookings/viewallMybookings.tpl.html',
    //         controller: 'ViewAllMyBookingsCtrl as vm'
    //       }
    //     }
    //   })
    //   .state('wams.allbookings', {
    //     url: 'allbookings/',
    //     views: {
    //       '@': {
    //         templateUrl: 'bookings/viewallbookings.tpl.html',
    //         controller: 'ViewAllBookingsCtrl as vm'
    //       }
    //     }
    //   });
  }
})();
