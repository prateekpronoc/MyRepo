(function () {
  'use strict';

  angular
    .module('wams.bookings')
    .controller('ViewAllMyBookingsCtrl', ViewAllMyBookingsCtrl);

  /* @ngInject */
  function ViewAllMyBookingsCtrl(wamsServices, session, commonService, notifier) {
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
    vm.archiveData = archiveData;
    activate();

    ////////////////

    function activate() {
      vm.ui.userId = parseInt(session.getUserId());
      //  fetchBookingParticipants();
      fetchAllUsers();
      fetchBookings();
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
      // console.log('Booking Info');
      // console.log(vm.ui.bookingInfo);
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
      vm.ui.bookings = [];
      vm.ui.booking = {};
      wamsServices.getEntity({
        key: 'bookings',
        request: {
          bookedForWhom: parseInt(session.getUserId()),
          limit: 10,
          offset: 0
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching bookings');
          return;
        }
        console.log(response);
        var temp = [];
        _.forEach(response.rows, function (val) {
          if (val.status !== 128) {
            temp.push(val);
          }
        });
        console.log(temp.length);
        vm.ui.bookings = response.rows;
        vm.ui.booking = response.rows[0];
        vm.ui.bookingInfo = response.rows[0];
        //fetchMeetingDetails();
        vm.pagingOptions.totalDataRecordCount = response.count;
        vm.pagingOptions.rowCount = 1;
        vm.pagingOptions.columnCount = 10;
        if (response.count < 10) {
          vm.shownCount = response.count;
        }
        vm.count = response.count;
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
          bookedForWhom: parseInt(vm.ui.userId)
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

    function archiveData(bookingId) {
      wamsServices.archiveEntity({
        key: 'bookings',
        request: {
          id: bookingId
        }
      }).then(function (response) {
        if (response) {
          console.log(response);
          if (_.has(response, 'statusCode')) {
            notifier.error('Problem encountered while saving data :' + response.message);
            return;
          }
          notifier.success(response);
        }
      }, function (error) {
        notifier.error('Problem encountered while saving data :' + error.message);
      });
    }
  }
})();

// (function () {
//   'use strict';

//   angular
//     .module('wams.bookings')
//     .controller('ViewAllMyBookingsCtrl', ViewAllMyBookingsCtrl);

//   /* @ngInject */
//   function ViewAllMyBookingsCtrl(wamsServices, notifier, _, session, commonService) {
//     /*jshint validthis: true */
//     var vm = this;
//     vm.title = 'My Bookings';
//     vm.ui = {};
//     vm.columnCollection = [{
//       id: 'id',
//       title: 'Id',
//       isAction: true
//     }, {
//       id: 'id',
//       title: 'Meeting Room Name',
//       isAction: false
//     }, {
//       id: 'from',
//       title: 'From',
//       isAction: false
//     }, {
//       id: 'to',
//       title: 'To',
//       isAction: false
//     }, {
//       id: 'id',
//       title: 'Amount',
//       isAction: false
//     }, {
//       id: 'id',
//       title: 'Status',
//       isAction: false
//     }];
//     vm.searchText = '';
//     vm.noData = false;
//     vm.shownCount = 10;
//     vm.maxSize = 10;
//     vm.pageNo = 0;
//     vm.pagingOptions = commonService.getPagingOptions();
//     vm.pageChanged = pageChanged;
//     vm.getBookingById = getBookingById;
//     activate();

//     function activate() {
//       fetchAllMeetingRooms();
//       fetchAllTransaction();
//       fetchUserInfo();
//       // fetchAllBookings();
//       // fetchUserInfo();
//       fetchBookingParticipants();
//     }

//     function getBookingById(bId) {
//       vm.ui.bookingInfo = _.filter(vm.ui.bookings, {
//         id: bId
//       })[0];
//       console.log('Booking Info');
//       console.log(vm.ui.bookingInfo);
//       fetchMeetingDetails();
//     }

//     function fetchBookingParticipants() {
//       wamsServices.getEntity({
//         key: 'bookingparticipants',
//         request: {}
//       }).then(function (response) {
//         if (!response || response.rows.length === 0) {
//           notifier.error('Problem encountered while fetching meeting room');
//           return;
//         }
//         vm.ui.mrInfo = response.rows[0];
//         fetchMRInfra();
//         console.log(vm.ui.mrInfo);
//       }, function (error) {
//         notifier.error(error.message);
//       });
//     }

//     function fetchMeetingDetails() {
//       vm.ui.mrInfo = {};
//       wamsServices.getEntity({
//         key: 'meetingRooms',
//         request: {
//           id: vm.ui.bookingInfo.resourceId
//         }
//       }).then(function (response) {
//         if (!response || response.rows.length === 0) {
//           notifier.error('Problem encountered while fetching meeting room');
//           return;
//         }
//         vm.ui.mrInfo = response.rows[0];
//         fetchMRInfra();
//         console.log(vm.ui.mrInfo);
//       }, function (error) {
//         notifier.error(error.message);
//       });
//     }

//     function fetchMRInfra() {
//       vm.ui.infra = {};
//       wamsServices.getEntity({
//         key: 'meetingroominfras',
//         request: {
//           meetingRoomId: vm.ui.mrInfo.id
//         }
//       }).then(function (response) {
//         if (!response || response.rows.length === 0) {
//           notifier.error('Problem encountered while fetching meeting room infra');
//           return;
//         }
//         _.forEach(response.rows, function (val) {
//           vm.ui.infra[val.id] = val.description;
//         });
//       }, function (error) {
//         notifier.error(error.message);
//       });
//     }

//     function fetchUserInfo() {
//       vm.ui.userId = session.getUserId();
//       fetchAllBookings();
//     }

//     function fetchAllBookings() {
//       vm.ui.bookings = [];
//       vm.ui.booking = {};
//       wamsServices.getEntity({
//         key: 'bookings',
//         request: {
//           bookedForWhom: parseInt(vm.ui.userId),
//           limit: 10,
//           offset: 0
//         }
//       }).then(function (response) {
//         if (!response || response.rows.length === 0) {
//           notifier.error('Problem encountered while fetching bookings');
//           return;
//         }
//         vm.ui.bookings = response.rows;
//         vm.ui.booking = response.rows[0];
//         vm.ui.bookingInfo = response.rows[0];
//         fetchMeetingDetails();
//         vm.pagingOptions.totalDataRecordCount = response.count;
//         vm.pagingOptions.rowCount = 1;
//         vm.pagingOptions.columnCount = 10;
//         if (response.count < 10) {
//           vm.shownCount = response.count;
//         }
//         vm.count = response.count;
//       }, function (error) {
//         notifier.error('Unable to fetch data' + error.message);
//       });
//     }

//     function pageChanged(pageNo) {
//       pageNo -= 1;

//       wamsServices.getEntity({
//         request: {
//           limit: vm.maxSize,
//           offset: pageNo * vm.maxSize,
//           bookedForWhom: parseInt(vm.ui.userId)
//         },
//         key: 'bookings'
//       }).then(function (response) {
//         if (!response) {
//           vm.noData = true;
//           notifier.error('Problem encountered while fetching Company');
//           return;
//         }
//         if (response.rows && response.rows.length === 0) {
//           vm.noData = true;
//           notifier.error('Unable to fetch data');
//           return;
//         }
//         vm.ui.bookings = response.rows;
//         vm.ui.booking = response.rows[0];
//         vm.ui.bookingInfo = response.rows[0];
//         vm.pagingOptions.totalDataRecordCount = response.count;
//         vm.pagingOptions.rowCount = 1;
//         vm.pagingOptions.columnCount = 10;
//         if (response.count < 10) {
//           vm.shownCount = response.count;
//         }
//         vm.count = response.count;
//       }, function (error) {
//         notifier.error('Unable to fetch data' + error.message);
//       });

//     }

//     function fetchAllTransaction() {
//       vm.ui.trans = {};
//       wamsServices.getEntity({
//         key: 'transactions',
//         request: {
//           limit: 50,
//           offset: 0
//         }
//       }).then(function (response) {
//         if (!response || response.rows.length === 0) {
//           notifier.error('Problem encountered while fetching Transactions');
//           return;
//         }
//         _.forEach(response.rows, function (val) {
//           vm.ui.trans[val.id] = val.amount;
//         });
//         console.log(vm.ui);
//       }, function (error) {
//         notifier.error(error.message);
//       });
//     }

//     function fetchAllMeetingRooms() {
//       vm.ui.meetingrooms = {};
//       wamsServices.getEntity({
//         key: 'meetingRooms',
//         request: {
//           limit: 50,
//           offset: 0
//         }
//       }).then(function (response) {
//         if (!response || response.rows.length === 0) {
//           notifier.error('Problem encountered while fetching Meeting Rooms');
//           return;
//         }
//         _.forEach(response.rows, function (val) {
//           vm.ui.meetingrooms[val.id] = val.name;
//         });
//         console.log(vm.ui);
//       }, function (error) {
//         notifier.error(error.message);
//       });
//     }
//   }
// })();
