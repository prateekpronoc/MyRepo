(function () {
  'use strict';

  angular
    .module('hp.common.security')
    .constant('appConfig', {
      JSONServices: true,
      JSONCommonControls: true,
      HelperServices: true,
      AssessmentReports: true,
      TestTranscriptReport: true,
      htmltest: true,
      QuestionPaperPreview: true,
      api: true,
      mappedTo: ''
    });
})();
