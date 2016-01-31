(function () {
  'use strict';

  angular
    .module('wams.infrastructure')
    .controller('ViewAllFloorpartsCtrl', ViewAllFloorpartsCtrl);

  /* @ngInject */
  function ViewAllFloorpartsCtrl(wamsServices, $stateParams, notifier, commonService, _, $state, $filter, $anchorScroll) {
    /*jshint validthis: true */
    var vm = this;
    vm.title = 'View All Floorparts';
    vm.noData = false;
    vm.pagingOptions = commonService.getPagingOptions();
    vm.pageChanged = pageChanged;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    vm.columnCollection = [{
      id: 'id',
      title: 'Id',
      isAction: true
    }, {
      id: 'name',
      title: 'Name',
      isAction: false
    }, {
      id: 'floorName',
      title: 'Floor Name',
      isAction: false
    }, {
      id: 'location',
      title: 'Location',
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
    }];
    vm.getById = getById;
    vm.update = update;
    var orderBy = $filter('orderBy');
    vm.order = order;
    vm.selectAll = selectAll;
    activate();

    function activate() {
      if (angular.isDefined($stateParams.floorId) && $stateParams.floorId > 0) {
        vm.floorId = $stateParams.floorId;
      }
      fetchAllFloorParts();
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

    function fetchAllFloorParts() {
      vm.entity = [];
      wamsServices.getEntity({
        request: {
          limit: 10,
          offset: 0,
          floorId: vm.floorId
        },
        key: 'floorparts'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching floor parts');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        vm.entity = response.rows;
        vm.floorPartsDetails = response.rows[0];
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
        key: 'floorparts'
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

    function getById(fpId) {
      vm.floorPartsDetails = _.filter(vm.entity, {
        id: fpId
      })[0];
      $anchorScroll();
    }

    function update(fpId) {
      $state.go('wams.addFloorPart', {
        fpId: fpId
      });
    }
  }
})();
// (function () {
//   'use strict';

//   angular
//     .module('wams.infrastructure')
//     .controller('ViewAllFloorpartsCtrl', ViewAllFloorpartsCtrl);

//   function ViewAllFloorpartsCtrl($window, $modal, fetcher, fetchEntity) {
//     var vm = this;
//     vm.title = 'View All Floorparts';
//     vm.noData = false;
//     vm.getById = getById;
//     activate();

//     ////////////////

//     function activate() {
//       getAllFloorparts();
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
//       id: 'floorName',
//       title: 'Floor Name',
//       isAction: false
//     }, {
//       id: 'location',
//       title: 'Location',
//       isAction: false
//     }, {
//       id: 'contactPersonName',
//       title: 'Contact Person',
//       isAction: false
//     }, {
//       id: 'contactNo',
//       title: 'Contact Number',
//       isAction: false
//     }, {
//       id: 'email',
//       title: 'Email-Id',
//       isAction: false
//     }];

//     function getAllFloorparts() {
//       vm.entity = [];
//       fetcher.get({
//         request: {
//           limit: 5,
//           offset: 0
//         },
//         key: 'floorparts'
//       }).then(function (response) {
//         vm.entity = response.rows;
//         vm.count = response.count;
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
//         key: 'floorparts'
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

//     function getById(Floorpartid) {
//       fetchEntity.getById({
//         key: 'floorparts',
//         request: {
//           id: Floorpartid
//         }
//       }).then(function (response) {
//         // console.log('Get By id : ');
//         console.log(response);
//         var modalInstance = $modal.open({
//           animation: vm.animationsEnabled,
//           templateUrl: 'floorpart/viewFloorpartInfo.html',
//           controller: 'viewFloorpartInfoCtrl as vm',
//           size: 'lg',
//           resolve: {
//             viewFloorpartInfo: function () {
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
