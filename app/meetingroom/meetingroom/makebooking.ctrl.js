(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('MakeBookingCtrl', MakeBookingCtrl);



  function MakeBookingCtrl($scope, $state) {
    var vm = this;
    vm.toggled = toggled;
    vm.ajaxFaker = ajaxFaker;
    // $scope.mytime = new Date();
    // $scope.hstep = 1;
    // $scope.mstep = 1;
    // vm.changed = changed;
    vm.page = {
      title: 'Make Booking'
    };
    vm.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1
    };

    function activate() {
      today();
      clear();
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
      id: 'name',
      title: 'Name'
    }, {
      id: 'bookedby',
      title: 'BookedBy'
    }, {
      id: 'cost',
      title: 'Cost'
    }];

    vm.entity = [{
      id: 1,
      name: 'abc',
      bookedby: 'xyz',
      contactnumber: '8986866866',
      companyname: 'abc',
      slot: '11am-1pm',
      date: '16-06-2015',
      cost: '$500'
    }, {
      id: 2,
      name: 'xyz',
      bookedby: 'abc',
      contactnumber: '9898878987',
      companyname: 'wsa',
      slot: '9am-12pm',
      date: '12-07-2015',
      cost: '$700'
    }, {
      id: 3,
      name: 'dfd',
      bookedby: 'gghvh',
      contactnumber: '98798798797',
      companyname: 'fhfvh',
      slot: '4pm-7pm',
      date: '31-06-2015',
      cost: '$1100'
    }];


    // /***********for Time Picker**************/
    // /*for getting AM and PM*/
    // $scope.ismeridian = true;
    // $scope.toggleMode = function () {
    //   $scope.ismeridian = !$scope.ismeridian;
    // };

    // function changed() {
    //   $log.log('Time changed to: ' + $scope.mytime);
    // };


    /***************for date picker********************/
    function today() {
      vm.dt = new Date();
      vm.minDate = new Date();
    };

    function clear() {
      vm.dt = null;
    };

    /* function open($event) {
       console.log("in side calendar");
       $event.preventDefault();
       $event.stopPropagation();
      vm.opened = true;
     };*/
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
