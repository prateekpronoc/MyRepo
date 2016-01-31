(function () {
  'use strict';

  angular
    .module('hp.common')
    .directive('cardViewGrid', cardViewGrid);

  /* @ngInject */
  function cardViewGrid() {
    var directive = {
      link: link,
      restrict: 'A',
      templateUrl: 'common/cardViewGrid.tpl.html',
      scope: {
        data: '=',
        templateUrl: '=',
        actionListener: '&',
        mainColumns: '=',
        flipColumns: '=',
        cardTitle: '@',
        mainActions: '=',
        flipActions: '=',
        actionsProvider: '&',
        idField: '@',
        nameField: '@',
        isEditDisabled: '=',
        isDeleteDisabled: '=',
        cardHeight: '@'
      },
      controller: CardViewGridCtrl,
      controllerAs: 'vm'
    };
    return directive;

    function link() {} //scope, element, attrs

    /* ngInject */
    function CardViewGridCtrl($scope) {
      /*jshint validthis: true */
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
  }
})();
