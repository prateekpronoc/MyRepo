(function () {
  'use strict';

  angular
    .module('wams.configuration')
    .controller('AllcostConfigurationCtrl', AllcostConfigurationCtrl);

  /* @ngInject */
  function AllcostConfigurationCtrl(fetcher, $window, wamsServices, $filter, commonService) {
    var vm = this;
    vm.title = 'Controller';
    vm.page = {
      title: 'All Cost Configuration'
    };
    vm.entityName = [];
    vm.columnCollection = [{
      id: 'id',
      title: 'Id',
      isAction: true
    }, {
      id: 'resourceId',
      title: 'Name',
      isAction: false
    }, {
      id: 'points',
      title: 'Cost',
      isAction: false
    }];
    vm.searchText = '';
    vm.noData = false;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    vm.costDetails = {};
    vm.pagingOptions = commonService.getPagingOptions();
    vm.pageChanged = pageChanged;
    activate();

    ////////////////

    function activate() {
      getAllCostConfiguration();
    }



    function getAllCostConfiguration() {
      vm.entity = [];
      wamsServices.getEntity({
        request: {
          limit: 10,
          offset: 0
        },
        key: 'costconfigurations'
      }).then(function (response) {
        vm.entity = response.rows;
        angular.forEach(vm.entity, function (val) {
          vm.costId = val.id;
          vm.points = val.points;
          getMRName(val.resourceId, vm.costId, vm.points);
        });
        vm.count = response.count;
        vm.costDetails = response.rows[0];
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

    function getMRName(mrid, costid, points) {
      vm.meetingroomentity = [];
      vm.entityName = [];
      wamsServices.getEntity({
        request: {
          id: mrid
        },
        key: 'meetingRooms'
      }).then(function (response) {
        vm.meetingroomentity.push(response.rows[0]);
      }).then(function (response) {
        angular.forEach(vm.meetingroomentity, function (data) {
          vm.mrname = data.name;
        });
        vm.entityName.push({
          resourceId: vm.mrname,
          id: costid,
          points: points
        });
      });
    }

    function pageChanged(pageNo) {
      pageNo -= 1;

      wamsServices.getEntity({
        request: {
          limit: vm.maxSize,
          offset: pageNo * vm.maxSize
        },
        key: 'costconfigurations'
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
        vm.costDetails = response.rows[0];
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
