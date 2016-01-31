(function () {
  'use strict';

  angular
    .module('wams.accounting', ['ui.router', 'wams.home'])
    .config(config);
  /* @ngInject */
  function config($stateProvider) {
    $stateProvider
      .state('wams.transactions', {
        url: 'transactions/',
        views: {
          '@': {
            templateUrl: 'transactions/view/viewAllTransactions.tpl.html',
            controller: 'ViewAllTransactionsSummaryCtrl as vm'
          }
        }
      }).state('wams.createAccounts', {
        url: 'transactions/',
        views: {
          '@': {
            templateUrl: 'transactions/create/createAccounts.tpl.html',
            controller: 'CreateAccountsCtrl as vm'
          }
        }
      }).state('wams.recharge', {
        url: 'transactions/',
        views: {
          '@': {
            templateUrl: 'transactions/recharge/recharge.tpl.html',
            controller: 'RechargeCtrl as vm'
          }
        }
      }).state('wams.accountBalance', {
        url: 'accountBalance/',
        views: {
          '@': {
            templateUrl: 'transactions/myaccount/accountbalancedetails.html',
            controller: 'accountBalanceCtrl as vm'
          }
        }
      });
  }
})();
