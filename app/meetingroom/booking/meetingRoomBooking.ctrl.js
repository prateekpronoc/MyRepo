(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('MRoomBookingCtrl', MRoomBookingCtrl);

  /* @ngInject */
  function MRoomBookingCtrl(meetingRoomService, $state, $filter, $window) {
    var vm = this;
    vm.title = 'Controller';
    vm.ui = {};
    vm.page = {
      title: 'Meeting Room Booking'
    };
    vm.fetchFloor = fetchFloor;
    vm.filterSearch = filterSearch;
    vm.getById = getById;

    //Pagging data
    vm.totalItems = 1;
    vm.currentPage = 1;
    vm.maxSize = 1;
    vm.startPage = 1;
    vm.endPage = 0;
    vm.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    vm.startdateopen = startdateopen;
    vm.enddateopen = enddateopen;
    vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[0];

    vm.meetingroomMainColumns = [{
      id: 'id',
      title: 'Id',
      isAction: true
    }, {
      id: 'name',
      title: 'Name',
      isAction: false
    }, {
      id: 'location',
      title: 'Location',
      isAction: false
    }, {
      id: 'capacity',
      title: 'Capacity',
      isAction: false
    }];
    vm.meetingroomFlipColumns = [{
      id: 'status',
      title: 'Status'
    }, {
      id: 'type',
      title: 'Type'
    }, {
      id: 'floorname',
      title: 'Floor Name'
    }];
    vm.pageChanged = pageChanged;
    vm.actionClicked = actionClicked;
    //end of paging data
    activate();

    function activate() {
      fetchAllMeetingRooms();
      getBuildings();
    }


    vm.mainActions = [{
      id: 'ViewMeetingRoom',
      title: 'View Meeting Room',
      iconClass: 'fa fa-eye fa-lg'
    }];

    function actionClicked(actionName, entity) {
      if (actionName) {
        switch (actionName) {
        case 'ViewMeetingRoom':
          getById(entity.id);
          break;
        case 'getById':
          getById(entity.id);
          break;
        }
      }
    }

    function getById(selectedId) {
      console.log(selectedId);
      var mrslotdetails = {
        id: selectedId,
        from: vm.ui.startdate,
        to: vm.ui.enddate,
        buildingId: vm.ui.buildingId,
        floorId: vm.ui.floorId
      };
      $state.go('wams.mRoomSlotDetails', {
        id: selectedId,
        from: vm.ui.startdate,
        to: vm.ui.enddate,
        buildingId: vm.ui.buildingId,
        floorId: vm.ui.floorId
      });
    }

    function filterSearch() {
      fetchAllMeetingRooms(vm.ui.buildingId, vm.ui.floorId);
    }

    function fetchAllMeetingRooms(filterDatabuildingId, filterDatafloorId) {
      vm.entity = [];
      meetingRoomService.getAllMeetingRooms({
        buildingId: filterDatabuildingId,
        floorId: filterDatafloorId,
        limit: 5,
        offset: 0
      }).then(function (response) {
        vm.entity = response.rows;
        vm.count = response.count;
        createPaging(response.count, 1, 5);
      });
    }

    function pageChanged(pageNo) {
      pageNo -= 1;
      meetingRoomService.getAllMeetingRooms({
        buildingId: vm.ui.buildingId,
        floorId: vm.ui.floorId,
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
    }



    function getBuildings() {
      vm.buildings = [];
      meetingRoomService.getAllBuildings().then(function (response) {
        angular.forEach(response.rows, function (data) {
          vm.buildings.push({
            id: data.id,
            name: data.name
          });
        });
      });
    }

    function fetchFloor(Id) {
      vm.floors = [];
      meetingRoomService.getFloorById(Id).then(function (response) {
        angular.forEach(response, function (data) {
          if (Id === data.buildingId) {
            vm.floors.push({
              id: data.id,
              name: data.name
            });
          }
        });
      });
    }
    /***************for date picker********************/
    function today() {
      vm.dt = new Date();
      vm.minDate = new Date();
    };

    function clear() {
      vm.dt = null;
    };

    function startdateopen($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.startdateopened = true;
    };

    function enddateopen($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.enddateopened = true;
    };
  }
})();
