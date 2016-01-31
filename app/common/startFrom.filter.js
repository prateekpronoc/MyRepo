(function () {
  'use strict';

  angular
    .module('hp.common')
    .filter('startFrom', function () {
      return function (input, start) {
        //start = +start; need changes here
        return input.slice(start);
      };
    });
})();
