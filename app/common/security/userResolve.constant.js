(function () {
  'use strict';

  angular
    .module('hp.common.security')
    .constant('userResolve', {
    //  currentUser: currentUser
    });

  /* @ngInject */
  function currentUser(session) {
   // return session.getUser();
  }
})();
