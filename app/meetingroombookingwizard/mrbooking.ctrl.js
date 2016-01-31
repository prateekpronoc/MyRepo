(function () {
  'use strict';

  angular
    .module('wams.mrbookingwizard')
    .controller('MrBookingCtrl', MrBookingCtrl);

  /* @ngInject */
  function MrBookingCtrl($stateParams, wamsServices, $filter, _, session, $timeout) {
    /*jshint validthis: true */
    var vm = this;
    vm.title = 'Ctrl';
    vm.myInterval = 3000;
    vm.dateValue = {};
    vm.ui = {};
    vm.search = {};
    vm.users = null;
    vm.user = null;
    vm.slides = [{
      image: 'http://lorempixel.com/400/200/'
    }, {
      image: 'http://lorempixel.com/400/200/food'
    }, {
      image: 'http://lorempixel.com/400/200/sports'
    }, {
      image: 'http://lorempixel.com/400/200/people'
    }];
    vm.search = search;
    vm.fetchAllUsers = fetchAllUsers;
    activate();

    function activate() {
      fetchMRDetails(parseInt($stateParams.mrId[0]));
      //fetchAllTenantUsers();
    }

    function fetchAllUsers() {
      var temp = [];
      wamsServices.getEntity({
        key: 'users',
        request: {
          tenantId: parseInt(session.getTenantId())
        }
      }).then(function (response) {
        temp = response.rows;
      });

      return $timeout(function () {
        vm.users = vm.users || temp;
      }, 650);
    }

    function fetchMRDetails(mrId) {
      wamsServices.getEntity({
        key: 'meetingRooms',
        request: {
          id: mrId
        }
      }).then(function (response) {
        if (response && response.rows && response.rows.length > 0) {
          vm.ui = response.rows[0];
        }
        console.log(response);
      }, function (error) {
        console.log(error);
      });
    }

    function search() {
      //vm.search.from
      console.log(vm.search.from);
      wamsServices.getEntity({
        key: 'bookings',
        request: {
          resourceType: 34,
          resourceId: vm.ui.id,
          from: $filter('date')(vm.search.from, 'yyyy-MM-dd'),
          to: $filter('date')(vm.search.to, 'yyyy-MM-dd')
        }
      }).then(function (response) {
        if (response && response.rows && response.rows.length > 0) {
          vm.unaviableSlots = response.rows;
        }
      }, function (error) {
        notifier.error('Unable to fetch data : ' + error.message);
      });
    }
  }
})();
