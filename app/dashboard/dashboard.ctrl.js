(function () {
  'use strict';

  angular
    .module('wams.dashboard')
    .controller('DashboardCtrl', DashboardCtrl);

  /* @ngInject */
  function DashboardCtrl(wamsServices, session, _, notifier, $window, $state, $mdSidenav, $modal) {
    /*jshint validthis: true */
    var vm = this,
      assignedMeetingRoom = [];
    vm.currentUserName = session.getUserName();
    vm.dashboard = {};
    vm.todayDate = new Date();
    vm.foodBookingEntity = [];
    vm.session = session;
    vm.countMeetingRooms = 0;
    vm.selectedIndex = 0;
    vm.toggleLeft = toggleLeft;

    function toggleLeft() {
      $mdSidenav('left').toggle();
    }
    // vm.fullCalenderView = fullCalenderView;
    vm.changeState = changeState;
    activate();

    vm.chartObject = {};

    vm.chartObject.type = 'ColumnChart';

    vm.onions = [{
      v: 'September'
    }, {
      v: 3
    }, ];

    vm.activity = [{
      what: 'Brunch this weekend?',
      who: 'Ali Conners',
      when: '3:08PM',
      notes: " I'll be in your neighborhood doing errands"
    }, {
      what: 'Summer BBQ',
      who: 'to Alex, Scott, Jennifer',
      when: '3:08PM',
      notes: "Wish I could come out but I'm out of town this weekend"
    }, {
      what: 'Oui Oui',
      who: 'Sandra Adams',
      when: '3:08PM',
      notes: "Do you have Paris recommendations? Have you ever been?"
    }, {
      what: 'Birthday Gift',
      who: 'Trevor Hansen',
      when: '3:08PM',
      notes: "Have any ideas of what we should get Heidi for her birthday?"
    }, {
      what: 'Recipe to try',
      who: 'Brian Holt',
      when: '3:08PM',
      notes: "We should eat this: Grapefruit, Squash, Corn, and Tomatillo tacos"
    }, ];

    vm.chartObject.data = {
      'cols': [{
        id: 't',
        label: 'Topping',
        type: 'string'
      }, {
        id: 's',
        label: 'Booking',
        type: 'number'
      }],
      'rows': [{
        c: [{
          v: 'August'
        }, {
          v: 3
        }, ]
      }, {
        c: vm.onions
      }, {
        c: [{
          v: 'October'
        }, {
          v: 31
        }]
      }, {
        c: [{
          v: 'November'
        }, {
          v: 1
        }, ]
      }, {
        c: [{
          v: 'December'
        }, {
          v: 2
        }, ]
      }]
    };

    vm.chartObject.options = {
      'title': 'Booking Done in last 5 months'
    };

    vm.slides = [{
      image: 'http://lorempixel.com/400/200/food'
    }];

    function activate() {
      fetchFoodBookingDetails();
      fetchAllCafeteria();
    }

    function validateResponse(res) {
      if (res && res.rows && res.rows.length) {
        return true;
      }
      return false;
    }

    vm.cafeEntity = {};

    function fetchAllCafeteria() {
      wamsServices.getEntity({
        key: 'viewCafe',
        request: {
          premiseId: 12
        }
      }).then(function (response) {
        if (validateResponse(response)) {
          vm.cafeEntity.entities = response.rows;
          vm.cafeEntity.totalCount = response.rows.count;
        }
      }, function (error) {
        console.log(error);
      });
    }

    function changeState(val, selectedId) {
      switch (val) {
      case 'mymeetingroom':
        $state.go('wams.mymeetingrooms');
        break;
      case 'mybooking':
        $state.go('wams.mybookings');
        break;
      case 'viewCafe':
        $state.go('wams.cafemeuview', {
          cafeId: selectedId
        });
        break;
      }
    }

    function fetchFoodBookingDetails() {
      wamsServices.getEntity({
        key: 'cafeorders',
        request: {
          userId: parseInt(session.getUserId())
        }
      }).then(function (response) {
        if (response && response.rows) {
          response.rows = _(response.rows).reverse().value();
          _.forEach(response.rows, function (val) {
            vm.foodBookingEntity.push({
              cafeId: val.cafeId,
              foodItems: val.orderFood.data,
              bookingId: val.trackingId
            });
          });
          //vm.foodBookingEntity = [];
          console.log(vm.foodBookingEntity);
        }
      }, function (error) {
        console.log(error);
      });
    }
  }
})();
