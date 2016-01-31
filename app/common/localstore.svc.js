(function () {
  'use strict';

  angular
    .module('hp.common')
    .factory('localStore', localStore);

  /* @ngInject */
  function localStore($window) {
    var service = {
      getCollection: getItemCollection,
      setCollection: setItemCollection
    };
    return service;

    function getItemCollection(itemType) {
      if ($window.localStorage) {
        try {
          return angular.fromJson($window.localStorage.getItem(itemType));
        } catch (err) {
          $window.localStorage.removeItem(itemType);
          return null;
        }
      } else {
        return null;
      }
    }

    function setItemCollection(itemType, object) {
      if (!object) {
        return;
      }
      if ($window.localStorage) {
        $window.localStorage.setItem(itemType, JSON.stringify(object));
        return object;
      } else {
        return null;
      }
    }
  }
})();
