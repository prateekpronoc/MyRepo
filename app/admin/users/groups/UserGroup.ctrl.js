(function () {
  'use strict';

  angular
    .module('wams.admin')
    .controller('UserGroupCtrl', UserGroupCtrl);
  /* @ngInject */
  function UserGroupCtrl(wamsServices, $modalInstance, data, notifier) {
    var vm = this;
    vm.title = 'User Group';
    vm.createGroup = createGroup;
    vm.exit = exit;
    activate();

    ////////////////

    function activate() {
      getResourceType();
      console.log(data);
    }

    function getResourceType() {
      wamsServices.getEntity({
        request: {
          resourceType: 16
        },
        key: 'groups'
      }).then(function (response) {
        vm.resourceTypes = response.rows;
      });
    }

    function exit() {
      $modalInstance.dismiss('cancel');
    }

    function createGroup() {
      var groupDetails = {
        groupId: vm.ui.resourceId,
        entityId: data
      }
      wamsServices.saveEntity({
        key: 'entitygroups',
        request: groupDetails
      }).then(function (response) {
        if (response) {
          if (_.has(response, 'statusCode')) {
            notifier.error('Problem encountered while saving data : ' + response.message);
            return;
          }
          notifier.success('User Group is  saved successfully');
          $modalInstance.close();
        }
      }, function (error) {
        notifier.error('Problem encountered while saving data :' + error.message);
      });
    }
  }
})();
