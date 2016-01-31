(function () {
  'use strict';

  angular
    .module('wams.meetingroom')
    .controller('SaveMRInfraCtrl', SaveMRInfraCtrl);

  /* @ngInject */
  function SaveMRInfraCtrl(wamsServices, _, notifier, $stateParams, $state) {
    /*jshint validthis: true */
    var vm = this;
    vm.title = 'Ctrl';
    vm.page = {
      title: 'Meeting Room Infrastructure'
    };
    vm.createmore = false;
    vm.ui = {};
    vm.saveInfra = saveInfra;
    vm.cancel = cancel;
    activate();

    function activate() {
      if (angular.isDefined($stateParams.roomid) && $stateParams.roomid > 0) {
        vm.ui.mrId = $stateParams.roomid;
        getMRInfo($stateParams.roomid);
      }
      fetchInfraTypeValues();
    }

    function fetchInfraTypeValues() {
      wamsServices.getEntity({
        key: 'catalogValues',
        request: {
          masterId: 3
        }
      }).then(function (response) {
        if (!response) {
          notifier.error('Problem encountered while fetching meeting room');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          notifier.error('Unable to fetch data');
          return;
        }
        vm.ui.infraType = response.rows;
        //vm.ui.infraType = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'value'));
      }, function (error) {
        notifier.error('Unable to fetch data : ' + error.message);
      });
    }

    function cancel() {
      $state.go('wams.meetingrooms');
    }

    function getMRInfo(mrId) {
      wamsServices.getEntity({
        key: 'meetingRooms',
        request: {
          id: mrId
        }
      }).then(function (response) {
        if (!response) {
          notifier.error('Problem encountered while fetching meeting room');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          notifier.error('Unable to fetch data');
          return;
        }
        vm.ui.mrInfo = response.rows[0];
        getInfraExisted();
      }, function (error) {
        notifier.error('Unable to fetch data : ' + error.message);
      });
    }

    function saveInfra() {
      vm.infraType = [];
      vm.ui.infraType = _.filter(vm.ui.infraType, 'code');
      _.forEach(vm.ui.infraType, function (val) {
        vm.infraType.push({
          name: val.value,
          code: val.code
        });
      });
      var request = {
        meetingroom: $stateParams.roomid,
        type: vm.ui.mrInfo.typeId,
        infra: vm.infraType
      };
      wamsServices.saveEntity({
        key: 'postmeetinginfra',
        request: request
      }).then(function (response) {
        console.log(response);
        if (response) {
          if (_.has(response, 'statusCode')) {
            notifier.error('Problem encountered while saving data :' + response.message);
            return;
          }
          notifier.success('Meeting Room Infra : ' + response.name + '  saved successfully');
          if (vm.createmore) {} else {
            $state.go('wams.allmeetingroominfra', {}, {
              reload: true
            });
          }
        }
      }, function (error) {
        notifier.error('Unable to fetch data : ' + error.message);
      });
    }

    function getInfraExisted() {
      var i;
      wamsServices.getEntity({
        request: {
          limit: 10,
          offset: 0,
          meetingRoomId: vm.ui.mrId
        },
        key: 'getMeetingInfra'
      }).then(function (response) {
        if (!response) {
          vm.noData = true;
          notifier.error('Problem encountered while fetching buildings');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          vm.noData = true;
          notifier.error('Unable to fetch data');
          return;
        }
        if (response.rows.length > 0) {
          for (i = 0; i < response.rows.length; i = i + 1) {
            _.forEach(vm.ui.infraType, function (val) {
              if (val.value == response.rows[i].name) {
                val.isSelected = true;
                val.code = response.rows[i].code
              }
            });
          }
        }
      }, function (error) {
        notifier.error('Unable to fetch data' + error.message);
      });
    }
  }
})();
