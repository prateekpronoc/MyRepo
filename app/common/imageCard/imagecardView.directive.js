(function () {
  'use strict';

  angular
    .module('hp.common')
    .directive('imagecardView', imagecardView);

  /* @ngInject */
  function imagecardView() {
    var directive = {
      link: link,
      restrict: 'A',
      templateUrl: 'common/imageCard/imagecardView.tpl.html',
      scope: {
        data: '=',
        templateUrl: '=',
        actionListener: '&',
        cardTitle: '=',
        mainActions: '=',
        actionsProvider: '&',
        idField: '=',
        nameField: '=',
        cardHeight: '=',
        isDeleteDisabled: '=',
        isEditDisabled: '=',
        interval: '=',
        slidesData: '='
      },
      controller: ImageCardViewCtrl,
      controllerAs: 'vm'
    };
    return directive;

    function link() {} //scope, element, attrs

    /* ngInject */
    function ImageCardViewCtrl($scope, commonService, session) {
      /*jshint validthis: true */
      var vm = this;
      vm.session = session;
      $scope.actionClicked = actionClicked;
      vm.isHidden = isHidden;
      vm.getCardActions = getCardActions;
      activate();

      //////////////////////
      function activate() {
        // vm.maxCols = 3;
        // if ($scope.mainColumns && $scope.mainColumns.length > vm.maxCols) {
        //   vm.maxCols = $scope.mainColumns.length;
        // }
        // if ($scope.flipColumns && $scope.flipColumns.length > vm.maxCols) {
        //   vm.maxCols = $scope.flipColumns.length;
        // }
        // vm.maxCols += 3;
        // if (angular.isUndefined($scope.idField)) {
        //   $scope.idField = 'id';
        // }
        // if (angular.isUndefined($scope.nameField)) {
        //   $scope.nameField = 'name';
        // }
        // if ($scope.data) {
        //   if (angular.isUndefined($scope.data.isEditDisabled)) {
        //     $scope.data.isEditEnabled = true;
        //   }
        //   if (angular.isUndefined($scope.data.isDeleteEnabled)) {
        //     $scope.data.isDeleteEnabled = true;
        //   }
        // }
        // $scope.mainColumns = commonService.normalizeFieldTitles($scope.mainColumns, 'id', 'title');
        // $scope.flipColumns = commonService.normalizeFieldTitles($scope.flipColumns, 'id', 'title');
        // if (!$scope.flipTitle) {
        //   $scope.flipTitle = 'Current Progress';
        // }
      }

      function actionClicked(actionCode, data) {
        if ($scope.actionListener) {
          $scope.actionListener({
            actionCode: actionCode,
            record: data
          });
        }
      }

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

      function getCardActions(viewType, data) {
        var actions = [];
        if ($scope.actionsProvider) {
          actions = $scope.actionsProvider({
            view: viewType,
            record: data
          });
        }
        if (!actions || actions.length === 0) {
          if (viewType === 'front' && $scope.mainActions && $scope.mainActions.length > 0) {
            actions = $scope.mainActions;
          } else if (viewType === 'back' && $scope.flipActions && $scope.flipActions.length > 0) {
            actions = $scope.flipActions;
          }
        }
        return actions;
      }
    }
  }
})();
