(function () {
  'use strict';

  angular
    .module('hp.common')
    .directive('pagingControl', pagingControl);

  /* @ngInject */
  function pagingControl() {
    // Usage:
    //
    // Creates:
    //
    var directive = {
      link: link,
      restrict: 'E',
      replace: true,
      templateUrl: 'common/pagingControl.tpl.html',
      scope: {
        pagingOptions: '=',
        actionPageChanged: '='
      },
      controller: function ($scope, $window) {
        /*Region : Variables*/
        var startPage, endPage, nextPageAnchorIndex = 0,
          nextPageSliderPoint = 3;
        $scope.totalRecordCount = 0;
        $scope.maxPageLimit = 0;
        $scope.pagingArray = [];
        $scope.nextPageClicked = nextPageClicked;
        $scope.previousPageClicked = previousPageClicked;
        $scope.endPage = 0;
        $scope.pageStartIndex = 1;
        $scope.pageEndIndex = 1;
        $scope.pageRecordOptionsArray = [];
        $scope.pageClicked = pageClicked;
        $scope.onRowCountChange = onRowCountChange;
        $scope.pageRecordCount = 1;
        $scope.onLastPageClicked = onLastPageClicked;
        $scope.onFirstPageClicked = onFirstPageClicked;
        $scope.rowChangeFlag = 0;
        $scope.recordsPerPage = 0;
        /*endRegion : Variables*/

        $scope.$watchCollection('pagingOptions', function (newValue) {
          if (newValue.columnCount !== $scope.pageRecordCount || $scope.totalRecordCount !== $scope.pagingOptions
            .totalDataRecordCount) {
            calculatePagingParameters();
          }
        });

        function calculatePagingParameters() {
          var optionsArray = [10];
          if (!$scope.pagingOptions) {
            $scope.pagingOptions = {};
          }
          if (!$scope.pagingOptions.currentPage) {
            $scope.pagingOptions.currentPage = 1;
          }
          $scope.pageRecordOptionsArray = ($scope.pagingOptions.pageRecordOptionsArray.length > 0) ?
            $scope.pagingOptions.pageRecordOptionsArray : optionsArray;
          $scope.totalRecordCount = $scope.pagingOptions.totalDataRecordCount;
          $scope.recordsPerPage = $scope.pagingOptions.recordsPerPage;
          if ($scope.recordsPerPage > 0) {
            $scope.totalPageRecord = $scope.recordsPerPage;
            $scope.pageRecordCount = $scope.recordsPerPage;
          } else {
            $scope.totalPageRecord = $scope.pagingOptions.rowCount * $scope.pagingOptions.columnCount;
            $scope.pageRecordCount = $scope.pagingOptions.rowCount * $scope.pagingOptions.columnCount;
          }

          if ($scope.totalRecordCount >= 1) {
            $scope.maxPageLimit = $window.Math.ceil($scope.totalRecordCount / $scope.totalPageRecord);
            calculatePagingLimit();
          }
        }

        function calculatePagingLimit() {
          nextPageAnchorIndex = $scope.pagingOptions.pagingRange;
          if ($scope.maxPageLimit < $scope.pagingOptions.pagingRange) {
            startPage = 1;
            endPage = $scope.maxPageLimit;
          } else if ($scope.maxPageLimit >= $scope.pagingOptions.pagingRange) {
            startPage = 1;
            endPage = $scope.pagingOptions.pagingRange;
          }
          createPagingArray(startPage, endPage);
        }

        function createPagingArray(startPage, endPage) {
          var i;
          $scope.pageStartIndex = startPage;
          $scope.pageEndIndex = endPage;
          $scope.pagingArray.length = 0;
          for (i = startPage; i <= endPage; i = i + 1) {
            $scope.pagingArray.push(i);
          }
        }

        function nextPageClicked() {
          var newStartpage, newEndPage;
          newStartpage = nextPageSliderPoint + $scope.pageStartIndex;
          newEndPage = newStartpage + $scope.pagingOptions.pagingRange - 1;
          $scope.pagingOptions.currentPage += 1;
          if (newEndPage > $scope.maxPageLimit) {
            newEndPage = $scope.maxPageLimit;
          }
          if ($scope.pagingOptions.currentPage < newStartpage) {
            $scope.pageClicked($scope.pagingOptions.currentPage);
          } else {
            createPagingArray(newStartpage, newEndPage);
            $scope.pageClicked($scope.pagingOptions.currentPage);
          }
        }

        function previousPageClicked() {
          var newStartpage, newEndPage;
          newStartpage = $scope.pageStartIndex - nextPageSliderPoint;
          newEndPage = newStartpage + $scope.pagingOptions.pagingRange - 1;
          $scope.pagingOptions.currentPage -= 1;
          if (newStartpage < 1) {
            newStartpage = 1;
            newEndPage = newStartpage + $scope.pagingOptions.pagingRange - 1;
          }
          if ($scope.pagingOptions.currentPage > newEndPage) {
            $scope.pageClicked($scope.pagingOptions.currentPage);
          } else {
            createPagingArray(newStartpage, newEndPage);
            $scope.pageClicked(newEndPage);
          }
        }

        function pageClicked(currentPage) {
          $scope.pagingOptions.currentPage = currentPage;
          $scope.actionPageChanged(currentPage, $scope.pagingOptions.rowCount * $scope.pagingOptions.columnCount,
            false);
        }

        function onRowCountChange(newRowValue) {
          //console.log(newRowValue);
          $scope.rowChangeFlag = $scope.pagingOptions.rowCount = newRowValue / $scope.pagingOptions.columnCount;
          $scope.actionPageChanged(1, newRowValue);
          $scope.pageRecordCount = newRowValue;
        }

        function onLastPageClicked() {
          var newStartpage, lastPage;
          lastPage = $scope.maxPageLimit;
          newStartpage = lastPage - ($scope.pagingOptions.pagingRange - 1);
          createPagingArray(newStartpage, lastPage);
          pageClicked(lastPage);
        }

        function onFirstPageClicked() {
          var newEndPage, firstPage;
          firstPage = 1;
          newEndPage = firstPage + $scope.pagingOptions.pagingRange - 1;
          createPagingArray(firstPage, newEndPage);
          pageClicked(firstPage);
        }
      }
    };
    return directive;

    function link() {}
  }
})();
