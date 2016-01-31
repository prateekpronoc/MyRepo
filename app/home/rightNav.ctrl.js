(function () {
  'use strict';

  angular
    .module('wams.home')
    .controller('RightNavCtrl', RightNavCtrl);

  /* @ngInject */
  function RightNavCtrl() {
    /*jshint validthis: true */
    var vm = this;
    vm.title = 'Ctrl';

    activate();

    function activate() {}
  }
})();
