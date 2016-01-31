(function () {
  'use strict';

  angular
    .module('wams.mymeetingrooms', ['ui.router'])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('wams.mymeetingrooms', {
        url: 'mymeetingrooms/',
        views: {
          '@': {
            templateUrl: 'myviews/meetingrooms/mymeetingrooms.tpl.html',
            controller: 'MyMeetingRooms as vm'
          }
        }
      });
  }
})();
