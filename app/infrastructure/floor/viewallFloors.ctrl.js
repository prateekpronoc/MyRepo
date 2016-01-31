(function () {
  'use strict';

  angular
    .module('wams.infrastructure')
    .controller('ViewAllFloorsCtrl', ViewAllFloorsCtrl);

  /* @ngInject */
  function ViewAllFloorsCtrl(wamsServices, $stateParams, notifier, commonService, _, $state, $filter, $anchorScroll) {
    /*jshint validthis: true */
    var vm = this;
    vm.title = 'View All Floors';
    vm.noData = false;
    vm.floorDetails = {};
    vm.pagingOptions = commonService.getPagingOptions();
    vm.addFloorPart = addFloorPart;
    vm.pageChanged = pageChanged;
    vm.columnCollection = [{
      id: 'id',
      title: 'Id',
      isAction: true
    }, {
      id: 'name',
      title: 'Name',
      isAction: false
    }, {
      id: 'buildingsName',
      title: 'BuildingName',
      isAction: false
    }, {
      id: 'contactPersonName',
      title: 'Contact Person',
      isAction: false
    }, {
      id: 'contactNo',
      title: 'Conatact Number',
      isAction: false
    }, {
      id: 'email',
      title: 'Email-Id',
      isAction: false
    }];
    vm.getById = getById;
    vm.searchText = '';
    vm.noData = false;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    vm.companyDetails = {};
    vm.pagingOptions = commonService.getPagingOptions();
    vm.pageChanged = pageChanged;
    vm.update = update;
    var orderBy = $filter('orderBy');
    vm.order = order;
    vm.selectAll = selectAll;
    activate();

    function activate() {
      if (angular.isDefined($stateParams.buildingId) && $stateParams.buildingId > 0) {
        vm.buildingId = $stateParams.buildingId;
      }
      fetchAllFloors();
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

    function addFloorPart(floorId) {
      $state.go('wams.addFloorPart', {
        floorId: floorId
      });
    }

    function fetchAllFloors() {
      vm.entity = [];
      wamsServices.getEntity({
        request: {
          limit: 10,
          offset: 0,
          buildingId: vm.buildingId
        },
        key: 'floors'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching floors');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.entity = response.rows;
        vm.floorDetails = response.rows[0];
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
        key: 'floors'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching floors');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.entity = response.rows;
        vm.floorDetails = response.rows[0];
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

    function getById(floorId) {
      vm.floorDetails = _.filter(vm.entity, {
        id: floorId
      })[0];
      $anchorScroll();
    }

    function update(floorId) {
      $state.go('wams.addFloor', {
        floorId: floorId
      });
    }
  }
})();

// (function () {
//   'use strict';

//   angular
//     .module('wams.infrastructure')
//     .controller('ViewAllFloorsCtrl', ViewAllFloorsCtrl);

//   function ViewAllFloorsCtrl(FloorService, $window, $modal, fetcher, fetchEntity) {
//     var vm = this;
//     vm.title = 'View All Floors';
//     vm.getById = getById;
//     activate();

//     ////////////////

//     function activate() {
//       getAllFloors();
//     }
//     vm.columnCollection = [{
//       id: 'id',
//       title: 'Id',
//       isAction: true
//     }, {
//       id: 'name',
//       title: 'Name',
//       isAction: false
//     }, {
//       id: 'buildingsName',
//       title: 'BuildingName',
//       isAction: false
//     }, {
//       id: 'contactPersonName',
//       title: 'Contact Person',
//       isAction: false
//     }, {
//       id: 'contactNo',
//       title: 'Conatact Number',
//       isAction: false
//     }, {
//       id: 'email',
//       title: 'Email-Id',
//       isAction: false
//     }];

//     function getAllFloors() {
//       vm.entity = [];
//       fetcher.get({
//         request: {
//           limit: 5,
//           offset: 0
//         },
//         key: 'floors'
//       }).then(function (response) {
//         vm.entity = response.rows;
//         vm.count = response.count;
//         createPaging(response.count, 1, 5);
//       });
//     }

//     function pageChanged(pageNo) {
//       pageNo -= 1;
//       FloorService.getAllFloors({
//         limit: vm.maxSize,
//         offset: pageNo * vm.maxSize
//       }).then(function (response) {
//         vm.entity = response.rows;
//       });

//     }

//     vm.setPage = function (b) {
//       vm.currentPage = b;
//     };

//     vm.pagingArray = [];
//     vm.totalItems = 1;
//     vm.currentPage = 1;
//     vm.maxSize = 1;
//     vm.startPage = 1;
//     vm.endPage = 0;
//     vm.pageChanged = pageChanged;

//     function createPaging(totalCount, pageNo, pageItemCount) {
//       var i = 0;
//       vm.totalItems = totalCount;
//       vm.currentPage = pageNo;
//       vm.maxSize = pageItemCount;
//       vm.maxPageLimit = $window.Math.ceil(totalCount / pageItemCount);
//       for (i = 1; i <= vm.maxPageLimit; i = i + 1) {
//         vm.pagingArray.push(i);
//       }
//       vm.endPage = vm.maxPageLimit;
//       // vm.bigTotalItems = 175;
//       // vm.bigCurrentPage = 1;
//     }

//     function getById(floorId) {
//       fetchEntity.getById({
//         key: 'floors',
//         request: {
//           id: floorId
//         }
//       }).then(function (response) {
//         // console.log('Get By id : ');
//         console.log(response);
//         var modalInstance = $modal.open({
//           animation: vm.animationsEnabled,
//           templateUrl: 'floor/viewFloorInfo.html',
//           controller: 'viewFloorInfoCtrl as vm',
//           size: 'lg',
//           resolve: {
//             viewFloorInfo: function () {
//               return response.rows;
//             }
//           }
//         });
//         modalInstance.result.then(function () {

//         }, function () {
//           console.log('Modal dismissed at: ' + new Date());
//         });
//       });
//     }
//   }
// })();
