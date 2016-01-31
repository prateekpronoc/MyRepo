'use strict';

describe('Login', function () {
  var vm;

  beforeEach(module('crpo.user'));

  beforeEach(inject(function ($rootScope, $controller) {
    vm = $controller('Login', {
      $scope: $rootScope.$new()
    });
  }));

  it('should start with empty credentials', function () {
    expect(vm.credentials.LoginName).toEqual('');
    expect(vm.credentials.Password).toEqual('');
    expect(vm.credentials.TenantAlias).toEqual('');
  });

});
