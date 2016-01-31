(function () {
  'use strict';

  angular
    .module('hp.common')
    .directive('imagecardViewGrid', imagecardViewGrid);

  /* @ngInject */
  function imagecardViewGrid() {
    var directive = {
      link: link,
      restrict: 'A',
      templateUrl: 'common/imageCard/imagecardViewGrid.tpl.html',
      scope: {
        data: '=',
        templateUrl: '=',
        actionListener: '&',
        cardTitle: '@',
        mainActions: '=',
        actionsProvider: '&',
        idField: '@',
        nameField: '@',
        isEditDisabled: '=',
        isDeleteDisabled: '=',
        cardHeight: '@',
        interval: '=',
        slidesData: '='
      },
      controller: ImageCardViewGridCtrl,
      controllerAs: 'vm'
    };
    return directive;

    function link() {}
  }

  /* @ngInject */
  function ImageCardViewGridCtrl($scope) {
    var vm = this;
    vm.provideActions = provideActions;
    $scope.isAllChecked = false;
    $scope.toggleSelection = function (newValue) {
      angular.forEach($scope.data, function (value) {
        value.checked = newValue;
      });
    };
    $scope.actionClicked = function (actionCode, record) {
      if ($scope.actionListener) {
        $scope.actionListener({
          actionCode: actionCode,
          record: record
        });
      }
    };

    //////////////////////
    function provideActions(viewType, data) {
      if ($scope.actionsProvider) {
        return $scope.actionsProvider({
          view: viewType,
          record: data
        });
      }
      return [];
    }
  }
})();
