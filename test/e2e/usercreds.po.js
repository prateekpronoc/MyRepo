'use strict';

var UserData = function () {
  this.userName = 'admin';
  this.password = 'admin@123';
  this.tenantAlias = 'ct';
  this.homePageUrl = 'http://localhost:3000/#/login/';
  this.urls = {
    dashboard: '/crpo/dashboard/',
    eventsCard: '/crpo/events/card',
    login: '/login/',
    eventCreateBasic: '/crpo/events/event/create//basic',
    requirementsCard: '/crpo/requirements/card',
    requirementCreateBasic: '/crpo/createRequirement//chooseRoles',
    requirementCreateEC: '/crpo/createRequirement//hiringDetails',
    requirementCreateSP: '/crpo/createRequirement//salaryPackage',
    requirementCreateCG: '/crpo/createRequirement//chooseCollege',
    config: '/crpo/configuration/jrs'
  };
};

module.exports = new UserData();
