(function () {
  'use strict';

  angular
    .module('hp.common')
    .factory('notifier', notifier);

  /* @ngInject */
  function notifier($log, $window, growl, toaster) {
    var service = {
      alert: showAlert,
      debug: debug,
      error: error,
      warning: warning,
      success: success,
      notice: notice
    };
    return service;

    ////////////////

    function success(message) {
      if (!message) {
        return;
      }
      toaster.pop('success', '', message);
    }

    function notice(message) {
      if (!message) {
        return;
      }
      toaster.pop('notice', '', message);
      growl.info(message, {
        inlineMessage: true
      });
    }

    function showAlert(message) {
      if (!message) {
        return;
      }
      $window.alert(message);
    }

    function debug(message) {
      if (!message) {
        return;
      }
      $log.log(message);
    }

    function error(message) {
      if (!message) {
        return;
      }
      toaster.pop('error', '', message);
    }

    function warning(message) {
      if (!message) {
        return;
      }
      growl.warning(message, {
        ttl: 5000,
        inlineMessage: true
      });
    }
  }
})();
