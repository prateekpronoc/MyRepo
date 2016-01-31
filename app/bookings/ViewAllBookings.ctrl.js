(function () {
  'use strict';

  angular
    .module('wams.bookings')
    .controller('ViewAllBookingsCtrl', ViewAllBookingsCtrl);
  /* @ngInject */
  function ViewAllBookingsCtrl(wamsServices, notifier, _, session, commonService) {
    var vm = this;
    vm.title = 'My Bookings';
    vm.ui = {};
    vm.noData = false;
    vm.columnCollection = [{
        id: 'id',
        title: 'Id',
        isAction: true
      }, {
        id: 'meetingroom',
        title: 'Meeting Room Name',
        isAction: false
      }, {
        id: 'from',
        title: 'From',
        isAction: false
      }, {
        id: 'to',
        title: 'To',
        isAction: false
      }, {
        id: 'bookedForWhom',
        title: 'Booked By',
        isAction: false
      },
      //  {
      //   id: 'id',
      //   title: 'Amount',
      //   isAction: false
      // },
      {
        id: 'id',
        title: 'Status',
        isAction: false
      }
    ];
    vm.searchText = '';
    vm.noData = false;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    vm.pagingOptions = commonService.getPagingOptions();
    vm.pageChanged = pageChanged;
    vm.getBookingById = getBookingById;
    vm.selectAll = selectAll;
    var assignedMeetingRoom = [];
    activate();

    ////////////////

    function activate() {
      fetchAllUsers();
      if (session.hasRole('TenantAdmin')) {
        fetchTenantMeetingRooms();
      } else {
        fetchBookings();
      }

    }
    vm.selectedAll = !1;

    function selectAll() {
      vm.selectedAll = vm.selectedAll ? !1 : !0;
      angular.forEach(vm.ui.bookings, function (b) {
        b.selected = vm.selectedAll;
      });
    }

    function getBookingById(bId) {
      vm.ui.bookingInfo = _.filter(vm.ui.bookings, {
        id: bId
      })[0];
      fetchMeetingDetails();
      fetchBookingParticipants();
    }

    function fetchAllUsers() {
      wamsServices.getEntity({
        key: 'users',
        request: {}
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching meeting room');
          return;
        }
        vm.ui.userInfo = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'name'));
        console.log(vm.ui.userInfo);
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function fetchBookingParticipants() {
      vm.ui.bookingparticipants = {};
      wamsServices.getEntity({
        key: 'bookingparticipants',
        request: {
          bookingId: vm.ui.bookingInfo.id
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching Participants');
          return;
        }
        vm.ui.bookingparticipants = response.rows;
        console.log(vm.ui.bookingparticipants);
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function fetchBookings() {
      var i, temp = [];
      vm.ui.bookings = [];
      vm.ui.booking = {};
      wamsServices.getEntity({
        key: 'bookings',
        request: {
          limit: 10,
          offset: 0,
          resourceId: assignedMeetingRoom
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching bookings');
          return;
        }
        vm.ui.bookings = response.rows;
        vm.ui.booking = response.rows[0];
        vm.ui.bookingInfo = response.rows[0];
        vm.pagingOptions.totalDataRecordCount = response.count;
        vm.pagingOptions.rowCount = 1;
        vm.pagingOptions.columnCount = 10;
        if (response.count < 10) {
          vm.shownCount = response.count;
        }
        vm.count = response.count;
        // if (assignedMeetingRoom.length > 0) {
        //   for (i = 0; i < assignedMeetingRoom.length; i = i + 1) {
        //     _.forEach(response.rows, function (val) {
        //       if (val.resourceId === assignedMeetingRoom[i]) {
        //         temp.push(val);
        //       }
        //     });
        //   }
        //   vm.ui.bookings = temp;
        //   vm.ui.booking = temp[0];
        //   vm.ui.bookingInfo = temp[0];
        //   vm.pagingOptions.totalDataRecordCount = temp.length;
        //   vm.pagingOptions.rowCount = 1;
        //   vm.pagingOptions.columnCount = 10;
        //   if (response.count < 10) {
        //     vm.shownCount = temp.length;
        //   }
        //   vm.count = temp.length;

        // } else {
        //   vm.ui.bookings = response.rows;
        //   vm.ui.booking = response.rows[0];
        //   vm.ui.bookingInfo = response.rows[0];
        //   vm.pagingOptions.totalDataRecordCount = response.count;
        //   vm.pagingOptions.rowCount = 1;
        //   vm.pagingOptions.columnCount = 10;
        //   if (response.count < 10) {
        //     vm.shownCount = response.count;
        //   }
        //   vm.count = response.count;
        // }
        fetchMeetingDetails();
        fetchBookingParticipants();
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function pageChanged(pageNo) {
      pageNo -= 1;
      wamsServices.getEntity({
        request: {
          limit: vm.maxSize,
          offset: pageNo * vm.maxSize,
          resourceId: assignedMeetingRoom
        },
        key: 'bookings'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching Company');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.ui.bookings = response.rows;
        vm.ui.booking = response.rows[0];
        vm.ui.bookingInfo = response.rows[0];
        vm.pagingOptions.totalDataRecordCount = response.count;
        vm.pagingOptions.rowCount = 1;
        vm.pagingOptions.columnCount = 10;
        if (response.count < 10) {
          vm.shownCount = response.count;
        }
        vm.count = response.count;
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function fetchMeetingDetails() {
      vm.ui.mrInfo = {};
      wamsServices.getEntity({
        key: 'meetingRooms',
        request: {
          id: vm.ui.bookingInfo.resourceId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching meeting room');
          return;
        }
        vm.ui.mrInfo = response.rows[0];
        fetchMRInfra();
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function fetchMRInfra() {
      vm.ui.infra = {};
      wamsServices.getEntity({
        key: 'getMeetingInfra',
        request: {
          meetingRoomId: vm.ui.mrInfo.id
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching meeting room infra');
          return;
        }
        _.forEach(response.rows, function (val) {
          vm.ui.infra[val.id] = val.name;
        });
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function fetchTenantMeetingRooms() {
      wamsServices.getEntity({
        request: {
          tenantId: parseInt(session.getTenantId())
        },
        key: 'tenantmeeting'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching meeting-rooms');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }

        assignedMeetingRoom = _.uniq(_.pluck(response.rows, 'meetingroomId'));
        fetchBookings();
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }
  }
})();
