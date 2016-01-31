(function () {
  'use strict';

  angular
    .module('hp.common')
    .directive('multiSelectItem', multiSelectItem);

  /* @ngInject */
  function multiSelectItem() {
    // Usage:
    //  data binding should be a Json object with structure
    //  {id: value, id2: value2..} format.
    // selectedIds should resolve to an Array of empty/already selected ids.
    // selectionListener is an optional call back which can be binded to get the selection callback.
    // Creates:
    //
    var directive = {
      link: link,
      restrict: 'A',
      templateUrl: 'common/multiSelectItem.tpl.html',
      controller: MultiSelectItemCtrl,
      controllerAs: 'vm',
      scope: {
        data: '=',
        name: '@',
        selectedIds: '=',
        selectionListener: '&',
        selectedItemClass: '='
      }
    };
    return directive;

    function link() {} //scope, element, attrs

    /* ngInject */
    function MultiSelectItemCtrl($scope) {
      /*jshint validthis: true */
      var vm = this;
      if (angular.isUndefined($scope.selectedIds)) {
        $scope.selectedIds = [];
      }
      vm.itemStateChanged = selectionChanged;

      //////////////////
      function selectionChanged(id, isSelected) {
        if (isSelected) {
          if ($scope.selectedIds.indexOf(id) === -1) {
            $scope.selectedIds.push(id);
          }
        } else {
          if ($scope.selectedIds.indexOf(id) > -1) {
            $scope.selectedIds.splice($scope.selectedIds.indexOf(id), 1);
          }
        }
        if ($scope.selectionListener) {
          $scope.selectionListener($scope.selectedIds);
        }
      }
    }
  }
})();
