(function () {
  'use strict';

  angular
    .module('wams.mymeetingrooms')
    .controller('DemoCtrl', DemoCtrl);
  // .config(config);

  /* @ngInject */
  function DemoCtrl($mdDialog, allinfra, thisInfra, entityInfo) {
    /*jshint validthis: true */
    var vm = this;
    vm.title = 'Ctrl';
    vm.allinfra = [];
    vm.thisInfra = [];
    vm.entityInfo = {};
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
    vm.iconsList = [{
      name: 'Projector',
      icon: 'projector3.svg'
    }, {
      name: 'Camera',
      icon: 'ic_camera_enhance_24px.svg'
    }, {
      name: 'Headset',
      icon: 'ic_headset_mic_24px.svg'
    }, {
      name: 'Pendrive',
      icon: 'ic_usb_24px.svg'
    }, {
      name: 'Computer',
      icon: 'ic_computer_24px.svg'
    }, {
      name: 'Wi-Fi',
      icon: 'ic_camera_enhance_24px.svg'
    }, {
      name: 'Camera',
      icon: 'ic_wifi_tethering_24px.svg'
    }, {
      name: 'Camera',
      icon: 'ic_camera_enhance_24px.svg'
    }];
    activate();
    vm.hide = function () {
      $mdDialog.hide();
    };

    function activate() {
      vm.allinfra = allinfra;
      vm.thisInfra = thisInfra;
      vm.entityInfo = entityInfo;
      console.log(vm.entityInfo);
    }
  }

  // function config($mdThemingProvider) {
  //   $mdThemingProvider.theme('default')
  //     //.primaryPalette("red")
  //     .accentPalette('green')
  //     .warnPalette('blue');
  // }
})();
