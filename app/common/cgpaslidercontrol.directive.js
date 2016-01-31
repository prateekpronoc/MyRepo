(function () {
  'use strict';

  angular
    .module('hp.common')
    .directive('cgpaSliderControl', cgpaSliderControl);

  /* @ngInject */
  function cgpaSliderControl() {
    var directive = {
      link: link,
      template: '<div class="form-control" style="background-color: white;" data-placement="bottom" ' +
        'data-template="common/cgpaslidercontrol.tpl.html" data-animation="am-fade-and-slide-top" ' +
        'data-auto-close="true" bs-popover><span class="pull-left" style="text-overflow: ellipsis;" ' +
        'ng-bind="vm.title"></span><i class="fa fa-chevron-down pull-right"></i></div>',
      restrict: 'A',
      controller: CgpaCtrl,
      controllerAs: 'vm',
      scope: {
        isPercentage: '=',
        percentage: '=',
        title: '@'
      }
    };
    return directive;

    function link() {} //scope, element, attrs

    /* ngInject */
    function CgpaCtrl($scope) {
      /*jshint validthis: true */
      var vm = this;
      vm.options = {
        falseOptions: {
          from: '0',
          to: '10',
          step: '0.5',
          round: 1,
          dimension: ' CGPA',
          scale: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        },
        trueOptions: {
          from: '0',
          to: '100',
          step: '5',
          dimension: ' %',
          scale: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100']
        },
        falseDefault: '0;10',
        trueDefault: '0;100'
      };
      vm.isPercentage = $scope.isPercentage || false;
      vm.percentage = $scope.percentage ? $scope.percentage : vm.options[vm.isPercentage + 'Default'];
      vm.sliderOptions = vm.options[vm.isPercentage + 'Options'];
      vm.title = $scope.title || 'Choose Range';
      $scope.cgpaOptionChanged = cgpaOptionChanged;

      $scope.$watch('vm.isPercentage', function () {
        $scope.isPercentage = vm.isPercentage;
      });
      $scope.$watch('vm.percentage', function () {
        $scope.percentage = vm.percentage;
        vm.title = getTitle(vm.isPercentage, $scope.percentage);
      });

      function cgpaOptionChanged() {
        vm.percentage = vm.options[vm.isPercentage + 'Default'];
        $scope.isPercentage = vm.isPercentage;
        $scope.percentage = vm.percentage;
        vm.sliderOptions = vm.options[vm.isPercentage + 'Options'];
        vm.title = getTitle(vm.isPercentage, $scope.percentage);
      }

      function getTitle(isPercentage, percentageText) {
        var values = percentageText.split(';');
        return values[0] + ' To ' + values[1] + (isPercentage ? '%' : ' CGPA');
      }
    }
  }
})();
