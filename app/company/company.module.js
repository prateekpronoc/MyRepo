(function () {
  'use strict';

  angular
    .module('wams.company', [
      'ui.router',
      'wams.home'
    ]).config(config);

  function config($stateProvider) {
    $stateProvider
      .state('wams.createCompany', {
        url: 'createCompany/:companyId',
        param: {
          companyId: {
            array: true
          }
        },
        views: {
          '@': {
            templateUrl: 'company/createcompany.html',
            controller: 'AddCompanyCtrl as vm'
          }
        }
      })
      .state('wams.viewAllCompanies', {
        url: 'viewAllCompanies/',
        views: {
          '@': {
            templateUrl: 'company/viewallcompanies.html',
            controller: 'ViewAllCompaniesCtrl as vm'
          }
        }
      })
      .state('wams.viewCompany', {
        url: 'viewCompany/',
        views: {
          '@': {
            templateUrl: 'company/viewcompany.html',
            controller: 'ViewCompanyCtrl as vm'
          }
        }
      });
  }
})();
