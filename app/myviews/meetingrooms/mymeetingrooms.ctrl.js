(function () {
  'use strict';

  angular
    .module('wams.mymeetingrooms')
    .controller('MyMeetingRooms', MyMeetingRooms);

  /* @ngInject */
  function MyMeetingRooms(wamsServices, session, _, $mdDialog, $mdMedia, $state) {
    /*jshint validthis: true */
    var vm = this,
      assignedMRs = [];
    vm.title = 'Ctrl';
    vm.entity = [];
    vm.allInfra = [];
    vm.infraEntity = [];
    vm.myInterval = 3000;
    vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    vm.slides = [{
      image: 'http://lorempixel.com/400/200/'
    }, {
      image: 'http://lorempixel.com/400/200/city'
    }, {
      image: 'http://lorempixel.com/400/200/abstract'
    }, {
      image: 'http://lorempixel.com/400/200/transport'
    }];
    vm.viewMRInfra = viewMRInfra;
    vm.bookMr = bookMr;
    activate();

    function activate() {
      fetchAssignedMR();
      fetchAllInfra();
    }

    vm.openMenu = function ($mdOpenMenu, ev) {
      //originatorEv = ev;
      $mdOpenMenu(ev);
    };

    function fetchAssignedMR() {
      wamsServices.getEntity({
        key: 'tenantMeeting',
        request: {
          tenantId: parseInt(session.getTenantId())
        }
      }).then(function (response) {
        if (response && response.rows && response.rows.length > 0) {
          assignedMRs = _.pluck(response.rows, 'meetingroomId');
          fetchMRs();
        } else {
          console.log('No Meeting Room assigned');
          //proper notification should be showns . need implementation;
        }
      }, function (error) {
        console.log(error);
        //proper notification should be showns . need implementation;
      });
    }

    function fetchAllInfra() {
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          masterId: 3
        }
      }).then(function (response) {
        if (response && response.rows && response.rows.length > 0) {
          vm.allInfra = _.pluck(response.rows, 'value');
        }
      }, function (error) {
        console.log(error);
      });
    }

    function fetchMRs() {
      wamsServices.getEntity({
        key: 'meetingRooms',
        request: {
          offset: 0,
          limit: 10
        }
      }).then(function (response) {
        if (response && response.rows && response.rows.length > 0) {
          _.forEach(response.rows, function (val) {
            if (assignedMRs.indexOf(val.id) > -1) {
              vm.entity.push(val);
            }
          });
          console.log(vm.entity);
        } else {
          console.log('No Meeting Room ');
          //proper notification should be showns . need implementation;
        }
      }, function (error) {
        console.log(error);
        //proper notification should be showns . need implementation;
      });
    }

    function viewMRInfra(event, mrId) {
      //var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
      wamsServices.getEntity({
        key: 'getMeetingInfra',
        request: {
          meetingRoomId: mrId
        }
      }).then(function (response) {
        var entityInfo = {},
          useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && vm.customFullscreen;
        if (response && response.rows && response.rows.length > 0) {
          vm.infraEntity = _.pluck(response.rows, 'name');
          angular.forEach(vm.entity, function (val) {
            if (val.id == mrId) {
              entityInfo = val;
            }
          });
          $mdDialog.show({
            locals: {
              allinfra: vm.allInfra,
              thisInfra: vm.infraEntity,
              entityInfo: entityInfo
            },
            //parent: angular.element(document.body),
            clickOutsideToClose: true,
            templateUrl: 'myviews/meetingrooms/viewInfra.tpl.html',
            controller: 'DemoCtrl as vm'
              //fullscreen: useFullScreen
          });
        }
      }, function (error) {
        console.log(error);
      });
    }

    function bookMr(event, selectedMR) {
      console.log(selectedMR);
      $state.go('wams.mrbookingwizard', {
        mrId: selectedMR
      });
    }

  }
})();
