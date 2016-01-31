'use strict';

var ConfigPage = function () {
  this.typeSelector = element(by.model('vm.currentViewType'));
  this.createDropdown = element(by.buttonText('Create'));
  this.save = element(by.css('[ng-click="vm.save()"]'));
  this.cancel = element(by.css('[ng-click="vm.cancelClicked()"]'));
  this.growl = element(by.css('[growl]'));
  this.configSection = element(by.css('[ui-sref="crpo.configuration({ viewType: \'jrs\' })"]'));
};

module.exports = new ConfigPage();
