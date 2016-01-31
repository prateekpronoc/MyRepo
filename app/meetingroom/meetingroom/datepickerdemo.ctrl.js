(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('DatepickerDemoCtrl', DatepickerDemoCtrl);


  function DatepickerDemoCtrl($scope) {
    var vm = this;
    vm.today = today;
    vm.clear = clear;
    /*vm.disabled = disabled;*/
    vm.toggleMin = toggleMin;
    vm.open = open;
    vm.opened = false;
    vm.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1
    };

    function today() {
      vm.dt = new Date();
      vm.minDate = new Date();
    };
    vm.today();

    function clear() {
      vm.dt = null;
    };

   // Disable weekend selection
  /*function disabled(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };*/

    function toggleMin() {
      /*vm.minDate = vm.minDate ? null : new Date*/
    };
    vm.toggleMin();

    function open($event) {
      $event.preventDefault();
      $event.stopPropagation();
     vm.opened = true;
    };

    // vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    // vm.format = vm.formats[0]
  }
})();

