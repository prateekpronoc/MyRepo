(function () {
  'use strict';

  angular
    .module('hp.common', ['angular-growl', 'hp.common.security', 'hp.common.charts'])
    .config(['growlProvider', function (growlProvider) {
      growlProvider.globalTimeToLive({
        success: 1000,
        error: 2000,
        warning: 3000,
        info: 4000
      });
      growlProvider.globalTimeToLive(5000);
      growlProvider.globalReversedOrder(true);
      growlProvider.globalDisableCloseButton(false);
      growlProvider.globalDisableCountDown(true);
      // angular.extend($dropdownProvider.defaults, {
      //   animation: 'am-flip-x',
      //   trigger: 'click'
      // });
    }]).constant('_', window._);
})();
