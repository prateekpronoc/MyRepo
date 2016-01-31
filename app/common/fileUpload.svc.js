(function () {
  'use strict';

  angular
    .module('hp.common')
    .factory('fileUpload', fileUpload);

  /* @ngInject */
  function fileUpload($http) {
    var service = {
      uploadFile: uploadFile
    };
    return service;

    function uploadFile(uploadUrl, file, formData) {
      var fd = new FormData();
      if (angular.isDefined(formData)) {
        angular.forEach(formData, function (value, key) {
          fd.append(key, value);
        });
      }
      fd.append('file', file);
      return $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      });
    }
  }
})();
