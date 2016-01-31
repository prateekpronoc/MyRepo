(function () {
  'use strict';

  angular
    .module('hp.common')
    .factory('wamsServices', wamsServices);

  /* @ngInject */
  function wamsServices($http, _,  $timeout, $q) {
    var service = {
        getEntity: fetchData,
        saveEntity: saveEntity,
        assignedMR: [],
        postUpload: postUpload,
        archiveEntity: archiveEntity
      },
      entities = {
        premises: 'premises',
        meetingRooms: 'meetingrooms',
        users: 'users',
        tenants: 'tenants',
        buildings: 'buildings',
        floors: 'floors',
        floorparts: 'floorparts',
        postmeetinginfra: 'meetinginfra',
        getMeetingInfra: 'meetingroominfras',
        transactions: 'transactions',
        accounts: 'accounts',
        catalogValues: 'catalogvalues',
        costconfigurations: 'costconfigurations',
        bookings: 'bookings',
        userroles: 'userroles',
        bookingSearch: 'book/search',
        catalogmasters: 'catalogmasters',
        cafeteria: 'cafeteria',
        groups: 'groups',
        entitygroups: 'entitygroups/multi',
        sendInvitations: 'users/invites',
        userprofiles: 'userprofiles',
        tenantpremises: 'tenantpremises',
        tenantmeeting: 'tenantmeeting',
        fooditems: 'fooditems',
        bookingparticipants: 'bookingparticipants',
        upload: 'files/fileupload',
        forgotpassword: 'forgotpassword',
        download: 'download',
        imageUpload: 'files/uploadImages',
        archive: 'archive',
        useruploadExcel: 'users/postexcel',
        gym: 'gyms',
        gyminfra: 'gyminfra',
        gyminfras: 'gyminfras',
        gyminfraspecifications: 'gyminfraspecifications',
        tenantresource: 'tenantresource',
        parkings: 'parkings',
        tenantMeeting: 'tenantmeeting',
        mrSearch: 'mr/search',
        viewMenu: 'menuscafe',
        viewCafe: 'cafeteria',
        orderFood: 'foodorders',
        cafeorders: 'cafemenu/orders',
        fetchMenus: 'menus',
        infraSearch: 'mr/mysearch',
        typeSearch: 'mr/types'
      };
    // catalogCodes = {
    //   meetingRooms: 1,
    //   meetingRoomInfra: 2,
    //   country: 3,
    //   state: 4,
    //   city: 5,
    //   resourceType: 6,
    //   accountType: 7,
    //   factors: 8,
    //   roles: 11,
    //   actions: 12
    // };
    // catalogIcons = {
    //   Projector: 'fa fa-video-camera',
    //   Camera: 'fa fa-camera',
    //   Headset: 'fa fa-headphones',
    //   Pendrive: 'fa fa-eraser',
    //   Computer: 'fa fa-laptop',
    //   WiFi: 'fa fa-wifi',
    //   Board: 'fa fa-square-o',
    //   tv:'fa fa-television',
    //   fax:'fa fa-fax',
    //   desktop:'fa fa-desktop',
    //   phone:'fa fa-phone-square',
    // };
    return service;

    ////////////////


    function postUpload(req) {
      return $http.post('/api/files/upload', req.request).then(function (response) {
        console.log(response);
      });

      // console.log(JSON.stringify(req));
      // return Upload.upload({
      //   url: apiUrl(req.key),
      //   data: {
      //     file: req.request.file
      //   }
      // }).then(function (response) {
      //   return response;
      // });

      // Upload.upload({
      //   url: apiUrl(req.key),
      //   data: {
      //     file: req.request.file,
      //     fileName: req.request.fileName
      //   }
      // }).then(function (response) {
      //     if (response && response.data) {
      //       if (_.has(response.data, 'attrs')) {
      //         return {
      //           message: response.data.msg,
      //           statusCode: response.data.result
      //         };
      //       }
      //       return response.data;
      //     }
      //   },
      //   function (error) {
      //     error.message = 'Problem encountered while performing the operation';
      //     return error;
      //   });
    }

    function fetchData(req) {
      return $http.get(apiUrl(req.key), {
        params: req.request
      }).then(function (response) {
        if (response) {
          if (response.data !== null) {
            if (_.has(response.data, 'entity')) {
              return response.data.entity;
            } else {
              return response.data;
            }
          }
        }
        return response.data.entity;
      }, function (error) {
        error.message = 'Problem encountered while performing the operation';
        return error;
      });
    }

    function saveEntity(req) {
      return $http.post(apiUrl(req.key), req.request).then(function (response) {
          if (response && response.data) {
            if (_.has(response.data, 'attrs')) {
              return {
                message: response.data.msg,
                statusCode: response.data.result
              };
            }
            return response.data;
          }
        },
        function (error) {
          error.message = 'Problem encountered while performing the operation';
          return error;
        });
    }

    function archiveEntity(req) {
      return $http.put(apiUrl(req.key), req.request).then(function (response) {
          if (response && response.data) {
            if (_.has(response.data, 'attrs')) {
              return {
                message: response.data.msg,
                statusCode: response.data.result
              };
            }
            return response.data;
          }
        },
        function (error) {
          error.message = 'Problem encountered while performing the operation';
          return error;
        });
    }

    function apiUrl(key) {
      return '/api/' + entities[key];
    }
  }
})();
