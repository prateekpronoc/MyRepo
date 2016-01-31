(function () {
  'use strict';

  angular
    .module('wams.accounting')
    .controller('accountBalanceCtrl', accountBalanceCtrl);
  /* @ngInject */
  function accountBalanceCtrl(wamsServices, notifier, session) {
    var vm = this;
    vm.title = 'Account Balance';
    vm.getEntityBalance = getEntityBalance;
    activate();

    ////////////////

    function activate() {
      fetchAccounts();
    }

    function fetchAccounts() {
      var req = {};
      if (session.getUserId() !== 1) {
        req = {
          holderId: parseInt(session.getUserId())
        };
      }
      wamsServices.getEntity({
        key: 'accounts',
        request: req
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching premises data');
          return;
        }
        vm.accountDetails = response.rows;
      }, function (error) {
        notifier.error(error.message);
      });
    }

    function getEntityBalance(entityId) {
      wamsServices.getEntity({
        key: 'accounts',
        request: {
          id: entityId
        }
      }).then(function (response) {
        if (!response || response.rows.length === 0) {
          notifier.error('Problem encountered while fetching building information');
          return;
        }
        vm.accountBalanceDetails = response.rows[0];
        vm.accountsbalance.accountname = vm.accountBalanceDetails.name;
        vm.accountsbalance.balance = vm.accountBalanceDetails.balance;
        console.log(response.rows[0]);
      }, function (error) {
        notifier.error(error.message);
      });
    }

  }
})();
