(function () {
  'use strict';

  angular
    .module('wams.configuration')
    .controller('AddcatalogCtrl', AddcatalogCtrl);

  /* @ngInject */
  function AddcatalogCtrl(wamsServices, notifier, $state) {
    var vm = this;
    vm.title = 'Add Catalog';
    vm.ui = {};
    vm.createCatalogObject = createCatalogObject;
    vm.fetchMasterAndParentValue = fetchMasterAndParentValue;
    vm.fetchParentCatalogValue = fetchParentCatalogValue;
    vm.reset = reset;
    vm.cancel = cancel;

    activate();

    ////////////////

    function activate() {
      fetchMasterCatalogs();
      vm.ui.selectentity = '0';
    }

    function reset() {
      vm.ui = {};
    }

    function cancel() {
      $state.go('wams.addConfiguration');
    }

    function fetchMasterCatalogs() {
      vm.mcValues = {};
      wamsServices.getEntity({
        request: {},
        key: 'catalogmasters'
      }).then(function (response) {
        vm.mcValues = response.rows;
        // angular.forEach(response.rows, function (val) {
        //   vm.mcValues[val.id] = val.name;
        // });
      });
    }

    function fetchMasterAndParentValue() {
      vm.parentMCValues = {};
      if (!angular.isDefined(vm.ui.mcId)) {
        return;
      }

      var temp = _.filter(vm.mcValues, {
        id: parseInt(vm.ui.mcId)
      })[0];
      if (temp.parentId === null) {
        return vm.noData;
      } else {
        wamsServices.getEntity({
          request: {
            id: temp.parentId
          },
          key: 'catalogmasters'
        }).then(function (response) {
          angular.forEach(response.rows, function (val) {
            vm.parentMCValues[val.id] = val.name;
          });
        });
      }

    }

    function fetchParentCatalogValue() {
      wamsServices.getEntity({
        request: {
          masterId: vm.ui.pmcId
        },
        key: 'catalogValues'
      }).then(function (response) {
        vm.catalogValues = response.rows;
      });

    }

    function createCatalogObject() {
      var reqObj = {};

      reqObj.description = vm.ui.description;

      if (vm.ui.selectentity === '0') {
        reqObj.name = vm.ui.name;
        if (angular.isDefined(vm.ui.mcId) && vm.ui.mcId !== null) {
          reqObj.parentId = vm.ui.mcId;
        } else {
          reqObj.parentId = 0;
        }
        serviceCall(reqObj, 'catalogmasters');
        //service call method with key catalogMaster
      } else {
        // 1. validation for Master Catalog;
        // 2. Parent Catalog values
        // 3. Catalog Value

        // reqObj.masterId = vm.ui.mcId; //City
        // reqObj.parentId = vm.ui.pcvId; // to which city i m assinging it.
        reqObj.value = vm.ui.name;
        if (angular.isDefined(vm.ui.pcvId) && vm.ui.pcvId !== null) {
          reqObj.masterId = vm.ui.mcId;
          reqObj.parentId = vm.ui.pcvId;
        } else {
          reqObj.masterId = vm.ui.mcId;
          reqObj.parentId = '0';
        }
        // service call method with key catalogValues
        serviceCall(reqObj, 'catalogValues');
      }

      console.log(reqObj);
      // var reqObj = {};
      // if (angular.isDefined(vm.ui.mcId) && vm.ui.mcId !== null) {
      //   reqObj.parentId = vm.ui.mcId;
      // } else {
      //   reqObj.parentId = 0;
      // }
      // // if (angular.isDefined(vm.ui.pcvId) && vm.ui.pcvId !== null) {
      // //   reqObj.masterId = vm.ui.mcId;
      // //   reqObj.parentId = vm.ui.pcvId;
      // // } else {
      // //   reqObj.masterId = vm.ui.mcId;
      // //   reqObj.parentId = 0;
      // // }


      // console.log(reqObj);
    }

    function serviceCall(req, key) {
      console.log(key);
      wamsServices.saveEntity({
        key: key,
        request: req
      }).then(function (response) {
        if (response) {
          if (_.has(response, 'statusCode')) {
            notifier.error('Problem encountered while saving data :' + response.message);
            return;
          }
          if (_.has(response, 'value')) {
            notifier.success('Master Catalog : ' + response.value + '  saved successfully');
          } else {
            notifier.success('Master Catalog : ' + response.name + '  saved successfully');
          }
          if (vm.createmore) {
            vm.ui = {};
          } else {
            cancel();
          }
        }
      }, function (error) {
        notifier.error('Problem encountered while saving data :' + error.message);
      });
    }
  }
})();

// (function () {
//   'use strict';

//   angular
//     .module('wams.configuration')
//     .controller('AddcatalogCtrl', AddcatalogCtrl);
//   /* @ngInject */
//   function AddcatalogCtrl(wamsServices, notifier) {
//     var vm = this;
//     vm.title = 'Create Catalogs';
//     vm.ui = {};
//     vm.createmore = false;
//     vm.catalogValues = {};
//     vm.saveCatalogValues = saveCatalogValues;
//     vm.fetchCatalogValues = fetchCatalogValues;
//     activate();

//     ////////////////

//     function activate() {
//       getMasterCatalog();
//     }

