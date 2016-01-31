(function () {
  'use strict';

  angular
    .module('wams.infrastructure', ['ui.router', 'wams.home'])
    .config(config);

  /* @ngInject */
  function config($stateProvider) {
    $stateProvider
      .state('wams.addPremises', {
        url: 'addpremises/:premisesId',
        param: {
          premisesId: {
            array: true
          }
        },
        views: {
          '@': {
            templateUrl: 'infrastructure/premises/createpremises.tpl.html',
            controller: 'PremisesCtrl as vm'
          }
        }
      }).state('wams.viewAllPremises', {
        url: 'viewallpremises/',
        views: {
          '@': {
            templateUrl: 'infrastructure/premises/viewallpremises.tpl.html',
            controller: 'ViewAllPremisesCtrl as vm'
          }
        }
      }).state('wams.viewPremises', {
        url: 'viewPremises/',
        views: {
          '@': {
            templateUrl: 'infrastructure/viewpremises.html',
            controller: 'ViewPremisesCtrl as vm'
          }
        }
      }).state('wams.addFloorPart', {
        url: 'addFloorPart/:fpId/:floorId',
        params: {
          fpId: {
            array: true
          },
          floorId: {
            array: true
          }
        },
        views: {
          '@': {
            templateUrl: 'infrastructure/floorpart/addfloorpart.tpl.html',
            controller: 'FloorPartsCtrl as vm'
          }
        }
      }).state('wams.viewAllFloorParts', {
        url: 'viewAllFloors/:floorId',
        param: {
          floorId: {
            array: false
          }
        },
        views: {
          '@': {
            templateUrl: 'infrastructure/floorpart/viewallfloorparts.tpl.html',
            controller: 'ViewAllFloorpartsCtrl as vm'
          }
        }
      }).state('wams.viewAllbuildings', {
        url: 'viewallbuildings/:premiseId',
        param: {
          premiseId: {
            array: false
          }
        },
        views: {
          '@': {
            templateUrl: 'infrastructure/buildings/viewallbuilding.tpl.html',
            controller: 'ViewAllBuildingsCtrl as vm'
          }
        }
      }).state('wams.createBuildings', {
        url: 'buildings/:buildingId',
        param: {
          buildingId: {
            array: true
          }
        },
        views: {
          '@': {
            templateUrl: 'infrastructure/buildings/createbuilding.tpl.html',
            controller: 'BuildingCtrl as vm'
          }
        }
      }).state('wams.addFloor', {
        url: 'addFloor/:floorId',
        param: {
          floorId: {
            array: true
          }
        },
        views: {
          '@': {
            templateUrl: 'infrastructure/floor/createFloor.html',
            controller: 'FloorCtrl as vm'
          }
        }
      }).state('wams.viewAllFloors', {
        url: 'viewallFloors/:buildingId',
        param: {
          buildingId: {
            array: false
          }
        },
        views: {
          '@': {
            templateUrl: 'infrastructure/floor/viewallFloors.html',
            controller: 'ViewAllFloorsCtrl as vm'
          }
        }
      });
  }
})();
