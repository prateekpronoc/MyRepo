(function () {
  'use strict';

  angular
    .module('wams.mybookings')
    .controller('MyBookingsCtrl', MyBookingsCtrl);

  /* @ngInject */
  function MyBookingsCtrl(wamsServices, notifier, $mdDialog, $mdMedia, $scope, _) {
    /*jshint validthis: true */
    var vm = this;
    vm.title = 'Ctrl';
    vm.ui = {};
    vm.showDetails = showDetails;
    vm.visible = true;
    activate();

    function activate() {
      fetchBookings();
    }
    vm.openMenu = function ($mdOpenMenu, ev) {
      //originatorEv = ev;
      $mdOpenMenu(ev);
    };

    function fetchBookings() {
      wamsServices.getEntity({
        key: 'bookings',
        request: {
          limit: 20,
          offset: 0
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching bookings');
          return;
        }
        console.log(response.rows);
        vm.ui.bookings = [];
        vm.ui.bookings = response.rows ;
        //processBookingsInfo(response.rows);

      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function showDetails(entityId) {
      vm.ui.mrInfo = {};
      wamsServices.getEntity({
        key: 'meetingRooms',
        request: {
          id: entityId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching meeting room');
          return;
        }
        vm.ui.mrInfo = response.rows[0];
        showpopup(response.rows[0]);
        //fetchMRInfra();
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function showpopup(entity) {
      $mdDialog.show({
        locals: {
          mrInfo: entity
        },
        clickOutsideToClose: true,
        templateUrl: 'mybookings/dialog.tpl.html',
        controller: 'PopUpCtrl as vm'
      });
    }

  }
})();

// (function () {
//   'use strict';

//   angular
//     .module('wams.mybookings')
//     .controller('MyBookingsCtrl', MyBookingsCtrl);

//   /* @ngInject */
//   function MyBookingsCtrl(wamsServices, notifier, session, $mdDialog, $mdMedia, $scope) {
//     /*jshint validthis: true */
//     var vm = this;
//     vm.title = 'Ctrl';
//     vm.toppings = [{
//       name: 'Pepperoni',
//       wanted: true
//     }, {
//       name: 'Sausage',
//       wanted: false
//     }, {
//       name: 'Black Olives',
//       wanted: true
//     }, {
//       name: 'Green Peppers',
//       wanted: false
//     }];
//     vm.settings = [{
//       name: 'Wi-Fi',
//       extraScreen: 'Wi-fi menu',
//       icon: 'device:network-wifi',
//       enabled: true
//     }, {
//       name: 'Bluetooth',
//       extraScreen: 'Bluetooth menu',
//       icon: 'device:bluetooth',
//       enabled: false
//     }];
//     vm.messages = [{
//       id: 1,
//       title: "Message A",
//       selected: false
//     }, {
//       id: 2,
//       title: "Message B",
//       selected: true
//     }, {
//       id: 3,
//       title: "Message C",
//       selected: true
//     }, ];
//     vm.people = [{
//       name: 'Janet Perkins',
//       img: 'img/100-0.jpeg',
//       newMessage: true
//     }, {
//       name: 'Mary Johnson',
//       img: 'img/100-1.jpeg',
//       newMessage: false
//     }, {
//       name: 'Peter Carlsson',
//       img: 'img/100-2.jpeg',
//       newMessage: false
//     }];
//     vm.bookings = [];
//     vm.ui = {};
//     vm.showAdvanced = showAdvanced;
//     activate();
//     var assignedMeetingRoom = [];

//     function showAdvanced(mrId) {
//       vm.ui.mrInfo = {};
//       wamsServices.getEntity({
//         key: 'meetingRooms',
//         request: {
//           id: mrId
//         }
//       }).then(function (response) {
//         if (!response || response.rows.length === 0) {
//           notifier.error('Problem encountered while fetching meeting room');
//           return;
//         }
//         vm.ui.mrInfo = response.rows[0];
//         showpopup(response.rows[0]);
//         //fetchMRInfra();
//       }, function (error) {
//         notifier.error(error.message);
//       });
//       // var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
//       // $mdDialog.show({
//       //     locals: {
//       //       dataToPass: {
//       //         name: 'prateek'
//       //       }
//       //     },
//       //     controller: 'PopUpCtrl as vm',
//       //     templateUrl: 'mybookings/dialog.tpl.html',
//       //     parent: angular.element(document.body),
//       //     targetEvent: ev,
//       //     clickOutsideToClose: true,
//       //     fullscreen: useFullScreen
//       //   })
//       //   .then(function (answer) {
//       //     $scope.status = 'You said the information was "' + answer + '".';
//       //   }, function () {
//       //     $scope.status = 'You cancelled the dialog.';
//       //   });
//       // $scope.$watch(function () {
//       //   return $mdMedia('xs') || $mdMedia('sm');
//       // }, function (wantsFullScreen) {
//       //   $scope.customFullscreen = (wantsFullScreen === true);
//       // });
//     }

//     function showpopup(entity) {
//       $mdDialog.show({
//         locals: {
//           mrInfo: entity
//         },
//         clickOutsideToClose: true,
//         templateUrl: 'mybookings/dialog.tpl.html',
//         controller: 'PopUpCtrl as vm'
//       });
//     }

//     function activate() {
//       fetchAllUsers();
//       fetchTenantMeetingRooms();
//       fetchAllBookings();
//     }

//     function fetchTenantMeetingRooms() {
//       wamsServices.getEntity({
//         request: {
//           tenantId: parseInt(session.getTenantId())
//         },
//         key: 'tenantmeeting'
//       }).then(function (response) {
//         if (!response) {
//           vm.noData = true;
//           notifier.error('Problem encountered while fetching meeting-rooms');
//           return;
//         }
//         if (response.rows && response.rows.length === 0) {
//           vm.noData = true;
//           notifier.error('Unable to fetch data');
//           return;
//         }

//         assignedMeetingRoom = _.uniq(_.pluck(response.rows, 'meetingroomId'));
//         // fetchBookings();
//       }, function (error) {
//         notifier.error('Unable to fetch data' + error.message);
//       });
//     }

//     function fetchAllUsers() {
//       wamsServices.getEntity({
//         key: 'users',
//         request: {}
//       }).then(function (response) {
//         if (!response || response.rows.length === 0) {
//           notifier.error('Problem encountered while fetching meeting room');
//           return;
//         }
//         vm.ui.userInfo = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'name'));
//         console.log(vm.ui.userInfo);
//       }, function (error) {
//         notifier.error(error.message);
//       });
//     }

//     function fetchAllBookings() {
//       wamsServices.getEntity({
//         key: 'bookings',
//         request: {
//           limit: 10,
//           offset: 0
//         }
//       }).then(function (response) {
//         if (!response || response.rows.length === 0) {
//           vm.noData = true;
//           notifier.error('Problem encountered while fetching bookings');
//           return;
//         }
//         console.log(response.rows);
//         processBookingsInfo(response.rows);

//       }, function (error) {
//         notifier.error('Unable to fetch data' + error.message);
//       });
//     }

//     function processBookingsInfo(entity) {
//       angular.forEach(entity, function (val) {
//         vm.bookings.push({
//           title: val.meetingroom,
//           selected: false,
//           from: val.from,
//           to: val.to,
//           whome: val.bookedForWhom,
//           reason: val.reason,
//           id: val.resourceId
//         });
//       });
//     }

//   }
// })();
