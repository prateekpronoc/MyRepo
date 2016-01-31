(function () {
  'use strict';
  angular.module('wams.infrastructure')
    .controller('ViewAllPremisesCtrl', ViewAllPremisesCtrl);

  function ViewAllPremisesCtrl(premisesServices, $state, $window, $modal, fetcher, catalogService, fetchEntity) {
    var vm = this;
    vm.page = {
      title: 'All Premises'
    }
    vm.toggled = toggled;
    vm.ajaxFaker = ajaxFaker;
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

    function toggled(a) {
      console.log('Dropdown is now: ', a);
    }

    function ajaxFaker() {
      $state.reload();
    }

    function activate() {
      getAllpremises();
      catalogService.getCatalog('city').then(function (response) {
        console.log(response);
      });

      catalogService.getCatalogMaster().then(function (response) {
        console.log(response);
      });
    }

    activate();

    function getAllpremises() {
      vm.entity = [];
      fetcher.get({
        request: {
          limit: 5,
          offset: 0
        },
        key: 'premises'
      }).then(function (response) {
        vm.entity = response.rows;
        vm.count = response.count;
        createPaging(response.count, 1, 5);
      });
    }

    function pageChanged(pageNo) {
      pageNo -= 1;

      premisesServices.getAllPremises({
        limit: vm.maxSize,
        offset: pageNo * vm.maxSize
      }).then(function (response) {
        vm.entity = response.rows;
      });

    }

    vm.setPage = function (b) {
      vm.currentPage = b;
    };

    vm.pagingArray = [];
    vm.totalItems = 1;
    vm.currentPage = 1;
    vm.maxSize = 1;
    vm.startPage = 1;
    vm.endPage = 0;
    vm.pageChanged = pageChanged;

    function createPaging(totalCount, pageNo, pageItemCount) {
      var i = 0;
      vm.totalItems = totalCount;
      vm.currentPage = pageNo;
      vm.maxSize = pageItemCount;
      vm.maxPageLimit = $window.Math.ceil(totalCount / pageItemCount);
      for (i = 1; i <= vm.maxPageLimit; i = i + 1) {
        vm.pagingArray.push(i);
      }
      vm.endPage = vm.maxPageLimit;
      // vm.bigTotalItems = 175;
      // vm.bigCurrentPage = 1;
    }

    function getById(premisesid) {
      fetchEntity.getById({
        key: 'premises',
        request: {
          id: premisesid
        }
      }).then(function (response) {
        // console.log('Get By id : ');
        console.log(response);
        var modalInstance = $modal.open({
          animation: vm.animationsEnabled,
          templateUrl: 'infrastructure/viewpremisesinfo.html',
          controller: 'viewPremisesInfo as vm',
          size: 'lg',
          resolve: {
            viewpremisesinfo: function () {
              return response.rows;
            }
          }
        });
        modalInstance.result.then(function () {

        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
      });
    }
  }
})();
