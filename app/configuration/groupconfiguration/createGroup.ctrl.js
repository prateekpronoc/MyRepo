(function () {
  'use strict';

  angular
    .module('wams.configuration')
    .controller('CreateGroupCtrl', CreateGroupCtrl);

  /* @ngInject */
  function CreateGroupCtrl(wamsServices, notifier, $state) {
    var vm = this;
    vm.title = 'Create Group';
    vm.ui = {};
    vm.createGroup = createGroup;
    vm.createmore = false;
    vm.reset = reset;
    vm.cancel = cancel;
    activate();

    ////////////////

    function activate() {
      getResourceType();
    }

    function getResourceType() {
      wamsServices.getEntity({
        request: {},
        key: 'catalogmasters'
      }).then(function (response) {
        vm.resourceTypes = response.rows;
      });
    }

    function reset() {
      vm.ui = {};
    }

    function cancel() {
      $state.go('wams.allGroups');
    }

    function createGroup() {
      vm.groupDetails = {
        name: vm.ui.name,
        description: vm.ui.description,
        resourceType: vm.ui.resourceId
      };
      console.log(vm.groupDetails);
      wamsServices.saveEntity({
        key: 'groups',
        request: vm.groupDetails
      }).then(function (response) {
        if (response) {
          if (_.has(response, 'statusCode')) {
            notifier.error('Problem encountered while saving data :' + response.message);
            return;
          }
          notifier.success('Group : ' + response.name + '  saved successfully');
          if (vm.createmore) {
            vm.ui = {};
          } else {
            vm.cancel();
          }
        }
      }, function (error) {
        notifier.error('Problem encountered while saving data :' + error.message);
      });
    }
  }
})();
