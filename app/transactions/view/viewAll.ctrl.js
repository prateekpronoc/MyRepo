(function () {
  'use strict';

  angular
    .module('wams.accounting')
    .controller('ViewAllTransactionsSummaryCtrl', ViewAllTransactionsSummaryCtrl);

  /* @ngInject */
  function ViewAllTransactionsSummaryCtrl(wamsServices, notifier, _, session, commonService, $filter) {
    var vm = this;
    vm.title = 'Controller';
    vm.page = {
      title: 'Transactions Summary'
    };
    vm.columnCollection = [{
      id: 'id',
      title: 'Id',
      isAction: true,
      isDate: false
    }, {
      id: 'amount',
      title: 'Amount',
      isAction: false,
      isDate: false
    }, {
      id: 'debitname',
      title: 'Transactions From',
      isAction: false,
      isDate: false
    }, {
      id: 'creditname',
      title: 'Transactions To',
      isAction: false,
      isDate: false
    }, {
      id: 'createdOn',
      title: 'Transactions Date',
      isAction: false,
      isDate: true
    }];
    vm.ui = {};
    vm.searchText = '';
    vm.noData = false;
    vm.pagingOptions = commonService.getPagingOptions();
    vm.pageChanged = pageChanged;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    var orderBy = $filter('orderBy');
    vm.order = order;
    activate();

    ////////////////

    function activate() {
      getAllTransactionSummary();
      // fetAllMeetingRooms();
    }

    function order(predicate, reverse) {
      vm.entity = orderBy(vm.entity, predicate, reverse);
    }

    // function fetAllMeetingRooms() {
    //   vm.ui.mR = {};
    //   wamsServices.getEntity({
    //     key: 'meetingRooms',
    //     request: {
    //       limit: 10,
    //       offset: 0
    //     }
    //   }).then(function (response) {
    //     if (!response || response.rows.length === 0) {
    //       notifier.error('Problem encountered while fetching MeetingRooms');
    //       return;
    //     }
    //     vm.entity = response.rows;
    //     _.forEach(response.rows, function (val) {
    //       vm.ui.mR[val.id] = val.name;
    //     });
    //     fetchAllBookings();
    //   }, function (error) {
    //     notifier.error(error.message);
    //   });
    // }

    // function fetchAllBookings() {
    //   vm.ui.bookings = [];
    //   wamsServices.getEntity({
    //     key: 'bookings',
    //     request: {
    //       bookedForWhom: parseInt(session.getUserId())
    //     }
    //   }).then(function (response) {
    //     if (!response || response.rows.length === 0) {
    //       notifier.error('Problem encountered while fetching bookings');
    //       return;
    //     }

    //     vm.ui.booking = response.rows;
    //     processTransactionAndBookingInfo();

    //   }, function (error) {
    //     notifier.error(error.message);
    //   });
    // }


    // function processTransactionAndBookingInfo() {
    //   vm.ui.transBooking = [];
    //   _.forEach(vm.ui.booking, function (val) {

    //     vm.ui.transBooking.push({
    //       id: val.transactionId,
    //       amount: vm.ui.trans[val.transactionId],
    //       description: 'Booked ' + vm.ui.mR[val.resourceId]
    //     });
    //   });
    //   console.log(vm.ui);
    // }

    function pageChanged(pageNo) {
      pageNo -= 1;

      wamsServices.getEntity({
        request: {
          limit: vm.maxSize,
          offset: pageNo * vm.maxSize
        },
        key: 'transactions'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching transactions');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.entity = response.rows;
        vm.ui.trans = response.rows[0];
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

    function getAllTransactionSummary() {
      vm.entity = [];
      vm.ui.trans = {};
      wamsServices.getEntity({
        key: 'transactions',
        request: {
          limit: 10,
          offset: 0
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching Transactions');
          return;
        }
        vm.entity = response.rows;
        _.forEach(response.rows, function (val) {
          vm.ui.trans[val.id] = val.amount;
        });
        vm.pagingOptions.totalDataRecordCount = response.count;
        vm.pagingOptions.rowCount = 1;
        vm.pagingOptions.columnCount = 10;
        if (response.count < 10) {
          vm.shownCount = response.count;
        }
        vm.count = response.count;
        console.log(vm.entity);
      }, function (error) {
        notifier.error(error.message);
      });
    }
  }
})();
