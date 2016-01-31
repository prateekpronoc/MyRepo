(function () {
  'use strict';

  angular
    .module('hp.common')
    .directive('fileModel', fileModel);

  /* @ngInject */
  function fileModel($parse) {
    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
      var model = $parse(attrs.fileModel),
        modelSetter = model.assign;

      element.bind('change', function () {
        scope.$apply(function () {
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  }
})();
