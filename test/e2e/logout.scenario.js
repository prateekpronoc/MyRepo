'use strict';

describe('Logout page', function () {
  var LoginPage = require('./login.po'), UserData = require('./usercreds.po');

  beforeEach(function () {
    browser.driver.get('http://localhost:3000/#/login/');
  });

  it('should successfully logout to login page', function () {
    LoginPage.username.clear();
    LoginPage.password.clear();
    LoginPage.tenantAlias.clear();
    LoginPage.username.sendKeys(UserData.userName);
    LoginPage.password.sendKeys(UserData.password);
    LoginPage.tenantAlias.sendKeys(UserData.tenantAlias);
    LoginPage.login.click();
    expect(browser.getLocationAbsUrl()).toEqual('/crpo/dashboard/');
    LoginPage.logoutMenu.click().then(function () {
      element(by.css('#logoutBtn')).click().then(function () {
        expect(browser.getLocationAbsUrl()).toEqual('/login/');
      });
    });
  });
});
