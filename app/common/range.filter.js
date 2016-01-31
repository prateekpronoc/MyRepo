(function () {
  'use strict';

  angular
    .module('hp.common')
    .filter('range', function () {
      return function (input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i += 1) {
          input.push(i);
        }
        return input;
      };
    });
})();
