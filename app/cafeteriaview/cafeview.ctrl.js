(function () {
  'use strict';

  angular
    .module('wams.cafeview')
    .controller('ViewMenuCtrl', ViewMenuCtrl);

  /* @ngInject */
  function ViewMenuCtrl(wamsServices, _, session, $mdToast, $stateParams, $mdSidenav, $state) {
    /*jshint validthis: true */
    var vm = this;
    vm.title = 'Ctrl';
    vm.cafeEntity = {};
    vm.cafeMenu = {};
    vm.myInterval = 3000;
    vm.tabIndex = 0;
    vm.session = session;
    vm.toggleLeft = toggleLeft;
    vm.currentDate = new Date();
    vm.slides = [{
      image: 'http://lorempixel.com/400/200/food'
    }];
    vm.fetchMenuDetails = fetchMenuDetails;
    vm.addToCart = addToCart;
    vm.viewCart = viewCart;
    vm.confirmOrder = confirmOrder;
    vm.shopAgain = shopAgain;
    vm.updateCart = updateCart;
    vm.viewAllBookings = viewAllBookings;
    activate();

    function activate() {
      if (angular.isDefined($stateParams.cafeId) && $stateParams.cafeId > 0) {
        vm.selectedCafeId = $stateParams.cafeId[0];
        fetchMenu($stateParams.cafeId[0]);
      } else {
        vm.tabIndex = 0;
        fetchAllCafeteria();
        fetchUserAccountInfo();
      }
    }

    function toggleLeft() {
      $mdSidenav('left').toggle();
    }



    function fetchMenuByCafeId(cafeId) {
      vm.selectedCafeId = cafeId;
      wamsServices.getEntity({
        key: 'fetchMenus',
        request: {
          cafeId: cafeId
        }
      }).then(function (response) {
          viewConsole(response);
          if (validateResponse(response)) {
            vm.menuId = response.rows[0].id;
            fetchMenuList();
            viewConsole(vm.menuId);
          }
          // if (validateResponse(response)) {
          //   vm.tabIndex = vm.tabIndex + 1;
          //   vm.categoryValues = response.categoryValues;
          //   vm.category = _.uniq(_.pluck(response.rows, 'categoryId'));
          //   viewConsole(vm.category);
          //   vm.cafeMenu.entities = response.rows;
          //   viewConsole(vm.cafeMenu.entities);
          //   vm.selectedCafeInfo = _.find(vm.cafeEntity.entities, function (val) {
          //     return val.id === vm.selectedCafeId;
          //   });
          // }
        },
        function (error) {
          console.log(error);
          //proper notification should be showns . need implementation;
        });
    }

    function viewAllBookings() {
      $state.go('wams.dashboard');
    }

    vm.deleteItems = deleteItems;

    function deleteItems(itemId) {
      for (var n = 0; n < vm.mycart.length; n = n + 1) {
        if (vm.mycart[n].fId === itemId) {
          delete vm.mycartQuantity[vm.mycart[n].fId];
          var removedObject = vm.mycart.splice(n, 1);
          removedObject = null;
          break;
        }
      }
      calculateTotal();
      // var temp = _.remove(vm.mycart, function (val) {
      //   if (val.fId === itemId) {
      //     delete vm.mycartQuantity[val.fId];
      //   }
      //   return val.selected !== true; //(vm.mycartQuantity).hasOwnProperty(fItemCol.fId)
      // });
      // vm.mycart = temp;

    }

    function updateCart() {

      var temp = _.remove(vm.mycart, function (val) {
        if (val.selected === true) {
          delete vm.mycartQuantity[val.fId];
        }
        return val.selected !== true; //(vm.mycartQuantity).hasOwnProperty(fItemCol.fId)
      });
      vm.mycart = temp;
      calculateTotal();
    }

    function fetchUserAccountInfo() {
      wamsServices.getEntity({
        key: 'accounts',
        request: {
          holderId: parseInt(session.getUserId())
        }
      }).then(function (response) {
        if (response && response.rows) {
          vm.accountInfo = response.rows[0];
        }
      }, function (error) {
        console.log(error);
      });
    }

    function shopAgain() {
      vm.tabIndex = vm.tabIndex - 1;
    }

    function viewConsole(entity) {
      console.log(entity);
    }

    function validateResponse(entity) {
      if (!entity || !entity.rows || entity.rows.length === 0) {
        return false;
      }
      return true;
    }

    function fetchAllCafeteria() {
      wamsServices.getEntity({
        key: 'viewCafe',
        request: {
          premiseId: 12
        }
      }).then(function (response) {
        if (validateResponse(response)) {
          vm.cafeEntity.entities = response.rows;
          vm.cafeEntity.totalCount = response.rows.count;
        }
      }, function (error) {
        console.log(error);
      });
    }

    function fetchMenu(cafeId) {
      vm.selectedCafeId = cafeId;
      wamsServices.getEntity({
        key: 'fetchMenus',
        request: {
          cafeId: cafeId
        }
      }).then(function (response) {
          viewConsole(response);
          if (validateResponse(response)) {
            vm.menuId = response.rows[0].id;
            fetchMenuList();
            viewConsole(vm.menuId);
          }
          // if (validateResponse(response)) {
          //   vm.tabIndex = vm.tabIndex + 1;
          //   vm.categoryValues = response.categoryValues;
          //   vm.category = _.uniq(_.pluck(response.rows, 'categoryId'));
          //   viewConsole(vm.category);
          //   vm.cafeMenu.entities = response.rows;
          //   viewConsole(vm.cafeMenu.entities);
          //   vm.selectedCafeInfo = _.find(vm.cafeEntity.entities, function (val) {
          //     return val.id === vm.selectedCafeId;
          //   });
          // }
        },
        function (error) {
          console.log(error);
          //proper notification should be showns . need implementation;
        });

    }

    function fetchMenuList() {
      wamsServices.getEntity({
        key: 'viewMenu',
        request: {
          menuId: vm.menuId
        }
      }).then(function (response) {
          viewConsole(response);
          if (validateResponse(response)) {
            vm.tabIndex = vm.tabIndex + 1;
            vm.categoryValues = response.categoryValues;
            vm.category = _.uniq(_.pluck(response.rows, 'categoryId'));
            viewConsole(vm.category);
            vm.cafeMenu.entities = response.rows;
            viewConsole(vm.cafeMenu.entities);
            vm.selectedCafeInfo = _.find(vm.cafeEntity.entities, function (val) {
              return val.id === vm.selectedCafeId;
            });
          }
        },
        function (error) {
          console.log(error);
          //proper notification should be showns . need implementation;
        });
    }

    function fetchMenuDetails(cafeId) {
      fetchMenu(cafeId);


    }

    vm.mycartQuantity = {};
    vm.mycart = [];

    function addToCart(fItemCol) {
      if ((vm.mycartQuantity).hasOwnProperty(fItemCol.fId)) {
        vm.mycartQuantity[fItemCol.fId] = vm.mycartQuantity[fItemCol.fId] + 1;
      } else {
        vm.mycartQuantity[fItemCol.fId] = fItemCol.quantity;
        vm.mycart.push(fItemCol);
      }
      //  vm.mycartQunatity.quantity = fItemCol.quantity;
      viewConsole(vm.mycartQuantity);
    }
    var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

    function viewCart() {
      if (vm.mycart.length === 0) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('Please select food items!')
          .hideDelay(3000)
        );
        return;
      }
      vm.totalCost = 0;
      _.forEach(vm.mycart, function (value) {
        if ((vm.mycartQuantity).hasOwnProperty(value.fId)) {
          value.quantity = vm.mycartQuantity[value.fId];
          vm.totalCost = vm.totalCost + (vm.mycartQuantity[value.fId] * value.fCost);
        }
      });
      vm.tabIndex = vm.tabIndex + 1;
      viewConsole(vm.mycart);

    }
    vm.recieptInfo = {};
    vm.selectedCafeInfo = {};
    vm.calculateTotal = calculateTotal;

    function calculateTotal() {
      vm.totalCost = 0;
      _.forEach(vm.mycart, function (value) {
        vm.totalCost = vm.totalCost + (value.quantity * value.fCost);

      });
    }

    function confirmOrder() {
      var data = [],
        totalQty = 0,
        request = {};
      _.forEach(vm.mycart, function (value) {
        totalQty = totalQty + vm.mycartQuantity[value.fId];
        data.push({
          id: value.fId,
          name: value.fname,
          qty: vm.mycartQuantity[value.fId],
          cost: value.fcost
        });

      });
      request = {
        userId: parseInt(session.getUserId()),
        orderFood: {
          data: data
        },
        status: 1,
        cafeId: vm.selectedCafeId,
        qty: totalQty,
        price: vm.totalCost
      };
      viewConsole(JSON.stringify(request));
      wamsServices.saveEntity({
        key: 'orderFood',
        request: request
      }).then(function (response) {
        vm.tabIndex = vm.tabIndex + 1;
        vm.selectedCafeInfo = _.find(vm.cafeEntity.entities, function (val) {
          return val.id === vm.selectedCafeId;
        });
        vm.recieptInfo = response;
        var temp = JSON.parse(response.orderFood);
        vm.orderedFood = temp.data;

        viewConsole(vm.recieptInfo);
      }, function (error) {
        viewConsole(error);
      });
    }
  }
})();
