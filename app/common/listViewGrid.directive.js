(function () {
  'use strict';

  angular
    .module('hp.common')
    .directive('listViewGrid', listViewGird);

  /* @ngInject */
  function listViewGird() {
    // Usage:
    // Creates:
    var directive = {
      link: link,
      restrict: 'E',
      templateUrl: 'common/listViewGrid.tpl.html',
      scope: {
        data: '=',
        columnInfo: '=',
        options: '=',
        actions: '=',
        actionListener: '&',
        isFilterDisabled: '@',
        isActive: '='
      },
      controller: ListViewGridCtrl
    };
    return directive;

    ////////////////////////////
    function link() {}

    /* ngInject */
    function ListViewGridCtrl($scope, commonService, $filter) {

      if ($scope.options) {
        $scope.options.isAllChecked = false;
      }
      $scope.toggleSelection = toggleSelection;
      $scope.toggleSorting = toggleSorting;
      $scope.reversed = false;
      $scope.predicate = 'Id';
      $scope.isHidden = isHidden;
      $scope.itemSelectionChange = itemSelectionChange;
      $scope.counter = 0;
      activate();
      $scope.search = {};

      function activate() {
        // Fill in the defaults for column data type to text
        $scope.$watch('columnInfo', function () {
          $scope.search = {};
          if (angular.isDefined($scope.columnInfo) && $scope.columnInfo.length > 0) {
            for (var i = 0; i < $scope.columnInfo.length; i += 1) {
              if (angular.isUndefined($scope.columnInfo[i].dataType)) {
                $scope.columnInfo[i].dataType = 'text';
              }
              if (angular.isUndefined($scope.columnInfo[i].isFilter)) {
                $scope.columnInfo[i].isFilter = true;
              }
              if (angular.isUndefined($scope.columnInfo[i].isSorting)) {
                $scope.columnInfo[i].isSorting = true;
              }
            }
          }
        });
        $scope.columnInfo = commonService.normalizeFieldTitles($scope.columnInfo, 'id', 'title');
      }

      $scope.$watchCollection('data', function () {
        $scope.counter = 0;
        if ($scope.options) {
          $scope.options.isAllChecked = false;
        }
      });

      $scope.$watch('isActive', function () {
        cancelAllCheked();
        if ($scope.options) {
          $scope.options.selectedRowCount = 0;
          $scope.options.isAllChecked = false;
        }
      });

      $scope.$watch('search', function () {
        if ($scope.options) {
          $scope.options.isAllChecked = false;
          cancelAllCheked();
          itemSelectionChange();
        }
      }, true);

      function isHidden(entity, action) {
        if (angular.isUndefined(action.ngHide)) {
          return false;
        }
        if (action.ngHide.indexOf('!') > -1) {
          return !entity[action.ngHide.substring(1)];
        } else {
          return entity[action.ngHide];
        }
        return false;
      }

      function cancelAllCheked() {
        if ($scope.data && $scope.data.length > 0) {
          angular.forEach($scope.data, function (item) {
            item.checked = false;
          });
        }
      }

      function toggleSorting(sortingValue) {
        $scope.predicate = sortingValue.id;
        $scope.reversed = !$scope.reversed;
      }

      function toggleSelection(isChecked) {
        angular.forEach($filter('filter')($scope.data, $scope.search), function (value) {
          value.checked = isChecked;
        });
        itemSelectionChange();
      }

      function itemSelectionChange(isChecked) {
        var temp = ($filter('filter'))($filter('filter')($scope.data, $scope.search), {
          checked: true
        });
        if (angular.isDefined(temp) && temp !== null) {
          if (isChecked) {
            $scope.options.selectedRowCount = getFilteredCount();
          } else {
            $scope.options.selectedRowCount = getFilteredSelectedCount();
          }
          if (getFilteredCount() > 0) {
            $scope.options.isAllChecked = ($scope.options.selectedRowCount === getFilteredCount());
          }
        }
      }

      function getFilteredCount() {
        return ($filter('filter')($scope.data, $scope.search).length);
      }

      function getFilteredSelectedCount(isChecked) {
        return isChecked ? ($filter('filter'))($filter('filter')($scope.data, $scope.search), {
          checked: isChecked
        }).length : ($filter('filter'))($filter('filter')($scope.data, $scope.search), {
          checked: true
        }).length;
      }

      $scope.actionClicked = function (actionCode, data) {
        if ($scope.actionListener) {
          $scope.actionListener({
            actionCode: actionCode,
            record: data
          });
        }
      };
    }
  }
})();
