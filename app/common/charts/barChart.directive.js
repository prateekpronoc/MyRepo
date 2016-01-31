(function () {
  'use strict';

  angular
    .module('hp.common.charts')
    .directive('barChart', BarChart);

  /* @ngInject */
  function BarChart() {
    var directive = {
        link: link,
        restrict: 'E',
        templateUrl: 'common/charts/barChart.tpl.html',
        scope: {
          data: '='
        },
        controller: BarChartCtrl
      },
      colors = ['#02CBC9', '#B8E735', '#31AF95', '#D06A8C', '#69C2EE', '#F59B7B', '#FFD54F', '#BFBFBF', '#D9DB39'];
    return directive;

    function link(scope, element) {
      var div1 = angular.element(element.children()[0]);
      scope.div = angular.element(div1.children()[1]);
    }

    /*ngInject*/
    function BarChartCtrl($scope, _) {
      $scope.chartCount = 5;
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
          data = $scope.data.data,
          dummy = [''];
        $scope.isLessData = startIndex > 0 && data.length > 0;
        $scope.isMoreData = data.length > $scope.chartCount + startIndex;
        if (!$scope.chartData) {
          $scope.chartData = {
            type: 'ColumnChart',
            data: [],
            options: {
              colors: colors,
              isStacked: false,
              hAxis: {
                baseline: 0
              },
              vAxis: {
                min: 5
              },
              animation: {
                duration: 500,
                easing: 'linear',
                startup: true
              }
            }
          };
        }
        $scope.chartData.data.length = 0;
        $scope.chartData.data.push(angular.copy(series));
        if (data && data.length > 0 && data.length > startIndex) {
          $scope.chartData.data = $scope.chartData.data.concat(angular.copy(data.slice(startIndex, ($scope.chartCount +
            startIndex) < data.length ? startIndex + $scope.chartCount : data.length)));
        }
        if ($scope.chartData.data.length < $scope.chartCount && series && series.length > 0) {
          _.times(series.length - 1, _.partial(function () {
            dummy.push(0);
          }));
          _.times($scope.chartCount - $scope.chartData.data.length, _.partial(function () {
            $scope.chartData.data.push(angular.copy(dummy));
          }));
        }
        // $scope.chartData.data[0].push({type: 'string', role: 'tooltip'});
        // for (i = 1; i < $scope.chartData.data.length; i += 1) {
        //   $scope.chartData.data[i].push('XYZ');
        // }
      }
    }
  }
})();
