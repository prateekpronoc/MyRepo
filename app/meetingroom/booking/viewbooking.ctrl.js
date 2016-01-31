(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('ViewBookingCtrl', ViewBookingCtrl);



  function ViewBookingCtrl($state, $log, session, bookingService, $filter, $window) {
    var vm = this;
    vm.toggled = toggled;
    vm.viewbooking = {};
    vm.ajaxFaker = ajaxFaker;
    vm.page = {
      title: 'View Booking'
    };
    vm.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1
    };
    var uistartdate, uifromtime, uienddate, uitotime = '';
    // vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'yyyy-mm-ddThh:mm:ss:sssz'];
    // vm.format = vm.formats[4];
    vm.filterSearch = filterSearch;
    vm.pageChanged = pageChanged;

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
    }, {
      id: 'meetingroom',
      title: 'Resource Name'
    }];

    function getUserId() {
      session.getUserId().then(function (resp) {
        console.log(resp);
        vm.userid = resp;
        getUserBookings(vm.userid);
      });
    }

    function filterSearch() {
      console.log(vm.viewbooking.startdate);
      console.log(vm.viewbooking.fromtime);
      console.log(vm.viewbooking.enddate);
      console.log(vm.viewbooking.totime);
      // var uistartdate, uifromtime, uienddate, uitotime = '';
      uistartdate = $filter('date')(vm.viewbooking.startdate, 'yyyy-MM-dd');
      console.log(uistartdate);
      uifromtime = $filter('date')(vm.viewbooking.fromtime, 'hh:mm:ss');
      console.log(uifromtime);
      uienddate = $filter('date')(vm.viewbooking.enddate, 'yyyy-MM-dd');
      console.log(uienddate);
      uitotime = $filter('date')(vm.viewbooking.totime, 'hh:mm:ss');
      // console.log(uitotime);
      getUserBookings(vm.userid);
    }

    function getUserBookings(userid) {
      console.log(uitotime);
      vm.entity = [];
      console.log(uistartdate + 'T' + uifromtime);
      bookingService.getBookingByUserId({
        bookedForWhom: userid,
        // from: uistartdate + 'T' + uifromtime,
        limit: 10,
        offset: 0
      }).then(function (resp) {
        // console.log(JSON.stringify(resp));
        //vm.entity = resp.rows;
        // var fromdate = vm.entity[0].from;
        // var date = $filter('date')(fromdate, 'dd-MMMM-yyyy');
        // console.log(fromdate);
        // console.log(date);
        angular.forEach(resp.rows, function (data) {
          vm.entity.push({
            id: data.id,
            from: $filter('date')(data.from, 'dd-MMMM-yyyy'),
            to: $filter('date')(data.to, 'dd-MMMM-yyyy'),
            resourceType: data.resourceType
          });
        });
        vm.count = resp.count;
        createPaging(resp.count, 1, 10);
      });
    }

    function pageChanged(pageNo) {
      pageNo -= 1;
      bookingService.getBookingByUserId({
        bookedForWhom: vm.userid,
        limit: vm.maxSize,
        offset: pageNo * vm.maxSize
      }).then(function (response) {
        //vm.entity = response.rows;
        angular.forEach(response.rows, function (data) {
          vm.entity.push({
            id: data.id,
            from: $filter('date')(data.from, 'dd-MMMM-yyyy'),
            to: $filter('date')(data.to, 'dd-MMMM-yyyy'),
            resourceType: data.resourceType
          });
        });
      });
    }

    vm.setPage = function (b) {
      vm.currentPage = b;
    };
    vm.totalItems = 1;
    vm.currentPage = 1;
    vm.maxSize = 1;
    vm.startPage = 1;
    vm.endPage = 0;
    vm.pagingArray = [];

    function createPaging(totalCount, pageNo, pageItemCount) {
      var i = 0;
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

    // /***********for Time Picker**************/
    vm.mytime = new Date();
    vm.hstep = 1;
    vm.mstep = 1;
    vm.changed = changed;

    /*for getting AM and PM*/
    vm.ismeridian = true;
    vm.toggleMode = function () {
      vm.ismeridian = !vm.ismeridian;
    };

    function changed() {
      //$log.log('Time changed to: ' + vm.mytime);
    };


    /***************for date picker********************/
    function today() {
      vm.dt = new Date();
      vm.minDate = new Date();
    };

    function clear() {
      vm.dt = null;
    };
    vm.startdateopen = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.startdateopened = true;
    };
    vm.enddateopen = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.enddateopened = true;
    };
  }

})();
