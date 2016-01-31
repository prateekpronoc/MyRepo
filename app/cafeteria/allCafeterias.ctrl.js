(function () {
  'use strict';

  angular
    .module('wams.cafeteria')
    .controller('allCafeteriasCtrl', allCafeteriasCtrl);

  /* @ngInject */
  function allCafeteriasCtrl(wamsServices, notifier, commonService, _, $state, $filter, $anchorScroll) {
    var vm = this;
    vm.title = 'All Cafeterias';
    vm.toggled = toggled;
    vm.getById = getById;

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
      id: 'contactName',
      title: 'Contact Name',
      isAction: false
    }, {
      id: 'contactNo',
      title: 'Contact Number',
      isAction: false
    }, {
      id: 'contactEmail',
      title: 'Email-Id',
      isAction: false
    }];
    vm.searchText = '';
    vm.noData = false;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    vm.cafeteriaDetails = {};
    vm.pagingOptions = commonService.getPagingOptions();
    vm.pageChanged = pageChanged;
    vm.update = update;
    var orderBy = $filter('orderBy');
    vm.order = order;
    vm.selectAll = selectAll;

    function toggled(a) {
      console.log('Dropdown is now: ', a);
    }

    function activate() {
      getAllCafeterias();
      getCusineTypes();
    }

    activate();
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

    function getAllCafeterias() {
      vm.entity = [];
      wamsServices.getEntity({
        request: {
          limit: 10,
          offset: 0
        },
        key: 'cafeteria'
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
        vm.cafeteriaDetails = response.rows[0];
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
        key: 'cafeteria'
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
        vm.cafeteriaDetails = response.rows[0];
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

    function getById(cafeteriaId) {
      vm.cafeteriaDetails = _.filter(vm.entity, {
        id: cafeteriaId
      })[0];
      $anchorScroll();
    }

    function update(cafeteriaId) {
      $state.go('wams.createCafeteria', {
        cafeteriaId: cafeteriaId
      });
    }
  }
})();
