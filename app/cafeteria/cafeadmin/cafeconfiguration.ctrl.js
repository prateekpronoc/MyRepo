(function () {
  'use strict';

  angular
    .module('wams.cafeteria')
    .controller('cafeCongigureCtrl', cafeCongigureCtrl);

  function cafeCongigureCtrl() {
    var vm = this;
    vm.title = 'Cafe Configuration';
    vm.cafeConfigure = cafeConfigure;
    activate();
    var fooditems = [{
      "id": 1,
      "name": "dosa",
      "category": [1, 2, 3]
    }, {
      "id": 2,
      "name": "idlli",
      "category": [1]
    }];

    ////////////////

    function activate() {}

    function cafeConfigure() {
      vm.configurecafe = {
        cuisineId: vm.ui.cuisineId,
        sittingcapacity: vm.ui.sittingcapacity,
        description: vm.ui.description,
        premiseId: vm.ui.premiseId,
        buildingId: vm.ui.buildingId,
        floorId: vm.ui.floorId,
        floorPartId: vm.ui.floorPartId,
      };
      console.log(vm.configurecafe);
      getCategory();
    }

    function getCategory() {
      _.map(fooditems, function (val) {
        console.log(val.category);
        _.forEach(val.category, function (value) {
          if (value === 3) {
            console.log(val);
          }
        });
      })
    }
  }
})();
