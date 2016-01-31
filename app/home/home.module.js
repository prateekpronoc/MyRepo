(function () {
  'use strict';

  angular
    .module('wams.home', [
      'wams.core', 'angular-growl'
    ])
    .config(config);

  function config($stateProvider, $urlRouterProvider, userResolve) {
    //$urlRouterProvider.otherwise('/signup');
    if ((window.location.hash).indexOf('/signup') > -1) {
      $urlRouterProvider.otherwise('/signup/');
    } else {
      $urlRouterProvider.otherwise('/login/');
    }

    $stateProvider
      .state('wams', {
        abstract: true,
        url: '/wams/',
        views: {
          'header@': {
            templateUrl: 'home/header.html',
            controller: 'Header as vm'
          },
          'navbar@': {
            templateUrl: 'home/navigation.tpl.html',
            controller: 'NavCtrl as vm'
          },
          'footer@': {
            templateUrl: 'home/footer.html'
          },
          'rightbar@': {
            templateUrl: 'home/rightNav.tpl.html',
            controller: 'RightNavCtrl as vm'
          }
        },
        resolve: userResolve,
        data: {
          private: true
        }
      });
  }
})();
