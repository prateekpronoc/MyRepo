(function () {
  'use strict';

  angular
    .module('wams.gym', ['ui.router', 'wams.home'])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('wams.gymcreate', {
        url: 'create/:gymId',
        param: {
          gymId: {
            array: false
          }
        },
        views: {
          '@': {
            templateUrl: 'gym/create/creategym.tpl.html',
            controller: 'CreateGymCtrl as vm'
          }
        }
      }).state('wams.allgyms', {
        url: 'allGyms',
        views: {
          '@': {
            templateUrl: 'gym/view/allGyms.tpl.html',
            controller: 'AllGymsCtrl as vm'
          }
        }
      }).state('wams.addGymInfra', {
        url: 'addGymInfra/:gymId',
        param: {
          gymId: {
            array: false
          }
        },
        views: {
          '@': {
            templateUrl: 'gym/infraitems/addGymInfra.tpl.html',
            controller: 'AddGymInfraCtrl as vm'
          }
        }
      }).state('wams.allGymInfras', {
        url: 'allGymInfras',
        views: {
          '@': {
            templateUrl: 'gym/infraitems/allGymInfras.tpl.html',
            controller: 'AllGymInfrasCtrl as vm'
          }
        }
      }).state('wams.addGymInfraToMr', {
        url: 'addGymInfraToMr/:gymId',
        param: {
          gymId: {
            array: false
          }
        },
        views: {
          '@': {
            templateUrl: 'gym/infraitems/addGymInfraToMr.tpl.html',
            controller: 'AddGymInfraToMrCtrl as vm'
          }
        }
      });
  }
})();
