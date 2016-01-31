(function () {
  'use strict';

  angular
    .module('wams.gym')
    .controller('AllGymsCtrl', AllGymsCtrl);
  /* @ngInject */
  function AllGymsCtrl(wamsServices, notifier, commonService, _, $state, $filter, $anchorScroll, session) {
    var vm = this;
    vm.title = 'All Gyms';
    vm.session = session;
    vm.columnCollection = [{
      id: 'id',
      title: 'Id'
    }, {
      id: 'name',
      title: 'Name'
    }, {
      id: 'capacity',
      title: 'Capacity'
    }, {
      id: 'managerId',
      title: 'Admin'
    }, {
      id: 'managerId',
      title: 'Mobile'
    }, {
      id: 'managerId',
      title: 'E-mail'
    }];
    var assignedGyms = [];
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
      getAllUsers();
      fetchTenantGyms();
      //getAllGyms();
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

    function getAllUsers() {
      var req = {};
      // if (session.hasRole('TenantAdmin')) {
      //   req.tenantId = parseInt(session.getTenantId());
      // }
      wamsServices.getEntity({
        request: req,
        key: 'users'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching users');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.allUsersNames = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'name'));
        vm.allusersMobile = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'mobile'));
        vm.allusersEmail = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'email'));
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function fetchTenantGyms() {
      wamsServices.getEntity({
        request: {
          tenantId: parseInt(session.getTenantId()),
          resourceType: 89
        },
        key: 'tenantresource'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching meeting-rooms');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }

        assignedGyms = _.uniq(_.pluck(response.rows, 'resourceId'));
        //console.log(assignedMeetingRoom);
        getAllGyms();
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function getAllGyms() {
      vm.entity = [];
      var i;
      wamsServices.getEntity({
        request: {
          limit: 10,
          offset: 0
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
        if (!session.hasRole('SuperAdmin') && assignedGyms.length > 0) {
          for (i = 0; i < assignedGyms.length; i = i + 1) {
            _.forEach(response.rows, function (val) {
              if (val.id == assignedGyms[i]) {
                vm.entity.push(val);
              }
            });
          }
          vm.gymDetails = vm.entity[0];
          vm.count = vm.entity.length;
          vm.pagingOptions.totalDataRecordCount = vm.entity.length;
          if (response.count < 10) {
            vm.shownCount = vm.entity.length;
          }
        } else {
          vm.entity = response.rows;
          vm.gymDetails = response.rows[0];
          vm.count = response.count;
          vm.pagingOptions.totalDataRecordCount = response.count;
          if (response.count < 10) {
            vm.shownCount = response.count;
          }
        }
        vm.pagingOptions.rowCount = 1;
        vm.pagingOptions.columnCount = 10;
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
          notifier.error('Problem encountered while fetching Company');
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
