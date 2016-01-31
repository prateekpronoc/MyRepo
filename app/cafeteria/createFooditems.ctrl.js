(function () {
  'use strict';

  angular
    .module('wams.cafeteria')
    .controller('createFooditemsCtrl', createFooditemsCtrl);

  /* @ngInject */
  function createFooditemsCtrl(wamsServices, notifier, $stateParams, $modal, $state) {
    var vm = this;
    vm.title = 'Add Food Items';
    vm.updateMode = false;
    vm.ui = {};
    var serverData = {};
    vm.saveFoodItems = saveFoodItems;
    vm.cancel = cancel;
    vm.reset = reset;
    vm.uploadPic = uploadPic;
    activate();

    ////////////////

    function activate() {
      if (angular.isDefined($stateParams.fooditemId) && $stateParams.fooditemId > 0) {
        getFoodItemById($stateParams.fooditemId);
        vm.updateMode = true;
        vm.title = 'Update Food Item';
      } else {
        getCusineTypes();
        getFoodTypes();
      }
      getCategories();
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

    function cancel() {
      $state.go('wams.allFooditems', {}, {
        reload: true
      });
    }

    function reset() {
      if (!vm.updateMode) {
        vm.ui = serverData;
      }
    }

    function getFoodItemById(fooditemId) {
      wamsServices.getEntity({
        key: 'fooditems',
        request: {
          id: fooditemId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching cafeteria information');
          return;
        }
        serverData = response.rows[0];
        vm.ui = response.rows[0];
        console.log(JSON.stringify(vm.ui));

      }, function (error) {
        notifier.error(error.message);
      }).then(function (response) {
        getCusineTypes();
        getFoodTypes();
        if (vm.ui.image) {
          getUploadPic(vm.ui.image)
        }
      });
    }

    function saveFoodItems() {
      vm.fooddetails = {
        name: vm.ui.name,
        description: vm.ui.description,
        typeId: vm.ui.typeId,
        cusineId: vm.ui.cusineId,
        cost: vm.ui.cost,
        preparationTime: vm.ui.preparationTime,
        tags: vm.ui.tags.split(","),
        image: vm.imageId
          // category: _.pluck(_.filter(vm.foodCategories, {
          //   'isSelected': true
          // }), 'id')
      };
      console.log(JSON.stringify(vm.fooddetails));
      if (vm.updateMode) {
        vm.fooddetails.id = vm.ui.id;
      }

      if (vm.fooddetails) {
        openConfirmation(vm.fooddetails);
      }
    }

    function openConfirmation(fooddetails) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'cafeteria/fooditemconfirm.html',
        controller: 'foodConfirmCtrl as vm',
        size: 'sm',
        resolve: {
          data: function () {
            return fooddetails;
          }
        }
      });

      modalInstance.result.then(function (data) {
          vm.saveconfirmation = data;
          if (vm.saveconfirmation === 'save') {
            console.log(JSON.stringify(vm.fooddetails));
            wamsServices.saveEntity({
              key: 'fooditems',
              request: vm.fooddetails
            }).then(function (response) {
              if (response) {
                if (_.has(response, 'statusCode')) {
                  notifier.error('Problem encountered while saving data :' + response.message);
                  return;
                }
                notifier.success('Food Item: ' + response.name + '  saved successfully');
                if (vm.createmore) {
                  vm.ui = {};;
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
        vm.cuisines = response.rows;
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

    function uploadPic(file) {
      console.log(file);
      var imageUpload = {
        file: file
      };
      wamsServices.postUpload({
        key: 'upload',
        request: imageUpload
      }).then(function (response) {
        vm.imageId = response.data
        getUploadPic(vm.imageId)
      });
    }

    function getUploadPic(imageId) {
      vm.imageSource = '/api/download?fileName=' + imageId;
    }
  }
})();
