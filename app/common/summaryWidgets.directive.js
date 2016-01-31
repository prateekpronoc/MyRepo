(function () {
  'use strict';

  angular
    .module('hp.common')
    .directive('summaryWidget', summaryWidget);

  /* @ngInject */
  function summaryWidget() {
    // Usage:
    //
    // Creates:
    //
    var directive = {
      link: link,
      restrict: 'E',
      templateUrl: 'common/summaryWidget.tpl.html',
      transclude: true,
      scope: {
        data: '=data',
        toggleHeaderWidgetShown: '&',
        headerWidgetShown: '='
      },
      controller: SummaryController,
      controllerAs: 'vm'
    };
    return directive;

    function link() { //scope, element, attrs
    }

    /* @ngInject */
    function SummaryController($scope) {
      /*jshint validthis: true */
      var vm = this;
      vm.colWidth = 4;
      if ($scope.data && $scope.data.dataValues && $scope.data.dataValues.length > 0) {
        if ($scope.data.dataValues[0].rowData.length > 12) {
          $scope.data.dataValues[0].rowData.length = 12;
        }
        if ($scope.data.dataValues.length > 0) {
          vm.colWidth = Math.floor(12 / $scope.data.dataValues[0].rowData.length);
        }
      }
      vm.toggleHeaderWidgetShown = function () {
        $scope.headerWidgetShown = !$scope.headerWidgetShown;
        if ($scope.toggleHeaderWidgetShown) {
          $scope.toggleHeaderWidgetShown();
        }
      };
    }
  }
})();
