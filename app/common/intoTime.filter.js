(function () {
  'use strict';

  angular.module('hp.common')
    .filter('intToTime', [function () {

      return function (input) {

        function pad(n, width) {
          n = n + '';
          return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
        }

        var hours = Math.floor(input / 60),
          minutes = input % 60;
        return pad(hours, 2) + ':' + pad(minutes, 2);
      };
    }]);

})();
