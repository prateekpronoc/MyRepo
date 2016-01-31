(function () {
  'use strict';

  angular
    .module('wams.infrastructure')
    .controller('PremisesCtrl', PremisesCtrl);

  /* @ngInject */
  function PremisesCtrl(session, wamsServices, _, notifier, $stateParams, $state, $modal) {
    /*jshint validthis: true */
    var vm = this;
    vm.title = 'Ctrl';
    vm.page = {
      title: 'Create Premises'
    };
    vm.updateMode = false;
    vm.premises = {
      stateId: null,
      cityId: null
    };
    var serverData = {};
    vm.ui = {
      stateValues: '',
      cityValues: ''
    };
    vm.createmore = false;
    vm.getCityCatalog = getCityCatalog;
    vm.savePremises = savePremises;
    vm.getLocCatalog = getLocCatalog;
    vm.reset = reset;
    vm.cancel = cancel;
    vm.notReadable = false;
    vm.getUserById = getUserById;
    vm.addNew = addNew;
    activate();

    function activate() {
      if (angular.isDefined($stateParams.premisesId) && $stateParams.premisesId > 0) {
        getPremisesById($stateParams.premisesId);
        vm.updateMode = true;
        vm.page = {
          title: 'Update Premises'
        };
      }
      getStateCatalog();
      getAllusers();
    }

    function addNew() {
      vm.notReadable = false;
      vm.premises.contactPerson = '';
      vm.premises.contactPersonName = '';
      vm.premises.contactNo = '';
      vm.premises.email = '';
    }

    function getAllusers() {
      vm.allusers = {};
      wamsServices.getEntity({
        request: {
          tenantId: parseInt(session.getTenantId())
        },
        key: 'users'
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
        //vm.allusers = response.rows;
        angular.forEach(response.rows, function (val) {
          vm.allusers[val.id] = val.name;
        });
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function getUserById(id) {
      console.log('Selected Id ' + id);
      vm.notReadable = true;
      wamsServices.getEntity({
        request: {
          id: id
        },
        key: 'users'
      }).then(function (response) {
        vm.managerdetails = response.rows[0];
        if (vm.managerdetails) {
          vm.premises.contactPersonName = vm.managerdetails.name;
          vm.premises.contactNo = vm.managerdetails.mobile;
          vm.premises.email = vm.managerdetails.email;

        } else {
          vm.premises.contactPersonName = '';
          vm.premises.contactNo = '';
          vm.premises.email = '';
          alert('this user is not a manager');
        }
      });
    }

    function getPremisesById(premisesId) {
      wamsServices.getEntity({
        key: 'premises',
        request: {
          id: premisesId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching premise information');
          return;
        }
        serverData = response.rows[0];
        vm.premises = response.rows[0];
        // fetchMasterCatalogValues();
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getStateCatalog() {
      wamsServices.getEntity({
        request: {
          masterId: 5
        },
        key: 'catalogValues'
      }).then(function (response) {
        vm.state = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'value'));
        console.log(vm.state);
      });
    }

    function getCityCatalog() {
      vm.ui.cityValues = {};
      if (vm.premises.stateId === null) {
        return;
      }
      wamsServices.getEntity({
        request: {
          parentId: vm.premises.stateId
        },
        key: 'catalogValues'
      }).then(function (response) {
        if (!response) {
          notifier.error('Problem encountered while fetching buildings');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          notifier.error('Unable to fetch data');
          return;
        }
        //vm.ui.cityValues = response.rows;
        console.log(JSON.stringify(vm.ui.cityValues));
        angular.forEach(response.rows, function (val) {
          vm.ui.cityValues[val.id] = val.value;
        });
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function savePremises() {
      vm.premisesdetails = {
        name: vm.premises.name,
        cityId: vm.premises.cityId,
        location: vm.premises.location,
        address: vm.premises.address,
        //contactPerson: vm.premises.contactPerson,
        contactPersonName: vm.premises.contactPersonName,
        contactNo: vm.premises.contactNo,
        email: vm.premises.email,
        status: 0
      };
      if (vm.premises.checkbox) {
        vm.premisesdetails.contactPerson = 0;
      } else {
        vm.premisesdetails.contactPerson = vm.premises.contactPerson;
      }
      if (vm.updateMode) {
        vm.premisesdetails.id = vm.premises.id;
      }
      if (vm.premisesdetails) {
        openConfirmation(vm.premisesdetails);
      }

    }

    function openConfirmation(premisesdetails) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'infrastructure/saveConfirmation.html',
        controller: 'saveConfirmationCtrl as vm',
        size: 'sm',
        resolve: {
          data: function () {
            return premisesdetails;
          }
        }
      });

      modalInstance.result.then(function (data) {
          vm.saveconfirmation = data;
          if (vm.saveconfirmation === 'save') {
            console.log(JSON.stringify(vm.premisesdetails));
            wamsServices.saveEntity({
              key: 'premises',
              request: vm.premisesdetails
            }).then(function (response) {
              if (response) {
                if (_.has(response, 'statusCode')) {
                  notifier.error('Problem encountered while saving data :' + response.message);
                  return;
                }
                notifier.success('Premises : ' + response.name + '  saved successfully');
                if (vm.createmore) {
                  vm.premises = {};
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
        vm.premises = serverData;
      }
    }

    function cancel() {
      $state.go('wams.viewAllPremises', {}, {
        reload: true
      });
    }

    function getLocCatalog() {
      vm.location = {};
      wamsServices.getEntity({
        request: {
          parentId: vm.premises.cityId
        },
        key: 'catalogValues'
      }).then(function (response) {
        angular.forEach(response.rows, function (val) {
          vm.location[val.id] = val.value;
        });
      });
    }
  }
})();

// (function () {
//   'use strict';
//   angular.module('wams.infrastructure')
//     .controller('AddPremisesCtrl', AddPremisesCtrl);

//   function AddPremisesCtrl($scope, $state, premisesServices, $timeout, toaster) {
//     var vm = this;
//     vm.premises = {};
//     vm.createPremises = createPremises;
//     vm.getCityCatalog = getCityCatalog;
//     vm.saveAndCreatePremises = saveAndCreatePremises;
//     vm.page = {
//       title: 'Create Premises'
//     };
//     vm.toggled = toggled;
//     vm.ajaxFaker = ajaxFaker;
//     vm.reset = reset;
//     vm.cancel = cancel;

//     function toggled(a) {
//       console.log('Dropdown is now: ', a);
//     }

//     function ajaxFaker() {
//       $state.reload();
//     }
//     activate();

//     function activate() {
//       getStatesCatalog();
//     }

//     function saveAndCreatePremises() {
//       var premisesdetails = {
//         name: vm.premises.name,
//         cityId: vm.premises.cityId,
//         location: vm.premises.location,
//         address: vm.premises.address,
//         contactPerson: 1,
//         contactNo: vm.premises.contactnumber,
//         email: vm.premises.email,
//         status: 0
//       };
//       // console.log(JSON.stringify(premisesdetails));
//       premisesServices.createPremises(premisesdetails).then(function (response) {
//         vm.premisesdetailspost = response;
//         if (!response.data.msg) {
//           //alert('success');
//           toaster.success({
//             title: '',
//             body: 'Premises is Created'
//           });
//           vm.premises = {};
//         } else {
//           //alert(response.data.msg);
//           toaster.error({
//             title: '',
//             body: response.data.msg
//           });
//         }

//         //   toaster.success({
//         //     title: '',
//         //     body: 'Premises is Created'
//         //   });
//         // }, function (response) {
//         //   toaster.error({
//         //     title: '',
//         //     body: 'Problem encounterd while saving Premises'
//         //   });
//       });
//     }

//     function createPremises() {
//       vm.saveAndCreatePremises();
//       $timeout(function () {
//         $state.go('wams.viewAllPremises', {}, {
//           reload: true
//         });
//       }, 3000);
//     }

//     function reset() {
//       vm.premises = '';
//     }

//     function cancel() {
//       $state.go('wams.viewAllPremises', {}, {
//         reload: true
//       });
//     }

//     function getStatesCatalog() {
//       premisesServices.getPremiseStateCatalog().then(function (response) {
//         vm.states = response;
//       });
//     }

//     function getCityCatalog() {
//       premisesServices.getPremiseCityCatalog().then(function (response) {
//         vm.cities = response;
//       });
//     }
//   }
// })();
