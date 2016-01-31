(function () {
  'use strict';

  angular
    .module('hp.common')
    .directive('advanceSearch', advanceSearch);

  /* @ngInject */
  function advanceSearch() {
    var directive = {
      link: link,
      restrict: 'E',
      templateUrl: 'common/advanceSearch.tpl.html',
      scope: {
        searchColumnCollection: '=',
        applySearchCallback: '=',
        clearSearchCallback: '=',
        onChangeCallback: '='
      },
      controller: 'AdvanceSearchCtrl as vm'
    };
    return directive;

    function link() {}
  }
})();
