(function () {
  'use strict';

  angular
    .module('wams.configuration', ['ui.router', 'wams.home'])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('wams.addConfiguration', {
        url: 'configuration/',
        views: {
          '@': {
            templateUrl: 'configuration/configuration.html',
            controller: 'configurationCtrl as vm'
          }
        }
      }).state('wams.costConfiguration', {
        url: 'costconfiguration/:roomids',
        param: {
          roomids: {
            array: true
          }
        },
        views: {
          '@': {
            templateUrl: 'configuration/costconfiguration/costconfiguration.tpl.html',
            controller: 'CostConfigCtrl as vm'
          }
        }
      }).state('wams.allcostConfiguration', {
        url: 'allcostconfiguration/',
        views: {
          '@': {
            templateUrl: 'configuration/costconfiguration/allcostconfiguration.tpl.html',
            controller: 'AllcostConfigurationCtrl as vm'
          }
        }
      }).state('wams.allroles', {
        url: 'allroles/',
        views: {
          '@': {
            templateUrl: 'configuration/costconfiguration/allcostconfiguration.tpl.html'
          }
        }
      }).state('wams.addcatalogConfiguration', {
        url: 'addcatalogconfiguration/',
        views: {
          '@': {
            templateUrl: 'configuration/addcatalog.tpl.html',
            controller: 'AddcatalogCtrl as vm'
          }
        }
      }).state('wams.addGroupConfiguration', {
        url: 'addGroupConfiguration/',
        views: {
          '@': {
            templateUrl: 'configuration/groupconfiguration/addGroupConfiguration.tpl.html',
            controller: 'CreateGroupCtrl as vm'
          }
        }
      }).state('wams.allGroups', {
        url: 'allGroups/',
        views: {
          '@': {
            templateUrl: 'configuration/groupconfiguration/allGroups.tpl.html',
            controller: 'AllGroupsCtrl as vm'
          }
        }

      }).state('wams.enableMRoom', {
        url: 'MRoom/',
        views: {
          '@': {
            templateUrl: 'configuration/create.html',
            controller: 'EnableMRoomCtrl as vm'
          }
        }
      }).state('wams.common', {
        url: 'WorkingModule/',
        views: {
          '@': {
            templateUrl: 'configuration/commonpage.html',
            controller: 'commonCtrl as vm'
          }
        }
      });
  }
})();
