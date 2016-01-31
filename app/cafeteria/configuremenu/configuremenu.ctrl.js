(function () {
  'use strict';

  angular
    .module('wams.cafeteria')
    .controller('ConfigureMenuCtrl', ConfigureMenuCtrl);
  /* @ngInject */
  function ConfigureMenuCtrl(wamsServices, notifier) {
    var vm = this;
    vm.title = 'Configure Menu';
    vm.ui = {};
    vm.add = add;
    vm.ui.categories = [];
    vm.getAllFoodItems = getAllFoodItems;
    activate();

    ////////////////

    function activate() {
      vm.ui.categories.push({
        'category': 'Category1'
      });
      getCusineTypes();
      getFoodTypes();
      getAllFoodItems();
      getCategories();
    }

    function add(index) {
      vm.ui.categories.push({
        'category': 'Category' + index,
      });
      if (_.has(vm.ui.categories[vm.ui.categories.length - 2].categoryname, 'value')) {
        // vm.categoryname = _.pluck(vm.ui.categories, 'categoryname')[vm.ui.categories.length - 2].value;
        vm.alreadyexist = true;
        notifier.error('Category already exist so choose the category');
        return;
      } else {
        vm.categoryname = _.pluck(vm.ui.categories, 'categoryname')[vm.ui.categories.length - 2];
      }
      console.log(vm.categoryname);
      var req = {
        value: vm.categoryname,
        masterId: 19,
        parentId: 0,
        description: vm.categoryname,
      };
      console.log(req);
      // wamsServices.saveEntity({
      //   key: 'catalogValues',
      //   request: req
      // }).then(function (response) {
      //   if (response) {
      //     if (_.has(response, 'statusCode')) {
      //       notifier.error('Problem encountered while saving data :' + response.message);
      //       return;
      //     }
      //     if (_.has(response, 'value')) {
      //       notifier.success('Master Catalog : ' + response.value + '  saved successfully');
      //     }
      //   }
      // }, function (error) {
      //   notifier.error('Problem encountered while saving data :' + error.message);
      // });
    }

    function getCusineTypes() {
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          masterId: 12
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching premises information');
          return;
        }
        vm.cusines = response.rows;
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getFoodTypes() {
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          masterId: 13
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching premises information');
          return;
        }
        vm.types = response.rows;
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getAllFoodItems() {
      vm.foodItems = {};
      wamsServices.getEntity({
        request: {
          typeId: vm.ui.typeId,
          cusineId: vm.ui.cusineId
        },
        key: 'fooditems'
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
        //console.log(JSON.stringify(vm.entity));
        _.forEach(response.rows, function (val) {
          vm.foodItems[val.id] = val.name;
        });
        // console.log(JSON.stringify(vm.foodItems));
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }

    function getCategories() {
      vm.foodCategories = {};
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          masterId: 19
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching premises information');
          return;
        }
        vm.foodCategories = response.rows;
        // _.forEach(response.rows, function (val) {
        //   vm.foodCategories[val.id] = val.value;
        // });
      }, function (error) {
        notifier.error(error.message);
      });
    }
  }
})();

// (function () {
//   'use strict';

//   angular
//     .module('wams.cafeteria')
//     .controller('ConfigureMenuCtrl', ConfigureMenuCtrl);
//   /* @ngInject */
//   function ConfigureMenuCtrl(wamsServices, notifier) {
//     var vm = this;
//     vm.title = 'Configure Menu';
//     vm.ui = {};
//     vm.noData = false;
//     //vm.ui.categories = [];
//     vm.remove = remove;
//     vm.add = add;
//     vm.selectedCatagories = selectedCatagories;
//     vm.getCategoriesAdded = getCategoriesAdded;
//     vm.getAllFoodItems = getAllFoodItems;
//     // vm.addMealMaking = addMealMaking;
//     // vm.getCategoryAdded = getCategoryAdded;
//     activate();

//     ////////////////

//     function activate() {
//       vm.ui.categories.push({
//         'id': 1,
//         'category': 'Category1'
//       });
//       getCusineTypes();
//       getFoodTypes();
//       getAllFoodItems();
//       getCategories();
//       getMealTypes();
//     }

//     function getMealTypes() {
//       vm.mealTypes = {};
//       wamsServices.getEntity({
//         key: 'catalogValues',
//         request: {
//           masterId: 20
//         }
//       }).then(function (response) {
//         if (!response || response.rows.length === 0) {
//           notifier.error('Problem encountered while fetching premises information');
//           return;
//         }
//         //vm.mealTypes = response.rows;
//         _.forEach(response.rows, function (val) {
//           vm.mealTypes[val.id] = val.value;
//         });
//       }, function (error) {
//         notifier.error(error.message);
//       });
//     }

