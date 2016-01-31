(function () {
  'use strict';

  angular
    .module('wams.admin')
    .controller('AllUsersCtrl', AllUsersCtrl);

  /* @ngInject */
  function AllUsersCtrl(notifier, wamsServices, commonService, $state, _, $modal, $filter, session) {
    var vm = this;
    vm.getById = getById;
    vm.getInfo = getInfo;
    vm.page = {
      title: 'All Users'
    };
    vm.session = session;
    vm.noData = false;
    vm.pagingOptions = commonService.getPagingOptions();
    vm.pageChanged = pageChanged;
    vm.shownCount = 10;
    vm.maxSize = 10;
    vm.pageNo = 0;
    vm.applyAction = applyAction;
    vm.columnCollection = [{
      id: 'employeeId',
      title: 'Employee Id',
      isAction: true
    }, {
      id: 'firstName',
      title: 'Name',
      isAction: false
    }, {
      id: 'officialMail',
      title: 'Email-Id',
      isAction: false
    }, {
      id: 'mobile',
      title: 'Mobile No',
      isAction: false
    }];
    if (session.hasRole('SuperAdmin')) {
      vm.columnCollection.push({
        id: 'company',
        title: 'Company',
        isAction: false
      });
    }
    vm.pageChanged = pageChanged;
    var orderBy = $filter('orderBy');
    vm.order = order;
    vm.selectAll = selectAll;
    vm.openAdvanceSearch = openAdvanceSearch;
    vm.searchDetails = {};
    activate();

    ////////////////

    function activate() {
      getAllUsers();
      getAllCompanies();
    }
    vm.selectedAll = !1;

    function selectAll() {
      vm.selectedAll = vm.selectedAll ? !1 : !0;
      angular.forEach(vm.entity, function (b) {
        b.selected = vm.selectedAll;
      });
    }

    function getAllCompanies() {
      vm.entity = [];
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
        vm.companyDetails = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'name'));
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function applyAction() {
      if (vm.ui.actionId) {
        switch (vm.ui.actionId) {
        case '1':
          tagToGroup();
          break;
        case '2':
          console.log('case2');
          break;
        }
      }
    }

    function tagToGroup() {
     // console.log(JSON.stringify(vm.entity));
      var selectedId = _.pluck(_.filter(vm.entity, {
        'isSelected': true
      }), 'uid');

      if (selectedId.length === 0) {
        notifier.error('Please select users');
        return;
      }
      var modalInstance = $modal.open({
        animation: vm.animationsEnabled,
        templateUrl: 'admin/users/groups/createusergroup.html',
        controller: 'UserGroupCtrl as vm',
        size: 'lg',
        resolve: {
          data: function () {
            return selectedId;
          }
        }
      });
      modalInstance.result.then(function () {

      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }

    function order(predicate, reverse) {
      vm.entity = orderBy(vm.entity, predicate, reverse);

    }

    function getAllUsers() {
      vm.entity = [];
      var req = {
        limit: 10,
        offset: 0
      };
      if (session.hasRole('TenantAdmin')) {
        req.company = parseInt(session.getTenantId());
      }
      if (vm.searchDetails) {
        req.id = vm.searchDetails.firstName;
        req.employeeId = vm.searchDetails.employeeId;
        req.company = vm.searchDetails.company;
      }
      console.log(JSON.stringify(req));
      wamsServices.getEntity({
        request: req,
        key: 'userprofiles'
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
        console.log(JSON.stringify(response.rows));
        vm.entity = response.rows;
        vm.usersDetails = response.rows[0];
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

    function getById(userId) {
      vm.usersDetails = _.filter(vm.entity, {
        id: userId
      })[0];
    }

    function pageChanged(pageNo) {
      pageNo -= 1;
      vm.entity = [];
      var req = {
        limit: vm.maxSize,
        offset: pageNo * vm.maxSize
      };
      if (session.hasRole('TenantAdmin')) {
        req.company = parseInt(session.getTenantId());
      }
      if (vm.searchDetails) {
        req.id = vm.searchDetails.firstName;
        req.employeeId = vm.searchDetails.employeeId;
        req.company = vm.searchDetails.company;
      }
      wamsServices.getEntity({
        request: req,
        key: 'userprofiles'
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
        vm.usersDetails = response.rows[0];
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

    function openAdvanceSearch() {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'admin/users/view/searchModal.tpl.html',
        controller: 'AdvanceSearchCtrl as vm',
        size: 'lg',
        resolve: {
          data: function () {
            return vm.searchDetails;
          }
        }
      });
      modalInstance.result.then(function (data) {
        console.log(JSON.stringify(data));
        vm.searchDetails = data;
        getAllUsers();
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }

    function getInfo(id) {
      wamsServices.getEntity({
        key: 'userprofiles',
        request: {
          id: id
        }
      }).then(function (response) {
        console.log(response);
        var modalInstance = $modal.open({
          animation: vm.animationsEnabled,
          templateUrl: 'admin/users/view/userinfo.tpl.html',
          controller: 'UserInfoCtrl as vm',
          size: 'lg',
          resolve: {
            userdata: function () {
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









// (function () {
//   'use strict';

//   angular
//     .module('wams.admin')
//     .controller('AllUsersCtrl', AllUsersCtrl);

//   /* @ngInject */
//   function AllUsersCtrl(userService, _, $window, $modal, fetcher, fetchEntity) {
//     var vm = this;
//     vm.getById = getById;
//     vm.page = {
//       title: 'All Users'
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
//       id: 'mobile',
//       title: 'Mobile No',
//       isAction: false
//     }, {
//       id: 'phone',
//       title: 'Contact No',
//       isAction: false
//     }, {
//       id: 'email',
//       title: 'Email-Id',
//       isAction: false
//     }];
//     vm.pageChanged = pageChanged;
//     activate();

//     ////////////////

//     function activate() {
//       getAllUsers();
//     }

//     function getAllUsers() {
//       vm.entity = [];
//       fetcher.get({
//         request: {
//           limit: 4,
//           offset: 0
//         },
//         key: 'users'
//       }).then(function (response) {
//         //  console.logs
//         vm.entity = response.rows;
//         vm.count = response.count;
//         createPaging(response.count, 1, 4);
//       });
//     }

//     function pageChanged(pageNo) {
//       pageNo -= 1;
//       userService.getAllUsers({
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

// function createPaging(totalCount, pageNo, pageItemCount) {
//   var i = 0;
//   vm.totalItems = totalCount;
//   vm.currentPage = pageNo;
//   vm.maxSize = pageItemCount;
//   vm.maxPageLimit = $window.Math.ceil(totalCount / pageItemCount);
//   for (i = 1; i <= vm.maxPageLimit; i = i + 1) {
//     vm.pagingArray.push(i);
//   }
//   vm.endPage = vm.maxPageLimit;
//   // vm.bigTotalItems = 175;
//   // vm.bigCurrentPage = 1;
// }

//     function getById(premisesid) {
//       fetchEntity.getById({
//         key: 'users',
//         request: {
//           id: premisesid
//         }
//       }).then(function (response) {
//         // console.log('Get By id : ');
//         console.log(response);
//         var modalInstance = $modal.open({
//           animation: vm.animationsEnabled,
//           templateUrl: 'infrastructure/viewpremisesinfo.html',
//           controller: 'viewPremisesInfo as vm',
//           size: 'lg',
//           resolve: {
//             viewpremisesinfo: function () {
//               return response;
//             }
//           }
//         });
//         modalInstance.result.then(function () {

//         }, function () {
//           console.log('Modal dismissed at: ' + new Date());
//         });
//       });
//     }
//     function getById(id) {
//       fetchEntity.getById({
//         key: 'users',
//         request: {
//           id: id
//         }
//       }).then(function (response) {
//         // console.log('Get By id : ');
// //        console.log(response);
//         var modalInstance = $modal.open({
//           animation: vm.animationsEnabled,
//           templateUrl: 'admin/users/view/userinfo.tpl.html',
//           controller: 'UserInfoCtrl as vm',
//           size: 'lg',
//           resolve: {
//             userdata: function () {
//               return response.rows;
//             }
//           }
//         });
//         modalInstance.result.then(function () {

//         }, function () {
// //          console.log('Modal dismissed at: ' + new Date());
//         });
//       });
//     }
//   }
// })();
