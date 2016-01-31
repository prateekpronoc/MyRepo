(function () {
  'use strict';

  angular
    .module('wams.gym')
    .controller('ImageCardCtrl', ImageCardCtrl);
  /* @ngInject */
  function ImageCardCtrl() {
    var vm = this;
    vm.title = 'Image Card';
    vm.myInterval = 5000;
    var slides = vm.slides = [];
    var images = ['https://www.lifefitness.com/assets/static-assets/image/blog/Posts/Big_Gym_vs._Small_Studio.jpg',
      'http://www.beautybuzzhk.com/wp-content/uploads/2012/08/FF1.jpg',
      'https://cbsbaltimore.files.wordpress.com/2012/11/gym-workout.jpg'
    ];
    vm.entity = [{
      id: 73,
      name: "Venus1",
      location: "Building A-level 1",
      typeId: 1,
      capacity: 12,
      description: "meeting room",
      managerId: 250,
      status: 0,
      buildingId: 10,
      floorId: 15,
      floorPartId: 13,
      createdAt: "2015-10-20T07:21:54.000Z",
      updatedAt: null,
      createdBy: 0,
      updatedBy: 0,
      type: "2-Seater Meeting Room"
    }, {
      id: 72,
      name: "Meadows",
      location: "Indiquebe-First\r\nFloor",
      typeId: 2,
      capacity: 20,
      description: "Meeting Room",
      managerId: 251,
      status: 0,
      buildingId: 1,
      floorId: 1,
      floorPartId: 1,
      createdAt: "2015-10-27T05:42:46.000Z",
      updatedAt: null,
      createdBy: 0,
      updatedBy: 0,
      type: "2-Seater Meeting Room"
    }];

    activate();

    ////////////////

    function activate() {
      addSlide();
    }

    function addSlide() {
      var i;
      for (i = 0; i < images.length; i++) {
        vm.slides.push({
          image: images[i],
          text: ['More', 'Extra', 'Lots of', 'Surplus'][vm.slides.length % 4] + ' ' + ['Cats', 'Kittys',
            'Felines',
            'Cutes'
          ][vm.slides.length % 4]
        });
      }
    }
  }
})();
