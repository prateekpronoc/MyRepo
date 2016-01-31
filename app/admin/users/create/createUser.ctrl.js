(function () {
  'use strict';

  angular
    .module('wams.admin')
    .controller('CreateUserCtrl', CreateUserCtrl);

  /* @ngInject */
  function CreateUserCtrl(wamsServices, notifier, _, $state, $stateParams) {
    var vm = this;
    vm.updateMode = false;
    vm.createmore = false;
    vm.title = 'Create User';

    vm.saveUser = saveUser;
    vm.reset = reset;
    vm.cancel = cancel;
    activate();

    ////////////////
    function activate() {
      if (angular.isDefined($stateParams.userId) && $stateParams.userId > 0) {
        getuserIdInfoById($stateParams.userId);
        vm.updateMode = true;
        vm.title = 'Update User';
      }
      getRoleCatalog();
      getAllTenants();
    }

    function getuserIdInfoById(userId) {
      wamsServices.getEntity({
        key: 'users',
        request: {
          id: userId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching building information');
          return;
        }
        vm.serverData = response.rows[0];
        vm.userInfo = response.rows[0];
        fetchAllPremises();
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getAllTenants() {
      wamsServices.getEntity({
        request: {},
        key: 'tenants'
      }).then(function (response) {
        vm.tenants = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'name'));
      });
    }

    function saveUser() {
      console.log(vm.userInfo);
      //vm.userInfo.userName = vm.userInfo.email;
      if (vm.updateMode) {
        vm.userInfo.id = vm.userInfo.id;
      }
      wamsServices.saveEntity({
        key: 'users',
        request: vm.userInfo
      }).then(function (response) {
        if (response) {
          if (_.has(response, 'statusCode')) {
            notifier.error('Problem encountered while saving data : ' + response.message);
            return;
          }
          notifier.success('User : ' + response.name + '  saved successfully');
          if (vm.createmore) {
            vm.userInfo = {};
          } else {
            $state.go('wams.users', {}, {
              reload: true
            });
          }
        }
      }, function (error) {
        notifier.error('Problem encountered while saving data :' + error.message);
      });
    }

    function reset() {
      vm.userInfo = '';
    }

    function cancel() {
      $state.go('wams.users', {}, {
        reload: true
      });
    }

    function getRoleCatalog() {
      vm.assignrole = {};
      wamsServices.getEntity({
        request: {
          masterId: 10
        },
        key: 'catalogValues'
      }).then(function (response) {
        angular.forEach(response.rows, function (val) {
          vm.assignrole[val.id] = val.value;
        });
      });
    }
  }
})();
