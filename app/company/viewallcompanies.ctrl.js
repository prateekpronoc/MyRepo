(function () {
  'use strict';

  angular
    .module('wams.company')
    .controller('ViewAllCompaniesCtrl', ViewAllCompaniesCtrl);

  /* @ngInject */
  function ViewAllCompaniesCtrl(wamsServices, notifier, commonService, _, $state, $filter, $modal, $anchorScroll) {
    /*jshint validthis: true */
    var vm = this;
    vm.page = {
      title: 'View All Company'
    };
    vm.toggled = toggled;
    vm.action = null;
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
      id: 'contactPerson',
      title: 'Contact Person',
      isAction: false
    }, {
      id: 'contactNumber',
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
    vm.companyDetails = {};
    vm.pagingOptions = commonService.getPagingOptions();
    vm.pageChanged = pageChanged;
    var orderBy = $filter('orderBy');
    vm.order = order;
    vm.update = update;
    vm.applyAction = applyAction;
    vm.selectAll = selectAll;

    function toggled(a) {
      console.log('Dropdown is now: ', a);
    }

    function activate() {
      getAllCompanies();
      fetchAllPremises();
    }

    activate();
    vm.selectedAll = !1;

    function selectAll() {
      vm.selectedAll = vm.selectedAll ? !1 : !0;
      angular.forEach(vm.ui, function (b) {
        b.selected = vm.selectedAll;
      });
    }

    function fetchAllPremises() {
      wamsServices.getEntity({
        key: 'premises',
        request: {}
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching premises data');
          return;
        }
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function order(predicate, reverse) {
      vm.ui = orderBy(vm.ui, predicate, reverse);
    }

    function getAllCompanies() {
      vm.ui = [];
      wamsServices.getEntity({
        request: {
          limit: 10,
          offset: 0
        },
        key: 'tenants'
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
        vm.ui = response.rows;
        vm.companyDetails = response.rows[0];
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
        key: 'tenants'
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
        vm.ui = response.rows;
        vm.companyDetails = response.rows[0];
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

    function getById(companyId) {
      vm.companyDetails = _.filter(vm.ui, {
        id: companyId
      })[0];
      $anchorScroll();
    }

    function update(companyId) {
      $state.go('wams.createCompany', {
        companyId: companyId
      });
    }

    function applyAction() {
      switch (vm.action) {
      case 'AllocateLocation':
        allocateLocation();
        break;
      }
    }

    function allocateLocation() {
      vm.selectedId = _.pluck(_.filter(vm.ui, {
        'isSelected': true
      }), 'id');
      console.log(JSON.stringify(vm.selectedId));
      allocateLocationModal();
    }

    function allocateLocationModal() {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'company/allocateLocation/allocatelocation.html',
        controller: 'AllocateLocationCtrl as vm',
        size: 'lg',
        resolve: {
          data: function () {
            return vm.selectedId;
          }
        }
      });
      modalInstance.result.then(function () {}, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }

  }
})();
