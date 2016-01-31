(function () {
  'use strict';
  angular.module('wams.infrastructure')
    .controller('ViewPremisesCtrl', ViewPremisesCtrl);

  function ViewPremisesCtrl($scope, $stateParams, premisesServices) {
    var vm = this;
    $scope.page = {
      title: 'View Premise'
    }
    vm.toggled = toggled;
    vm.ajaxFaker = ajaxFaker;

    function toggled(a) {
      console.log('Dropdown is now: ', a);
    }

    function ajaxFaker() {
      $state.reload();
    }
    activate();

    function activate() {
      viewPremiseById();
    };

    function viewPremiseById() {
      var premiseid = $stateParams.premiseid;
      console.log('premiseid came as: ' + premiseid);
      var viewpremisedetails = premisesServices.query({
        id: premiseid
      }, function (response) {
        vm.viewpremisedetails = response;
        console.log(" room data from response" + JSON.stringify(vm.viewpremisedetails));
      });
    }
  }
})();
