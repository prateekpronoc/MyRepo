(function () {
  'use strict';

  angular
    .module('wams.accounting')
    .controller('RechargeCtrl', RechargeCtrl);

  /* @ngInject */
  function RechargeCtrl(fetcher, _, fetchEntity) {
    var vm = this;
    vm.title = 'Recharge';
    vm.fromAccount = {};
    vm.selectedToAccount = null;
    vm.selectedAccountFrom = null
    vm.accountTo = {};
    vm.amount = 0;
    vm.recharge = recharge;
    activate();

    ////////////////

    function activate() {
      fetchAccounts();
      fetchUsers();
    }

    function recharge() {
      fetchEntity.getByValues({
        request: {
          id: vm.selectedAccountFrom
        },
        key: 'accounts',
        value: 'holderId'
      }).then(function (response) {
        vm.debitAccount = response.rows[0].id;
      });


      fetchEntity.getByValues({
        request: {
          id: vm.selectedToAccount
        },
        key: 'accounts',
        value: 'holderId'
      }).then(function (response) {
        console.log(response);
        vm.creditAccount = response;
      });
    }

    function fetchUsers() {
      fetcher.get({
        request: {},
        key: 'users'
      }).then(function (response) {
        _.forEach(response.rows, function (val) {
          vm.accountTo[val.id] = val.name + ' ' + val.email;
        });
      }, function (response) {
        console.log(response);
      });
    }

    function fetchAccounts() {
      vm.fromAccount = {};
      fetcher.get({
        request: {},
        key: 'accounts'
      }).then(function (response) {
        _.forEach(response.rows, function (value) {
          vm.fromAccount[value.id] = value.name;
        });
      }, function (response) {
        console.log(response);
      });
    }
  }
})();
