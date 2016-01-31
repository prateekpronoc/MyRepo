(function () {
  'use strict';

  angular
    .module('wams.parking')
    .controller('BookParkingCtrl', BookParkingCtrl);

  /* @ngInject */
  function BookParkingCtrl($scope, wamsServices, notifier, session, $state, $filter, _, commonService) {
    var vm = this;
    vm.title = 'Book Parking';
    vm.ui = {};
    vm.myInterval = 5000;
    vm.session = session;
    vm.pagingOptions = commonService.getPagingOptions();
    vm.pageChanged = pageChanged;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    vm.states = [
      'wams.parkingWizard.checkAvailability',
      'wams.parkingWizard.booking',
      'wams.parkingWizard.transaction',
      'wams.parkingWizard.invoice'
    ];
    var slides = vm.slides = [];
    vm.addSlide = addSlide;

    var images = ['http://www.prestigehotelbudapest.com/kcfinder/upload/images/parking.jpg',
      'https://eugene-kaspersky-wpengine.netdna-ssl.com/files/2014/04/DSC00248.jpg',
      'http://www.infsoft.com/portals/0/graphics/use/branchen/shopping_center/shopping_parking_skal.jpg'
    ];
    vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[0];
    vm.startdateopen = startdateopen;
    vm.enddateopen = enddateopen;
    vm.previous = previous;
    vm.bookParking = bookParking;

    activate();

    ////////////////

    function activate() {
      addSlide();
      getAllParkings();
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

    function getAllParkings() {
      vm.entity = [];
      wamsServices.getEntity({
        request: {
          limit: 10,
          offset: 0
        },
        key: 'parkings'
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

    function bookParking(pId) {
      vm.ui.parkingId = pId;
      wamsServices.getEntity({
        key: 'parkings',
        request: {
          id: vm.ui.parkingId
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
      $state.go('wams.parkingWizard.booking');
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
