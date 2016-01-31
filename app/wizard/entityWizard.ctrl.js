(function () {
  'use strict';

  angular
    .module('wizard')
    .controller('MRBookingWizardCtrl', MRBookingWizardCtrl);
  /* @ngInject */
  function MRBookingWizardCtrl($window, wamsServices, notifier, $state, _, $filter, $scope, session, commonService,
    $modal, $mdSidenav, $mdBottomSheet) {
    var vm = this;
    vm.title = 'Controller';
    vm.page = {
      title: 'Booking'
    };
    vm.isDeleteDisabled = true;
    vm.isEditDisabled = true;
    vm.showSearch = false;
    vm.isOpenRight = function () {
      $mdSidenav('right')
        .toggle();
    };
    // vm.meetingroomMainColumns = [{
    //   id: 'id',
    //   title: 'Id',
    //   isAction: true
    // }, {
    //   id: 'name',
    //   title: 'Name',
    //   isAction: false
    // }, {
    //   id: 'location',
    //   title: 'Location',
    //   isAction: false
    // }, {
    //   id: 'capacity',
    //   title: 'Capacity',
    //   isAction: false
    // }];
    // vm.meetingroomFlipColumns = [{
    //   id: 'status',
    //   title: 'Status'
    // }, {
    //   id: 'type',
    //   title: 'Type'
    // }];
    vm.mainActions = [{
      id: 'getById',
      title: 'Book Meeting Room',
      iconClass: 'fa fa-shopping-cart fa-sm'
    }];
    vm.ui = {};
    vm.allmeetingrooms = {};
    vm.states = [
      'wams.wizard.checkAvailability',
      'wams.wizard.booking',
      'wams.wizard.invitation',
      'wams.wizard.invoice'
      // ,
      // 'wams.wizard.transaction'
    ];
    vm.slots = [];
    var assignedMeetingRoom = [];
    vm.searchedValues = [];
    vm.allBookings = [];
    vm.myInterval = 5000;
    vm.session = session;
    vm.pagingOptions = commonService.getPagingOptions();
    vm.pageChanged = pageChanged;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    vm.previous = previous;
    vm.minDate = vm.minDate ? null : new Date();
    vm.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[0];
    vm.startdateopen = startdateopen;
    vm.enddateopen = enddateopen;
    vm.searchDetails = {};
    vm.openAdvanceSearch = openAdvanceSearch;
    var slides = vm.slides = [];
    var images = ['http://www.thelongemonthotels.com/d/longemont/media/optimised_images/Club_Lounge_Meeting_Room.jpg',
      'https://www.alliancevirtualoffices.com/images/locations/3454_New-York-meeting-room-rent.jpg',
      'http://www3.hilton.com/resources/media/hi/en_US/img/shared/carousel/main/HH_meetingroom.jpg'
    ];
    vm.filterMRs = filterMRs;
    vm.reset = reset;
    //vm.getMeetingRoomInfoById = getMeetingRoomInfoById;
    vm.actionClicked = actionClicked;
    vm.bookMeetingRoom = bookMeetingRoom;
    vm.addUserMail = addUserMail;
    vm.closeAlert = closeAlert;
    vm.usermails = [];
    vm.usrmails = [];
    vm.finaltransaction = finaltransaction;

    activate();

    ////////////////
    var assignedMRs = [];
    vm.entity = [];

    function activate() {
      fetchAssignedMR();
      // fetchInfraTypeValues();
      // fetchTenantMeetingRooms();
      // getAllUsers();
      // addSlide();
      // fetchAllMRBookings({
      //   resourceType: 34
      // });
    }

    function fetchAssignedMR() {
      wamsServices.getEntity({
        key: 'tenantMeeting',
        request: {
          tenantId: parseInt(session.getTenantId())
        }
      }).then(function (response) {
        if (response && response.rows && response.rows.length > 0) {
          assignedMRs = _.pluck(response.rows, 'meetingroomId');
          fetchMRs();
        } else {
          console.log('No Meeting Room assigned');
          //proper notification should be showns . need implementation;
        }
      }, function (error) {
        console.log(error);
        //proper notification should be showns . need implementation;
      });
    }

    function fetchMRs() {
      wamsServices.getEntity({
        key: 'meetingRooms',
        request: {
          offset: 0,
          limit: 10
        }
      }).then(function (response) {
        if (response && response.rows && response.rows.length > 0) {
          _.forEach(response.rows, function (val) {
            if (assignedMRs.indexOf(val.id) > -1) {
              vm.entity.push(val);
            }
          });
          console.log(vm.entity);
        } else {
          console.log('No Meeting Room ');
          //proper notification should be showns . need implementation;
        }
      }, function (error) {
        console.log(error);
        //proper notification should be showns . need implementation;
      });
    }

    vm.fetchBookingDetails = viewBookingDetails;

    function viewBookingDetails(mrId) {
      console.log(mrId);
      var from = new Date(),
        to = new Date();

      wamsServices.getEntity({
        key: 'bookingSearch',
        request: {
          from: $filter('date')(from, 'yyyy-MM-dd'),
          to: $filter('date')(to, 'yyyy-MM-dd')
        }
      }).then(function (response) {
        if (response && response.rows && response.rows.length > 0) {
          generateDefaultSlots(response.rows);
        }
      }, function (error) {
        console.log(error);
      });
    }

    function processBookingData(entity) {
      if (entity.length > 0) {
        var temp = [];
        var rToMin = 0,
          rFromMin = 0,
          rFromHour = 0,
          rtoHour = 0;
        angular.forEach(entity, function (val) {
          rFromHour = $filter('date')(val.from, 'HH', 'UTC');
          rFromMin = $filter('date')(val.from, 'mm', 'UTC');
          rtoHour = $filter('date')(val.to, 'HH', 'UTC');
          rToMin = $filter('date')(val.to, 'mm', 'UTC');
          //console.log((rFromHour * 60) + ((rFromMin * 60) / 60));
          // console.log((rtoHour * 60) + ((rToMin * 60) / 60));
          for (var i = 0; i <= vm.labels.length; i++) {
            //console.log($filter('date')(vm.labels[i], 'yyyy-MM-dd'));
            if ($filter('date')(vm.labels[i], 'yyyy-MM-dd') === $filter('date')(val.from, 'yyyy-MM-dd')) {
              vm.index = i;
              // temp.push({
              //   start: ((rFromHour * 60) + ((rFromMin * 60) / 60)),
              //   stop: ((rtoHour * 60) + ((rToMin * 60) / 60)),
              //   day: i
              // });
            }
          }

        });
        // vm.slots = temp;
        vm.slots.push({
          start: ((rFromHour * 60) + ((rFromMin * 60) / 60)),
          stop: ((rtoHour * 60) + ((rToMin * 60) / 60)),
          day: vm.index
        });
      }
    }

    function generateDefaultSlots(entity) {
      // console.log(entity);
      var slot = [],
        from = 0,
        to = 0;
      for (var i = 480; i <= 1320; i = i + 60) {
        _.forEach(entity, function (val) {
          from = ($filter('date')(val.from, 'HH', 'UTC')) * 60 + (($filter('date')(val.from, 'mm', 'UTC') * 60) /
            60);
          to = ($filter('date')(val.to, 'HH', 'UTC')) * 60 + (($filter('date')(val.to, 'HH', 'UTC') * 60) / 60);
          if (i >= from && (i + 60) >= from) {
            vm.slots.push({
              from: Math.floor((i) / 60),
              frommin: i % 60 === 0 ? '00' : i % 60,
              to: Math.floor((i + 60) / 60),
              tomin: (i + 60) % 60 === 0 ? '00' : (i + 60) % 60
            });
          }

        });
      }

      // for (var i = 480; i < = 1320; i = i + 60) {
      // startHr = Math.floor((val.start) / 60);
      //   if (startHr < 10) {
      //     startHr = '0' + startHr;
      //   }
      //   endHr = Math.floor((val.stop) / 60);
      //   if (endHr < 10) {
      //     endHr = '0' + endHr;
      //   }
      //   startMin = val.start % 60 === 0 ? '00' : val.start % 60;
      //   endMin = val.stop % 60 === 0 ? '00' : val.stop % 60;
      //   frmdate = frmdate + 'T' + startHr + ':' + startMin + ':00' + '.00';
      //   todate = todate + 'T' + endHr + ':' + endMin + ':00' + '.00';
      // }

      // console.log(slot);
      // vm.slots = [];
      // vm.slots = slot;

      $state.go('wams.wizard.booking');
    }
    vm.selectedMRId = 0;

    vm.showListBottomSheet = showListBottomSheet;

    function showListBottomSheet(ev) {
      $scope.alert = '';
      $mdBottomSheet.show({
        templateUrl: 'wizard/bookingdetails.tpl.html',
        clickOutsideToClose: false
      });
    }

    function openAdvanceSearch() {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'meetingroom/view/openAdvanceSearch.tpl.html',
        controller: 'OpenAdvanceSearchCtrl as vm',
        size: 'lg',
        resolve: {
          data: function () {
            return vm.searchDetails;
          }
        }
      });
      modalInstance.result.then(function (data) {
        vm.searchDetails = data;
        fetchAllMR();
      }, function () {});
    }

    function getAllUsers() {
      var req = {};
      wamsServices.getEntity({
        request: req,
        key: 'users'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching users');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.allusers = response.rows;
        vm.ui.userInfo = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'name'));
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function fetchInfraTypeValues() {
      var i;
      vm.infraTypes = [];
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          masterId: 3
        }
      }).then(function (response) {
        if (!response) {
          notifier.error('Problem encountered while fetching meeting room');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          notifier.error('Unable to fetch data');
          return;
        }
        vm.infraTypes = response.rows;
        // console.log(JSON.stringify(vm.infraTypes));
      }, function (error) {
        notifier.error('Unable to fetch data : ' + error.message);
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

        assignedMeetingRoom = _.pluck(response.rows, 'meetingroomId');
        fetchAllMR();
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function fetchAllMR() {
      vm.entity = [];
      var req = {
        limit: 10,
        offset: 0
      };
      if (vm.searchDetails) {
        req = {
          buildingId: vm.searchDetails.buildingId,
          floorId: vm.searchDetails.floorId,
          floorPartId: vm.searchDetails.floorPartId,
          id: vm.searchDetails.id,
          capacity: vm.searchDetails.capacity,
          typeId: vm.searchDetails.typeId,
          status: vm.searchDetails.status
        };
      }
      wamsServices.getEntity({
        request: req,
        key: 'meetingRooms'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.allmeetingrooms = [];
        if (assignedMeetingRoom.length > 0) {
          _.forEach(response.rows, function (val) {
            if (assignedMeetingRoom.indexOf(val.id) > -1) {
              vm.entity.push(val);
            }
          });
          vm.count = vm.entity.length;
        } else {
          vm.entity = response.rows[0];
        }
        vm.pagingOptions.totalDataRecordCount = response.count;
        vm.pagingOptions.rowCount = 1;
        vm.pagingOptions.columnCount = 10;

      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function pageChanged(pageNo) {
      pageNo -= 1;

      wamsServices.getEntity({
        request: {
          limit: vm.maxSize,
          offset: pageNo * vm.maxSize
        },
        key: 'meetingRooms'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching premises');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.entity = response.rows;
        vm.allmeetingrooms = response.rows[0];
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

    function addSlide() {
      var i;
      for (i = 0; i < images.length; i++) {
        vm.slides.push({
          image: images[i],
          text: ['More', 'Extra', 'Lots of', 'Surplus'][vm.slides.length % 4] + ' ' + ['Cats', 'Kittys',
            'Felines',
            'Cutes'
          ][vm.slides.length % 4]
        });
      }
    }

    function reset() {
      fetchAllMR();
    }

    function filterMRs() {
      var searchRequest = {},
        bookingSearch = {};
      if (vm.ui.buiding !== null) {
        searchRequest.buildingId = vm.ui.buildingId;
      }
      if (vm.ui.floorId !== null) {
        searchRequest.floorId = vm.ui.floorId;
      }
      if (vm.ui.startdate !== null) {
        bookingSearch.from = vm.ui.startdate;
        if (vm.ui.startdate && vm.ui.fromtime) {
          var tempFrom = $filter('date')(vm.ui.fromtime, 'HH:mm:ss')
          var tempdateField = $filter('date')(vm.ui.startdate, 'yyyy-MM-dd') + 'T' + tempFrom.substring(':',
            tempFrom.length - 3) + ':00';
          //console.log(tempdateField);
        }
      }
      if (vm.ui.enddate !== null) {
        bookingSearch.to = vm.ui.enddate;
        if (vm.ui.enddate && vm.ui.totime) {

          var tempTo = $filter('date')(vm.ui.totime, 'HH:mm:ss')
          var tempdateTField = $filter('date')(vm.ui.enddate, 'yyyy-MM-dd') + 'T' + tempTo.substring(':',
            tempTo.length - 3) + ':00';
        }
      }
      searchmeetingRooms(searchRequest, bookingSearch);
    }

    function searchmeetingRooms(req, bSearch) {
      wamsServices.getEntity({
        key: 'meetingRooms',
        request: req
      }).then(function (response) {
        if (!response) {
          notifier.error('Problem encountered while fetching meeting rooms');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          return;
        }
        _.forEach(response.rows, function (val) {
          vm.searchedValues.push(val.id);
        });
        vm.entity = response.rows;
        vm.searchedValues = _.uniq(vm.searchedValues);
        vm.searchedEntity = response.rows;
        if (bSearch.hasOwnProperty('from')) {
          exclusivelist();
          fetchAllMRBookings({
            resourceType: 34,
            from: $filter('date')(vm.ui.startdate, 'yyyy-MM-dd'),
            to: $filter('date')(vm.ui.enddate, 'yyyy-MM-dd')
          });
        } else {
          exclusivelist();
        }
        exclusivelist();
      }, function (error) {
        notifier.error('Unable to fetch data : ' + error.message);
      });
    }

    function fetchAllMRBookings(req) {
      wamsServices.getEntity({
        key: 'bookings',
        request: req
      }).then(function (response) {
        if (!response) {
          notifier.error('Problem encountered while fetching bookings');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          notifier.error('Unable to fetch data');
          return;
        }
        _.forEach(response.rows, function (val) {
          vm.allBookings.push(val.resourceId);
        });
        vm.allBookings = _.uniq(vm.allBookings);
        if (req.hasOwnProperty('from')) {
          exclusivelist();
        }
      }, function (error) {
        notifier.error('Unable to fetch data : ' + error.message);
      });
    }

    function exclusivelist() {
      var notbooked = _.difference(vm.searchedValues, vm.allBookings),
        i, temp = [];
      if (notbooked.length > 0) {
        for (i = 0; i < notbooked.length; i = i + 1) {
          _.forEach(vm.searchedEntity, function (val) {
            if (val.id === notbooked[i]) {
              temp.push(val);
            }
          });
          vm.entity = temp;
        }

      }
    }

    // function getMeetingRoomInfoById(mrId) {
    //   vm.ui.meetingRoomId = mrId;
    //   vm.tday = new Date();
    //   if (vm.ui.startdate && vm.ui.enddate) {
    //     differenceInDays(vm.ui.startdate, vm.ui.enddate);
    //   } else {
    //     createLables(vm.tday, 7);
    //   }
    //   fetchMRInfo();
    //   fetchBookingDetails();
    //   fetchInfraDetails(mrId);
    //   fetchCostConfig();
    //   fetchMRAccountInfo();
    // }

    function actionClicked(actionName, entity) {
      if (actionName) {
        switch (actionName) {
        case 'getById':
          vm.tday = new Date();
          if (vm.ui.startdate && vm.ui.enddate) {
            differenceInDays(vm.ui.startdate, vm.ui.enddate);
          } else {
            createLables(vm.tday, 7);
          }
          fetchMRInfo();
          fetchBookingDetails(entity.id);
          fetchInfraDetails(entity.id);
          fetchCostConfig();
          fetchMRAccountInfo();
          break;
        case 'viewInfra':
          fetchInfraDetails(entity.id);
        }
      }
    }

    function differenceInDays(fromdate, todate) {
      vm.tdays = [];
      var firstdate = $filter('date')(fromdate, 'dd/MM/yyyy'),
        seconddate = $filter('date')(todate, 'dd/MM/yyyy'),
        dt1 = firstdate.split('/'),
        dt2 = seconddate.split('/'),
        one = new Date(dt1[2], dt1[1] - 1, dt1[0]),
        two = new Date(dt2[2], dt2[1] - 1, dt2[0]),
        millisecondsPerDay = 1000 * 60 * 60 * 24,
        millisBetween = two.getTime() - one.getTime();
      vm.days = millisBetween / millisecondsPerDay;
      vm.totaldays = Math.floor(vm.days);
      if (vm.totaldays > 0) {
        createLables(fromdate, vm.totaldays);
      } else {
        createLables(fromdate, 0);
      }
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
      //  //console.log(vm.labels);
    }

    function fetchMRInfo() {
      wamsServices.getEntity({
        request: {
          id: vm.ui.meetingRoomId
        },
        key: 'meetingRooms'
      }).
      then(function (response) {
          if (!response || response.rows.length === 0) {
            notifier.error('Problem encountered while fetching meeting-room information');
            return;
          }
          vm.ui.mrInfo = response.rows[0];
          $state.go('wams.wizard.booking');
        },
        function (error) {
          notifier.error(error.message);
        });
    }

    function fetchInfraDetails(mrId) {
      var i;
      vm.infraDetails = [];
      if (mrId) {
        vm.ui.meetingRoomId = mrId;
      }
      wamsServices.getEntity({
        request: {
          meetingRoomId: vm.ui.meetingRoomId
        },
        key: 'getMeetingInfra'
      }).then(function (response) {
          if (vm.infraTypes.length > 0) {
            _.forEach(vm.infraTypes, function (val) {
              vm.infraDetails.push({
                id: val.id,
                name: val.value
              });
            });
            for (i = 0; i < response.rows.length; i = i + 1) {
              _.forEach(vm.infraDetails, function (val) {
                if (val.name == response.rows[i].name) {
                  val.isSelected = true;
                }
              });
            }
          }
          // if (mrId) {
          //   return viewInfraAvailable();
          // }
        },
        function (error) {
          notifier.error(error.message);
        });
    }

    function fetchMRAccountInfo() {
      wamsServices.getEntity({
        request: {
          holderId: vm.ui.meetingRoomId,
          holderType: 14
        },
        key: 'accounts'
      }).
      then(function (response) {
          if (!response || response.rows.length === 0) {
            return;
          }
          vm.ui.mrAccountInf = response.rows[0];
        },
        function (error) {
          notifier.error(error.message);
        });
    }

    function fetchCostConfig() {
      wamsServices.getEntity({
        request: {
          resourceId: vm.ui.meetingRoomId
        },
        key: 'costconfigurations'
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching meeting-room information');
          return;
        }
        vm.costConfig = response.rows[0];
        calculateConfigData(vm.costConfig.factor);
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function calculateConfigData(entityId) {
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          id: entityId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          return;
        }
        vm.unit = response.rows[0].value;
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function fetchBookingDetails(mrId) {
      wamsServices.getEntity({
        key: 'bookings',
        request: {
          resourceId: mrId
        }
      }).then(function (response) {
        if (response.rows.length > 0) {
          processBookingData(response.rows);
        }
      }, function (error) {
        notifier.error(error.message);
      });
    }



    $scope.$watch('vm.slots', function (newValue) {
      calculateBookingCost(newValue);
      getSlotTimeDurations(newValue);
    }, true);

    function getSlotTimeDurations(entity) {
      var startHr, endHr, startMin, endMin;
      _.forEach(entity, function (val) {
        if (!_.has('val', '$$hashKey')) {
          startHr = Math.floor((val.start) / 60);
          if (startHr < 10) {
            startHr = '0' + startHr;
          }
          endHr = Math.floor((val.stop) / 60);
          if (endHr < 10) {
            endHr = '0' + endHr;
          }
          startMin = val.start % 60 === 0 ? '00' : val.start % 60;
          endMin = val.stop % 60 === 0 ? '00' : val.stop % 60;
          vm.slotToSelected = startHr + ':' + startMin + 'to' + endHr + ':' + endMin;
          // console.log(JSON.stringify(vm.slotToSelected));
        }
      });
    }

    function calculateBookingCost(entity) {
      vm.totalCost = 0;
      _.forEach(entity, function (val) {
        if (!_.has('val', 'isbooked')) {
          vm.totalCost = parseInt(vm.totalCost + (val.stop - val.start) * (0 / 60));
        }
      });
    }

    function bookMeetingRoom() {
      vm.bookingInfo = [];
      var frmdate, todate, startHr, endHr, startMin, endMin;
      if (vm.slots.length === 0) {
        notifier.error('Please select booking slot');
        return;
      }
      console.log(JSON.stringify(vm.slots));
      _.forEach(vm.slots, function (val) {
        if (angular.isDefined(val.day)) {
          frmdate = $filter('date')(vm.labels[val.day], 'yyyy-MM-dd');
          todate = $filter('date')(vm.labels[val.day], 'yyyy-MM-dd');
          startHr = Math.floor((val.start) / 60);
          if (startHr < 10) {
            startHr = '0' + startHr;
          }
          endHr = Math.floor((val.stop) / 60);
          if (endHr < 10) {
            endHr = '0' + endHr;
          }
          startMin = val.start % 60 === 0 ? '00' : val.start % 60;
          endMin = val.stop % 60 === 0 ? '00' : val.stop % 60;
          frmdate = frmdate + 'T' + startHr + ':' + startMin + ':00' + '.00';
          todate = todate + 'T' + endHr + ':' + endMin + ':00' + '.00';
          vm.bookingInfo.push({
            from: frmdate,
            to: todate
          });
        }

      });
      console.log(JSON.stringify(vm.bookingInfo));
      $state.go(vm.states[2]);
    }

    function addUserMail() {
      vm.usermails.push(vm.slotdetails.usr);
      vm.usrmails = _.pluck(vm.usermails, 'email');
      vm.slotdetails.usr = '';
      return vm.usrmails;
    }

    function closeAlert(index) {
      vm.usrmails.splice(index, 1);
      var userremovedata = [];
      userremovedata = vm.usermails.splice(index, 1);
    }

    function finaltransaction() {
      vm.userEmailids = [];
      vm.userEmailids = _.pluck(vm.usermails, 'id');
      var bookingDetails = {
        resourceId: vm.ui.meetingRoomId,
        resourceType: 34,
        from: vm.bookingInfo[vm.bookingInfo.length - 1].from, // '2015-06-15T11:15:26.00',
        to: vm.bookingInfo[vm.bookingInfo.length - 1].to, //2015-08-15T13:15:26.00',
        bookedForWhom: parseInt(session.getUserId()),
        userId: vm.userEmailids,
        reason: vm.slotdetails.subject
      };
      console.log(JSON.stringify(bookingDetails));
      wamsServices.saveEntity({
        key: 'bookings',
        request: bookingDetails
      }).then(function (response) {
        vm.logging = true;
        if (response) {
          if (_.has(response, 'statusCode')) {
            notifier.error('Problem encountered while saving data :' + response.message);
            return;
          }
          notifier.success('Booking done successfully');
          //vm.order = response;
          createInvoice(response);
        }
      }, function (error) {
        notifier.error('Problem encountered while saving data :' + error.message);
      });

    }
    vm.orderDetails = {};

    function createInvoice(bookingOrder) {
      vm.orderDetails.bookingInfo = bookingOrder;
      vm.orderDetails.MRInfo = _.filter(vm.entity, {
        id: bookingOrder.resourceId
      })[0];
      $state.go(vm.states[3]);
    }
    /***************for date picker********************/
    function today() {
      vm.dt = new Date();
      vm.minDate = new Date();
    }

    function clear() {
      vm.dt = null;
    }

    function startdateopen($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.startdateopened = true;
    }
    vm.getEndDate = getEndDate;

    function getEndDate() {
      if (!vm.ui.enddate || vm.ui.startdate) {
        vm.ui.enddate = vm.ui.startdate;
      }
    }

    function enddateopen($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.enddateopened = true;
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
      if (!vm.ui.totime || vm.ui.fromtime) {
        var d = vm.ui.fromtime;
        vm.ui.totime = d.setHours(d.getHours() + 1);
      }
    }

    function previous(state) {
      $state.go(vm.states[state]);
    }
  }
})();
