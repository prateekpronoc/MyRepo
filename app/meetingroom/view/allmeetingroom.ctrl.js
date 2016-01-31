(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('AllMeetingRoomCtrl', AllMeetingRoomCtrl);

  /* @ngInject */
  function AllMeetingRoomCtrl(commonService, wamsServices, notifier, $state, $modal, session) {
    /*jshint validthis: true */
    var vm = this,
      assignedMeetingRoom = [];
    vm.title = 'Ctrl';
    vm.page = {
      title: 'All Meeting Rooms'
    };
    var slides = vm.slides = [];
    var images = ['http://www.thelongemonthotels.com/d/longemont/media/optimised_images/Club_Lounge_Meeting_Room.jpg',
      'https://www.alliancevirtualoffices.com/images/locations/3454_New-York-meeting-room-rent.jpg',
      'http://www3.hilton.com/resources/media/hi/en_US/img/shared/carousel/main/HH_meetingroom.jpg'
    ];
    vm.myInterval = 5000;
    vm.session = session;
    vm.allmeetingrooms = {};
    vm.meetinroomDetails = {};
    vm.noData = false;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    vm.pageChanged = pageChanged;
    vm.pagingOptions = commonService.getPagingOptions();
    vm.applyAction = applyAction;
    vm.meetingroomActions = [{
      id: 1,
      name: 'Archive Selected'
    }, {
      id: 2,
      name: 'Cost Configuration'
    }];
    vm.columnCollection = [{
      id: 'id',
      title: 'Id',
      isAction: true
    }, {
      id: 'name',
      title: 'Name',
      isAction: false
    }, {
      id: 'location',
      title: 'Location',
      isAction: false
    }, {
      id: 'capacity',
      title: 'Capacity',
      isAction: false
    }];

    vm.FlipColumns = [{
      id: 'status',
      title: 'Status'
    }, {
      id: 'type',
      title: 'Type'
    }];
    vm.searchText = '';
    vm.selectedMRIds = [];
    vm.actionClicked = actionClicked;
    vm.isDeleteDisabled = true;
    vm.isEditDisabled = true;
    vm.openAdvanceSearch = openAdvanceSearch;
    activate();

    function activate() {
      addSlide();
      if (!session.hasRole('SuperAdmin')) {
        fetchTenantMeetingRooms();
      } else {
        fetchAllMeetingRooms();
      }
      if (session.hasRole('SuperAdmin')) {
        vm.isEditDisabled = false;
        vm.mainActions = [{
          id: 'addMrInfra',
          title: 'Add Infra Structure',
          iconClass: 'fa fa-plus-circle fa-sm'
        }];
      }
    }
    vm.searchDetails = {};

    function addSlide() {
      var i;
      for (i = 0; i < images.length; i++) {
        vm.slides.push({
          image: images[i],
          text: ['More', 'Extra', 'Lots of', 'Surplus'][vm.slides.length % 4] + ' ' + ['Cats', 'Kittys',
            'Felines',
            'Cutes'
          ][vm.slides.length % 4]
        });
      }
    }

    function openAdvanceSearch() {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'meetingroom/view/openAdvanceSearch.tpl.html',
        controller: 'OpenAdvanceSearchCtrl as vm',
        size: 'lg',
        resolve: {
          data: function () {
            return vm.searchDetails;
          }
        }
      });
      modalInstance.result.then(function (data) {
        console.log('searchDetails' + JSON.stringify(data));
        vm.searchDetails = data;
        fetchAllMeetingRooms();
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }

    function fetchTenantMeetingRooms() {
      wamsServices.getEntity({
        request: {
          tenantId: parseInt(session.getTenantId())
        },
        key: 'tenantmeeting'
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

        assignedMeetingRoom = _.pluck(response.rows, 'meetingroomId');
        //console.log(assignedMeetingRoom);
        fetchAllMeetingRooms();
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function fetchAllMeetingRooms() {
      vm.entity = [];
      var req = {
        limit: 10,
        offset: 0
      };
      if (vm.searchDetails) {
        req.buildingId = vm.searchDetails.buildingId;
        req.floorId = vm.searchDetails.floorId;
        req.floorPartId = vm.searchDetails.floorPartId;
        req.id = vm.searchDetails.id;
        req.capacity = vm.searchDetails.capacity;
        req.typeId = vm.searchDetails.typeId;
        req.status = vm.searchDetails.status;
      }
      wamsServices.getEntity({
        request: req,
        key: 'meetingRooms'
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
        //vm.entity = response.rows;
        // vm.allmeetingrooms = response.rows[0];
        if (!session.hasRole('SuperAdmin') && assignedMeetingRoom.length > 0) {
          _.forEach(response.rows, function (val) {
            if (assignedMeetingRoom.indexOf(val.id) > -1) {
              vm.entity.push(val);
            }
          });
          vm.count = vm.entity.length;
        } else {
          vm.allmeetingrooms = response.rows[0];
          vm.entity = response.rows;
          // if (response.count < 10) {
          //   vm.shownCount = response.count;
          // }
          vm.count = response.count;
        }
        vm.pagingOptions.totalDataRecordCount = response.count;
        vm.pagingOptions.rowCount = 1;
        vm.pagingOptions.columnCount = 10;
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function applyAction(actionId) {
      console.log(actionId);
      if (actionId) {
        switch (actionId) {
        case 1:
          perCostConfiguration();
          console.log('case1');
          break;
        case 2:
          console.log('case2');
          getCostConfiguration();
          break;
        }
      }
    }

    function perCostConfiguration() {
      angular.forEach(vm.selectedMRIds, function (value) {
        wamsServices.getEntity({
          key: 'costconfigurations',
          request: {
            resourceId: value
          }
        }).then(function (response) {
          angular.forEach(response.rows, function (data) {
              if (data.resourceId == value) {
                notifier.error('Cost Configuration is Done For Meeting Room' + '' + '' + response.rows[0].resourceId);
              }
              vm.respmrids = _.remove(vm.selectedMRIds, function (n) {
                return data.resourceId == n;
              });
            })
            // if (response.rows[0].resourceId == value) {
            //   notifier.error('Cost Configuration is Done For' + response.rows[0].resourceId);
            //   vm.respmrids = _.remove(vm.selectedMRIds, value);
            // }
        }).then(function (resp) {
          $state.go('wams.costConfiguration', {
            roomids: vm.selectedMRIds
          });
        })
      });
    }

    function getCostConfiguration() {
      if (vm.selectedMRIds.length === 0) {
        $state.go('wams.costConfiguration', {
          roomids: vm.selectedMRIds
        });
      } else {
        perCostConfiguration();
      }
    }



    function actionClicked(actionName, entity) {
      if (actionName) {
        switch (actionName) {
        case 'addMrInfra':
          addInfraToMR(entity.id);
          break;
          // case 'UpdateMeetingRoom':
          //   updateMR(entity.id);
          //   break;
        case 'edit':
          updateMR(entity.id);
          break;
        case 'getById':
          getMRById(entity.id);
          break;
        case 'selectionChanged':
          getSelectedMR(entity.id);
          break;
        }
      }
    }

    function pageChanged(pageNo) {
      pageNo -= 1;

      wamsServices.getEntity({
        request: {
          limit: vm.maxSize,
          offset: pageNo * vm.maxSize
        },
        key: 'meetingRooms'
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
        vm.allmeetingrooms = response.rows[0];
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

    function getSelectedMR(mrId) {
      vm.selectedMRIds.push(mrId);
      _.uniq(vm.selectedMRIds);
      console.log(_.uniq(vm.selectedMRIds));
    }

    function addInfraToMR(mrId) {
      $state.go('wams.addmrinfra', {
        roomid: mrId
      });
    }

    function updateMR(mrId) {
      $state.go('wams.updatemeetingroom', {
        roomid: mrId
      });
    }

    function getMRById(mrId) {
      vm.meetinroomDetails = _.filter(vm.entity, {
        id: mrId
      })[0];
      open(vm.meetinroomDetails);
      console.log(JSON.stringify(vm.meetinroomDetails));
    }

    function open(meetinroomDetails) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'meetingroom/view/meetingRoomInfo.tpl.html',
        controller: 'MeetingRoomInfoCtrl as vm',
        size: 'sm',
        resolve: {
          data: function () {
            return meetinroomDetails;
          }
        }
      });

      modalInstance.result.then(function (data) {
        vm.editdata = data;
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }

  }
})();

// (function () {
//   'use strict';

//   angular
//     .module('wams.meetingroom')
//     .controller('AllMeetingRoomCtrl', AllMeetingRoomCtrl);

//   /* @ngInject */
//   function AllMeetingRoomCtrl(meetingRoomService, _, $modal, $state, $log, $window, wamsServices, commonService,
//     notifier) {
//     var vm = this;
//     vm.page = {
//       title: 'All Meeting Rooms'
//     };
//     vm.pagingOptions = commonService.getPagingOptions();
//     vm.toggled = toggled;
//     vm.ajaxFaker = ajaxFaker;
//     vm.getById = getById;

//     function activate() {
//       getAllMeetingRooms();
//     }
//     activate();


//     vm.actionClicked = actionClicked;
//     vm.mainActions = [{
//       id: 'addMrInfra',
//       title: 'Add Infra Structure',
//       iconClass: 'fa fa-plus-circle fa-sm'
//     }, {
//       id: 'UpdateMeetingRoom',
//       title: 'Update Meeting Room',
//       iconClass: 'fa fa-edit fa-xs'
//     }];

//     function actionClicked(actionName, entity) {
//       if (actionName) {
//         switch (actionName) {
//         case 'addMrInfra':
//           addmrinfra(entity.id);
//           break;
//         case 'UpdateMeetingRoom':
//           UpdateMeetingRoom(entity.id);
//           break;
//         case 'getById':
//           getById(entity.id);
//           break;
//         }
//       }
//     }

//     function addmrinfra(selectedId) {
//       console.log(selectedId);
//       $state.go('wams.addmrinfra', {
//         roomid: selectedId
//       });
//     }

//     function UpdateMeetingRoom(selectedId) {
//       $state.go('wams.updatemeetingroom', {
//         roomid: selectedId
//       });
//     }

//     function open(size, resp) {
//       console.log(resp);
//       var modalInstance = $modal.open({
//         animation: true,
//         templateUrl: 'meetingroom/view/meetingRoomInfo.tpl.html',
//         controller: 'MeetingRoomInfoCtrl as vm',
//         size: size,
//         resolve: {
//           data: function () {
//             return resp;
//           }
//         }
//       });

//       modalInstance.result.then(function (data) {
//         vm.editdata = data;
//       }, function () {
//         console.log('Modal dismissed at: ' + new Date());
//       });
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
//       id: 'location',
//       title: 'Location',
//       isAction: false
//     }, {
//       id: 'capacity',
//       title: 'Capacity',
//       isAction: false
//     }];

//     vm.FlipColumns = [{
//       id: 'status',
//       title: 'Status'
//     }, {
//       id: 'type',
//       title: 'Type'
//     }];
//     vm.searchText = '';

//     function toggled(a) {
//       console.log('Dropdown is now: ', a);
//     }

//     function ajaxFaker() {
//       $state.reload();
//     }


//     function getById(entityId) {
//       meetingRoomService.getMeetingRoomById(entityId).then(function (resp) {
//         console.log(JSON.stringify(resp));
//         open('lg', resp);
//       });
//     }

//     function getAllMeetingRooms() {
//       wamsServices.getEntity({
//         request: {
//           limit: 20,
//           offset: 0
//         },
//         key: 'meetingRooms'
//       }).then(function (response) {
//         // vm.entity = response.rows;
//         // vm.count = response.count;
//         // createPaging(response.count, 1, 10);
//         if (!response) {
//           vm.noData = true;
//           notifier.error('Problem encountered while fetching premises');
//           return;
//         }
//         if (response.rows && response.rows.length === 0) {
//           vm.noData = true;
//           notifier.error('Unable to fetch data');
//           return;
//         }
//         vm.entity = response.rows;
//         vm.premisesDetails = response.rows[0];
//         vm.pagingOptions.rowCount = 1;
//         vm.pagingOptions.columnCount = 20;
//         vm.pagingOptions.recordsPerPage = 20;
//         if (response.count < 10) {
//           vm.shownCount = response.count;
//         }
//         vm.count = response.count;
//       }, function (error) {
//         notifier.error('Unable to fetch data' + error.message);
//       });
//     }

//     vm.pagingArray = [];
//     vm.totalItems = 1;
//     vm.currentPage = 1;
//     vm.maxSize = 1;
//     vm.startPage = 1;
//     vm.endPage = 0;
//     vm.pageChanged = pageChanged;

//     function pageChanged(pageNo) {
//       pageNo -= 1;

//       meetingRoomService.getAllMeetingRooms({
//         limit: vm.maxSize,
//         offset: pageNo * vm.maxSize
//       }).then(function (response) {
//         vm.entity = response.rows;
//       });
//     }


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

//     vm.setPage = function (b) {
//       vm.currentPage = b;
//     };
//   }
// })();
