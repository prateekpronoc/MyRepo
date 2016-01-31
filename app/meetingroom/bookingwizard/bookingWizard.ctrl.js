(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('BookingWizardCtrl', BookingWizardCtrl);

  /* @ngInject */
  function BookingWizardCtrl(fetcher, $filter, fetchEntity, _, meetingRoomService) {
    /*jshint validthis: true */
    alert(1);
    var vm = this;
    vm.title = 'Ctrl';
    vm.ui = {};
    vm.steps = {
      step1: true,
      step2: false,
      step3: false,
      step4: false,
      step5: false
    };
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
    vm.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[0];
    vm.buildings = {};
    vm.floors = {};
    vm.slots = [];
    vm.nextTab = nextTab;
    vm.filterMeetingRooms = filterMeetingRooms;
    vm.startdateopen = startdateopen;
    vm.enddateopen = enddateopen;
    vm.fetchFloor = fetchFloor;
    vm.actionClicked = actionClicked;
    activate();

    function activate() {
      fetchAllMeetingRooms();
      fetchAllBuilding();

    }
    function nextTab(tabId) {
      angular.forEach(vm.steps, function (val, key) {
        if (key !== tabId) {
          val = false;
        }
      });
      vm.steps[tabId] = true;
    }

    function actionClicked(actionName, entity) {
      if (actionName) {
        switch (actionName) {
        case 'ViewMeetingRoom':
          getById(entity.id);
          break;
        case 'getById':
          vm.tday = new Date();
          createLables(vm.tday, 7);
          fetchMeetingRoomInfo(entity.id);
          break;
        }
      }
    }

    function fetchResouceCostConfig() {
      fetchEntity.getByValues({
        request: {
          id: vm.ui.meetingRoomId
        },
        key: 'costconfigurations',
        value: 'resourceId'
      }).then(function (response) {
        vm.costConfig = response.rows[0];
        //calculateConfigData(vm.costConfig.factor);
      }, function (error) {
        console.log(error);
      });
    }

    function calculateConfigData(entityId) {
      meetingRoomService.getCatalogValueById(entityId).
      then(function (response) {
        //if (response[0].value === 'Hours') {
        vm.unit = response[0].value;
        //}
      }, function (error) {
        console.log(error);
      });
    }

    function fetchMeetingRoomInfo(mrId) {
      vm.ui.meetingRoomId = mrId;
      fetchEntity.filterEntity({
        request: {
          id: mrId
        },
        key: 'meetingrooms'
      }).
      then(function (response) {
          vm.ui.mrInfo = response.rows[0];
          console.log(vm.ui.mrInfo);
          vm.nextTab('step2');
          fetchMRBookingDetails();
          fetchMRInfraDetails();
          fetchResouceCostConfig();
        },
        function (error) {
          console.log(error);
        });
    }

    function fetchMRInfraDetails() {
      vm.infraDetails = [];
      fetchEntity.filterEntity({
        request: {
          meetingRoomId: vm.ui.meetingRoomId
        },
        key: 'meetingroominfras'
      }).then(function (response) {
        angular.forEach(response.rows, function (val) {
          vm.infraDetails.push({
            id: val.id,
            name: val.name
          });
        });
      }, function (response) {
        //  console.log(response);
      });
    }

    function fetchMRBookingDetails() {
      fetchEntity.filterEntity({
        request: {
          resourceId: vm.ui.meetingRoomId
        },
        key: 'bookings'
      }).then(function (response) {
          processbookingInfo(response.rows);
        },
        function (error) {
          console.log(error);
        });
    }

    function createLables(labelFrom, labelTo) {
      vm.labels = [];
      var temp = [];
      vm.tday = labelFrom;
      for (var i = 0; i <= labelTo; i++) {
        var nextDay = new Date(vm.tday);
        nextDay.setDate(vm.tday.getDate() + i);
        temp.push(nextDay);
      }
      vm.labels = temp;

      //  console.log(vm.labels);
    }

    function processbookingInfo(entity) {
      vm.slots = [];
      var rToMin = 0,
        rFromMin = 0,
        rFromHour = 0,
        rtoHour = 0;
      angular.forEach(entity, function (val) {
        rFromHour = $filter('date')(val.from, 'HH', 'UTC');
        rFromMin = $filter('date')(val.from, 'mm', 'UTC');
        rtoHour = $filter('date')(val.to, 'HH', 'UTC');
        rToMin = $filter('date')(val.to, 'mm', 'UTC');
        // console.log((rFromHour * 60) + ((rFromMin * 60) / 60));
        // console.log((rtoHour * 60) + ((rToMin * 60) / 60));
        for (var i = 0; i <= vm.labels.length; i++) {
          // console.log($filter('date')(vm.labels[i], 'yyyy-MM-dd'));
          if ($filter('date')(vm.labels[i], 'yyyy-MM-dd') === $filter('date')(val.from, 'yyyy-MM-dd')) {
            vm.index = i;
          }
        }

      });
      vm.slots.push({
        start: ((rFromHour * 60) + ((rFromMin * 60) / 60)),
        stop: ((rtoHour * 60) + ((rToMin * 60) / 60)),
        day: vm.index
      });
      //console.log(vm.slots);
    }

    function fetchAllBuilding() {
      fetcher.get({
        request: {},
        key: 'buildings'
      }).then(function (response) {
        _.forEach(response.rows, function (val) {
          vm.buildings[val.id] = val.name;
        });
      });
    }

    function fetchFloor() {
      if (vm.ui.building === null) {
        return;
      }
      fetchEntity.filterEntity({
        request: {
          buildingId: vm.ui.building
        },
        key: 'floors'
      }).then(function (response) {
          _.forEach(response.rows, function (val) {
            vm.floors[val.id] = val.name;
          });
        },
        function (error) {
          console.log(error);
        });
    }

    function filterMeetingRooms() {
      var sRequest = {};
      if (vm.ui.frmDate !== null) {
        sRequest.from = $filter('date')(vm.ui.startdate, 'yyyy-MM-ddTHH:mm:ss');
      }
      if (vm.ui.toDate !== null) {
        sRequest.to = $filter('date')(vm.ui.enddate, 'yyyy-MM-ddTHH:mm:ss');
      }
      if (vm.ui.building !== null) {
        sRequest.buildingId = vm.ui.buildingId;
      }
      if (vm.ui.floorId !== null) {
        sRequest.floorId = vm.ui.floorId;
      }

      fetchEntity.filterEntity({
        request: sRequest,
        key: 'meetingrooms'
      }).then(function (response) {
        console.log(response.data);
      }, function (error) {
        console.log(error);
      });
    }

    /***************for date picker********************/
    // function today() {
    //   vm.dt = new Date();
    //   vm.minDate = new Date();
    // }

    // function clear() {
    //   vm.dt = null;
    // }

    function startdateopen($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.startdateopened = true;
    }

    function enddateopen($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.enddateopened = true;
    }

    

    function fetchAllMeetingRooms() {
      vm.entity = [];
      fetcher.get({
        request: {
          limit: 5,
          offset: 0
        },
        key: 'meetingRooms'
      }).then(function (response) {
        vm.entity = response.rows;
        vm.count = response.count;
        //createPaging(response.count, 1, 5);
      });
    }
  }
})();