//     function getMasterCatalog() {
//       vm.masterCatalog = {};
//       wamsServices.getEntity({
//         request: {},
//         key: 'catalogmasters'
//       }).then(function (response) {
//         angular.forEach(response.rows, function (val) {
//           vm.masterCatalog[val.id] = val.name;
//         });
//       });
//     }

//     vm.fetchMasterAndParentValue = fetchMasterAndParentValue;

//     function fetchMasterAndParentValue () {

//     }

//     function fetchCatalogValues() {
//       vm.catalogValues = {};
//       //vm.preCatalogValues = {};
//       if (vm.ui.mcId === null) {
//         return;
//       }
//       wamsServices.getEntity({
//         request: {
//           masterId: vm.ui.mcId
//         },
//         key: 'catalogValues'
//       }).then(function (response) {
//         // angular.forEach(response.rows, function (val) {
//         //   vm.catalogValues[val.id] = val.value;
//         // });
//         vm.preCatalogValues = response.rows;
//       }).then(function (response) {
//         wamsServices.getEntity({
//           request: {
//             id: vm.preCatalogValues[0].parentId
//           },
//           key: 'catalogValues'
//         }).then(function (response) {
//           vm.catalogValues = response.rows;
//           // angular.forEach(response.rows, function (val) {
//           //   vm.catalogValues[val.id] = val.value;
//           // });
//         })
//       });
//     }

//     function saveCatalogValues() {
//       var reqObj = {};
//       // this block creates Master Catalog Value
//       if (vm.ui.isMaster) {
//         reqObj = {
//           name: vm.ui.name,
//           description: vm.ui.description
//         }
//         if (angular.isDefined(vm.ui.mcId) && vm.ui.mcId !== null) {
//           reqObj.parentId = vm.ui.mcId;
//         } else {
//           reqObj.parentId = 0;
//         }
//       } else { //Block to create Catalog Values
//         if (!angular.isDefined(vm.ui.mcId)) {
//           //Message to notify to select master catalog Value
//           return;
//         }
//         reqObj = {
//           name: vm.ui.name,
//           description: vm.ui.description,
//           masterId: vm.ui.mcId
//         };
//         if (angular.isDefined(vm.ui.cvId) && vm.ui.cvId !== null) {
//           reqObj.parentId = vm.ui.cvId;
//         } else {
//           reqObj.parentId = 0;
//         }

//       }

//       console.log(reqObj);
//     }

//     // function saveCatalogValues() {
//     //   if (vm.ui.mastercatalogId) {
//     //     console.log(vm.ui.mastercatalogId);
//     //     if (vm.ui.masterId) {
//     //       console.log(' create a child catalogmasters with parentId as mastercatalogId' +
//     //         'we have to post for catalogmasters');
//     //       vm.catalogDetails = {
//     //         name: vm.ui.name,
//     //         description: vm.ui.description,
//     //         parentId: vm.ui.mastercatalogId
//     //       };
//     //       vm.keyValue = 'catalogmasters';
//     //       console.log(JSON.stringify(vm.catalogDetails));
//     //       if (vm.ui.catalogValueId) {
//     //         console.log(
//     //           ' create a child catalogvalues with masterid as mastercatalogId and parentId as the catalogValueId' +
//     //           'we have to post for catalogValues');
//     //       } else {
//     //         console.log(' create a child catalogmasters with parentId as mastercatalogId' +
//     //           'we have to post for catalogValues');
//     //       }
//     //     } else {
//     //       console.log('create a child catalogvalues with masterid as mastercatalogId and parentId as zero' +
//     //         'we have to post for catalog values');
//     //       vm.catalogDetails = {
//     //         value: vm.ui.name,
//     //         description: vm.ui.description,
//     //         masterId: vm.ui.mastercatalogId,
//     //         parentId: 0
//     //       };
//     //       vm.keyValue = 'catalogValues';
//     //       console.log(JSON.stringify(vm.catalogDetails));
//     //     }
//     //   } else {
//     //     console.log('create new catalogmasters with parentId as mastercatalogId' +
//     //       'we have to post for catalogmasters');
//     //     vm.catalogDetails = {
//     //       name: vm.ui.name,
//     //       description: vm.ui.description,
//     //       parentId: 0
//     //     };
//     //     vm.keyValue = 'catalogmasters';
//     //     console.log(JSON.stringify(vm.catalogDetails));
//     //   }
//     //   // wamsServices.saveEntity({
//     //   //   key: vm.keyValue,
//     //   //   request: vm.catalogDetails
//     //   // }).then(function (response) {
//     //   //   if (response) {
//     //   //     if (_.has(response, 'statusCode')) {
//     //   //       notifier.error('Problem encountered while saving data :' + response.message);
//     //   //       return;
//     //   //     }
//     //   //     if (_.has(response, 'value')) {
//     //   //       notifier.success('Master Catalog : ' + response.value + '  saved successfully');
//     //   //     } else {
//     //   //       notifier.success('Master Catalog : ' + response.name + '  saved successfully');
//     //   //     }
//     //   //     if (vm.createmore) {
//     //   //       vm.ui = {};
//     //   //     } else {
//     //   //       console.log('no create more');
//     //   //     }
//     //   //   }
//     //   // }, function (error) {
//     //   //   notifier.error('Problem encountered while saving data :' + error.message);
//     //   // });
//     // }
//   }
// })();
