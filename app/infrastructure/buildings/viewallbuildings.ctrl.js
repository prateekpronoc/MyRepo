(function () {
  'use strict';

  angular
    .module('wams.infrastructure')
    .controller('ViewAllBuildingsCtrl', ViewAllBuildingsCtrl);

  /* @ngInject */
  function ViewAllBuildingsCtrl(notifier, wamsServices, commonService, $state, _, $filter, $anchorScroll,
    $stateParams) {
    /*jshint validthis: true */
    var vm = this;
    vm.title = 'View All Buildings';
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
      id: 'name',
      title: 'Name',
      isAction: true
    }, {
      id: 'contactPersonName',
      title: 'contact Person',
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
    vm.update = update;
    vm.selectAll = selectAll;
    activate();

    function activate() {
      if (angular.isDefined($stateParams.premiseId) && $stateParams.premiseId > 0) {
        vm.premiseId = $stateParams.premiseId;
      }
      fetchAllBuildings();
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

    function fetchAllBuildings() {
      vm.entity = [];
      wamsServices.getEntity({
        request: {
          limit: 10,
          offset: 0,
          premiseId: vm.premiseId
        },
        key: 'buildings'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching buildings');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.entity = response.rows;
        vm.buildingDetails = response.rows[0];
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

    function update(buildingId) {
      $state.go('wams.createBuildings', {
        buildingId: buildingId
      });
    }

    function getBuildingById(buildingId) {
      vm.buildingDetails = _.filter(vm.entity, {
        id: buildingId
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
        key: 'buildings'
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
        vm.buildingDetails = response.rows[0];
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

// (function () {
//   'use strict';

//   angular
//     .module('wams.infrastructure')
//     .controller('ViewAllBuildingsCtrl', ViewAllBuildingsCtrl);

//   function ViewAllBuildingsCtrl($window, $modal, fetcher, fetchEntity, commonService) {
//     var vm = this;
//     vm.title = 'View All Buildings';
//     vm.getBuildingById = getBuildingById;

//     activate();

//     ////////////////

//     function activate() {
//       getAllBuildings();
//     }
//     vm.slots = [{
//       start: 300,
//       stop: 420,
//       day: 1
//     }, {
//       start: 60,
//       stop: 120,
//       day: 1
//     }];
//     vm.columnCollection = [{
//       id: 'id',
//       title: 'Id',
//       isAction: true
//     }, {
//       id: 'name',
//       title: 'Name',
//       isAction: false
//     }, {
//       id: 'contactPersonName',
//       title: 'contact Person',
//       isAction: false
//     }, {
//       id: 'contactNo',
//       title: 'Contact Number',
//       isAction: false
//     }, {
//       id: 'email',
//       title: 'Email-Id',
//       isAction: false
//     }, {
//       id: 'location',
//       title: 'Location',
//       isAction: false
//     }];
//     vm.pagingOptions = commonService.getPagingOptions();

//     function getAllBuildings() {
//       vm.entity = [];
//       fetcher.get({
//         request: {
//           limit: 10,
//           offset: 0
//         },
//         key: 'buildings'
//       }).then(function (response) {
//         vm.entity = response.rows;
//         vm.count = response.count;
//         vm.pagingOptions.totalDataRecordCount = response.count;
//         vm.pagingOptions.rowCount = 1;
//         vm.pagingOptions.columnCount = 10;
//         createPaging(response.count, 1, 5);
//       });
//     }

//     function pageChanged(pageNo) {
//       pageNo -= 1;
//       fetcher.get({
//         request: {
//           limit: vm.maxSize,
//           offset: pageNo * vm.maxSize
//         },
//         key: 'buildings'
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

//     function getBuildingById(buildingId) {
//       fetchEntity.getById({
//         key: 'buildings',
//         request: {
//           id: buildingId
//         }
//       }).then(function (response) {
//         // console.log('Get By id : ');
//         console.log(response);
//         var modalInstance = $modal.open({
//           animation: vm.animationsEnabled,
//           templateUrl: 'building/viewbuildinginfo.html',
//           controller: 'viewBuildingInfoCtrl as vm',
//           size: 'lg',
//           resolve: {
//             viewBuildingInfo: function () {
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
