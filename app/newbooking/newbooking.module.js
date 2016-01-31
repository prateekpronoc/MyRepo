(function () {
  'use strict';

  angular
    .module('wams.newbooking', ['ui.router'])
    .config(config);

  function config($stateProvider, $mdIconProvider) {
    $stateProvider
      .state('wams.newbooking', {
        url: 'newmrbooking/',
        views: {
          '@': {
            templateUrl: 'newbooking/newbooking.tpl.html',
            controller: 'NewBookingCtrl as vm'

          }
        }
      });

    $mdIconProvider
      .icon('computer', 'styles/icons/ic_computer_24px.svg', 24)
      .icon('desktop', 'styles/icons/ic_desktop_mac_24px.svg', 24)
      .icon('headset', 'styles/icons/ic_headset_mic_24px.svg', 24)
      .icon('speaker', 'styles/icons/ic_speaker_24px.svg', 24);
  }
})();
