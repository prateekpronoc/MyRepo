(function () {
  'use strict';

  angular
    .module('wams.gym')
    .controller('AddGymInfraToMrCtrl', AddGymInfraToMrCtrl);

  function AddGymInfraToMrCtrl(wamsServices, _, notifier, $stateParams, $state, $modal) {
    var vm = this;
    vm.title = 'Add Equipment';
    vm.createmore = false;
    vm.ui = {};
    vm.saveInfra = saveInfra;
    vm.cancel = cancel;
    vm.reset = reset;
    vm.codesModal = codesModal;

    activate();

    ////////////////

    function activate() {
      if (angular.isDefined($stateParams.gymId) && $stateParams.gymId > 0) {
        vm.ui.gymId = $stateParams.gymId;
        getGymInfo($stateParams.gymId);
      }
      fetchEquipments();
    }

    function getGymInfo(gymId) {
      wamsServices.getEntity({
        key: 'gym',
        request: {
          id: gymId
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


    function fetchEquipments() {
      wamsServices.getEntity({
        key: 'gyminfras',
        request: {}
      }).then(function (response) {
        if (!response) {
          notifier.error('Problem encountered while fetching meeting room');
          return;
        }
        if (response.rows && response.rows.length === 0) {
          notifier.error('Unable to fetch data');
          return;
        }
        vm.ui.infras = response.rows;
        //vm.ui.infraType = _.zipObject(_.pluck(response.rows, 'id'), _.pluck(response.rows, 'value'));
      }, function (error) {
        notifier.error('Unable to fetch data : ' + error.message);
      });
    }

    function cancel() {
      $state.go('wams.allgyms');
    }

    function reset() {
      vm.ui.infras = {};
      vm.ui.infraType = {};
    }

    function saveInfra() {
      vm.infras = [];
      _.forEach(_.filter(vm.ui.infras, 'isSelected'), function (val) {
        vm.infras.push({
          infraId: val.id,
          code: val.code,
          qty: parseInt(val.qty)
        });
      });
      var request = {
        gymId: $stateParams.gymId,
        infra: vm.infras
      };
      console.log(JSON.stringify(request));
      wamsServices.saveEntity({
        key: 'gyminfra',
        request: request
      }).then(function (response) {
        console.log(response);
        if (response) {
          if (_.has(response, 'statusCode')) {
            notifier.error('Problem encountered while saving data :' + response.message);
            return;
          }
          notifier.success('Gym Infra : ' + response.name + '  saved successfully');
          if (vm.createmore) {} else {
            $state.go('wams.allgyms', {}, {
              reload: true
            });
          }
        }
      }, function (error) {
        notifier.error('Unable to fetch data : ' + error.message);
      });
    }

    function codesModal(qty) {
      console.log(qty);
      if (angular.isDefined(qty) && qty > 0) {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'gym/infraitems/openCodeModal.html',
          controller: 'OpenCodeModalCtrl as vm',
          size: 'sm',
          resolve: {
            data: function () {
              return qty;
            }
          }
        });
      }


      modalInstance.result.then(function (data) {
        processCodeData(data);
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }

    function processCodeData(codes) {
      _.forEach(_.filter(vm.ui.infras, 'isSelected'), function (val) {
        if (val.code === "") {
          val.code = codes;
        }
      });

    }

    function getInfraExisted() {
      var i;
      wamsServices.getEntity({
        request: {
          gymId: $stateParams.gymId
        },
        key: 'gyminfraspecifications'
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
            _.forEach(vm.ui.infras, function (val) {
              if (val.id == response.rows[i].infraId) {
                val.isSelected = true;
                val.code = response.rows[i].code;
                val.qty = response.rows[i].qty;
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
