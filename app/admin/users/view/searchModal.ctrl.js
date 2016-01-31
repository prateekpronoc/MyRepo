(function () {
  'use strict';

  angular
    .module('wams.admin')
    .controller('AdvanceSearchCtrl', AdvanceSearchCtrl);
  /* @ngInject */
  function AdvanceSearchCtrl(_, wamsServices, $modalInstance, notifier, session, data) {
    var vm = this;
    vm.title = 'AdvanceSearch';
    vm.session = session;
    vm.premises = [];
    vm.ui = {};
    vm.cancel = cancel;
    vm.reset = reset;
    vm.searchData = searchData;
    vm.companyDetails = {};
    vm.getAllCompanies = getAllCompanies;
    vm.fetchBuildings = fetchBuildings;
    activate();

    ////////////////

    function activate() {
      console.log('searchDetails Modal' + JSON.stringify(data));
      vm.ui = data;
      vm.resp = data;
      fetchPremises();
      fetchBuildings();
      getAllCompanies();
      getAllUsers();
    }

    function fetchPremises() {
      wamsServices.getEntity({
        request: {
          limit: 100,
          offset: 0
        },
        key: 'premises'
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
        vm.premises = response.rows;
        getAllCompanies();
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function fetchBuildings() {
      vm.buildings = {};
      wamsServices.getEntity({
        request: {
          premiseId: vm.ui.premisesId
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
        vm.buildings = response.rows;
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function getAllCompanies() {
      var reqObj = {
        limit: 10,
        offset: 0
      };
      if (vm.ui.premisesId || vm.ui.buildingId) {
        reqObj.premiseId = vm.ui.premisesId;
        reqObj.buildingId = vm.ui.buildingId;
        serviceCall(reqObj, 'tenantpremises');
      } else {
        serviceCall(reqObj, 'tenants');
      }
    }

    function serviceCall(req, key) {
      var i, temp = [];
      vm.assignedtenantId = {};
      wamsServices.getEntity({
        request: req,
        key: key
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching tenants');
          return;
        }
        if (vm.companyDetails.length === 0) {
          console.log('no data');
        }
        if (vm.ui.premisesId || vm.ui.buildingId) {
          if (response.rows.length > 0) {
            vm.assignedtenantId = _.uniq(_.pluck(response.rows, 'tenantId'));
            for (i = 0; i < vm.assignedtenantId.length; i = i + 1) {
              _.forEach(vm.companyDetails, function (val) {
                if (val.id == vm.assignedtenantId[i]) {
                  temp.push(val);
                }
              });
            }
            vm.companyDetails = temp;
          }
        } else {
          vm.companyDetails = response.rows;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          vm.companyDetails = {};
          return;
        }

      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
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
        vm.usersDetails = response.rows;
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function searchData() {
      var searchdetails = {
        premisesId: vm.ui.premisesId,
        buildingId: vm.ui.buildingId,
        firstName: vm.ui.firstName,
        employeeId: vm.ui.employeeId
      };
      if (vm.ui.company) {
        searchdetails.company = vm.ui.company;
      } else {
        searchdetails.company = vm.assignedtenantId;
      }
      console.log(JSON.stringify(searchdetails));
      $modalInstance.close(searchdetails);
    }

    function cancel() {
      $modalInstance.close('cancel');
    }

    function reset() {
      vm.ui = {};
    }
  }
})();
