(function () {
  'use strict';

  angular
    .module('wams.mybookings', [
      'ui.router'
    ]).config(config);

  function config($stateProvider, $mdIconProvider) {
    $mdIconProvider
      .icon('computer', 'styles/icons/ic_computer_24px.svg', 24)
      .icon('desktop', 'styles/icons/ic_desktop_mac_24px.svg', 24)
      .icon('headset', 'styles/icons/ic_headset_mic_24px.svg', 24)
      .icon('speaker', 'styles/icons/ic_speaker_24px.svg', 24);
    $stateProvider
      .state('wams.mybookings', {
        url: 'mybookings/',
        views: {
          '@': {
            templateUrl: 'mybookings/mybooking.tpl.html',
            controller: 'MyBookingsCtrl as vm'
          }
        }
      })
      .state('wams.allbookings', {
        url: 'allbookings/',
        views: {
          '@': {
            templateUrl: 'bookings/viewallbookings.tpl.html',
            controller: 'ViewAllBookingsCtrl as vm'
          }
        }
      });


  }
})();
