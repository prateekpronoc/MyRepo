(function () {
  'use strict';

  angular
    .module('wams.core')
    .controller('CardListViewCtrl', CardListViewCtrl);

  /* @ngInject */
  function CardListViewCtrl($loading, dataProviderName, $injector, commonService, session, $scope) {
    /*jshint validthis: true */
    var vm = this,
      provider = $injector.get(dataProviderName),
      notifier = commonService.notifier;
    vm.provider = provider;
    vm.config = vm.provider.config;
    vm.title = vm.provider.getTitle();
    vm.session = session;
    vm.defaultConfig = {
      isDeleteDisabled: true,
      isEditDisabled: true,
      isDetailsDisabled: false,
      isCreateDisabled: false,
      isActionsDisabled: false,
      isFilterDisabled: false,
      isSelectDisabled: false,
      isCardViewDisabled: false,
      isListViewDisabled: false,
      selectOptions: [],
      idField: 'Id',
      nameField: 'Name',
      cardSize: 'md',
      selectedIds: [],
      isRefreshing: false,
      pagingOptions: commonService.getPagingOptions()
    };
    vm.loadingOptions = {
      active: true,
      text: 'Loading'
    };
    vm.isEditDisabled = provider.isEditDisabled || true;
    vm.cardheights = {
      sm: 250,
      md: 300,
      lg: 350
    };
    vm.actions = {
      selectionChanged: selectionChanged
    };

    ///////// Functions //////////
    vm.actionClicked = actionClicked;
    vm.refresh = refresh;
    vm.archive = archive;
    vm.create = create;
    vm.edit = edit;
    vm.onPageClicked = onPageClicked;
    vm.onViewChange = onViewChange;
    activate();

    function activate() {
      vm.sortOn = '0';
      vm.sortBy = '2';
      vm.config.entities = [];
      for (var key in vm.defaultConfig) { // TODO Need to replace this function with some thing better -lodash
        if (key && !vm.config.hasOwnProperty(key)) {
          vm.config[key] = vm.defaultConfig[key];
        }
      }
      vm.cardHeight = vm.cardheights[vm.config.cardSize] + 'px';
      vm.viewType = vm.config.isCardViewDisabled ? 'list' : 'card';

      $scope.$watch('vm.config.actionRequired', function () {
        if (vm.config.actionRequired && vm.config.actionRequired.action === 'refresh') {
          refresh();
          vm.config.actionRequired = {};
        }
      });
      refresh();
    }

    function actionClicked(actionCode, data) {
      if (vm.actions[actionCode]) {
        vm.actions[actionCode](actionCode, data);
      }
      if (provider.actionClicked) {
        var promise = provider.actionClicked(actionCode, data, $scope);
        if (promise) {
          promise.then(function (response) {
            if (response && response.entities) {
              vm.entities = response.entities;
              vm.config.pagingOptions.totalDataRecordCount = response.totalRecordCount ? response.totalRecordCount :
                response.entities.length;
            }
            vm.title = vm.provider.getTitle();
          });
        }
      }
    }

    function selectionChanged(actionCode, data) {
      if (data.checked) {
        vm.config.selectedIds.push(data[vm.config.idField]);
      } else {
        vm.config.selectedIds.splice(vm.config.selectedIds.indexOf(data[vm.config.idField], 1));
      }
    }

    function refresh(isSorted) {
      if (vm.isRefreshing) {
        return;
      }
      vm.isRefreshing = true;
      if (provider.refresh) {
        $loading.start('data');
        provider.refresh(vm.config.pagingOptions, isSorted, isSorted ? vm.sortOn : undefined, vm.sortBy)
          .then(function (data) {
            vm.isRefreshing = false;
            vm.entities = data.entities;
            vm.config.pagingOptions.totalDataRecordCount = data.totalRecordCount;
            $loading.finish('data');
          }, function (errorMessage) {
            vm.isRefreshing = false;
            notifier.error(errorMessage);
            $loading.finish('data');
          });
      }
    }

    function archive(data) {
      if (provider.archive) {
        provider.archive(data);
      }
    }

    function create() {
      if (provider.create) {
        provider.create();
      }
    }

    function edit(data) {
      if (provider.edit) {
        provider.edit(data);
      }
    }

    function onPageClicked() {
      refresh(vm.sortOn && vm.sortOn !== '0');
    }

    function onViewChange(viewType) {
      if (viewType === 'card') {
        vm.config.pagingOptions.rowCount = 1;
        vm.config.pagingOptions.columnCount = 20;
        vm.config.pagingOptions.recordsPerPage = vm.totalRecordCount;
      } else if (viewType === 'list') {
        vm.config.pagingOptions.rowCount = 1;
        vm.config.pagingOptions.columnCount = 20;
        vm.config.pagingOptions.recordsPerPage = vm.totalRecordCount;
      }
      vm.viewType = viewType;
    }
  }
})();
