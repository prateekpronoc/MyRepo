(function () {
  'use strict';

  angular
    .module('hp.common')
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
    }])
    .directive('scheduler', scheduler);
  /* @ngInject */
  function scheduler() {
    // Usage:
    //
    // Creates:
    //
    var directive = {
      link: link,
      templateUrl: 'common/scheduler/scheduler.html',
      restrict: 'E',
      scope: {
        slots: '=',
        columns: '='
      },
      controller: SchedulerCtrl
    };
    return directive;

    function SchedulerCtrl($scope) {

      $scope.data = $scope.slots;
      $scope.lables = $scope.columns;
      $scope.$watch('slots', function (newValues) {
        // console.log('watch \n');
        //console.log(newValues);

        $scope.data = newValues;
      }, true);

      $scope.$watch('columns', function (newValues) {
        // console.log('watch \n');
        //console.log(newValues);

        $scope.labels = newValues;
      }, true);
//      console.log($scope.columns);
      // $scope.labels = [
      //   'Monday',
      //   'Tuesday',
      //   'Wednesday',
      //   'Thursday',
      //   'Friday',
      //   'Saturday',
      //   'Sunday'
      // ];
    }

    function link() {}
  }
  // .directive('scheduler', [function () {
  //   return {
  //     templateUrl: 'common/scheduler/scheduler.html',
  //     restrict: 'E',
  //     scope: {
  //       slots: '='
  //     },
  //     link: function (scope) {
  //       scope.data = scope.slots;
  //       scope.labels = [
  //         'Monday',
  //         'Tuesday',
  //         'Wednesday',
  //         'Thursday',
  //         'Friday',
  //         'Saturday',
  //         'Sunday'
  //       ];
  //     }
  //   };
  // }]);
})();
// (function () {
//   'use strict';

//   angular
//     .module('module')
//     .directive('directive', directive);

//   /* @ngInject */
//   function directive(dependencies) {
//     // Usage:
//     //
//     // Creates:
//     //
//     var directive = {
//       link: link,
//       restrict: 'A'
//     };
//     return directive;

//     function link(scope, element, attrs) {}
//   }
// })();
