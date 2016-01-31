(function () {
  'use strict';
  angular.module('wams.company')
    .controller('ViewCompanyCtrl', ViewCompanyCtrl);

  function ViewCompanyCtrl($scope, $stateParams, $state, CompaniesService) {
    var vm = this;
    $scope.page = {
      title: 'View company'
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
      viewCompanyUsersById();
      viewCompanyById();
    };

    function viewCompanyById() {
      var companyid = $stateParams.companyid;
      console.log('companyid came as: ' + companyid);
      var viewcompanydetails = CompaniesService.getCompanyById({
        id: companyid
      }, function (response) {
        vm.viewcompanydetails = response;
        console.log(" company data from response" + JSON.stringify(vm.viewcompanydetails));
      });
    }

    function viewCompanyUsersById() {
      var companyid = $stateParams.companyid;
      console.log('companyid came as: ' + companyid);
      var viewcompanyusersdetails = CompaniesService.query({
        tenant_id: companyid
      }, function (response) {
        vm.viewcompanyusersdetails = response;
        console.log(" company data from response" + JSON.stringify(vm.viewcompanyusersdetails));
      });
    }
  }
})();
