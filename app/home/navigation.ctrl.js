(function () {
  'use strict';

  angular
    .module('wams.home')
    .controller('NavCtrl', NavCtrl);

  /* @ngInject */
  function NavCtrl(session, wamsServices, notifier, $state, $mdSidenav) {
    var vm = this;
    vm.title = 'Controller';
    // vm.session = session;
    vm.oneAtATime = !1;
    vm.ui = {};
    vm.session = session;
    vm.status = {
      isFirstOpen: !0,
      isSecondOpen: !0,
      isThirdOpen: !0
    };

    vm.menu = [{
        link: 'dashboard',
        title: 'Dashboard',
        icon: 'dashboard'
      },
      //  {
      //   link: 'mybookings',
      //   title: 'My Bookings',
      //   icon: 'receipt'
      // },
      // {
      //   link: 'bookMR',
      //   title: 'Book Meeting Rooms',
      //   icon: 'accessibility'
      // }
      {
        link: 'viewmenus',
        title: 'Order Food',
        icon: 'add_shopping_cart'
      }


      // , {
      //   link: '',
      //   title: 'Cafeteria',
      //   icon: 'message'
      // }, {
      //   link: '',
      //   title: 'Parking',
      //   icon: 'message'
      // }
    ];

    vm.views = [
      // {
      //   link: 'mymeetingrooms',
      //   title: 'My Meeting Rooms',
      //   icon: 'dashboard'
      // },
      {
        link: 'myFoodOrders',
        title: 'My Food Orders',
        icon: 'add_shopping_cart'
      }
    ];

    vm.admin = [{
      link: 'myprofile', //'wams.userInfo',
      title: 'Account',
      icon: 'account_balance_wallet'
    }, {
      link: 'showListBottomSheet($event)',
      title: 'Settings',
      icon: 'settings'
    }];

    vm.actionsMenu = [{
      link: 'logout',
      title: 'Logout',
      icon: 'settings_power'
    }];
    vm.ui = {};
    vm.action = action;
    activate();

    function action(argument) {
      //$mdSidenav('left').toggle();

      switch (argument) {
      case 'dashboard':
        $state.go('wams.dashboard');
        break;
      case 'mybookings':
        $state.go('wams.mybookings');
        break;
      case 'myprofile':
        $state.go('wams.userInfo');
        break;
      case 'mymeetingrooms':
        $state.go('wams.mymeetingrooms');
        break;
      case 'bookMR':
        $state.go('wams.newbooking');
        break;
      case 'viewmenus':
        $state.go('wams.cafemeuview');
        break;
      case 'myFoodOrders':
        $state.go('wams.orderedFood');
        break;
      case 'logout':
        $state.go('anon.login');
        break;
      }

      $mdSidenav('left').close();
    }


    function fetchAllUserDetails() {
      wamsServices.getEntity({
        key: 'userprofiles',
        request: {
          uid: parseInt(vm.ui.userId)
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while Profile');
          return;
        }
        console.log(response.rows);
        vm.ui.usrInfo = response.rows[0];
        //console.log(JSON.stringify(response.rows[0]));
        //vm.currentUserName = response.rows[0].firstName + response.rows[0].lastName;
        if (response.rows[0].image) {
          getUploadPic(response.rows[0].image);
        }
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getUploadPic(imageId) {
      vm.imageSource = '/api/download?fileName=' + imageId;
    }

    function activate() {
      vm.ui.userId = session.getUserId();
      fetchAllUserDetails();
      // vm.ui.roles = session.hasRole('SuperAdmin');
      // console.log(JSON.stringify(vm.ui.roles));
      // wamsServices.getEntity({
      //   key: 'catalogValues',
      //   request: {
      //     id: vm.ui.roles
      //   }
      // }).then(function (response) {
      //   if (!response || response.rows.length === 0) {
      //     //notifier.error('Problem encountered while fetching bookings');
      //     return;
      //   }
      //   console.log(JSON.stringify(response.rows[0].value));
      //   vm.roleName = response.rows[0].value;
      // }, function (error) {
      //   notifier.error(error.message);
      // });
    }
  }
})();
