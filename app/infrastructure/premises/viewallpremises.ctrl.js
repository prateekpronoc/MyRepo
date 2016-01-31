(function () {
  'use strict';

  angular
    .module('wams.infrastructure')
    .controller('ViewAllPremisesCtrl', ViewAllPremisesCtrl);

  /* @ngInject */
  function ViewAllPremisesCtrl(wamsServices, notifier, commonService, _, $state, $filter, $anchorScroll, session) {
    /*jshint validthis: true */
    var vm = this;
    vm.page = {
      title: 'All Premises'
    };
    vm.toggled = toggled;
    //vm.ajaxFaker = ajaxFaker;
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
      id: 'contactPersonName',
      title: 'Contact Person',
      isAction: false
    }, {
      id: 'contactNo',
      title: 'Contact Number',
      isAction: false
    }, {
      id: 'email',
      title: 'Email-Id',
      isAction: false
    }, {
      id: 'location',
      title: 'Location',
      isAction: false
    }];
    vm.searchText = '';
    vm.noData = false;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    vm.premisesDetails = {};
    vm.pagingOptions = commonService.getPagingOptions();
    vm.pageChanged = pageChanged;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    vm.update = update;
    var orderBy = $filter('orderBy');
    vm.order = order;
    vm.selectAll = selectAll;
    vm.session = session;
    activate();

    function toggled(a) {
      console.log('Dropdown is now: ', a);
    }

    function activate() {
      getAllpremises();
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

    function getAllpremises() {
      vm.entity = [];
      wamsServices.getEntity({
        request: {
          limit: 10,
          offset: 0
        },
        key: 'premises'
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
        vm.premisesDetails = response.rows[0];
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
        key: 'premises'
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
        vm.premisesDetails = response.rows[0];
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

    function getById(premisesId) {
      vm.premisesDetails = _.filter(vm.entity, {
        id: premisesId
      })[0];
      $anchorScroll();
    }

    function update(premisesId) {
      $state.go('wams.addPremises', {
        premisesId: premisesId
      });
    }
  }
})();
