'use strict';

var LoginPage = function () {
  this.username = element(by.model('vm.credentials.LoginName'));
  this.password = element(by.model('vm.credentials.Password'));
  this.tenantAlias = element(by.model('vm.credentials.TenantAlias'));
  this.header = element(by.css('.login_style'));
  this.loginButton = element(by.css('.login'));
  this.logoutMenu = element(by.css('[bs-dropdown="vm.userDropdown"]'));
  this.logoutControl = this.logoutMenu.element(by.css('#logoutBtn'));
  this.userCreds = require('./usercreds.po');
};

LoginPage.prototype.login = function login(UserData) {
  if (UserData === undefined) {
    UserData = this.userCreds;
  }
  browser.driver.get(UserData.homePageUrl);
  this.username.clear();
  this.password.clear();
  this.tenantAlias.clear();
  this.username.sendKeys(UserData.userName);
  this.password.sendKeys(UserData.password);
  this.tenantAlias.sendKeys(UserData.tenantAlias);
  this.loginButton.click();
  expect(browser.getLocationAbsUrl()).toEqual(UserData.urls.dashboard);
};

LoginPage.prototype.logout = function logout(UserData) {
  if (UserData === undefined) {
    UserData = this.userCreds;
  }
  this.logoutMenu.click().then(function () {
    element(by.css('#logoutBtn')).click().then(function () {
      expect(browser.getLocationAbsUrl()).toEqual(UserData.urls.login);
    });
  });
};

module.exports = new LoginPage();
