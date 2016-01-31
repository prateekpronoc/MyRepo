(function () {
  'use strict';

  angular
    .module('hp.common')
    .factory('catalogService', catalogService);

  /* @ngInject */
  function catalogService($log, $http, localStore) {
    var service = {
        getCatalog: fetchCatalog,
        getCatalogs: fetchCatalogs,
        getCachedCatalog: getCachedCatalog,
        getCatalogValuesWithCode: fetchCatalogValuesWithCode,
        getCatalogIdByCatalogvalue: getCatalogIdByCatalogvalue,
        getCatalogWithoutParent: getCatalogWithoutParent,
        isWithoutParent: isWithoutParent,
        getHierarchicalCatalog: getHierarchicalCatalog,
        fetchCatalogsWithCode: fetchCatalogsWithCode,
        getCatalogMaster: fetchCatalogMaster
      },
      catalog = {},
      catalogEnum = {
        meetingRoomType: 1,
        meetingRoomInfra: 2,
        country: 3,
        state: 4,
        city: 5,
        resourceType: 6,
        accountType: 7
      },
      catalogUrls = {
        CatalogWithCodeUrl: '/api/catalogvalues?masterId=',
        CatalogMasterUrl: '/api/catalogmasters'
      };

    return service;

    ////////////////

    function fetchCatalogMaster() {
      return fetchServerCatalog('masterCatalogs', catalogUrls.CatalogMasterUrl);
    }

    function getCachedCatalog(catalogName) {
      if (catalog[catalogName] && !timedOut()) {
        return catalog[catalogName];
      }
      return [];
    }

    function fetchCatalog(catalogNames) {
      return fetchServerCatalog(catalogNames, catalogUrls.CatalogWithCodeUrl + catalogEnum[catalogNames]);
    }

    function fetchCatalogs(catalogNames) {
      return fetchCatalog(catalogNames).then(function () {
        return catalog;
      });
    }

    function fetchCatalogValuesWithCode(catalogNames) {
      return fetchServerCatalog(catalogNames, catalogUrls.CatalogWithCodeUrl);
    }

    function fetchCatalogsWithCode(catalogNames) {
      return fetchCatalogValuesWithCode(catalogNames).then(function () {
        return catalog;
      });
    }

    function fetchServerCatalog(catalogNames, url) {
      return $http.get(url).then(
        function (response) {
          if (response.data && response.data.rows && response.data.rows.length > 0) {
            return response.data.rows;
          }
          return response;
        },
        function (response) {
          $log.log('Error fetching Catalogs : ' + catalogNames + ' Error Log = ' + JSON.stringify(response));
          return response;
        });
    }

    function timedOut() {
      return false;
    }

    function getCatalogIdByCatalogvalue(MasterName) {
      var json = {
        MasterName: MasterName
      };
      return $http.post('/JSONServices/JSONCommonManagementService.svc/GetCatalogIdByCatalogvalue', json).then(
        function (response) {
          return response;
        },
        function (response) {
          $log.log('Error fetching Catalogs : ' + MasterName + ' Error Log = ' + JSON.stringify(response));
          return response;
        });
    }

    function getCatalogWithoutParent(catalogNames) {
      return fetchCatalog(catalogNames).then(function () {
        var customCatalog = {},
          i, j, innerCatalog;
        for (i = 0; i < catalogNames.length; i += 1) {
          innerCatalog = [];
          if (catalog[catalogNames[i]]) {
            for (j = 0; j < catalog[catalogNames[i]].length; j += 1) {
              if (isWithoutParent(catalog[catalogNames[i]][j])) {
                innerCatalog.push(catalog[catalogNames[i]][j]);
              }
            }
          }
          customCatalog[catalogNames[i]] = innerCatalog;
        }
        return customCatalog;
      });
    }

    function isWithoutParent(dataRecord) {
      return angular.isUndefined(dataRecord.ParentValueId) || dataRecord.ParentValueId === undefined ||
        dataRecord.ParentValueId === 0;
    }

    function getHierarchicalCatalog(catalog) {
      if (!catalog || !angular.isArray(catalog) || catalog.length === 0) {
        return {
          parents: {
            0: 'Choose'
          },
          children: {
            0: {
              0: 'Choose'
            }
          }
        };
      }
      var hierarchicalCatalog = {},
        i = 0,
        parents = {
          0: 'Choose'
        },
        children = {
          0: {
            0: 'Choose'
          }
        };
      for (i = 0; i < catalog.length; i += 1) {
        if (isWithoutParent(catalog[i])) {
          parents[catalog[i].CatalogValueId] = catalog[i].Name;
        } else {
          if (!children[catalog[i].ParentValueId]) {
            children[catalog[i].ParentValueId] = {
              0: 'Choose'
            };
          }
          children[catalog[i].ParentValueId][catalog[i].CatalogValueId] = catalog[i].Name;
        }
      }
      hierarchicalCatalog.parents = parents;
      hierarchicalCatalog.children = children;
      return hierarchicalCatalog;
    }
  }
})();
