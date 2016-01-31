(function () {
  'use strict';

  angular
    .module('wams.infrastructure')
    .controller('UpdateCtrl', UpdateCtrl);


  /* @ngInject */
  function UpdateCtrl($modalInstance, updatedata, premisesServices) {
    var vm = this;
    vm.title = 'Controller';
    vm.premises = {};
    vm.premises = updatedata;
    vm.cancel = cancel;
    vm.createPremises = createPremises;
    activate();

    ////////////////

    function activate() {
      getStatesCatalog();
      getCityCatalog();
      console.log(updatedata);
      vm.premises.name = vm.premises[0].name;
      //vm.premises.state = vm.premises[0].state;
      vm.premises.city = vm.premises[0].cityId;
      vm.premises.location = vm.premises[0].location;
      vm.premises.address = vm.premises[0].address;
      vm.premises.contactnumber = vm.premises[0].contactNo;
      vm.premises.email = vm.premises[0].email;
    }


    function createPremises() {
      var updateddata = {
        id: vm.premises[0].id,
        name: vm.premises.name,
        address: vm.premises.address,
        cityId: vm.premises.city,
        location: vm.premises.location,
        contactPerson: 1,
        contactNo: vm.premises.contactnumber,
        email: vm.premises.email,
        status: 0
      };
      console.log(updateddata);
      premisesServices.createPremises(updateddata).then(function (response) {
        console.log(response);
        $modalInstance.close(response);
      });
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function getStatesCatalog() {
      premisesServices.getPremiseStateCatalog().then(function (response) {
        vm.states = response;
        //console.log("states details" + JSON.stringify(vm.states));
      });
    }

    function getCityCatalog() {
      premisesServices.getPremiseCityCatalog().then(function (response) {
        vm.cities = response;
        //console.log("cities details" + JSON.stringify(vm.cities));
      });
    }
  }
})();
