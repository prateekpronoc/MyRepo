(function () {
  'use strict';

  angular
    .module('wams.meetingroom', [
      'ui.router',
      'ui.bootstrap',
      'hp.common',
      'wams.home',
      'wams.eventCalendar'
    ]).config(config);

  /* @ngInject */
  function config($stateProvider) {
    $stateProvider
      .state('wams.meetingrooms', {
        url: 'meetingrooms/',
        views: {
          '@': {
            templateUrl: 'meetingroom/view/allmeetingroom.tpl.html',
            controller: 'AllMeetingRoomCtrl as vm'
          }
        }
      })
      .state('wams.createmeetingroom', {
        url: 'createmeetingroom/entity',
        params: {
          roomid: {
            array: true
          }
        },
        views: {
          '@': {
            templateUrl: 'meetingroom/createmeetingroom/createMRoom.tpl.html',
            controller: 'CreateMeetingRoomCtrl as vm'
          }
        }
      })
      .state('wams.updatemeetingroom', {
        url: 'createmeetingroom/entity/:roomid',
        params: {
          roomid: {
            array: true
          }
        },
        views: {
          '@': {
            templateUrl: 'meetingroom/createmeetingroom/createMRoom.tpl.html',
            controller: 'CreateMeetingRoomCtrl as vm'
          }
        }
      })
      .state('wams.addmrinfra', {
        url: ':roomid/addmrinfra/',
        params: {
          roomid: {
            array: false
          }
        },
        views: {
          '@': {
            templateUrl: 'meetingroom/mroomInfra/saveMRInfra1.tpl.html',
            controller: 'SaveMRInfraCtrl as vm'
          }
        }
      })
      .state('wams.makebooking', {
        url: 'makebooking/',
        views: {
          '@': {
            templateUrl: 'meetingroom/meetingroom/makebooking.html',
            controller: 'MakeBookingCtrl as vm'
          }
        }
      })

    .state('wams.viewbooking', {
        url: 'viewbooking/',
        views: {
          '@': {
            templateUrl: 'meetingroom/meetingroom/viewbooking.html',
            controller: 'ViewBookingCtrl as vm'
          }
        }
      })
      .state('wams.allmeetingroominfra', {
        url: 'allmeetingroominfra/',
        views: {
          '@': {
            templateUrl: 'meetingroom/meetingroom/allmeetingroominfra.html',
            controller: 'AllMeetingRoomsInfractrl as vm'
          }
        }
      }).state('wams.empMRoomBooking', {
        url: 'meetingroombooking/',
        views: {
          '@': {
            templateUrl: 'meetingroom/booking/booking.tpl.html',
            controller: 'MRoomBookingCtrl as vm'
          }
        }
      }).state('wams.mRoomSlotDetails', {
        url: 'slotDetails/:id',
        params: {
          id: {
            array: true
          },
          from: {
            array: true
          },
          to: {
            array: true
          }
        },
        views: {
          '@': {
            templateUrl: 'meetingroom/booking/slotDetails.tpl.html',
            controller: 'MRoomSlotCtrl as vm'
          }
        }
      }).state('wams.bookingMeetingRoomWizard', {
        url: 'bookingMeetingRoom',
        views: {
          '@': {
            templateUrl: 'meetingroom/bookingWizard/bookingWizard.tpl.html',
            controller: 'BookingWizardCtrl as vm'
          }
        }
      });
    // .state('crpo.importEntityWizard', {
    //   url: 'importEntityWizard/:eventId',
    //   param: {
    //     eventId: {
    //       array: true
    //     }
    //   },
    //   views: {
    //     '@': {
    //       templateUrl: 'importEntityWizard/entityWizard.html',
    //       controller: 'EntityWizardCtrl as vm'
    //     }
    //   }
    // })

    // .state('wams.addmore', {
    //   url: '',
    //   views: {
    //     'createmeetingroom.addmore': {
    //       templateUrl: 'meetingroom/meetingroom/addmoredetails.html',
    //       controller: 'vm'
    //     }
    //   }
    // })
    // .state('wams.allmeetingrooms', {
    //   url: 'allmeetingrooms/',
    //   views: {
    //     '@': {
    //       templateUrl: 'meetingroom/meetingroom/allmeetingrooms.html',
    //       controller: 'AllMeetingRoomsCtrl as vm'
    //     }
    //   }
    // })
    // .state('wams.viewmeetingroom', {
    //   url: ':roomid/viewmeetingroom/',
    //   params: {
    //     roomid: null
    //   },
    //   views: {
    //     '@': {
    //       templateUrl: 'meetingroom/meetingroom/viewmeetingroom.html',
    //       controller: 'ViewMeetingRoomCtrl as vm'
    //     }
    //   }
    // })

    // .state('wams.allmeetingroominfra', {
    //   url: 'allmeetingroominfra/',
    //   views: {
    //     '@': {
    //       templateUrl: 'meetingroom/meetingroom/allmeetingroominfra.html',
    //       controller: 'AllMeetingRoomsInfractrl as vm'
    //     }
    //   }
    // })
    // .state('wams.detailsofmr', {
    //   url: ':roomid/detailsofmr',
    //   params: {
    //     roomid: {
    //       array: false
    //     },
    //   },
    //   views: {
    //     '@': {
    //       templateUrl: 'meetingroom/meetingroom/detailsofmr.html',
    //       controller: 'DetailsOfMrCtrl as vm'
    //     }
    //   }
    // })
    // .state('wams.makebooking', {
    //   url: 'makebooking/',
    //   views: {
    //     '@': {
    //       templateUrl: 'meetingroom/meetingroom/makebooking.html',
    //       controller: 'MakeBookingCtrl as vm'
    //     }
    //   }
    // })
    // .state('wams.viewbooking', {
    //   url: 'viewbooking/',
    //   views: {
    //     '@': {
    //       templateUrl: 'meetingroom/meetingroom/viewbooking.html',
    //       controller: 'ViewBookingCtrl as vm'
    //     }
    //   }
    // })
    // .state('wams.employebooking', {
    //   url: 'employebooking/',
    //   views: {
    //     '@': {
    //       templateUrl: 'meetingroom/employee/employebooking.html',
    //       controller: 'EmployeeBookingCtrl as vm'
    //     }
    //   }
    // })
    // .state('wams.employemoreinfo', {
    //   url: 'employemoreinfo/',
    //   views: {
    //     '@': {
    //       templateUrl: 'meetingroom/employee/employeemoreinfo.html',
    //       controller: 'EmployeeMoreInfo as vm'
    //     }
    //   }
    // })
    // .state('wams.employemrbooking', {
    //   url: 'employemrbooking/',
    //   views: {
    //     '@': {
    //       templateUrl: 'meetingroom/employee/mrbooking.html',
    //       controller: 'MrBookingCtrl as vm'
    //     }
    //   }
    // })
    // .state('wams.employemrbooking1', {
    //   url: 'employemrbooking1/',
    //   views: {
    //     '@': {
    //       templateUrl: 'meetingroom/employee/mrbooking1.html',
    //       controller: 'MrBooking1Ctrl as vm'
    //     }
    //   }
    // })
    // .state('wams.employemrbooking2', {
    //   url: 'employemrbooking2/',
    //   views: {
    //     '@': {
    //       templateUrl: 'meetingroom/employee/mrbooking2.html',
    //       controller: 'MrBooking2Ctrl as vm'
    //     }
    //   }
    // });
  }

})();
