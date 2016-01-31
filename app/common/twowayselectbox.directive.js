  (function () {
    'use strict';

    angular
      .module('hp.common')
      .directive('twoWaySelect', twoWaySelect);

    function twoWaySelect() {
      var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'common/twowayselectbox.html',
        controller: TwoWaySelectItemCtrl,
        controllerAs: 'vm',
        scope: {
          data: '=',
          isLast: '@',
          title: '@',
          selectedIds: '=',
          selectedText: '@',
          selectionListener: '&',
          maxLimit: '='
        }
      };
      return directive;

      function link() {} //scope, element, attrs

      /* ngInject */
      function TwoWaySelectItemCtrl($scope, commonService, notifier) {
        var vm = this;
        vm.rightSelectedItems = [];
        vm.leftSelectedItems = [];
        vm.moveItems = moveItems;
        if (angular.isUndefined($scope.selectedText)) {
          vm.selectedText = $scope.title;
        } else {
          vm.selectedText = $scope.selectedText;
        }
        if (angular.isUndefined($scope.selectedIds)) {
          $scope.selectedIds = [];
        }

        $scope.$watchCollection('selectedIds', function () {
          if (angular.isUndefined($scope.selectedIds)) {
            $scope.selectedIds = [];
          }
          updateDropDownTitle();
        });
        $scope.$watch('data', function () {
          updateDropDownTitle();
        });
        $scope.$watch('selectedText', function () {
          if ($scope.selectedText && $scope.selectedText.length > 0) {
            //console.log(' Selected Text = ' + JSON.stringify($scope.selectedText));
            vm.selectedText = $scope.selectedText;
          }
        });
        updateDropDownTitle();
        $scope.$on('tooltip.show', function () {
          if ($scope.isLast) {
            commonService.scrollToBottom($scope);
          }
        });

        function moveItems(leftToRight, isAll) {
          var i, key, src = vm.leftSelectedItems,
            dest = $scope.selectedIds;
          if (!$scope.selectedIds) {
            $scope.selectedIds = [];
          }
          if (!leftToRight) {
            src = $scope.selectedIds;
            dest = vm.leftSelectedItems;
          }
          if (isAll) {
            if (leftToRight) {
              if ($scope.maxLimit && Object.keys($scope.data).length > $scope.maxLimit) {
                notifier.notice('Maximum no of selection should be ' + $scope.maxLimit);
                return;
              }
              for (key in $scope.data) {
                if ($scope.data.hasOwnProperty(key) && $scope.selectedIds.indexOf(key) === -1) {
                  $scope.selectedIds.push(key);
                }
              }
            } else {
              $scope.selectedIds.length = 0;
            }
          } else {
            if (!leftToRight) {
              src = vm.rightSelectedItems;
            }
            if (leftToRight) {
              if ($scope.maxLimit && ($scope.selectedIds.length + vm.leftSelectedItems.length > $scope.maxLimit)) {
                notifier.notice('Maximum no of selection should be ' + $scope.maxLimit);
                return;
              }
              for (i = 0; i < vm.leftSelectedItems.length; i += 1) {
                if ($scope.selectedIds.indexOf(vm.leftSelectedItems[i]) === -1) {
                  $scope.selectedIds.push(vm.leftSelectedItems[i]);
                }
              }
              vm.leftSelectedItems.length = 0;
            } else {
              for (i = 0; i < vm.rightSelectedItems.length; i += 1) {
                if ($scope.selectedIds.indexOf(vm.rightSelectedItems[i]) > -1) {
                  $scope.selectedIds.splice($scope.selectedIds.indexOf(vm.rightSelectedItems[i]), 1);
                }
              }
              vm.rightSelectedItems.length = 0;
            }
            updateDropDownTitle();
          }
          if ($scope.selectionListener) {
            $scope.selectionListener({
              selectedIds: $scope.selectedIds
            });
          }
        }

        function updateDropDownTitle() {
          var i;
          if (angular.isObject($scope.data) && angular.isArray($scope.selectedIds) && $scope.selectedIds.length >
            0) {
            vm.selectedText = $scope.data[$scope.selectedIds[0]] ? $scope.data[$scope.selectedIds[0]] : '';
            for (i = 1; i < $scope.selectedIds.length; i += 1) {
              if ($scope.data[$scope.selectedIds[i]]) {
                vm.selectedText = vm.selectedText + ', ' + $scope.data[$scope.selectedIds[i]];
                if (vm.selectedText.length > 120) {
                  break;
                }
              }
            }
          } else if (angular.isArray($scope.selectedIds) && $scope.selectedIds.length === 0) {
            vm.selectedText = $scope.title;
          }
          if (!vm.selectedText || vm.selectedText.length === 0) {
            vm.selectedText = $scope.title;
          }
        }
      }
    }
  })();