//     function getCategories() {
//       vm.foodCategories = {};
//       wamsServices.getEntity({
//         key: 'catalogValues',
//         request: {
//           masterId: 19
//         }
//       }).then(function (response) {
//         if (!response || response.rows.length === 0) {
//           notifier.error('Problem encountered while fetching premises information');
//           return;
//         }
//         //vm.foodCategories = response.rows;
//         _.forEach(response.rows, function (val) {
//           vm.foodCategories[val.id] = val.value;
//         });
//       }, function (error) {
//         notifier.error(error.message);
//       });
//     }

//     function getCusineTypes() {
//       wamsServices.getEntity({
//         key: 'catalogValues',
//         request: {
//           masterId: 12
//         }
//       }).then(function (response) {
//         if (!response || response.rows.length === 0) {
//           notifier.error('Problem encountered while fetching premises information');
//           return;
//         }
//         vm.cusines = response.rows;
//       }, function (error) {
//         notifier.error(error.message);
//       });
//     }

//     function getFoodTypes() {
//       wamsServices.getEntity({
//         key: 'catalogValues',
//         request: {
//           masterId: 13
//         }
//       }).then(function (response) {
//         if (!response || response.rows.length === 0) {
//           notifier.error('Problem encountered while fetching premises information');
//           return;
//         }
//         vm.types = response.rows;
//       }, function (error) {
//         notifier.error(error.message);
//       });
//     }

//     function add(index) {
//       // vm.ui.categories.push({
//       //   'category': 'Category' + index
//       //     // 'id': vm.foodCategories.id,
//       // });
//       // var req = {
//       //   value: "Vegetarian Starters",
//       //   masterId: 19,
//       //   parentId: 0,
//       //   description: "Vegetarian Starters",
//       // };
//       // wamsServices.saveEntity({
//       //   key: 'catalogValues',
//       //   request: req
//       // }).then(function (response) {
//       //   if (response) {
//       //     if (_.has(response, 'statusCode')) {
//       //       notifier.error('Problem encountered while saving data :' + response.message);
//       //       return;
//       //     }
//       //     if (_.has(response, 'value')) {
//       //       notifier.success('Master Catalog : ' + response.value + '  saved successfully');
//       //     }
//       //   }
//       // }, function (error) {
//       //   notifier.error('Problem encountered while saving data :' + error.message);
//       // });
//       //console.log(vm.ui.categories); //entered categories in wizard1
//     }

//     function remove(index) {
//       // if (vm.ui.categories.length > 1) {
//       //   vm.ui.categories.splice(index, 1);
//       // }
//     }

//     function getAllFoodItems() {
//       vm.foodItems = {};
//       wamsServices.getEntity({
//         request: {
//           typeId: vm.ui.typeId,
//           cusineId: vm.ui.cusineId
//         },
//         key: 'fooditems'
//       }).then(function (response) {
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
//         //console.log(JSON.stringify(vm.entity));
//         _.forEach(response.rows, function (val) {
//           vm.foodItems[val.id] = val.name;
//         });
//         // console.log(JSON.stringify(vm.foodItems));
//       }, function (error) {
//         notifier.error('Unable to fetch data' + error.message);
//       });
//     }

//     function selectedCatagories() {
//       vm.addedcategory = _.filter(vm.entity, 'isSelected');
//       //console.log(JSON.stringify(vm.addedcategory));
//       processingSelectedCatagories();
//     }
//     // vm.categoriesSelected = [];

//     function processingSelectedCatagories() {
//       vm.selectedId = _.pluck(_.filter(vm.addedcategory, {
//         'selected': true
//       }), 'id');
//       angular.forEach(vm.ui.categories, function (val) {
//         if (val.categoryid === vm.ui.addtocategory) {
//           val.itemids = vm.selectedId;
//           // vm.ui.categories.push({
//           //   'categoryid': vm.ui.addtocategory,
//           //   'itemids': vm.selectedId
//           // });
//         }
//       });
//       console.log(JSON.stringify(vm.ui.categories));
//       // angular.forEach(vm.addedcategory, function (val) {
//       //   val.itemids = vm.selectedId;
//       //   // vm.ui.categories.push({
//       //   //   'categoryid': vm.ui.addtocategory,
//       //   //   'itemids': vm.selectedId
//       //   // });
//       // });
//       // console.log(JSON.stringify(vm.addedcategory));
//     }

//     function getCategoriesAdded() {
//       angular.forEach(vm.ui.categories, function (val) {
//         if (val.categoryid === vm.ui.addedtocategory) {
//           vm.categoryAddedItems = val.itemids
//         }
//       });
//       //console.log(JSON.stringify(vm.categoryAddedItems));
//     }

//     // function getCategoryAdded() {
//     //   angular.forEach(vm.addedcategory, function (val) {
//     //     //console.log(JSON.stringify(val));
//     //   });
//     // }

//     // function addMealMaking() {

//     // }
//   }
// })();
