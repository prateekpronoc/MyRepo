(function () {
  'use strict';

  angular
    .module('wams.core', [
      'ui.router', 'darthwade.dwLoading', 'hp.common'
    ]).config(config);

  /* ngInject */
  function config($stateProvider) {
    $stateProvider
      .state('wams.cardlistview', {
        url: 'view/',
        abstract: true,
        views: {
          '@': {
            templateUrl: 'core/cardlistview.tpl.html',
            controller: 'CardListViewCtrl as vm'
          }
        }
      });
  }
})();
