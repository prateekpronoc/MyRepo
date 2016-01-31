(function () {
  'use strict';

  angular
    .module('hp.common.charts')
    .directive('donutChart', donutChart);

  /* @ngInject */
  function donutChart() {
    var directive = {
        link: link,
        restrict: 'EA',
        templateUrl: 'common/charts/donutChart.tpl.html',
        scope: {
          data: '='
        },
        controller: DonutChartCtrl
      },
      colors = ['#02CBC9', '#B8E735', '#31AF95', '#D06A8C', '#69C2EE', '#F59B7B', '#FFD54F', '#BFBFBF', '#D9DB39'];
    return directive;

    function link(scope, element) {
      scope.div1 = angular.element(element.children()[0]);
      scope.div = angular.element(scope.div1.children()[1]);
    }

    /*ngInject*/
    function DonutChartCtrl($scope, _) {
      $scope.chartCount = 1000;
      $scope.$watch(function () {
        return $scope.div.height() * $scope.div.width();
      }, function () {
        $scope.width = $scope.div.width();
        $scope.height = $scope.div.height();
        $scope.navStyle = {
          top: ($scope.height / 2 - 20) + 'px'
        };
      });
      $scope.$watch('data', function () {
        $scope.dataArray = $scope.data.data ? $scope.data.data : [];
        $scope.startIndex = 0;
        fillChartData($scope.startIndex);
      });

      fillChartData = fillChartData;
      $scope.previous = previous;
      $scope.next = next;

      function previous() {
        $scope.startIndex = $scope.startIndex - $scope.chartCount;
        if ($scope.startIndex < 0) {
          $scope.startIndex = 0;
        }
        fillChartData($scope.startIndex);
      }

      function next() {
        $scope.startIndex = $scope.startIndex + $scope.chartCount;
        fillChartData($scope.startIndex);
      }

      function fillChartData(startIndex) {
        if (!$scope.data || !$scope.data.series) {
          return;
        }
        var series = $scope.data.series,
          data = $scope.data.data, options = $scope.data.options ? angular.copy($scope.data.options) : {};
        $scope.isLessData = startIndex > 0 && data.length > 0;
        $scope.isMoreData = data.length > $scope.chartCount + startIndex;
        if (!$scope.chartData) {
          $scope.chartData = {
            type: 'PieChart',
            data: [],
            options: {
              pieHole: 0.5,
              pieSliceTextStyle: {
                color: 'black',
                'font-weight': 'bold'
              },
              colors: colors,
              legend: 'none',
              is3D: false,
              chartArea: {
                left: '0px',
                top: '0px',
                height: $scope.height,
                width: $scope.width
              },
              pieSliceText: 'value',
              tooltip: {
                showColorCode: true,
                text: 'value'
              },
              height: $scope.height,
              width: $scope.width,
              animation: {
                duration: 500,
                easing: 'in',
                startup: true
              }
            }
          };
        }
        if (_.size(options) > 0) {
          $scope.chartData.options = _.merge($scope.chartData.options, options);
        }
        $scope.chartData.data.length = 0;
        $scope.chartData.data.push(angular.copy(series));
        if (data && data.length > 0 && data.length > startIndex) {
          $scope.chartData.data = $scope.chartData.data.concat(angular.copy(data.slice(startIndex, ($scope.chartCount +
            startIndex) < data.length ? startIndex + $scope.chartCount : data.length)));
        }
      }
    }
  }
})();
