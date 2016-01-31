(function () {
  'use strict';

  angular
    .module('wams.gym')
    .controller('BookingGymCtrl', BookingGymCtrl);

  /* @ngInject */
  function BookingGymCtrl($scope, wamsServices, notifier, session, $state, $filter, _, commonService) {
    var vm = this;
    vm.title = 'Booking Gym';
    vm.ui = {};
    vm.isDeleteDisabled = true;
    vm.isEditDisabled = true;
    vm.gymslots = [];
    vm.myInterval = 5000;
    vm.session = session;
    vm.pagingOptions = commonService.getPagingOptions();
    vm.pageChanged = pageChanged;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    vm.states = [
      'wams.gymWizard.checkAvailability',
      'wams.gymWizard.booking',
      'wams.gymWizard.transaction',
      'wams.gymWizard.invoice'
    ];
    vm.mainActions = [{
      id: 'getById',
      title: 'Book Meeting Room',
      iconClass: 'fa fa-shopping-cart fa-sm'
    }];
    vm.columnCollection = [{
      id: 'id',
      title: 'Id'
    }, {
      id: 'name',
      title: 'Name'
    }, {
      id: 'capacity',
      title: 'Capacity'
    }, {
      id: 'managerId',
      title: 'Admin'
    }];
    vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[0];
    vm.startdateopen = startdateopen;
    vm.enddateopen = enddateopen;
    var slides = vm.slides = [];
    vm.addSlide = addSlide;
    var images = ['https://www.lifefitness.com/assets/static-assets/image/blog/Posts/Big_Gym_vs._Small_Studio.jpg',
      'http://www.beautybuzzhk.com/wp-content/uploads/2012/08/FF1.jpg',
      'https://cbsbaltimore.files.wordpress.com/2012/11/gym-workout.jpg'
    ];
    vm.actionClicked = actionClicked;
    vm.bookGym = bookGym;
    vm.previous = previous;
    vm.bookGymSlot = bookGymSlot;
    vm.orderDetails = {};

    activate();

    ////////////////

    function activate() {
      // for (var i = 0; i < images.length; i++) {
      //   addSlide();
      // }
      addSlide();
      getAllGyms();
      getAllEquipments();
      fetchAllUsers();
    }


    function addSlide() {
      var i;
      var newWidth = 801 + slides.length;
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

    function getAllGyms() {
      vm.entity = [];
      wamsServices.getEntity({
        request: {
          limit: 10,
          offset: 0
        },
        key: 'gym'
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
        vm.gymDetails = response.rows[0];
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

    function pageChanged(pageNo) {
      pageNo -= 1;

      wamsServices.getEntity({
        request: {
          limit: vm.maxSize,
          offset: pageNo * vm.maxSize
        },
        key: 'gym'
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

    function getAllEquipments() {
      wamsServices.getEntity({
        request: {},
        key: 'gyminfras'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching equiments');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.gymEquipments = response.rows;
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function fetchAllUsers() {
      wamsServices.getEntity({
        key: 'users',
        request: {}
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching meeting room');
          return;
        }
        vm.allUsers = response.rows;
        vm.ui.userInfo = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'name'));
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function actionClicked(actionName, entity) {
      if (actionName) {
        switch (actionName) {
        case 'getById':
          bookGym(entity.id);
          // vm.tday = new Date();
          // if (vm.ui.startdate && vm.ui.enddate) {
          //   differenceInDays(vm.ui.startdate, vm.ui.enddate);
          // } else {
          //   createLables(vm.tday, 7);
          // }
          // fetchMRInfo();
          // fetchBookingDetails(entity.id);
          // fetchInfraDetails(entity.id);
          // fetchCostConfig();
          // fetchMRAccountInfo();
          break;
        }
      }
    }

    function bookGym(gymId) {
      vm.ui.gymId = gymId;
      vm.tday = new Date();
      if (vm.ui.startdate && vm.ui.enddate) {
        // createLables(vm.ui.startdate, 7);
        // if (vm.ui.enddate) {
        differenceInDays(vm.ui.startdate, vm.ui.enddate);
        //}
      } else {
        createLables(vm.tday, 7);
      }
      getGymInfoById();
      getEquipmentByGymId();
      getGymBookingsById();
      $state.go('wams.gymWizard.booking');
    }

    function getGymInfoById() {
      wamsServices.getEntity({
        key: 'gym',
        request: {
          id: vm.ui.gymId
        }
      }).then(function (response) {
        if (!response) {
          notifier.error('Problem encountered while fetching gym information');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          notifier.error('Unable to fetch data');
          return;
        }
        console.log(JSON.stringify(response.rows));
        vm.ui.gymCapacity = response.rows[0].capacity;
      }, function (error) {
        notifier.error('Unable to fetch data : ' + error.message);
      });
    }

    function getGymBookingsById() {
      wamsServices.getEntity({
        key: 'bookings',
        request: {
          resourceId: vm.ui.gymId,
          resourceType: 'gym'
        }
      }).then(function (response) {
        if (!response) {
          notifier.error('Problem encountered while fetching gym information');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          notifier.error('Unable to fetch data');
          return;
        }
        console.log(JSON.stringify(response.rows));
      }, function (error) {
        notifier.error('Unable to fetch data : ' + error.message);
      });
    }

    function getEquipmentByGymId() {
      var i;
      wamsServices.getEntity({
        key: 'gyminfraspecifications',
        request: {
          gymId: vm.ui.gymId
        }
      }).then(function (response) {
        if (!response) {
          notifier.error('Problem encountered while fetching gym equipment');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          notifier.error('Unable to fetch data');
          return;
        }
        console.log(JSON.stringify(response.count));
        if (response.rows.length > 0) {
          for (i = 0; i < response.rows.length; i = i + 1) {
            _.forEach(vm.gymEquipments, function (val) {
              if (val.id == response.rows[i].infraId) {
                getUploadPic(val.image);
              }
            });
          }
        }
        // console.log(JSON.stringify(temp));
      }, function (error) {
        notifier.error('Unable to fetch data : ' + error.message);
      });
    }
    vm.infraImages = [];

    function getUploadPic(imageId) {
      vm.imageSource = '/api/download?fileName=' + imageId;
      vm.infraImages.push(vm.imageSource);
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
      if (vm.totaldays) {
        createLables(fromdate, vm.totaldays);
      }
    }
    $scope.$watch('vm.gymslots', function (newValue) {
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
        }
      });
    }

    function bookGymSlot() {
      vm.bookingInfo = [];
      var frmdate, todate, startHr, endHr, startMin, endMin;
      if (vm.gymslots.length === 0) {
        notifier.error('Please select booking slot');
        return;
      }

      _.forEach(vm.gymslots, function (val) {
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
      });
      processCompleteBookingData();
    }

    function processCompleteBookingData() {
      var bookingDetails = {
        resourceId: vm.ui.gymId,
        resourceType: 89,
        from: vm.bookingInfo[0].from, // '2015-06-15T11:15:26.00',
        to: vm.bookingInfo[0].to, //2015-08-15T13:15:26.00',
        bookedForWhom: parseInt(session.getUserId()),
        userId: [parseInt(session.getUserId())],
        reason: 'Gym Booking'
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
          createInvoice(response);
        }
      }, function (error) {
        notifier.error('Problem encountered while saving data :' + error.message);
      });
    }

    function createInvoice(bookingOrder) {
      console.log(JSON.stringify(bookingOrder));
      vm.orderDetails.bookingInfo = bookingOrder;
      vm.orderDetails.gymInfo = _.filter(vm.entity, {
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
