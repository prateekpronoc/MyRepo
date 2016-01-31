(function () {
  'use strict';

  angular
    .module('wams.eventCalendar')
    .controller('EventCalendarCtrl', EventCalendarCtrl);

  /* @ngInject */
  function EventCalendarCtrl($log, eventsServices, commonService, notifier, $stateParams) {
    /*jshint validthis: true */
    var vm = this,
      y = 2014,
      m = 10,
      d = 27,
      dateFormat = 'MM-dd-yyyy';
    vm.title = 'Event Calendar';
    vm.uiConfig = {
      calendar: {
        height: 450,
        editable: true,
        header: {
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: vm.alertEventOnClick,
        eventDrop: vm.alertOnDrop,
        eventResize: vm.alertOnResize
      }
    };
    vm.alertEventOnClick = alertEventOnClick;
    vm.alertOnDrop = alertOnDrop;
    vm.alertOnResize = alertOnResize;
    vm.events = [{
      title: 'All Day Event',
      start: new Date(y, m, 1),
      color: 'red',
      textColor: 'blue'
    }, {
      title: 'Long Event',
      start: new Date(y, m, d - 5),
      end: new Date(y, m, d - 2)
    }];
    vm.eventSources = [
      vm.events
    ];
    vm.refresh = refresh;

    activate();

    function activate() {
      refresh();
    }

    function alertEventOnClick(date, jsEvent, view) {
      $log.log('Event Clicked : ' + date + ' Event = ' + JSON.stringify(jsEvent) + ' View = ' + view);
    }

    function alertOnDrop() {}

    function alertOnResize() {}

    function refresh() {
      vm.refreshing = true;
      vm.events.length = 0;
      eventsServices.getScheduledEvents($stateParams.id, $stateParams.type).then(
        function (response) {
          vm.refreshing = false;
          notifier.success('Event calendar data retrieved successfully.');
          if (angular.isDefined(response.data.json)) {
            var jsonData = angular.fromJson(response.data.json);
            if (angular.isDefined(jsonData.events)) {
              angular.forEach(jsonData.events, function (array) {
                if (array.length > 0) {
                  vm.events.push({
                    id: array[0],
                    title: array[9],
                    start: commonService.parseDate(array[2], dateFormat),
                    end: commonService.parseDate(array[3], dateFormat),
                    status: array[12],
                    campusId: array[11]
                  });
                }
              });
            }
          }
          $log.log(' Events fetched = ' + JSON.stringify(vm.events));
        },
        function () {
          vm.refreshing = false;
          notifier.error('Error loading event calendar data.');
        }
      );
    }
  }
})();
