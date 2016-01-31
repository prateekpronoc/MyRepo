(function () {
  'use strict';

  angular
    .module('wams.cafeview')
    .controller('OrderedFoodCtrl', OrderedFoodCtrl);

  /* @ngInject */
  function OrderedFoodCtrl(wamsServices, _, session) {
    var vm = this;
    vm.title = 'Controller';
    vm.foodBookingEntity = [];
    activate();

    ////////////////

    function activate() {
      fetchAllFoodItems();
      wamsServices.getEntity({
        key: 'cafeorders',
        request: {
          userId: parseInt(session.getUserId())
        }
      }).then(function (response) {
        if (response && response.rows) {

          _.forEach(response.rows, function (val) {
            vm.foodBookingEntity.push({
              cafeId: val.cafeId,
              foodItems: val.orderFood.data,
              bookingId: val.trackingId
            });
          });
          console.log(vm.foodBookingEntity);
        }
      }, function (error) {
        console.log(error);
      });
    }

    function fetchAllFoodItems() {
      wamsServices.getEntity({
        key: 'fooditems',
        request: {
          limit: 400,
          offset: 0
        }
      }).then(function (response) {
        console.log(response);
        vm.foodImages = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'image'));
        
        console.log(vm.foodImages);
      });
    }
  }
})();
