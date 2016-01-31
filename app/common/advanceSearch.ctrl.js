(function () {
  'use strict';

  angular
    .module('hp.common')
    .controller('AdvanceSearchCtrl', AdvanceSearchCtrl);

  /* @ngInject */
  function AdvanceSearchCtrl($scope, commonService) {
    /*jshint validthis: true */
    var vm = this;
    vm.commonService = commonService;
    vm.searchCriteria = {};
    vm.widthPerParam = 'width:30%';
    vm.advanceSearchColletion = [];
    vm.creatAdvanceSearch = creatAdvanceSearch;
    vm.clearAdvanceCollectionData = clearAdvanceCollectionData;
    vm.applyAdvanceSearch = applyAdvanceSearch;
    vm.onChangeOfValue = onChangeOfValue;

    function creatAdvanceSearch() {
      if (angular.isObject($scope.searchColumnCollection) && angular.isArray($scope.searchColumnCollection
          .collection) &&
        $scope.searchColumnCollection.collection.length > 0) {
        angular.forEach($scope.searchColumnCollection.collection, function (column) {
          if (angular.isUndefined(column.displayAttr) || column.displayAttr === '') {
            column.displayAttr = column.id;
          }
          if (column.hasToggleButton) {
            if (column.toggleDefautlValue) {
              vm.searchCriteria[column.toggleButtonId] = column.toggleTrue;
            } else {
              vm.searchCriteria[column.toggleButtonId] = column.toggleFalse;
            }
          }
          if (column.type === 'multiple' && angular.isArray(column.data)) {
            column.processedData = commonService.processItems(column.data, column.id, column.displayAttr);
          } else if (angular.isObject(column.data)) {
            column.processedData = column.data;
          }
          if (angular.isDefined(column.parentId)) {
            column.processedData = {};
          }
        });
      }
    }

    function clearAdvanceCollectionData() {
      vm.searchCriteria = {};
      vm.creatAdvanceSearch();
      $scope.clearSearchCallback();
    }

    function applyAdvanceSearch() {
      var searchObject = {};
      if (!angular.isUndefined(vm.searchCriteria)) {
        angular.forEach(vm.searchCriteria, function (value, key) {
          if (!angular.isUndefined(value) && value !== null && value.length !== 0) {
            searchObject[key] = value;
          }
        });
        if (Object.keys(searchObject).length > 0) {
          $scope.applySearchCallback(searchObject);
        }
      }
    }

    function activate() {
      $scope.$watch('searchColumnCollection', function () {
        vm.creatAdvanceSearch();
      });
    }

    function onChangeOfValue(controller) {
      var tempObj, newData = [],
        selectedIds = vm.searchCriteria[controller.id];
      if (controller.hasOnChangeEvent) {
        tempObj = {
          id: controller.id,
          data: selectedIds
        };
        newData = angular.copy($scope.onChangeCallback(tempObj));
        if (newData.length > 0) {
          changeControllerData(newData);
        }
      }
    }

    function changeControllerData(newData) {
      angular.forEach($scope.searchColumnCollection.collection, function (column) {
        angular.forEach(newData, function (data) {
          if (column.id === data.id) {
            column.data = data.data;
            column.processedData = commonService.processItems(data.data, column.id, column.displayAttr);
          }
        });

      });
    }
    activate();
  }
})();
