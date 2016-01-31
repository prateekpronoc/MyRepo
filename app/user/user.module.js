(function () {
  'use strict';

  angular
    .module('wams.user', ['wams.core'])
    .config(config);


  /* @ngInject */
  function config($stateProvider) {
    $stateProvider
      .state('anon.login', {
        url: '/login/',
        views: {
          'header@': {
            templateUrl: 'user/loginHeader.html'
          },
          '@': {
            templateUrl: 'user/login.html',
            controller: 'Login as vm'
          }
        }
      })
      .state('anon.forgotPassword', {
        url: '/forgotPassword/',
        views: {
          'header@': {
            templateUrl: 'user/loginHeader.html'
          },
          '@': {
            templateUrl: 'user/forgotPassword.html',
            controller: 'ForgotPassword as vm'
          }
        }
      })
      .state('anon.singup', {
        url: '/signup/:tenantId/:email',
        views: {
          'header@': {
            templateUrl: 'user/loginHeader.html'
          },
          '@': {
            templateUrl: 'user/signup.html',
            controller: 'SignupCtrl as vm'
          }
        }
      }).state('wams.userProfile', {
        url: 'userprofile/',
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
          '@': {
            templateUrl: 'user/userProfile/profileWizard.html',
            controller: 'UserProfileCtrl as vm'
          }
        }
      })
      // .state('wams.userProfileUpdate', {
      //   url: 'userprofileUpdate/',
      //   views: {
      //     'header@': {
      //       templateUrl: 'home/header.html',
      //       controller: 'Header as vm'
      //     },
      //     'navbar@': {
      //       templateUrl: 'home/navigation.tpl.html',
      //       controller: 'NavCtrl as vm'
      //     },
      //     'footer@': {
      //       templateUrl: 'home/footer.html'
      //     },
      //     '@': {
      //       templateUrl: 'user/userProfile/profileWizard.html',
      //       controller: 'UserProfileCtrl as vm'
      //     }
      //   }
      // })
      .state('wams.changePassword', {
        url: 'changePassword/',
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
          '@': {
            templateUrl: 'user/changepassword/changepassword.html',
            controller: 'ChangePasswordCtrl as vm'
          }
        }
      });
  }
})();
