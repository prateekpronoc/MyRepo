'use strict';

describe('Login page', function () {
  var LoginPage = require('./login.po'),
    UserData = require('./usercreds.po');

  beforeEach(function () {
    browser.driver.get('http://localhost:3000/#/login/');
  });

  afterEach(function () {
    LoginPage.logoutControl.click();
  });

  it('should successfully login to dashboard', function () {
    LoginPage.username.clear();
    LoginPage.password.clear();
    LoginPage.tenantAlias.clear();
    LoginPage.username.sendKeys(UserData.userName);
    LoginPage.password.sendKeys(UserData.password);
    LoginPage.tenantAlias.sendKeys(UserData.tenantAlias);
    LoginPage.login.click();
    expect(browser.getLocationAbsUrl()).toEqual('/crpo/dashboard/');
  });
});
