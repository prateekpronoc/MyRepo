(function () {
  'use strict';

  angular
    .module('wams.eventCalendar', [
      'ui.calendar'
    ]).config(config);

  /* @ngInject */
  function config($stateProvider) {
    //, $collapseProvider) {
    $stateProvider
      .state('wams.eventCalendar', {
        url: 'eventcalendar/',
        views: {
          '@': {
            templateUrl: 'eventcalendar/eventcalendar.html',
            controller: 'EventCalendarCtrl as vm'
          }
        },
        params: {
          id: {
            array: false
          },
          type: {
            array: false
          }
        }
      });
  }
})();
