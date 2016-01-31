(function () {
  'use strict';

  angular
    .module('wams.gym')
    .controller('OpenCodeModalCtrl', OpenCodeModalCtrl);

  /* @ngInject */
  function OpenCodeModalCtrl($modalInstance, wamsServices, notifier, data) {
    var vm = this;
    vm.title = 'Controller';
    vm.exit = exit;
    vm.save = save;



    activate();

    ////////////////

    function activate() {
      getSlots();
    }

    function getSlots() {
      vm.codeSlots = [];
      for (var i = 0; i < parseInt(data); i++) {
        vm.codeSlots.push({
          equipment: i
        });
      }
    }

    function exit() {
      $modalInstance.close('cancel');
    }

    function save() {
      var selectedId = _.pluck(_.filter(vm.codeSlots, 'code'), 'code');
      $modalInstance.close(selectedId);
    }
  }
})();
