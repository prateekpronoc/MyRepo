(function () {
  'use strict';

  angular
    .module('wams.cafeteria')
    .controller('ViewAllMenuCtrl', ViewAllMenuCtrl);

  function ViewAllMenuCtrl(commonService, $filter, wamsServices, notifier) {
    var vm = this;
    vm.title = 'All Menus';
    vm.ui = {};
    vm.noData = false;
    vm.getBuildingById = getBuildingById;
    vm.pagingOptions = commonService.getPagingOptions();
    vm.pageChanged = pageChanged;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    var orderBy = $filter('orderBy');
    vm.order = order;
    vm.columnCollection = [{
      id: 'id',
      title: 'Id',
      isAction: false
    }, {
      id: 'cafeteriaId',
      title: 'Cafeteria Name',
      isAction: true
    }, {
      id: 'description',
      title: 'Description',
      isAction: false
    }];
    vm.update = update;
    vm.selectAll = selectAll;
    activate();

    activate();

    ////////////////

    function activate() {
      getAllMenu();
      getAllcafes();

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

    function getAllMenu() {
      vm.entity = [];
      wamsServices.getEntity({
        request: {
          limit: 10,
          offset: 0,
          premiseId: vm.premiseId
        },
        key: 'menus'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching menus');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.entity = response.rows;
        vm.menuDetails = response.rows[0];
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

    function getAllcafes() {
      wamsServices.getEntity({
        key: 'cafeteria',
        request: {}
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching meeting room');
          return;
        }
        vm.ui.cafeInfo = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'name'));
        console.log(vm.ui.cafeInfo);
      }, function (error) {
        notifier.error(error.message);
      });
    }



    function update(cafeteriaId) {
      $state.go('wams.createMenus', {
        cafeteriaId: cafeteriaId
      });
    }

    function getBuildingById(cafeteriaId) {
      vm.menuDetails = _.filter(vm.entity, {
        id: cafeteriaId
      })[0];
      $anchorScroll();
    }

    function pageChanged(pageNo) {
      pageNo -= 1;

      wamsServices.getEntity({
        request: {
          limit: vm.maxSize,
          offset: pageNo * vm.maxSize
        },
        key: 'menus'
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
        vm.menuDetails = response.rows[0];
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

  }


})();
