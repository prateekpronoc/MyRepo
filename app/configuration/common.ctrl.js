(function () {
  'use strict';

  angular
    .module('wams.configuration')
    .controller('commonCtrl', commonCtrl);

  function commonCtrl($window) {
    var vm = this;
    vm.title = 'Information';
    vm.cancel = cancel;
    activate();

    ////////////////

    function activate() {}


    function cancel() {
      $window.history.back();
    }
  }
})();
