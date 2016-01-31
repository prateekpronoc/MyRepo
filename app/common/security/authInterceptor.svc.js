(function () {
  'use strict';

  angular
    .module('hp.common.security')
    .factory('authInterceptor', authInterceptor)
    .config(['$httpProvider',
      function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
      }
    ]);

  /* @ngInject */
  function authInterceptor($log, $window, $q, $injector, appConfig) {
    var service = {
      request: request,
      responseError: error
    };
    return service;

    ////////////////

    function request(config) {
      //      console.log(1);
      //TODO : Solve circular reference issue
      //var token = session.getToken;
      var firstWord = getFirstWord(config.url);
      if (firstWord === null) {
        return config;
      }
      if (firstWord && angular.isDefined(appConfig[firstWord]) && appConfig.mappedTo) {
        config.url = appConfig.mappedTo + config.url;
      }
      var token = $window.sessionStorage.token;
      config.withCredentials = true;
      config.headers = config.headers || {};
      if (angular.isDefined(token) && token !== 'undefined') {
        config.headers['X-AUTH-TOKEN'] = token;
      }
      return config;
    }

    function error(response) {
      if (response.config.method === 'POST' && response.data !== null && response.data.indexOf(
          'Session Expired') > -1) {
        //console.log('Session Expired : ' + response.data);
        delete $window.sessionStorage.token;
        // Using $state as a dependency causes Circular Dependency - So having $injector to find $state for us
        $injector.get('$state').transitionTo('anon.login');
        return $q.reject('Session Expired! Please login again.');
      }
      return response;
    }

    function getFirstWord(url) {
      var firstWord = null;
      if (url.indexOf('/', 1) > -1) {
        firstWord = url.substring(0, url.indexOf('/', 1));
      }
      if (firstWord !== null && firstWord.indexOf('/') === 0) {
        return firstWord.substring(1);
      } else {
        return firstWord;
      }
    }
  }
})();

// (function () {
//   'use strict';

//   angular
//     .module('hp.common.security')
//     .factory('authInterceptor', authInterceptor)
//     .config(['$httpProvider',
//       function ($httpProvider) {
//         $httpProvider.interceptors.push('authInterceptor');
//       }
//     ]);

//   /* @ngInject */
//   function authInterceptor($log, $window, $q, $injector, appConfig) {
//     var service = {
//       request: request,
//       responseError: error
//     };
//     return service;

//     ////////////////

//     function request(config) {
//       //TODO : Solve circular reference issue
//       //var token = session.getToken;
//       if (angular.isDefined(appConfig[getFirstWord(config.url)]) && appConfig.mappedTo) {
//         config.url = appConfig.mappedTo + config.url;
//       }
//       // console.log(config.url);
//       var token = $window.sessionStorage.token;
//       config.headers = config.headers || {};
//       if (angular.isDefined(token) && token !== 'undefined') {
//         config.headers['Authorization'] = token; //config.headers.Authorization
//       }
//       return config;
//     }

//     function error(response) {
//       //Rewrite this code of error;
//       console.log(response);
//       if (response.config.method === 'POST' && response.data !== null && response.data.indexOf(
//           'Session Expired') > -1) {
//         //console.log('Session Expired : ' + response.data);
//         delete $window.sessionStorage.token;
//         // Using $state as a dependency causes Circular Dependency - So having $injector to find $state for us
//         $injector.get('$state').transitionTo('anon.login');
//         return $q.reject('Session Expired! Please login again.');
//       }
//       return response;
//     }

//     function getFirstWord(url) {
//       var firstWord = null;
//       if (url.indexOf('/', 1) > -1) {
//         firstWord = url.substring(0, url.indexOf('/', 1));
//       }
//       if (firstWord !== null && firstWord.indexOf('/') === 0) {
//         return firstWord.substring(1);
//       } else {
//         return firstWord;
//       }
//     }
//   }
// })();
