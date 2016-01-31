(function () {
  'use strict';

  angular
    .module('wams.dashboard')
    .controller('DashboardCalendarCtrl', DashboardCalendarCtrl);
  /* @ngInject */
  function DashboardCalendarCtrl($modalInstance, wamsServices, notifier, $filter, session) {
    var vm = this;
    vm.title = 'DashboardCalendarCtrl';
    vm.cancel = cancel;
    vm.eventSources = [{
      events: [],
    }];
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
    activate();

    ////////////////

    function activate() {
      fetchAllMRBookings();
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function fetchAllMRBookings() {
      wamsServices.getEntity({
        key: 'bookings',
        request: {
          bookedForWhom: parseInt(session.getUserId())
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching bookings');
          return;
        }
        _.forEach(response.rows, function (val) {
          vm.eventSources[0].events.push({
            title: val.reason,
            start: $filter('date')(val.from, 'yyyy-MM-dd'),
            end: $filter('date')(val.to, 'yyyy-MM-dd'),
            allDay: false
          });
        });
        //console.log(JSON.stringify(vm.eventSources[0].events));
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }
  }
})();
