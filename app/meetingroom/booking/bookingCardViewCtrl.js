(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('bookingCardViewCtrl', bookingCardViewCtrl);

  /* @ngInject */
  function bookingCardViewCtrl($modalInstance, bookingFinalInfo) {
    var vm = this;
    vm.title = 'Booking Info';
    vm.entity = bookingFinalInfo;
    vm.exit = exit;
    activate();

    ////////////////

    function activate() {
      console.log(JSON.stringify(bookingFinalInfo));
    }

    function exit() {
      $modalInstance.dismiss('cancel');
    }
  }
})();
