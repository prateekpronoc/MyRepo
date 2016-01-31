(function () {
  'use strict';

  angular.module('hp.common')
    .directive('gridviewTable', gridviewTable);

  function gridviewTable() {
    var directive = {
      link: link,
      restrict: 'A',
      scope: {
        columnCollection: '=',
        entity: '='
      },
      templateUrl: 'common/gridviewTable.html',
      controller: gridViewTableCtrl,
      controllerAs: 'vm'
    };
    return directive;

    function link() {} //scope, element, attrs
    function gridViewTableCtrl($scope) {
      var vm = this;
      function activate() {

      }
      activate();

    }
  }
})();
