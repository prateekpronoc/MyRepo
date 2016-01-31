(function () {
  'use strict';

  angular
    .module('hp.common')
    .directive('panelSlider', panelSlider);

  /* @ngInject */
  function panelSlider() {
    // Usage:
    var directive = {
      link: link,
      restrict: 'E',
      scope: {
        data: '=',
        title: '=',
        count: '=',
        template: '='
      },
      templateUrl: 'common/panelSlider.tpl.html',
      controller: PanelSliderCtrl,
      controllerAs: 'vm'

    };
    return directive;

    function link() {} //scope, element, attrs

    /* ngInject */
    function PanelSliderCtrl($scope) {
      $scope.showIndex = 0;
      $scope.next = next;
      $scope.previous = previous;

      $scope.$watchCollection('data', function (newValue) {
        if (angular.isDefined(newValue) && newValue.length > 0) {
          $scope.keys = Object.keys($scope.data[0]);
          $scope.lastIndex = Math.ceil($scope.data.length / $scope.count);
          changeShowData();
        }
      });

      activate();

      function activate() {}

      function next() {
        if ($scope.showIndex + $scope.count <= $scope.lastIndex) {
          $scope.showIndex += $scope.count;
          changeShowData();
        }
      }

      function previous() {
        if ($scope.showIndex !== 0) {
          $scope.showIndex -= $scope.count;
          changeShowData();
        }
      }

      function changeShowData() {
        $scope.shownData = [];
        $scope.shownData = $scope.data.slice($scope.showIndex, $scope.count + $scope.showIndex);
      }

    }
  }
})();
