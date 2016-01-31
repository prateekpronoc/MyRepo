(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('MrBookingCtrl', MrBookingCtrl);


  function MrBookingCtrl($scope, MeetingRoomService, $state) {
    var vm = this;
    $scope.page = {
      title: 'Meeting Room Booking'
    };
    $scope.dataCarditems = [];
    $scope.cardHeight = '400px';
    $scope.mainActions = [];
    vm.actionClicked = actionClicked;
    vm.provideActions = provideActions;
    vm.isDeleteDisabled = true;
    vm.isEditDisabled = true;
    vm.toggled = toggled;
    vm.ajaxFaker = ajaxFaker;
    vm.selectPageNo = selectPageNo;
    //data of date picker
    vm.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1
    };

    function toggled(a) {
      console.log('Dropdown is now: ', a);
    }

    function ajaxFaker() {
      $state.reload();
    }


    function activate() {
      getMeetingRoomsdata();
      createPaging();
      today();
      clear();

    };
    activate();


    function getMeetingRoomsdata() {
      console.log("getMeetingRoomsdata");
      var gettingmeetingroomsdata = MeetingRoomService.query(function (response) {
        // vm.gettingmeetingroomsdata = response;
        // console.log(" meeting room data in function" + JSON.stringify(vm.gettingmeetingroomsdata));
      });
    };


    //***************for date picker********************
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
    /*****************for paging the data************/
    function actionClicked(actionCode, data) {

    }

    function provideActions(view) { //, record  = second attribute
      if (view === 'front') {
        // record based filtering can happen here...
        return vm.mainActions;
      } else {
        return [];
      }
    }

    function createPaging() {
      vm.pagingOptions = {
        columnCount: 1,
        currentPage: 1,
        isRefresh: false,
        rowCount: 10,
        pagingRange: 5,
        totalDataRecordCount: 100,
        recordsPerPage: 0,
        pageRecordOptionsArray: [10, 20, 50, 100],
        rowCountTitle: 'Select Count'
      };
      if (vm.candidateCount === 0) {
        vm.pagingOptions.totalDataRecordCount = 100;
      }
    }

    function selectPageNo() {
      vm.selectedPageNo = vm.pagingOptions.currentPage;
    };
  }
})();
