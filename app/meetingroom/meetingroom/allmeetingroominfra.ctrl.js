(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('AllMeetingRoomsInfractrl', AllMeetingRoomsInfractrl);

  function AllMeetingRoomsInfractrl(MeetingRoomInfraService, $state, $modal, meetingRoomService, $window, fetcher) {
    var vm = this;
    vm.toggled = toggled;
    vm.ajaxFaker = ajaxFaker;
    vm.getById = getById;
    vm.page = {
      title: 'All Meeting Room Infra Structure'
    };
    vm.columnCollection = [{
      id: 'id',
      title: 'Id',
      isAction: true
    }, {
      id: 'name',
      title: 'Name',
      isAction: false
    }, {
      id: 'code',
      title: 'code',
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
      getMeetingRooomInfra();
    }
    activate();

    function getMeetingRooomInfra() {
      vm.entity = [];
      fetcher.get({
        request: {
          limit: 10,
          offset: 0
        },
        key: 'meetingroominfras'
      }).then(function (response) {
        vm.entity = response.rows;
        vm.count = response.count;
        createPaging(response.count, 1, 10);
      });
    }

    function pageChanged(pageNo) {
      pageNo -= 1;

      MeetingRoomInfraService.getAllMeetingRoomInfra({
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

    function getById(id) {
      var infraid = id
      console.log(id);
      MeetingRoomInfraService.getMeetingRoomInfraById(infraid).then(function (response) {
        console.log(JSON.stringify(response));
        var modalInstance = $modal.open({
          animation: vm.animationsEnabled,
          templateUrl: 'meetingroom/meetingroom/viewmeetingroominfra.html',
          controller: 'ViewMRInfraCtrl as vm',
          size: 'lg',
          resolve: {
            mrdata: function () {
              return response;
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
