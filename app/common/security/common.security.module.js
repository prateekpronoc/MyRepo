(function () {
  'use strict';

  angular
    .module('hp.common.security', ['ui.router'])
    .config(config)
    .run(onRun);

  /* @ngInject */
  function config($stateProvider, $mdThemingProvider) {
    $stateProvider
      .state('anon', {
        abstract: true,
        data: {
          private: false
        }
      });

    var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50'],
      '50': 'ffffff'
    });
    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.theme('default')
      .primaryPalette('customBlue', {
        'default': '500',
        'hue-1': '50'
      })
      .accentPalette('pink');
    $mdThemingProvider.theme('input', 'default')
      .primaryPalette('grey');

  }

  /* @ngInject */
  function onRun($rootScope, session, $state, $window, $location) {
    $rootScope.$on('$stateChangeStart', function (event, toState) {
      if (!$window.sessionStorage.token && $window.localStorage.getItem('token')) {
        $window.sessionStorage.token = $window.localStorage.getItem('token');
      }
      if (toState.data.private && !session.getUser()) {
        event.preventDefault();
      } else {
        $rootScope.$broadcast('closeModals');
      }
      // if (toState.name === 'anon.login' && $window.sessionStorage.token) {
      //   session.logout().then(
      //     function () {
      //       $state.go('anon.login');
      //       $window.location.reload();
      //     }
      //   );
      // }
    });

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      console.log('$stateChangeError - Error = ' + event +
        ' toState = ' + JSON.stringify(toState) + ' froState = ' + JSON.stringify(fromState) +
        ' FroParams = ' + JSON.stringify(fromParams) + ' toParms = ' + JSON.stringify(toParams) + ' Error = ' +
        JSON.stringify(error));
      if ($window.sessionStorage.token) {
        session.logout().then(
          function () {
            $state.go('anon.login');
            $window.location.reload();
          }
        );
      }
    });

    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
      console.log('stateNotFound: Unfound State = ' + JSON.stringify(unfoundState) + ' FromState = ' + JSON.stringify(
        fromState) + ' FromParams = ' + JSON.stringify(fromParams));
    });
  }
})();
