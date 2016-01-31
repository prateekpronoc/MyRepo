(function () {
  'use strict';

  angular
    .module('wams.company')
    .controller('AddCompanyCtrl', AddCompanyCtrl);

  /* @ngInject */
  function AddCompanyCtrl($stateParams, wamsServices, notifier, _, $state, $modal) {
    /*jshint validthis: true */
    var vm = this;
    vm.title = 'Create Company';
    vm.company = {};
    var serverData = {};
    vm.updateMode = false;
    vm.createmore = false;
    vm.saveCompany = saveCompany;
    vm.reset = reset;
    vm.cancel = cancel;
    activate();

    function activate() {
      if (angular.isDefined($stateParams.companyId) && $stateParams.companyId > 0) {
        getcompanyDetailsById($stateParams.companyId);
        vm.updateMode = true;
        vm.page = {
          title: 'Update Company'
        };
      }
      getTenantTypes();
    }

    function getTenantTypes() {
      vm.tenantTypes = {};
      wamsServices.getEntity({
        request: {
          masterId: 17
        },
        key: 'catalogValues'
      }).then(function (response) {
        //vm.tenantTypes = response.rows;
        vm.tenantTypes = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'value'));
        // _.forEach(vm.costConfigEntity, function (val) {
        //   vm.cf.factorVal = vm.factors[val.factor];
        // });
      });
    }

    function getcompanyDetailsById(companyId) {
      wamsServices.getEntity({
        key: 'tenants',
        request: {
          id: companyId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching Company details');
          return;
        }
        serverData = response.rows[0];
        vm.company = response.rows[0];
        console.log(JSON.stringify(vm.company));
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function saveCompany() {
      vm.companydetails = {
        name: vm.company.name,
        alias: vm.company.name,
        type: vm.company.type,
        contactPerson: vm.company.contactPerson,
        contactNumber: vm.company.contactNumber,
        contactEmail: vm.company.contactEmail,
        employeeStrength: vm.company.capacity,
        address: vm.company.address,
        area: vm.company.area,
        occupancy: vm.company.occupancy,
        status: 0
      };
      if (vm.updateMode) {
        vm.companydetails.id = vm.company.id;
      }
      if (vm.companydetails) {
        openConfirmation(vm.companydetails);
      }
    }

    function openConfirmation(companydetails) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'company/tenantConfirmation.html',
        controller: 'tenantConfirmationCtrl as vm',
        size: 'sm',
        resolve: {
          data: function () {
            return companydetails;
          }
        }
      });

      modalInstance.result.then(function (data) {
          vm.saveconfirmation = data;
          if (vm.saveconfirmation === 'save') {
            console.log(JSON.stringify(vm.companydetails));
            wamsServices.saveEntity({
              key: 'tenants',
              request: vm.companydetails
            }).then(function (response) {
              if (response) {
                if (_.has(response, 'statusCode')) {
                  notifier.error('Problem encountered while saving data :' + response.message);
                  return;
                }
                notifier.success('Tenant : ' + response.name + '  saved successfully');
                if (vm.createmore) {
                  vm.company = {};
                } else {
                  vm.cancel();
                }
              }
            }, function (error) {
              notifier.error('Problem encountered while saving data :' + error.message);
            });
          } else {
            console.log('cancel');
          }
        },
        function () {
          console.log('Modal dismissed at: ' + new Date());
        });
    }

    function reset() {
      if (!vm.updateMode) {
        vm.company = serverData;
      }
    }

    function cancel() {
      $state.go('wams.viewAllCompanies');
    }
  }
})();





// (function () {
//   'use strict';

//   angular
//     .module('wams.company')
//     .controller('AddCompanyCtrl', AddCompanyCtrl);

//   /* @ngInject */
//   function AddCompanyCtrl(CompaniesService, $state, $timeout) {
//     var vm = this;
//     vm.createCompany = createCompany;
//     vm.saveAndCreateCompanies = saveAndCreateCompanies;
//     vm.companies = {};
//     vm.page = {
//       title: 'Create Company'
//     };
//     vm.toggled = toggled;
//     vm.ajaxFaker = ajaxFaker;
//     vm.reset = reset;
//     vm.cancel = cancel;


//     activate();

//     function toggled(a) {
//       console.log('Dropdown is now: ', a);
//     }

//     function ajaxFaker() {
//       $state.reload();
//     }
//     activate();

//     function createCompany() {
//       vm.saveAndCreateCompanies();
//       $timeout(function () {
//         $state.go('wams.viewAllCompanies', {}, {
//           reload: true
//         });
//       }, 3000);
//     }

//     function activate() {}

//     function saveAndCreateCompanies() {
//       var companydetails = {
//         name: vm.companies.name,
//         alias: vm.companies.name,
//         type: vm.companies.type,
//         contactPerson: vm.companies.person,
//         contactNumber: vm.companies.contactnumber,
//         contactEmail: vm.companies.email,
//         employeeStrength: vm.companies.strength,
//         address: vm.companies.address,
//         status: 0
//       };
//       // console.log(JSON.stringify(companydetails));
//       CompaniesService.createCompany(companydetails).then(function (response) {
//         vm.companies = '';
//         vm.companydetailspost = response;
//         console.log('companydetailspost' + JSON.stringify(vm.companydetailspost));
//         alertMessage();
//       });
//     }

//     vm.alerts = [];

//     function alertMessage() {
//       var alert = {
//         msg: 'Company is Created.'
//       };
//       vm.alerts.push(alert);

//       $timeout(function () {
//         vm.alerts.splice(0, 1);
//       }, 3000);
//     }

//     function reset() {
//       vm.companies = '';
//     }

//     function cancel() {
//       $state.go('wams.viewAllCompanies', {}, {
//         reload: true
//       });
//     }
//   }
// })();
