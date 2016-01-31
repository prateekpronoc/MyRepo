(function () {
  'use strict';

  angular
    .module('wams.user')
    .controller('SignupCtrl', SignupCtrl);


  /* @ngInject */
  function SignupCtrl($stateParams, $http, wamsServices, notifier, $state) {
    /*jshint validthis: true */
    var vm = this;
    vm.title = 'Ctrl';
    vm.ui = {};
    vm.steps = {
      step1: true,
      step2: false,
      step3: false,
      step4: false,
      step5: false
    };
    vm.stepCount = 0;
    vm.nextTab = nextTab;
    vm.previous = previous;
    vm.save = save;
    activate();

    function activate() {
      vm.ui.email = atob($stateParams.email);
      fetchTenantInfo();
    }

    function fetchTenantInfo() {
      wamsServices.getEntity({
        request: {
          id: $stateParams.tenantId
        },
        key: 'tenants'
      }).then(function (response) {
          if (!response) {
            //vm.noData = true;
            notifier.error('Problem encountered while fetching premises');
            return;
          }
          if (response.rows && response.rows.length === 0) {
            vm.noData = true;

            notifier.error('Unable to fetch data');
            return;
          }
          vm.ui.tenantDetails = response.rows[0];


        },
        function (error) {
          notifier.error('Unable to fetch data' + error.message);
        });

    }


    function nextTab() {
      vm.stepCount = vm.stepCount + 1;
      vm.steps[vm.stepCount].status = true;
    }

    function previous() {
      vm.stepCount = vm.stepCount - 1;
      vm.steps[vm.stepCount].status = true;
    }

    function save() {
      vm.userDetails = {
        employeeId: vm.ui.empId,
        name: vm.ui.firstname,
        lastName: vm.ui.lastname,
        email: vm.ui.email,
        mobile: vm.ui.phone,
        tenantId: $stateParams.tenantId,
        designation: vm.ui.designation,
        gender: vm.ui.gender,
        //username: vm.ui.email,
        phone: vm.ui.phone
      };
      // console.log(JSON.stringify(vm.userDetails));
      wamsServices.saveEntity({
        key: 'users',
        request: vm.userDetails
      }).then(function (response) {
        if (response) {
          if (_.has(response, 'statusCode')) {
            notifier.error('Problem encountered while saving data : ' + response.message);
            return;
          }
          notifier.success('User Login details are sent to your Email');
          $state.go('anon.login', {}, {
            reload: true
          });
        }
      }, function (error) {
        notifier.error('Problem encountered while saving data :' + error.message);
      });
    }

  }
})();
