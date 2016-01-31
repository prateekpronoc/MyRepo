(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('ViewBookingCtrl', ViewBookingCtrl);



  function ViewBookingCtrl($scope, $state, $log, session, bookingService) {
    var vm = this;
    vm.toggled = toggled;
    vm.ajaxFaker = ajaxFaker;
    vm.getUserId = getUserId;
    // $scope.mytime = new Date();
    // $scope.hstep = 1;
    // $scope.mstep = 1;
    // vm.changed = changed;
    vm.page = {
      title: 'View Booking'
    };
    vm.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1
    };

    function activate() {
      today();
      clear();
      getUserId();
    };

    activate();

    function toggled(a) {
      console.log('Dropdown is now: ', a);
    }

    function ajaxFaker() {
      $state.reload();
    }
    vm.columnCollection = [{
      id: 'id',
      title: 'Id'
    }, {
      id: 'from',
      title: 'From'
    }, {
      id: 'to',
      title: 'To'
    }, {
      id: 'resourceType',
      title: 'Resource Type'
    }];

    function getUserId() {
      session.getUserId().then(function (resp) {
        console.log(resp);
        vm.userid = resp;
        getUserBookings(vm.userid);
      });
    }

    function getUserBookings(userid) {
      vm.entity = [];
      bookingService.getBookingByUserId(userid, {
        limit: 10,
        offset: 0
      }).then(function (resp) {
        vm.entity = resp.rows;
        vm.count = resp.count;
        createPaging(resp.count, 1, 10);
      });
    }

    function pageChanged(pageNo) {
      pageNo -= 1;
      bookingService.getBookingByUserId({
        userid: userid,
        limit: vm.maxSize,
        offset: pageNo * vm.maxSize
      }).then(function (response) {
        vm.entity = response.rows;
      });
    }
    vm.setPage = function (b) {
      vm.currentPage = b;
    };


    function createPaging(totalCount, pageNo, pageItemCount) {
      var i = 0;
      vm.pagingArray = [];
      vm.totalItems = totalCount;
      vm.currentPage = pageNo;
      vm.maxSize = pageItemCount;
      vm.maxPageLimit = $window.Math.ceil(totalCount / pageItemCount);
      for (i = 1; i <= vm.maxPageLimit; i = i + 1) {
        vm.pagingArray.push(i);
      }
      vm.endPage = vm.maxPageLimit;
      // vm.bigTotalItems = 175;
      // vm.bigCurrentPage = 1;
    }

    function today() {
      vm.dt = new Date();
      vm.minDate = new Date();
    };

    function clear() {
      vm.dt = null;
    };
    $scope.startdateopen = function ($event) {
      console.log("in side calendar");
      $event.preventDefault();
      $event.stopPropagation();
      $scope.startdateopened = true;
    };
    $scope.enddateopen = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.enddateopened = true;
    };
  }
})();
