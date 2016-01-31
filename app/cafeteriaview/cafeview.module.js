(function () {
  'use strict';

  angular
    .module('wams.cafeview', ['ui.router'])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('wams.cafemeuview', {
        url: 'mymenu/',
        params: {
          cafeId: {
            array: true
          }
        },
        views: {
          '@': {
            templateUrl: 'cafeteriaview/cafeview.tpl.html',
            controller: 'ViewMenuCtrl as vm'
          }
        }
      })
      .state('wams.orderedFood', {
        url: 'myorders',
        views: {
          '@': {
            templateUrl: 'cafeteriaview/orderedFood.tpl.html',
            controller: 'OrderedFoodCtrl as vm'
          }
        }
      });
  }
})();
