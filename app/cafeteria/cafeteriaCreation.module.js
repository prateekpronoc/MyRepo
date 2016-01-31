(function () {
  'use strict';

  angular
    .module('wams.cafeteria', [
      'ui.router',
      'wams.home'
    ]).config(config);

  function config($stateProvider) {
    $stateProvider
      .state('wams.createCafeteria', {
        url: 'createCafeteria/:cafeteriaId',
        param: {
          cafeteriaId: {
            array: true
          }
        },
        views: {
          '@': {
            templateUrl: 'cafeteria/createCafeteria.html',
            controller: 'createCafeteriaCtrl as vm'
          }
        }
      }).state('wams.allCafeterias', {
        url: 'allCafeterias/',
        views: {
          '@': {
            templateUrl: 'cafeteria/allcafeterias.html',
            controller: 'allCafeteriasCtrl as vm'
          }
        }
      }).state('wams.createFooditems', {
        url: 'Fooditems/:fooditemId',
        param: {
          fooditemId: {
            array: true
          }
        },
        views: {
          '@': {
            templateUrl: 'cafeteria/createFooditems.html',
            controller: 'createFooditemsCtrl as vm'
          }
        }

      }).state('wams.configureMenu', {
        url: 'configureMenu/',
        views: {
          '@': {
            templateUrl: 'cafeteria/configuremenu/configuremenu.html',
            controller: 'ConfigureMenuCtrl as vm'
          }
        }
      }).state('wams.allFooditems', {
        url: 'allFooditems/',
        views: {
          '@': {
            templateUrl: 'cafeteria/allfooditems.html',
            controller: 'allFoodItemsCtrl as vm'
          }
        }
      }).state('wams.cafeConfiguration', {
        url: 'cafeconfiguration/',
        views: {
          '@': {
            templateUrl: 'cafeteria/cafeadmin/cafeconfigure.html',
            controller: 'cafeCongigureCtrl as vm'
          }
        }
      });
  }
})();
