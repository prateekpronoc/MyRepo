(function () {
  'use strict';

  angular
    .module('wams.mybookings')
    .controller('PopUpCtrl', PopUpCtrl);

  /* @ngInject */
  function PopUpCtrl($mdDialog, mrInfo, wamsServices) {
    /*jshint validthis: true */
    var vm = this;
    vm.title = 'Ctrl';
    vm.entityInfo = {};
    vm.items = [{
      name: 'computer',
      icon: 'computer'
    }, {
      name: 'desktop',
      icon: 'desktop'
    }, {
      name: 'headset',
      icon: 'headset'
    }, {
      name: 'speaker',
      icon: 'speaker'
    }, ];

    vm.myInterval = 3000;
    vm.slides = [{
      image: 'http://lorempixel.com/400/200/'
    }, {
      image: 'http://lorempixel.com/400/200/food'
    }, {
      image: 'http://lorempixel.com/400/200/sports'
    }, {
      image: 'http://lorempixel.com/400/200/people'
    }];
    activate();

    function activate() {
      vm.entityInfo = mrInfo;
      wamsServices.getEntity({
        key: 'meetingRooms',
        request: {
          id: vm.entityInfo.id
        }
      }).then(function(response){
        console.log(response);
      })

      console.log(vm.entityInfo);
    }

    vm.hide = function () {
      $mdDialog.hide();
    };
    vm.cancel = function () {
      $mdDialog.cancel();
    };
  }
})();
