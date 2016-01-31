(function () {
  'use strict';

  angular
    .module('wams.newbooking')
    .controller('NewBookingCtrl', NewBookingCtrl);

  /* @ngInject */
  function NewBookingCtrl(wamsServices, session, _, $filter, $timeout, $interval, $state, $mdToast, $document) {
    /*jshint validthis: true */
    var vm = this,
      assignedMRs = [],
      catalogMasterType = {
        InfraType: 3,
        MRType: 2
      };
    vm.duration = 30;
    vm.entity = [];
    vm.isOpen = false;
    vm.search = {};
    vm.slots = [];
    vm.selectedMR = null;
    vm.selectedSlot = {};
    vm.selectedEntity = {};
    vm.tabIndex = 0;
    vm.title = 'Ctrl';
    vm.myInterval = 3000;
    vm.determinateValue = 30;
    vm.slides = [{
      image: 'http://lorempixel.com/400/200/'
    }, {
      image: 'http://lorempixel.com/400/200/food'
    }, {
      image: 'http://lorempixel.com/400/200/sports'
    }, {
      image: 'http://lorempixel.com/400/200/people'
    }];
    // vm.book = book();
    vm.bookMeetingRoom = bookMeetingRoom;
    vm.createInvoice = createInvoice;
    vm.fetchBookingDetails = fetchBookingDetails;
    vm.fetchAllUsers = fetchAllUsers;
    vm.mrSearch = mrSearch;
    vm.back = back;
    vm.next = next;
    vm.finalbooking = finalbooking;
    vm.isSearched = false;
    vm.dateSearch = false;
    vm.currentDate = new Date();
    vm.infras = {};
    vm.infraList = [];
    vm.selectedInfra = null;
    vm.mrTypes = [];
    vm.selectedMRTypes = null;
    vm.clearSearch = clearSearch;
    vm.checkforBooking = checkforBooking;
    vm.minDate = new Date(
      vm.currentDate.getFullYear(),
      vm.currentDate.getMonth(),
      vm.currentDate.getDate());
    activate();

    function activate() {
      fetchAllMRInfra();
      fetchAllMRTypes();
      fetchAssignedMR();
      fetchAllUsers();
    }

    function checkforBooking(mrId) {
      console.log(mrId);
      vm.selectedMR = mrId;
      if (vm.dateSearch) {

      } else {

        var selectedmrDetails = _.find(vm.entity, function (o) {
          return o.id === mrId;
        });
        vm.selectedEntity = {
          mrDetails: selectedmrDetails
        };
        // var selectedmrDetails = vm.entity[vm.selectedMR];
        console.log(vm.selectedEntity);
        vm.tabIndex = vm.tabIndex + 1;
        // vm.selectedSlot = vm.slots[slotId];
        // vm.selectedEntity = {
        //   slotDetails: vm.slots[slotId],
        //   mrDetails: vm.entity[vm.selectedMR]
        // };
      }
    }


    function validateResponse(res) {
      if (res && res.rows && res.rows.length > 0) {
        return true;
      }
      return false;
    }

    function fetchAllMRTypes() {
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          masterId: catalogMasterType.MRType
        }
      }).then(function (response) {
        if (validateResponse(response)) {
          vm.mrTypes = response.rows;
        }
      });
    }

    function fetchAllMRInfra() {
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          masterId: catalogMasterType.InfraType
        }
      }).then(function (response) {
        if (validateResponse(response)) {
          vm.infras = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'value'));
          vm.infraList = response.rows;
        }
      });
    }

    function back() {
      vm.tabIndex = vm.tabIndex - 1;
    }

    function next() {
      vm.tabIndex = vm.tabIndex + 1;
      if (vm.tabIndex === 2) {
        createInvoice();
      }
    }

    function validateSearch() {
      if (vm.selectedInfra === null && vm.selectedMRTypes === null && !angular.isDefined(vm.search.time) && !angular.isDefined(
          vm.search.fromDate) && !angular.isDefined(vm.search.duration)) {
        return false;
      }
      return true;
    }

    function clearSearch() {
      vm.dateSearch = false;
      vm.entity = [];
      vm.selectedInfra = null;
      vm.selectedMRTypes = null;
      vm.search = {};
      fetchAllMRInfra();
      fetchAllMRTypes();
      fetchAssignedMR();
      vm.isSearchSuccess = true;
    }

    vm.isSearchSuccess = true;

    function mrSearch() {

      var searchReq = {
          resourceType: 34,
          tenantId: parseInt(session.getTenantId())
        },
        fromhr, tohr,
        tomin, temp;
      if (!validateSearch()) {
        return;
      }
      if (vm.selectedInfra !== null) {
        searchReq.infras = _.map(vm.selectedInfra, 'value');
        // getSelectedInfaDetails(searchReq.infra);
      }

      if (vm.selectedMRTypes !== null) {
        searchReq.mrTypes = vm.selectedMRTypes.id;
        // getSelectedmrTypes(vm.selectedMRTypes.id);
      }

      //From Time configuration
      if (angular.isDefined(vm.search.fromDate)) {
        vm.dateSearch = true;
        fromhr = vm.search.time < 10 ? '0' + vm.search.time : vm.search.time;
        searchReq.from = $filter('date')(vm.search.fromDate, 'yyyy-MM-dd') + 'T' + fromhr + ':00:00';


        // //To Time Config...
        temp = vm.search.duration >= 60 ? parseInt(vm.search.time + (vm.search.duration / 60)) : vm.search.time;
        tohr = temp < 10 ? '0' + temp : temp;
        tomin = (vm.search.duration) % 60 === 0 ? '00' : vm.search.duration % 60;
        searchReq.to = $filter('date')(vm.search.fromDate, 'yyyy-MM-dd') + 'T' + tohr + ':' + tomin + ':00';
      }
      // else {
      //   $mdToast.show(
      //     $mdToast.simple()
      //     .textContent('Please select food items!')
      //     .hideDelay(3000)
      //   );
      // }
      //  console.log(searchReq);

      wamsServices.getEntity({
        key: 'infraSearch',
        request: searchReq
      }).then(function (response) {
        if (response) {
          if (response.infraMRids.length === 0 && response.typesMRids.length === 0) {
            vm.searchMRIds = _.difference(response.tenantAssigned, response.bookingArray);
          } else {
            vm.searchMRIds = _.intersection(_.difference(response.tenantAssigned, response.bookingArray),
              response.infraMRids, response.typesMRids);
          }
          if (vm.searchMRIds.length === 0) {
            vm.isSearchSuccess = false;
          } else {
            fetchSearchedMRs();
          }
        }

      }, function (error) {
        console.log(error);
        //proper notification should be showns . need implementation;
      });

    }
    var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

    function fetchSearchedMRs() {
      vm.entity = [];
      assignedMRs = vm.searchMRIds;
      fetchMRs();
    }


    vm.users = null;

    function fetchAllUsers() {
      var temp = [];
      wamsServices.getEntity({
        key: 'users',
        request: {
          tenantId: parseInt(session.getTenantId())
        }
      }).then(function (response) {
        temp = response.rows;
      });

      return $timeout(function () {
        vm.users = vm.users || temp;
      }, 650);
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
          console.log(assignedMRs);
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
          limit: 100
        }
      }).then(function (response) {
        if (response && response.rows && response.rows.length > 0) {
          _.forEach(response.rows, function (val) {
            if (assignedMRs.indexOf(val.id) > -1) {
              val.isBook = vm.isSearched === true ? true : false;
              //val.isBook = true;
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

    function bookSearchedMR(mrId) {
      // vm.selectedMR = selectedIndex;
      // fromhr = vm.search.time < 10 ? '0' + vm.search.time : vm.search.time;
      // searchReq.from = $filter('date')(vm.search.fromDate, 'yyyy-MM-dd') + 'T' + fromhr + ':00:00';


      // // //To Time Config...
      // temp = vm.search.duration >= 60 ? parseInt(vm.search.time + (vm.search.duration / 60)) : vm.search.time;
      // tohr = temp < 10 ? '0' + temp : temp;
      // tomin = (vm.search.duration) % 60 === 0 ? '00' : vm.search.duration % 60;
      // searchReq.to = $filter('date')(vm.search.fromDate, 'yyyy-MM-dd') + 'T' + tohr + ':' + tomin + ':00';
    }

    function fetchBookingDetails(mrId, selectedIndex) {
      vm.selectedMR = selectedIndex;
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
        } else {
          generateAllSlots();
        }
      }, function (error) {
        console.log(error);
      });
    }

    function generateAllSlots() {
      var from = 0,
        to = 0,
        i;
      vm.slots = [];
      for (i = 480; i <= 1320; i = i + 60) {
        // _.forEach(entity, function (val) {
        // from = ($filter('date')(val.from, 'HH', 'UTC')) * 60 + (($filter('date')(val.from, 'mm', 'UTC') * 60) /
        //   60);
        // to = ($filter('date')(val.to, 'HH', 'UTC')) * 60 + (($filter('date')(val.to, 'HH', 'UTC') * 60) / 60);
        // if (i >= from && (i + 60) >= from) {
        vm.slots.push({
          from: Math.floor((i) / 60),
          frommin: i % 60 === 0 ? '00' : i % 60,
          to: Math.floor((i + 60) / 60),
          tomin: (i + 60) % 60 === 0 ? '00' : (i + 60) % 60
        });
        // }
        // });
      }
    }

    function generateDefaultSlots(entity) {
      // console.log(entity);
      var from = 0,
        to = 0,
        i;
      vm.slots = [];
      for (i = 480; i <= 1320; i = i + 60) {
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

      //console.log(vm.slots);
    }

    function bookMeetingRoom(slotId) {
      vm.tabIndex = vm.tabIndex + 1;
      var selectedmrDetails = vm.entity[vm.selectedMR];
      vm.selectedSlot = vm.slots[slotId];
      vm.selectedEntity = {
        slotDetails: vm.slots[slotId],
        mrDetails: vm.entity[vm.selectedMR]
      };

    }
    vm.select = {};

    function createInvoice() {
      // if (vm.dateSearch) {

      // } else {
      //   vm.invoice = {};
      //   vm.invoice.fromDate = $filter('date')(vm.select.fromDate, 'yyyy-MM-dd') + 'T' + vm.select.time + ':' + vm.select
      //     .min + ':00';
      //   vm.invoice.duration = vm.duration + ' min'
      //   console.log(vm.invoice);
      // }
      //console.log(session.getUser());
      vm.tabIndex = vm.tabIndex + 1;
      vm.invoice = {};
      vm.invoice.fromDate = new Date();
      vm.invoice.duration = vm.duration + ' min';
      vm.invoice.amount = 0;
      vm.userInfo = {
        name: session.getUserName(),
        email: session.getUserEmail(),
        info: session.getUserInfo()
      };
      vm.invoice.slot = vm.selectedSlot;
      console.log(vm.invoice.slot);
    }

    function finalbooking() {
      vm.userEmailids = [];
      vm.userEmailids = _.pluck(vm.usermails, 'id');
      var bookingDetails = {
        resourceId: vm.entity[vm.selectedMR].id,
        resourceType: 34,
        from: $filter('date')(vm.invoice.fromDate, 'yyyy-MM-dd') + 'T' + vm.invoice.slot.from + ':' + vm.invoice.slot
          .frommin +
          ':00', //vm.bookingInfo[vm.bookingInfo.length - 1].from, // '2015-06-15T11:15:26.00',
        to: $filter('date')(vm.invoice.fromDate, 'yyyy-MM-dd') + 'T' + vm.invoice.slot.to + ':' + vm.invoice.slot
          .tomin +
          ':00', //vm.bookingInfo[vm.bookingInfo.length - 1].to, //2015-08-15T13:15:26.00',
        bookedForWhom: parseInt(session.getUserId()),
        userId: vm.userEmailids,
        reason: 'Test The Booking Using New UI'
      };
      console.log(JSON.stringify(bookingDetails));
      wamsServices.saveEntity({
        key: 'bookings',
        request: bookingDetails
      }).then(function (response) {
        vm.logging = true;
        if (response) {
          if (_.has(response, 'statusCode')) {
            console.log('Problem encountered while saving data :' + response.message);
            return;
          }
          $state.go('wams.mybookings');
          //notifier.success('Booking done successfully');
          //vm.order = response;
          //createInvoice(response);
        }
      }, function (error) {
        console.log('Problem encountered while saving data :' + error.message);
      });
    }

  }
})();
