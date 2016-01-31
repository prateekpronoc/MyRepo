(function () {
  'use strict';

  angular
    .module('wams.cafeteria')
    .controller('allFoodItemsCtrl', allFoodItemsCtrl);

  function allFoodItemsCtrl(wamsServices, commonService, $state, $filter, $anchorScroll, $modal) {
    var vm = this;
    vm.title = 'All Food Items';
    vm.getById = getById;
    vm.getItemById = getItemById;

    vm.columnCollection = [{
      id: 'id',
      title: 'Id',
      isAction: true
    }, {
      id: 'name',
      title: 'Name',
      isAction: false
    }, {
      id: 'cusineId',
      title: 'Cuisine',
      isAction: false
    }, {
      id: 'typeId',
      title: 'Type',
      isAction: false
    }, {
      id: 'preparationTime',
      title: 'Preparation Time',
      isAction: false
    }, {
      id: 'cost',
      title: 'Cost',
      isAction: false
    }, {
      id: 'id',
      title: 'Status',
      isAction: false
    }];
    vm.searchText = '';
    vm.noData = false;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    vm.foodetails = {};
    vm.update = update;
    vm.pagingOptions = commonService.getPagingOptions();
    vm.pageChanged = pageChanged;
    var orderBy = $filter('orderBy');
    vm.order = order;
    vm.selectAll = selectAll;
    activate();

    function activate() {
      getAllFoodItems();
      getCusineTypes();
      getFoodTypes();
    }
    vm.selectedAll = !1;

    function selectAll() {
      vm.selectedAll = vm.selectedAll ? !1 : !0;
      angular.forEach(vm.entity, function (b) {
        b.selected = vm.selectedAll;
      });
    }

    function order(predicate, reverse) {
      vm.entity = orderBy(vm.entity, predicate, reverse);
    }

    function getCusineTypes() {
      vm.cuisines = {};
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          masterId: 12
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching cuisines information');
          return;
        }
        angular.forEach(response.rows, function (val) {
          vm.cuisines[val.id] = val.value;
        });
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getFoodTypes() {
      vm.foodtype = {};
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          masterId: 13
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching food types information');
          return;
        }
        angular.forEach(response.rows, function (val) {
          vm.foodtype[val.id] = val.value;
        });
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getById(fooditemId) {
      vm.foodetails = _.filter(vm.entity, {
        id: fooditemId
      })[0];
      $anchorScroll();
    }

    function getAllFoodItems() {
      vm.entity = [];
      wamsServices.getEntity({
        request: {
          limit: 10,
          offset: 0
        },
        key: 'fooditems'
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
        vm.foodetails = response.rows[0];
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

    function update(fooditemId) {
      $state.go('wams.createFooditems', {
        fooditemId: fooditemId
      });
    }

    function pageChanged(pageNo) {
      pageNo -= 1;

      wamsServices.getEntity({
        request: {
          limit: vm.maxSize,
          offset: pageNo * vm.maxSize
        },
        key: 'fooditems'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching Company');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.entity = response.rows;
        vm.foodetails = response.rows[0];
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

    function getItemById(fooditemId) {
      wamsServices.getEntity({
        key: 'fooditems',
        request: {
          id: fooditemId
        }
      }).then(function (response) {
        console.log('Get By id : ');
        console.log(response);
        var modalInstance = $modal.open({
          animation: vm.animationsEnabled,
          templateUrl: 'cafeteria/fooditeminfo.html',
          controller: 'foodItemInfoCtrl as vm',
          size: 'lg',
          resolve: {
            fooddata: function () {
              return response.rows;
            }
          }
        });
        modalInstance.result.then(function () {
          getCusineTypes();
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
      });
    }
  }
})();
