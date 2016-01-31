(function () {
  'use strict';

  angular
    .module('wams.accounting')
    .controller('CreateAccountsCtrl', CreateAccountsCtrl);

  /* @ngInject */
  function CreateAccountsCtrl(catalogService, fetcher, _, saveEntityService, notifier, wamsServices) {
    var vm = this;
    vm.title = 'Accounts';
    vm.accountFor = {};
    vm.selectedAccType = null;
    vm.singleSelect = null;
    vm.getEntity = getEntity;
    vm.entity = {};
    vm.accountType = {};
    vm.name = '';
    vm.createAccount = createAccount;
    activate();

    ////////////////

    function activate() {
      fetchCatalogValues();
      fetchAccountTypes();
    }

    vm.descp = '';

    function createAccount() {
      var request = {
        name: vm.name,
        description: vm.descp,
        holderId: vm.selectedEntity,
        holderType: vm.selectedAccType,
        accountType: vm.selectedAccountType
      };
      saveEntityService.createEntity({
        request: request,
        key: 'accounts'
      }).then(function (response) {
        notifier.success('Account Create Successfully');
      }, function (response) {
        console.log(response);
      });
    }

    function fetchAccountTypes() {
      wamsServices.getEntity({
        request: {
          masterId: 8
        },
        key: 'catalogValues'
      }).then(function (response) {
        vm.accountType = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'value'));
        console.log(vm.accountType);
      });
    }

    function getEntity() {
      vm.entity = {};
      if (vm.selectedAccType === null) {
        console.log('Please select entity type');
        return;
      }
      _.forEach(vm.accountFor, function (argument) {
        console.log(argument);
      });

      fetcher.get({
        request: {},
        key: _.camelCase(vm.accountFor[vm.selectedAccType]) + 's'
      }).then(function (response) {
        console.log(response);
        _.forEach(response.rows, function (resp) {
          vm.entity[resp.id] = resp.name;
        });
      }, function (response) {
        console.log(response);
      });
      console.log(vm.accountFor[vm.selectedAccType]);
    }

    function fetchCatalogValues() {
      catalogService.getCatalog('resourceType')
        .then(function (response) {
          if (response) {
            if (response.length <= 0) {
              console.log('Error Fetching Catalog Values');
            }
            angular.forEach(response, function (val) {
              vm.accountFor[val.id] = val.value;
            });
            console.log(vm.accountFor);
          }
        }, function (response) {
          console.log(response);
        });
    }
  }
})();
