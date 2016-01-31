  (function () {
    'use strict';
    angular
      .module('hp.common')
      .directive('filterableSelect', filterableSelect);

    function filterableSelect() {
      var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'common/filterableSelectbox.html',
        controller: SelectItemCtrl,
        controllerAs: 'vm',
        scope: {
          data: '=',
          title: '@',
          selectedId: '=',
          selectionChanged: '&'
        }
      };
      return directive;

      function link() {} //scope, element, attrs

      /* ngInject */
      function SelectItemCtrl($scope) {
        /*jshint validthis: true */
        var vm = this;
        vm.selectedText = $scope.title;
        vm.filterLeft = '';
        vm.changed = changed;
        updateTitle();

        function changed(selectedId) {
          $scope.selectedId = selectedId;
          updateTitle();
          if ($scope.selectionChanged) {
            $scope.selectionChanged({
              selectedId: $scope.selectedId
            });
          }
        }
        $scope.$watchGroup(['selectedId', 'data'], function () {
          updateTitle();
        });
        $scope.$watchCollection(['data'], function () {
          updateTitle();
        });

        function updateTitle() {
          if ($scope.selectedId && $scope.data) {
            vm.selectedText = $scope.data[$scope.selectedId];
          } else {
            vm.selectedText = $scope.title;
          }
        }
      }
    }
  })();
