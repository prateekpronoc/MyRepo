(function () {
  'use strict';

  angular
    .module('wams.gym')
    .controller('AllGymInfrasCtrl', AllGymInfrasCtrl);
  /* @ngInject */
  function AllGymInfrasCtrl(wamsServices, notifier, commonService, _, $state, $filter, $anchorScroll, session) {
    var vm = this;
    vm.title = 'All Equipment';
    vm.session = session;
    vm.columnCollection = [{
      id: 'id',
      title: 'Id'
    }, {
      id: 'name',
      title: 'Name'
    }];
    vm.searchText = '';
    vm.noData = false;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    vm.pagingOptions = commonService.getPagingOptions();
    vm.pageChanged = pageChanged;
    vm.update = update;
    var orderBy = $filter('orderBy');
    vm.order = order;
    vm.selectAll = selectAll;

    activate();

    ////////////////


    function activate() {
      getAllGymInfras();
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

    function getAllGymInfras() {
      vm.entity = [];
      wamsServices.getEntity({
        request: {
          limit: 10,
          offset: 0
        },
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

    function update(gymId) {
      $state.go('wams.gymcreate', {
        gymId: gymId
      });
    }
  }
})();
