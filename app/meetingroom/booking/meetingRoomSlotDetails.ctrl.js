(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('MRoomSlotCtrl', MRoomSlotCtrl);

  /* @ngInject */
  function MRoomSlotCtrl($state, $stateParams, meetingRoomService, toaster, bookingService, $filter, _, fetchEntity,
    $scope, $modal) {
    var vm = this;
    vm.title = 'Controller';
    vm.page = {
      title: 'Meeting Room Booking'
    };
    vm.slotdetails = {};
    vm.slotdetails.mailflag = false;
    vm.bookMeetingRoom = bookMeetingRoom;
    vm.addUserMail = addUserMail;
    vm.addOptinalUserMail = addOptinalUserMail;
    vm.closeAlert = closeAlert;
    vm.usermails = [];
    vm.usrmails = [];
    vm.useridsofmails = [];
    vm.optinalusermails = [];
    vm.optinalmails = [];
    vm.slots = [];
    vm.getSlotDuration = getSlotDuration;
    vm.tday = '';
    vm.getSlotDetails = getSlotDetails;
    vm.totalCost = 0;
    activate();

    ////////////////

    $scope.$watch('vm.slots', function (newValue) {
      calculateBookingCost(newValue);
    }, true);

    function calculateBookingCost(entity) {
      vm.totalCost = 0;
      _.forEach(entity, function (val) {
        if (!_.has('val', 'isbooked')) {
          vm.totalCost = vm.totalCost + (val.stop - val.start) * (10 / 60);
        }
      });
    }

    function fetchResouceCostConfig(resourceId) {
      fetchEntity.getByValues({
        request: {
          id: resourceId
        },
        key: 'costconfigurations',
        value: 'resourceId'
      }).then(function (response) {
        vm.costConfig = response.rows[0];
        calculateConfigData(vm.costConfig.factor);
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

    function activate() {
      // vm.slots.push({
      //   start: 440,
      //   stop: 780,
      //   day: 1
      // });
      if ($stateParams.id) {
        getmeetingRoomById($stateParams.id[0]);
        fetchInfraDetails($stateParams.id[0]);
        //Fetch Meeting Room Cost Configuration
        fetchResouceCostConfig($stateParams.id[0]);
      }
      getTenantId();
      getUserId();
      console.log('From :' + $stateParams.from);
      console.log('\n From :' + $stateParams.to);
      if ($stateParams.from && $stateParams.to) {
        if (differenceInDays($stateParams.from[0], $stateParams.to[0]) >= 7) {
          createdateLabel($stateParams.from[0], vm.totaldays);
        } else {
          createdateLabel($stateParams.from[0], vm.totaldays);
        }

      } else {
        vm.tday = new Date();
        createdateLabel(vm.tday, 7);
      }
      vm.slotdetails.slotduration = 60;
      getSlotDuration(vm.slotdetails.slotduration);
      getBookingByMrId();
    }


    function createdateLabel(labelFrom, labelTo) {
      vm.labels = [];
      var temp = [];
      vm.tday = labelFrom;
      for (var i = 0; i <= labelTo; i++) {
        var nextDay = new Date(vm.tday);
        nextDay.setDate(vm.tday.getDate() + i);
        temp.push(nextDay);
      }
      vm.labels = temp;
      console.log(vm.labels);
    }

    function getTenantId() {
      // toasters.getCompanyId().then(function (response) {
      //   vm.tenantId = response;
      //   getAllUsers(vm.tenantId);
      // });
    }

    function getUserId() {
      // return toasters.getUserId().then(function (response) {
      //   return vm.userId = response;
      // });
    }

    function getAllUsers(tenantId) {
      // meetingRoomService.getAllTenantUsers(tenantId).then(function (response) {
      //   vm.allusers = response;
      // });
    }

    function addUserMail() {
      vm.usermails.push(vm.slotdetails.usr);
      vm.usrmails = _.pluck(vm.usermails, 'email');
      vm.slotdetails.usr = '';
      return vm.usrmails;
    }

    function addOptinalUserMail() {
      vm.optinalusermails.push(vm.slotdetails.optionalemail);
      vm.optinalmails = _.pluck(vm.optinalusermails, 'email');
      vm.slotdetails.optionalemail = '';
      return vm.optinalmails;
    }

    function closeAlert(index) {
      vm.usrmails.splice(index, 1);
      var userremovedata = [];
      userremovedata = vm.usermails.splice(index, 1);
    }


    function bookMeetingRoom() {
      //filter selected slots
      var slotselecteddetails = [];
      angular.forEach(vm.slots, function (data) {
        var selectedstarttimemin, selectedendtimemin;
        if (!_.has(data, 'isBooked')) {
          var selecteddate = $filter('date')(vm.labels[data.day], 'yyyy-MM-dd');
          var selectedstarttimehours = Math.floor((data.start) / 60);
          var selectedendtimehours = Math.floor((data.stop) / 60);
          if ((data.start) % 60 === 0) {
            selectedstarttimemin = '00';
          } else {
            selectedstarttimemin = (data.start) % 60
          }
          if ((data.stop) % 60 === 0) {
            selectedendtimemin = '00';
          } else {
            selectedendtimemin = (data.stop) % 60
          }
          vm.startbookdate = selecteddate + 'T' + selectedstarttimehours + ':' + selectedstarttimemin + ':00';
          vm.endbookdate = selecteddate + 'T' + selectedendtimehours + ':' + selectedendtimemin + ':00'

          vm.selectedslotdetails = {
            bookedForWhom: 1,
            resourceType: 'meetingroom',
            resourceId: 5,
            from: vm.startbookdate,
            to: vm.endbookdate,
            reason: vm.slotdetails.subject
          }
          console.log(vm.selectedslotdetails);
        }
        bookingService.makeBooking(vm.selectedslotdetails).then(function (response) {
          if (!response.msg) {
            toaster.success({
              title: '',
              body: 'Booking is Done'
            });
            vm.slotDetails = {};
            var modalInstance = $modal.open({
              animation: vm.animationsEnabled,
              templateUrl: 'meetingroom/booking/cardViewOfBooking.html',
              controller: 'bookingCardViewCtrl as vm',
              resolve: {
                bookingFinalInfo: function () {
                  return response;
                }
              }
            });
            modalInstance.result.then(function () {

            }, function () {
              console.log('Modal dismissed at: ' + new Date());
            });
          } else {
            toaster.error({
              title: '',
              body: response.msg
            });
          }
        });
      });
    }


    function getSlotDuration(slotdurationtime) {
      vm.slottimmings = [];
      var a;
      var hours = slotdurationtime / 60;
      for (a = 9; a + hours <= 19; a++) {
        vm.slottimmings.push({
          from: a,
          to: a + hours,
          isBooked: false,
          isSelectedSlot: false
        });
      }
      getBookingByMrId();
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
      return vm.totaldays;
      // var myDate = fromdate;
      // for (var i = 0; i <= vm.totaldays; i++) {
      //   var nextDay = new Date(myDate);
      //   nextDay.setDate(myDate.getDate() + i);
      //   vm.tdays.push(nextDay);
      // }
    }

    function getmeetingRoomById(mrId) {
      meetingRoomService.getMeetingRoomById(mrId).then(function (response) {
          vm.mrObject = response[0];
        },
        function (error) {
          console.log(error);
        });
    }

    function fetchInfraDetails(mrId) {
      vm.infraDetails = [];
      meetingRoomService.getMeetingRoomInfra(mrId).then(function (response) {
        angular.forEach(response, function (val) {
          vm.infraDetails.push({
            id: val.id,
            name: val.name
          });
        });
      }, function (response) {
        //  console.log(response);
      });
    }

    function getSlotDetails(ul, ll, date) {
      for (var i = 0; i < vm.slottimmings.length; i++) {
        if (vm.slottimmings[i].from === ul && vm.slottimmings[i].to === ll) {
          vm.slottimmings[i].isSelectedSlot = true;
        }
      }
      var slotfromdate = $filter('date')(date, 'yyyy-MM-dd');
      var slotFrom = slotfromdate + 'T' + ul + ':00:00';
      var slotTo = slotfromdate + 'T' + ll + ':00:00';
      vm.slotDetailsData = {
        bookedForWhom: vm.userId,
        resourceType: 'meetingroom',
        resourceId: $stateParams.id[0],
        from: slotFrom,
        to: slotTo
      };
      vm.Slotdetails.push(vm.slotDetailsData);
      if (vm.Slotdetails.length === 1) {
        vm.slotDetails = {
          bookedForWhom: vm.userId,
          resourceType: 'meetingroom',
          resourceId: $stateParams.id[0],
          from: slotFrom,
          to: slotTo
        };
        // console.log(JSON.stringify(vm.slotDetails));
        return vm.slotDetails;
      } else {
        vm.slotDetails = {
          bookedForWhom: vm.userId,
          resourceType: 'meetingroom',
          resourceId: $stateParams.id[0],
          from: vm.Slotdetails[0].from,
          to: vm.Slotdetails[vm.Slotdetails.length - 1].to
        };
        return vm.slotDetails;
      }
    }

    function processBookingData(entity) {
      var rToMin = 0,
        rFromMin = 0,
        rFromHour = 0,
        rtoHour = 0;
      angular.forEach(entity, function (val) {
        rFromHour = $filter('date')(val.from, 'HH', 'UTC');
        rFromMin = $filter('date')(val.from, 'mm', 'UTC');
        rtoHour = $filter('date')(val.to, 'HH', 'UTC');
        rToMin = $filter('date')(val.to, 'mm', 'UTC');
        console.log((rFromHour * 60) + ((rFromMin * 60) / 60));
        console.log((rtoHour * 60) + ((rToMin * 60) / 60));
        for (var i = 0; i <= vm.labels.length; i++) {
          console.log($filter('date')(vm.labels[i], 'yyyy-MM-dd'));
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
      console.log(JSON.stringify(vm.slots));
    }


    function getBookingByMrId() {
      //vm.slots = [];
      var x, y;
      bookingService.getBookingByUserId({
        resourceId: $stateParams.id[0]
      }).then(function (response) {
        console.log(JSON.stringify(response.rows));
        processBookingData(response.rows);
        // x = vm.slottimmings.length;
        // if (vm.tdays) {
        //   y = vm.tdays.length;
        // } else {
        //   y = 1;
        // }

        // for (var j = 0; j < y; j++) {
        //   var newDateee = $filter('date')(vm.tday, 'yyyy-MM-dd');
        //   var datecompare = (vm.tdays) ? ($filter('date')(vm.tdays[j], 'yyyy-MM-dd')) : (newDateee);
        //   var rangeFrom = 0;
        //   var rangeTo = 0;
        //   angular.forEach(response.rows, function (data) {
        //     rangeFrom = $filter('date')(data.from, 'HH', 'UTC');
        //     rangeTo = $filter('date')(data.to, 'HH', 'UTC');
        //     rangeFrom = rangeFrom * 60;
        //     rangeTo = rangeTo * 60;
        //     vm.slots.push({
        //       start: 120,
        //       stop: 660,
        //       day: 0
        //     });
        //     // if (datecompare == $filter('date')(data.from, 'yyyy-MM-dd')) {
        //     //   for (var i = 0; i < x; i++) {
        //     //     if (vm.slottimmings[i].from == rangeFrom && vm.slottimmings[i].to == rangeTo) {
        //     //       vm.slottimmings[i].isBooked = true;
        //     //     }
        //     //   }
        //     // }
        //   });
        //   console.log(vm.slots);
        // }

      });
    }
  }
})();
