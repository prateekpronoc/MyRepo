<body id="minovate" class="scheme-default default-scheme-color  header-fixed aside-fixed rightbar-hidden" style="background-color: #e7eaeb">
  <!--  <toaster-container toaster-options="'close-button': true,'close-duration' :300"></toaster-container> -->
  <toaster-container toaster-options="{'time-out': 3000, 'close-button':true}"></toaster-container>
  <div id="wrap" autoscroll="false" style="visibility: visible;">
    <div ui-view="header"></div>
    <div id="controls" ui-view="navbar" class="dropdown-open"></div>
    <div class="view-container" ui-view style="background-color: #e7eaeb"></div>
  </div>
  <!-- build:js(bower_components) wams-vendor.js -->
  <!-- bower:js -->
  <!-- endbower -->
  <!-- endbuild -->
  <!-- build:js(app) wams.js -->
  <!-- inject:js -->
  <!-- endinject -->
  <!-- endbuild -->
  <!-- build:js(.tmp) wams-templates.js -->
  <!-- inject:partials -->
  <!-- endinject -->
  <!-- endbuild -->
</body>

<md-toolbar class="md-whiteframe-glow-z1 site-content-toolbar">

  <div class="md-toolbar-tools docs-toolbar-tools" tabindex="-1">
    <md-button class="md-icon-button" aria-label="Menu" ng-click="vm.toggleLeft()" hide-gt-sm="" aria-label="Toggle Menu">
      <md-icon md-svg-icon="styles/icons/ic_menu_24px.svg"></md-icon>
    </md-button>
    <span flex></span>
    <!--  <md-button class="md-icon-button" aria-label="Settings" layout-align="end" layout="column">
    <ng-md-icon icon="list" size="24"></ng-md-icon>
      
    </md-button> -->
    <!-- <button class="md-icon-button md-button md-ink-ripple hide-gt-sm" type="button" > -->

  </div>

</md-toolbar>


@import 'styles/main.css';
@import 'styles/vendor.css';
@import 'styles/cardview.css';
@import 'styles/scheduler.css';
@import 'styles/uploadImage.css';
@import 'styles/common.css';


 <md-list ng-cloak>

      <section>
        <!--  <md-subheader class="md-primary">Meeting Room </md-subheader> -->
        <md-list-item ng-repeat="mr in vm.entity">
          <div flex="50" flex-sm="100" flex-xs="100" layout="column">
            <md-card class="md-body-1">
              <md-card-title>
                <md-card-title-text>

                  <!--  <span class="md-title"> Id - {{ mr.id }}</span> -->
                  <span class="md-title">Name - {{ mr.name }}</span>

                </md-card-title-text>

              </md-card-title>
              <md-card-title-media>
                <div md-card-image>
                  <div>
                    <carousel interval="vm.myInterval">
                      <slide ng-repeat="slide in vm.slides" active="slide.active">
                        <img ng-src="{{slide.image}}">
                        <div class="carousel-caption">
                          <h4>Slide {{$index+1}}</h4>
                        </div>
                      </slide>
                    </carousel>
                  </div>
                </div>

              </md-card-title-media>
              <md-card-content>
                <p>
                  <span class="md-subhead">Id : {{ mr.id}}</span>
                </p>
                <p>
                  <span class="md-subhead">Location : {{ mr.location}}</span>
                </p>
                <p>
                  <span class="md-subhead">Descriptions : {{ mr.description}}</span>
                </p>

              </md-card-content>
              <md-card-actions layout="row" layout-align="end center">


                <md-menu md-position-mode="target-right target">
                  <md-button aria-label="Open phone interactions menu" class="md-icon-button" ng-click="vm.openMenu($mdOpenMenu, $event)">
                    <md-icon md-menu-origin md-svg-icon="styles/icons/ic_menu_24px.svg"></md-icon>
                  </md-button>
                  <md-menu-content width="2">
                    <md-menu-item>
                      <md-button ng-click="vm.viewMRInfra($event,mr.id)">
                        <md-icon md-svg-icon="styles/icons/ic_menu_24px.svg" md-menu-align-target></md-icon>
                        View Details
                      </md-button>
                    </md-menu-item>

                    <md-menu-item>
                      <md-button ng-click="vm.bookMr($event, mr.id);">
                        <md-icon md-svg-icon="styles/icons/ic_menu_24px.svg"></md-icon>
                        Book
                      </md-button>
                    </md-menu-item>

                  </md-menu-content>
                </md-menu>
                <!--  <md-button class="md-primary md-raised" ng-click="vm.showDetails(booking.resourceId)">
                  View Details
                </md-button> -->
              </md-card-actions>
              <md-card-actions layout="row" layout-align="end center">
                <!--  <md-button class="md-icon-button" aria-label="Favorite" alt="View infrastructure" title="View">
                  <md-icon md-svg-icon="styles/icons/ic_flip_24px.svg"></md-icon>
                </md-button>
                <md-button class="md-icon-button" aria-label="Settings">
                  <md-icon md-svg-icon="styles/icons/ic_menu_24px.svg"></md-icon>
                </md-button> -->
                <!--  <md-button class="md-icon-button" aria-label="Share">
                  <md-icon md-svg-icon="img/icons/share-arrow.svg"></md-icon>
                </md-button> -->
              </md-card-actions>

            </md-card>
          </div>

        </md-list-item>
      </section>
    </md-list>


<section id="header" class="scheme-default">
  <header class="clearfix ng-scope">
    <!-- Branding -->
    <div class="branding scheme-default">
      <a class="brand" ui-sref="wams.dashboard" href="#/app/dashboard">
        <span>
          <strong>WAMS</strong>
        </span>
      </a> <a href="javascript:;" class="offcanvas-toggle visible-xs-inline" offcanvas-sidebar=""><i class="fa fa-bars"></i></a> </div>
    <ul class="nav-left pull-left list-unstyled list-inline">
      <li class="sidebar-collapse divided-right">
        <a href="javascript:;" collapse-sidebar>
          <i class="fa fa-outdent" name="outdent"></i>
        </a>
      </li>
    </ul>
    <ul class="nav-right pull-right list-inline">
      <li class="dropdown nav-profile" dropdown="">
        <!--  <li class="toggle-right-sidebar" dropdown=""> -->
        <a href="" class="dropdown-toggle" dropdown-toggle="" aria-haspopup="true" aria-expanded="false">
          <!-- <img src="images/profile-photo.06d5f78a.jpg" alt="" class="img-circle size-30x30"> -->
          <img ng-src="{{vm.imageSource}}" alt="" class="img-circle size-45x45">
          <span>{{vm.currentUserName}}</span>
        </a>
        <ul class="dropdown-menu animated littleFadeInRight" role="menu">
          <li>
            <a href="javascript:;" ui-sref="wams.userProfile">
              <span class="badge bg-greensea pull-right"></span> <i class="fa fa-user" name="user"></i>Profile </a>
          </li>
          <!-- <li>
            <a href="javascript:;" ui-sref="wams.common">
              <span class="badge bg-greensea pull-right"></span> <i class="fa fa-cog" name="Settings"></i>Settings</a>
          </li> -->
          <li>
            <a href="javascript:;" ui-sref="wams.changePassword">
              <span class="badge bg-greensea pull-right"></span> <i class="fa fa-unlock" name="Password"></i>Change Password</a>
          </li>
          <!--  <li>
            <a href="javascript:;" ui-sref="wams.common">
              <span class="badge bg-greensea pull-right"></span> <i class="fa fa-question-circle" name="Help"></i>Help</a>
          </li> -->
          <li>
            <a href="javascript:;" ng-click="vm.logout();"> <i class="fa fa-sign-out" name="sign-out"></i>Logout </a>
          </li>
        </ul>
      </li>
    </ul>
    <!-- Right-side navigation end -->
  </header>
</section>



<!-- Dashboard -->
<div class="view-container" ui-view-container>
  <section id="content" autoscroll="false" class="ng-scope">
    <div class="page page-dashboard ng-scope">
      <div class="pageheader">
        <h2 class="ng-binding">Dashboard
          <span class="ng-binding"></span>
        </h2>
        <div class="page-bar">
          <ul class="page-breadcrumb">
            <li> <a ui-sref="app.dashboard" class="ng-binding" href="#/app/dashboard"><i class="fa fa-home"></i> Minovate</a> </li>
            <li> <a ui-sref="app.dashboard" class="ng-binding" href="#/app/dashboard">Dashboard</a> </li>
          </ul>
          <div class="page-toolbar ng-scope" ng-click="vm.fullCalenderView('lg');">
            <a href="javascript:;" class="btn btn-lightred no-border ng-isolate-scope" daterangepicker="rangeOptions" date-begin="startDate" date-end="endDate"> <i class="fa fa-calendar"></i>&nbsp;&nbsp;
              <span class="ng-binding">{{vm.todayDate| date : format : timezone}}</span>
            </a>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="card-container col-lg-3 col-sm-6 col-sm-12" ng-show="vm.session.hasRole('SuperAdmin')">
          <div class="card">
            <div class="front bg-greensea">
              <div class="row">
                <div class="col-xs-4"> <i class="fa fa-university fa-4x"></i> </div>
                <div class="col-xs-8">
                  <p class="text-elg text-strong mb-0">{{vm.countPremise}}</p>
                  <span>Premises</span>
                </div>
              </div>
            </div>
            <div class="back bg-greensea">
              <div class="row">
                <div class="col-xs-6"> <a href="javascript:;" ui-sref="wams.viewAllPremises"><i class="fa fa-eye fa-2x"></i>All Premises</a> </div>
                <div class="col-xs-6"> <a href="javascript:;" ui-sref="wams.addPremises"><i class="fa fa-plus fa-2x"></i>Create</a> </div>
                <!-- <div class="col-xs-4"> <a href="javascript:;"><i class="fa fa-ellipsis-h fa-2x"></i> More</a> </div> -->
              </div>
            </div>
          </div>
        </div>
        <div class="card-container col-lg-3 col-sm-6 col-sm-12" ng-show="vm.session.hasRole('SuperAdmin')">
          <div class="card">
            <div class="front bg-lightred">
              <div class="row">
                <div class="col-xs-4"> <i class="fa fa-building fa-4x"></i> </div>
                <div class="col-xs-8">
                  <p class="text-elg text-strong mb-0">{{vm.countBuildings}}</p>
                  <span>Buildings</span>
                </div>
              </div>
            </div>
            <div class="back bg-lightred">
              <div class="row">
                <div class="col-xs-6"> <a href="javascript:;" ui-sref="wams.viewAllbuildings"><i class="fa fa-eye fa-2x"></i>All Buildings</a> </div>
                <div class="col-xs-6"> <a href="javascript:;" ui-sref="wams.createBuildings"><i class="fa fa-plus fa-2x"></i>Create</a> </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-container col-lg-3 col-sm-6 col-sm-12" ng-show="vm.session.hasRole('SuperAdmin')">
          <div class="card">
            <div class="front bg-blue">
              <div class="row">
                <div class="col-xs-4"> <i class="fa fa-building-o fa-4x"></i> </div>
                <div class="col-xs-8">
                  <p class="text-elg text-strong mb-0">{{vm.countTenants}}</p>
                  <span>Tenants</span>
                </div>
              </div>
            </div>
            <div class="back bg-blue">
              <div class="row">
                <div class="col-xs-6"> <a href="javascript:;" ui-sref="wams.viewAllCompanies"><i class="fa fa-eye fa-2x"></i>All Tenants</a> </div>
                <div class="col-xs-6"> <a href="javascript:;" ui-sref="wams.createCompany"><i class="fa fa-plus fa-2x"></i>Create</a> </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-container col-lg-3 col-sm-6 col-sm-12" ng-show="vm.session.hasRole('SuperAdmin')||vm.session.hasRole('TenantAdmin')">
          <div class="card">
            <div class="front bg-cyan">
              <div class="row">
                <div class="col-xs-4"> <i class="fa fa-users fa-4x"></i> </div>
                <div class="col-xs-8">
                  <p class="text-elg text-strong mb-0">{{vm.countUsers}}</p>
                  <span>Users</span>
                </div>
              </div>
            </div>
            <div class="back bg-cyan">
              <div class="row">
                <div class="col-xs-6"> <a href="javascript:;" ui-sref="wams.users"><i class="fa fa fa-eye fa-2x"></i> View</a> </div>
                <div class="col-xs-6"> <a href="javascript:;" ui-sref="wams.sendInvitations"><i class="fa fa-envelope-o fa-2x"></i> Send Invites</a> </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-container col-lg-3 col-sm-6 col-sm-12" ng-show="vm.session.hasRole('SuperAdmin')">
          <div class="card">
            <div class="front bg-blue">
              <div class="row">
                <div class="col-xs-4"> <i class="fa fa-building-o fa-4x"></i> </div>
                <div class="col-xs-8">
                  <p class="text-elg text-strong mb-0">{{vm.countMeetingRooms}}</p>
                  <span>Meeting Rooms</span>
                </div>
              </div>
            </div>
            <div class="back bg-blue">
              <div class="row">
                <div class="col-xs-4"> <a href="javascript:;" ui-sref="wams.allbookings"><i class="fa fa-shopping-cart fa-2x"></i>All Bookings</a></div>
                <div class="col-xs-4"> <a href="javascript:;" ui-sref="wams.meetingrooms"><i class="fa fa-eye fa-2x"></i>All Meeting Rooms</a> </div>
                <div class="col-xs-4" ng-show="vm.session.hasRole('SuperAdmin')"> <a href="javascript:;" ui-sref="wams.createmeetingroom"><i class="fa fa-plus fa-2x"></i>Create</a> </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-container col-lg-3 col-sm-6 col-sm-12" ng-hide="vm.session.hasRole('SuperAdmin')||vm.session.hasRole('TenantAdmin')">
          <div class="card">
            <div class="front bg-blue">
              <div class="row">
                <div class="col-xs-4"> <i class="fa fa-building-o fa-4x"></i> </div>
                <div class="col-xs-8">
                  <p class="text-elg text-strong mb-0">{{vm.countMeetingRooms}}</p>
                  <span>Meeting Rooms</span>
                </div>
              </div>
            </div>
            <div class="back bg-blue">
              <div class="row">
                <div class="col-xs-12"> <a href="javascript:;" ui-sref="wams.meetingrooms"><i class="fa fa-eye fa-2x"></i>All Meeting Rooms</a> </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-container col-lg-3 col-sm-6 col-sm-12" ng-show="vm.session.hasRole('TenantAdmin')">
          <div class="card">
            <div class="front bg-blue">
              <div class="row">
                <div class="col-xs-4"> <i class="fa fa-building-o fa-4x"></i> </div>
                <div class="col-xs-8">
                  <p class="text-elg text-strong mb-0">{{vm.countMeetingRooms}}</p>
                  <span>Meeting Rooms</span>
                </div>
              </div>
            </div>
            <div class="back bg-blue">
              <div class="row">
                <div class="col-xs-6"> <a href="javascript:;" ui-sref="wams.allbookings"><i class="fa fa-shopping-cart fa-2x"></i>All Bookings</a> </div>
                <div class="col-xs-6"> <a href="javascript:;" ui-sref="wams.meetingrooms"><i class="fa fa-eye fa-2x"></i>All Meeting Rooms</a> </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-container col-lg-3 col-sm-6 col-sm-12">
          <div class="card">
            <div class="front bg-blue">
              <div class="row">
                <div class="col-xs-4"> <i class="fa fa-building-o fa-4x"></i> </div>
                <div class="col-xs-8">
                  <p class="text-elg text-strong mb-0"></p>
                  <span>Book Meeting Room</span>
                </div>
              </div>
            </div>
            <div class="back bg-blue">
              <div class="row">
                <div class="col-xs-6"> <a href="javascript:;" ui-sref="wams.wizard.checkAvailability"><i class="fa fa-shopping-cart fa-2x"></i>Book</a> </div>
                <div class="col-xs-6"> <a href="javascript:;" ui-sref="wams.mybookings"><i class="fa fa fa-eye fa-2x"></i>My Bookings</a> </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-container col-lg-3 col-sm-6 col-sm-12" ng-show="vm.session.hasRole('SuperAdmin')">
          <div class="card">
            <div class="front bg-greensea">
              <div class="row">
                <div class="col-xs-4"> <i class="fa fa-cutlery fa-4x"></i> </div>
                <div class="col-xs-8">
                  <p class="text-elg text-strong mb-0">{{ vm.countCafeteria}}</p>
                  <span>Cafeterias</span>
                </div>
              </div>
            </div>
            <div class="back bg-greensea">
              <div class="row">
                <div class="col-xs-6"> <a href="javascript:;" ui-sref="wams.allCafeterias"><i class="fa fa-eye fa-2x"></i>All Cafeterias</a> </div>
                <div class="col-xs-6"> <a href="javascript:;" ui-sref="wams.createCafeteria"><i class="fa fa-plus fa-2x"></i>Create</a> </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-8">
        </div>
        <div class="col-md-4">
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
        </div>
        <div class="col-md-4">
        </div>
        <div class="col-md-4">
        </div>
      </div>
      <div class="row">
        <div class="col-md-8">
        </div>
        <div class="col-md-4">
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
        </div>
        <div class="col-md-4">
        </div>
        <div class="col-md-4">
        </div>
      </div>
    </div>
    <div class="daterangepicker dropdown-menu opensleft">
      <div class="calendar first left">
        <div class="calendar-date">
          <table class="table-condensed">
            <thead>
              <tr>
                <th class="prev available"><i class="fa fa-arrow-left icon-arrow-left glyphicon glyphicon-arrow-left"></i></th>
                <th colspan="5" class="month">Jun 2015</th>
                <th class="next available"><i class="fa fa-arrow-right icon-arrow-right glyphicon glyphicon-arrow-right"></i></th>
              </tr>
              <tr>
                <th>Su</th>
                <th>Mo</th>
                <th>Tu</th>
                <th>We</th>
                <th>Th</th>
                <th>Fr</th>
                <th>Sa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="available off" data-title="r0c0">31</td>
                <td class="available" data-title="r0c1">1</td>
                <td class="available" data-title="r0c2">2</td>
                <td class="available" data-title="r0c3">3</td>
                <td class="available" data-title="r0c4">4</td>
                <td class="available" data-title="r0c5">5</td>
                <td class="available" data-title="r0c6">6</td>
              </tr>
              <tr>
                <td class="available" data-title="r1c0">7</td>
                <td class="available" data-title="r1c1">8</td>
                <td class="available" data-title="r1c2">9</td>
                <td class="available" data-title="r1c3">10</td>
                <td class="available" data-title="r1c4">11</td>
                <td class="available" data-title="r1c5">12</td>
                <td class="available" data-title="r1c6">13</td>
              </tr>
              <tr>
                <td class="available" data-title="r2c0">14</td>
                <td class="available" data-title="r2c1">15</td>
                <td class="available" data-title="r2c2">16</td>
                <td class="available" data-title="r2c3">17</td>
                <td class="available" data-title="r2c4">18</td>
                <td class="available" data-title="r2c5">19</td>
                <td class="available" data-title="r2c6">20</td>
              </tr>
              <tr>
                <td class="available" data-title="r3c0">21</td>
                <td class="available" data-title="r3c1">22</td>
                <td class="available" data-title="r3c2">23</td>
                <td class="available" data-title="r3c3">24</td>
                <td class="available" data-title="r3c4">25</td>
                <td class="available" data-title="r3c5">26</td>
                <td class="available" data-title="r3c6">27</td>
              </tr>
              <tr>
                <td class="available active start-date" data-title="r4c0">28</td>
                <td class="available in-range" data-title="r4c1">29</td>
                <td class="available in-range" data-title="r4c2">30</td>
                <td class="available off in-range" data-title="r4c3">1</td>
                <td class="available off in-range" data-title="r4c4">2</td>
                <td class="available off in-range" data-title="r4c5">3</td>
                <td class="available off in-range" data-title="r4c6">4</td>
              </tr>
              <tr>
                <td class="available off in-range" data-title="r5c0">5</td>
                <td class="available off in-range" data-title="r5c1">6</td>
                <td class="available off in-range" data-title="r5c2">7</td>
                <td class="available off in-range" data-title="r5c3">8</td>
                <td class="available off in-range" data-title="r5c4">9</td>
                <td class="available off in-range" data-title="r5c5">10</td>
                <td class="available off in-range" data-title="r5c6">11</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="calendar second right">
        <div class="calendar-date">
          <table class="table-condensed">
            <thead>
              <tr>
                <th class="prev available"><i class="fa fa-arrow-left icon-arrow-left glyphicon glyphicon-arrow-left"></i></th>
                <th colspan="5" class="month">Jul 2015</th>
                <th class="next available"><i class="fa fa-arrow-right icon-arrow-right glyphicon glyphicon-arrow-right"></i></th>
              </tr>
              <tr>
                <th>Su</th>
                <th>Mo</th>
                <th>Tu</th>
                <th>We</th>
                <th>Th</th>
                <th>Fr</th>
                <th>Sa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="available off in-range" data-title="r0c0">28</td>
                <td class="available off in-range" data-title="r0c1">29</td>
                <td class="available off in-range" data-title="r0c2">30</td>
                <td class="available in-range" data-title="r0c3">1</td>
                <td class="available in-range" data-title="r0c4">2</td>
                <td class="available in-range" data-title="r0c5">3</td>
                <td class="available in-range" data-title="r0c6">4</td>
              </tr>
              <tr>
                <td class="available in-range" data-title="r1c0">5</td>
                <td class="available in-range" data-title="r1c1">6</td>
                <td class="available in-range" data-title="r1c2">7</td>
                <td class="available in-range" data-title="r1c3">8</td>
                <td class="available in-range" data-title="r1c4">9</td>
                <td class="available in-range" data-title="r1c5">10</td>
                <td class="available in-range" data-title="r1c6">11</td>
              </tr>
              <tr>
                <td class="available in-range" data-title="r2c0">12</td>
                <td class="available in-range" data-title="r2c1">13</td>
                <td class="available in-range" data-title="r2c2">14</td>
                <td class="available in-range" data-title="r2c3">15</td>
                <td class="available in-range" data-title="r2c4">16</td>
                <td class="available in-range" data-title="r2c5">17</td>
                <td class="available in-range" data-title="r2c6">18</td>
              </tr>
              <tr>
                <td class="available in-range" data-title="r3c0">19</td>
                <td class="available in-range" data-title="r3c1">20</td>
                <td class="available in-range" data-title="r3c2">21</td>
                <td class="available in-range" data-title="r3c3">22</td>
                <td class="available in-range" data-title="r3c4">23</td>
                <td class="available in-range" data-title="r3c5">24</td>
                <td class="available in-range" data-title="r3c6">25</td>
              </tr>
              <tr>
                <td class="available in-range" data-title="r4c0">26</td>
                <td class="available active end-date" data-title="r4c1">27</td>
                <td class="available" data-title="r4c2">28</td>
                <td class="available" data-title="r4c3">29</td>
                <td class="available" data-title="r4c4">30</td>
                <td class="available" data-title="r4c5">31</td>
                <td class="available off" data-title="r4c6">1</td>
              </tr>
              <tr>
                <td class="available off" data-title="r5c0">2</td>
                <td class="available off" data-title="r5c1">3</td>
                <td class="available off" data-title="r5c2">4</td>
                <td class="available off" data-title="r5c3">5</td>
                <td class="available off" data-title="r5c4">6</td>
                <td class="available off" data-title="r5c5">7</td>
                <td class="available off" data-title="r5c6">8</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="ranges">
        <ul>
          <li>Today</li>
          <li>Yesterday</li>
          <li>Last 7 Days</li>
          <li class="active">Last 30 Days</li>
          <li>This Month</li>
          <li>Last Month</li>
          <li>Custom Range</li>
        </ul>
        <div class="range_inputs">
          <div class="daterangepicker_start_input">
            <label for="daterangepicker_start">From</label>
            <input class="input-mini" type="text" name="daterangepicker_start" value="">
          </div>
          <div class="daterangepicker_end_input">
            <label for="daterangepicker_end">To</label>
            <input class="input-mini" type="text" name="daterangepicker_end" value="">
          </div>
          <button class="applyBtn btn btn-small btn-sm btn-success">Apply</button>&nbsp;
          <button class="cancelBtn btn btn-small btn-sm btn-default">Cancel</button>
        </div>
      </div>
    </div>
    <div class="daterangepicker dropdown-menu opensleft">
      <div class="calendar first left">
        <div class="calendar-date">
          <table class="table-condensed">
            <thead>
              <tr>
                <th class="prev available"><i class="fa fa-arrow-left icon-arrow-left glyphicon glyphicon-arrow-left"></i></th>
                <th colspan="5" class="month">Jun 2015</th>
                <th class="next available"><i class="fa fa-arrow-right icon-arrow-right glyphicon glyphicon-arrow-right"></i></th>
              </tr>
              <tr>
                <th>Su</th>
                <th>Mo</th>
                <th>Tu</th>
                <th>We</th>
                <th>Th</th>
                <th>Fr</th>
                <th>Sa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="available off" data-title="r0c0">31</td>
                <td class="available" data-title="r0c1">1</td>
                <td class="available" data-title="r0c2">2</td>
                <td class="available" data-title="r0c3">3</td>
                <td class="available" data-title="r0c4">4</td>
                <td class="available" data-title="r0c5">5</td>
                <td class="available" data-title="r0c6">6</td>
              </tr>
              <tr>
                <td class="available" data-title="r1c0">7</td>
                <td class="available" data-title="r1c1">8</td>
                <td class="available" data-title="r1c2">9</td>
                <td class="available" data-title="r1c3">10</td>
                <td class="available" data-title="r1c4">11</td>
                <td class="available" data-title="r1c5">12</td>
                <td class="available" data-title="r1c6">13</td>
              </tr>
              <tr>
                <td class="available" data-title="r2c0">14</td>
                <td class="available" data-title="r2c1">15</td>
                <td class="available" data-title="r2c2">16</td>
                <td class="available" data-title="r2c3">17</td>
                <td class="available" data-title="r2c4">18</td>
                <td class="available" data-title="r2c5">19</td>
                <td class="available" data-title="r2c6">20</td>
              </tr>
              <tr>
                <td class="available" data-title="r3c0">21</td>
                <td class="available" data-title="r3c1">22</td>
                <td class="available" data-title="r3c2">23</td>
                <td class="available" data-title="r3c3">24</td>
                <td class="available" data-title="r3c4">25</td>
                <td class="available" data-title="r3c5">26</td>
                <td class="available" data-title="r3c6">27</td>
              </tr>
              <tr>
                <td class="available active start-date" data-title="r4c0">28</td>
                <td class="available in-range" data-title="r4c1">29</td>
                <td class="available in-range" data-title="r4c2">30</td>
                <td class="available off in-range" data-title="r4c3">1</td>
                <td class="available off in-range" data-title="r4c4">2</td>
                <td class="available off in-range" data-title="r4c5">3</td>
                <td class="available off in-range" data-title="r4c6">4</td>
              </tr>
              <tr>
                <td class="available off in-range" data-title="r5c0">5</td>
                <td class="available off in-range" data-title="r5c1">6</td>
                <td class="available off in-range" data-title="r5c2">7</td>
                <td class="available off in-range" data-title="r5c3">8</td>
                <td class="available off in-range" data-title="r5c4">9</td>
                <td class="available off in-range" data-title="r5c5">10</td>
                <td class="available off in-range" data-title="r5c6">11</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="calendar second right">
        <div class="calendar-date">
          <table class="table-condensed">
            <thead>
              <tr>
                <th class="prev available"><i class="fa fa-arrow-left icon-arrow-left glyphicon glyphicon-arrow-left"></i></th>
                <th colspan="5" class="month">Jul 2015</th>
                <th class="next available"><i class="fa fa-arrow-right icon-arrow-right glyphicon glyphicon-arrow-right"></i></th>
              </tr>
              <tr>
                <th>Su</th>
                <th>Mo</th>
                <th>Tu</th>
                <th>We</th>
                <th>Th</th>
                <th>Fr</th>
                <th>Sa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="available off in-range" data-title="r0c0">28</td>
                <td class="available off in-range" data-title="r0c1">29</td>
                <td class="available off in-range" data-title="r0c2">30</td>
                <td class="available in-range" data-title="r0c3">1</td>
                <td class="available in-range" data-title="r0c4">2</td>
                <td class="available in-range" data-title="r0c5">3</td>
                <td class="available in-range" data-title="r0c6">4</td>
              </tr>
              <tr>
                <td class="available in-range" data-title="r1c0">5</td>
                <td class="available in-range" data-title="r1c1">6</td>
                <td class="available in-range" data-title="r1c2">7</td>
                <td class="available in-range" data-title="r1c3">8</td>
                <td class="available in-range" data-title="r1c4">9</td>
                <td class="available in-range" data-title="r1c5">10</td>
                <td class="available in-range" data-title="r1c6">11</td>
              </tr>
              <tr>
                <td class="available in-range" data-title="r2c0">12</td>
                <td class="available in-range" data-title="r2c1">13</td>
                <td class="available in-range" data-title="r2c2">14</td>
                <td class="available in-range" data-title="r2c3">15</td>
                <td class="available in-range" data-title="r2c4">16</td>
                <td class="available in-range" data-title="r2c5">17</td>
                <td class="available in-range" data-title="r2c6">18</td>
              </tr>
              <tr>
                <td class="available in-range" data-title="r3c0">19</td>
                <td class="available in-range" data-title="r3c1">20</td>
                <td class="available in-range" data-title="r3c2">21</td>
                <td class="available in-range" data-title="r3c3">22</td>
                <td class="available in-range" data-title="r3c4">23</td>
                <td class="available in-range" data-title="r3c5">24</td>
                <td class="available in-range" data-title="r3c6">25</td>
              </tr>
              <tr>
                <td class="available in-range" data-title="r4c0">26</td>
                <td class="available active end-date" data-title="r4c1">27</td>
                <td class="available" data-title="r4c2">28</td>
                <td class="available" data-title="r4c3">29</td>
                <td class="available" data-title="r4c4">30</td>
                <td class="available" data-title="r4c5">31</td>
                <td class="available off" data-title="r4c6">1</td>
              </tr>
              <tr>
                <td class="available off" data-title="r5c0">2</td>
                <td class="available off" data-title="r5c1">3</td>
                <td class="available off" data-title="r5c2">4</td>
                <td class="available off" data-title="r5c3">5</td>
                <td class="available off" data-title="r5c4">6</td>
                <td class="available off" data-title="r5c5">7</td>
                <td class="available off" data-title="r5c6">8</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="ranges">
        <ul>
          <li>Today</li>
          <li>Yesterday</li>
          <li>Last 7 Days</li>
          <li class="active">Last 30 Days</li>
          <li>This Month</li>
          <li>Last Month</li>
          <li>Custom Range</li>
        </ul>
        <div class="range_inputs">
          <div class="daterangepicker_start_input">
            <label for="daterangepicker_start">From</label>
            <input class="input-mini" type="text" name="daterangepicker_start" value="">
          </div>
          <div class="daterangepicker_end_input">
            <label for="daterangepicker_end">To</label>
            <input class="input-mini" type="text" name="daterangepicker_end" value="">
          </div>
          <button class="applyBtn btn btn-small btn-sm btn-success">Apply</button>&nbsp;
          <button class="cancelBtn btn btn-small btn-sm btn-default">Cancel</button>
        </div>
      </div>
    </div>
    <div class="daterangepicker dropdown-menu opensleft">
      <div class="calendar first left">
        <div class="calendar-date">
          <table class="table-condensed">
            <thead>
              <tr>
                <th class="prev available"><i class="fa fa-arrow-left icon-arrow-left glyphicon glyphicon-arrow-left"></i></th>
                <th colspan="5" class="month">Jun 2015</th>
                <th class="next available"><i class="fa fa-arrow-right icon-arrow-right glyphicon glyphicon-arrow-right"></i></th>
              </tr>
              <tr>
                <th>Su</th>
                <th>Mo</th>
                <th>Tu</th>
                <th>We</th>
                <th>Th</th>
                <th>Fr</th>
                <th>Sa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="available off" data-title="r0c0">31</td>
                <td class="available" data-title="r0c1">1</td>
                <td class="available" data-title="r0c2">2</td>
                <td class="available" data-title="r0c3">3</td>
                <td class="available" data-title="r0c4">4</td>
                <td class="available" data-title="r0c5">5</td>
                <td class="available" data-title="r0c6">6</td>
              </tr>
              <tr>
                <td class="available" data-title="r1c0">7</td>
                <td class="available" data-title="r1c1">8</td>
                <td class="available" data-title="r1c2">9</td>
                <td class="available" data-title="r1c3">10</td>
                <td class="available" data-title="r1c4">11</td>
                <td class="available" data-title="r1c5">12</td>
                <td class="available" data-title="r1c6">13</td>
              </tr>
              <tr>
                <td class="available" data-title="r2c0">14</td>
                <td class="available" data-title="r2c1">15</td>
                <td class="available" data-title="r2c2">16</td>
                <td class="available" data-title="r2c3">17</td>
                <td class="available" data-title="r2c4">18</td>
                <td class="available" data-title="r2c5">19</td>
                <td class="available" data-title="r2c6">20</td>
              </tr>
              <tr>
                <td class="available" data-title="r3c0">21</td>
                <td class="available" data-title="r3c1">22</td>
                <td class="available" data-title="r3c2">23</td>
                <td class="available" data-title="r3c3">24</td>
                <td class="available" data-title="r3c4">25</td>
                <td class="available" data-title="r3c5">26</td>
                <td class="available" data-title="r3c6">27</td>
              </tr>
              <tr>
                <td class="available active start-date" data-title="r4c0">28</td>
                <td class="available in-range" data-title="r4c1">29</td>
                <td class="available in-range" data-title="r4c2">30</td>
                <td class="available off in-range" data-title="r4c3">1</td>
                <td class="available off in-range" data-title="r4c4">2</td>
                <td class="available off in-range" data-title="r4c5">3</td>
                <td class="available off in-range" data-title="r4c6">4</td>
              </tr>
              <tr>
                <td class="available off in-range" data-title="r5c0">5</td>
                <td class="available off in-range" data-title="r5c1">6</td>
                <td class="available off in-range" data-title="r5c2">7</td>
                <td class="available off in-range" data-title="r5c3">8</td>
                <td class="available off in-range" data-title="r5c4">9</td>
                <td class="available off in-range" data-title="r5c5">10</td>
                <td class="available off in-range" data-title="r5c6">11</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="calendar second right">
        <div class="calendar-date">
          <table class="table-condensed">
            <thead>
              <tr>
                <th class="prev available"><i class="fa fa-arrow-left icon-arrow-left glyphicon glyphicon-arrow-left"></i></th>
                <th colspan="5" class="month">Jul 2015</th>
                <th class="next available"><i class="fa fa-arrow-right icon-arrow-right glyphicon glyphicon-arrow-right"></i></th>
              </tr>
              <tr>
                <th>Su</th>
                <th>Mo</th>
                <th>Tu</th>
                <th>We</th>
                <th>Th</th>
                <th>Fr</th>
                <th>Sa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="available off in-range" data-title="r0c0">28</td>
                <td class="available off in-range" data-title="r0c1">29</td>
                <td class="available off in-range" data-title="r0c2">30</td>
                <td class="available in-range" data-title="r0c3">1</td>
                <td class="available in-range" data-title="r0c4">2</td>
                <td class="available in-range" data-title="r0c5">3</td>
                <td class="available in-range" data-title="r0c6">4</td>
              </tr>
              <tr>
                <td class="available in-range" data-title="r1c0">5</td>
                <td class="available in-range" data-title="r1c1">6</td>
                <td class="available in-range" data-title="r1c2">7</td>
                <td class="available in-range" data-title="r1c3">8</td>
                <td class="available in-range" data-title="r1c4">9</td>
                <td class="available in-range" data-title="r1c5">10</td>
                <td class="available in-range" data-title="r1c6">11</td>
              </tr>
              <tr>
                <td class="available in-range" data-title="r2c0">12</td>
                <td class="available in-range" data-title="r2c1">13</td>
                <td class="available in-range" data-title="r2c2">14</td>
                <td class="available in-range" data-title="r2c3">15</td>
                <td class="available in-range" data-title="r2c4">16</td>
                <td class="available in-range" data-title="r2c5">17</td>
                <td class="available in-range" data-title="r2c6">18</td>
              </tr>
              <tr>
                <td class="available in-range" data-title="r3c0">19</td>
                <td class="available in-range" data-title="r3c1">20</td>
                <td class="available in-range" data-title="r3c2">21</td>
                <td class="available in-range" data-title="r3c3">22</td>
                <td class="available in-range" data-title="r3c4">23</td>
                <td class="available in-range" data-title="r3c5">24</td>
                <td class="available in-range" data-title="r3c6">25</td>
              </tr>
              <tr>
                <td class="available in-range" data-title="r4c0">26</td>
                <td class="available active end-date" data-title="r4c1">27</td>
                <td class="available" data-title="r4c2">28</td>
                <td class="available" data-title="r4c3">29</td>
                <td class="available" data-title="r4c4">30</td>
                <td class="available" data-title="r4c5">31</td>
                <td class="available off" data-title="r4c6">1</td>
              </tr>
              <tr>
                <td class="available off" data-title="r5c0">2</td>
                <td class="available off" data-title="r5c1">3</td>
                <td class="available off" data-title="r5c2">4</td>
                <td class="available off" data-title="r5c3">5</td>
                <td class="available off" data-title="r5c4">6</td>
                <td class="available off" data-title="r5c5">7</td>
                <td class="available off" data-title="r5c6">8</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="ranges">
        <ul>
          <li>Today</li>
          <li>Yesterday</li>
          <li>Last 7 Days</li>
          <li class="active">Last 30 Days</li>
          <li>This Month</li>
          <li>Last Month</li>
          <li>Custom Range</li>
        </ul>
        <div class="range_inputs">
          <div class="daterangepicker_start_input">
            <label for="daterangepicker_start">From</label>
            <input class="input-mini" type="text" name="daterangepicker_start" value="">
          </div>
          <div class="daterangepicker_end_input">
            <label for="daterangepicker_end">To</label>
            <input class="input-mini" type="text" name="daterangepicker_end" value="">
          </div>
          <button class="applyBtn btn btn-small btn-sm btn-success">Apply</button>&nbsp;
          <button class="cancelBtn btn btn-small btn-sm btn-default">Cancel</button>
        </div>
      </div>
    </div>
  </section>
</div>


<!-- Login -->
<div class="page page-core page-login">

  <div class="text-center">
    <h3 class="text-light text-white">
      <span class="text-lightred">L</span>ogin</h3>
  </div>

  <div class="container w-420 p-15 bg-white mt-40 text-center" style="width:430px;">


    <h2 class="text-light text-greensea">{{vm.title}}</h2>

    <form name="form" class="form-validation mt-20" novalidate="">

      <div class="form-group">
        <input type="email" class="form-control underline-input" placeholder="Email" ng-model="vm.credentials.un" ng-keyup="$event.keyCode === 13 && vm.login()" required> </div>

      <div class="form-group">
        <input type="password" placeholder="Password" class="form-control underline-input" ng-model="vm.credentials.pwd" ng-keyup="$event.keyCode === 13 && vm.login()" required> </div>

      <div class="form-group text-left mt-20">
        <button type="button" class="btn btn-greensea b-0 br-2 mr-5" ng-click="vm.login();" ng-disabled="form.$invalid">Login</button>
        <label class="checkbox checkbox-custom checkbox-custom-sm inline-block">
          <input type="checkbox" ng-model="vm.rememberMe"><i></i> Remember me </label>
        <a ui-sref="anon.forgotPassword" class="pull-right mt-10">Forgot Password?</a>
      </div>
    </form>

    <hr class="b-3x">

    <div class="social-login text-left">

      <!--    <ul class="pull-right list-unstyled list-inline">
        <li class="p-0">
          <a class="btn btn-sm btn-primary b-0 btn-rounded-20" href="javascript:;"><i class="fa fa-facebook"></i></a>
        </li>
        <li class="p-0">
          <a class="btn btn-sm btn-info b-0 btn-rounded-20" href="javascript:;"><i class="fa fa-twitter"></i></a>
        </li>
        <li class="p-0">
          <a class="btn btn-sm btn-lightred b-0 btn-rounded-20" href="javascript:;"><i class="fa fa-google-plus"></i></a>
        </li>
        <li class="p-0">
          <a class="btn btn-sm btn-primary b-0 btn-rounded-20" href="javascript:;"><i class="fa fa-linkedin"></i></a>
        </li>
      </ul> -->

      <h5 class="text-danger">{{vm.errorMessage}}</h5>

    </div>

    <!-- <div class="bg-slategray lt wrap-reset mt-40">
      <p class="m-0">
        <a ui-sref="anon.singup" class="text-uppercase">Create an account</a>
      </p>
    </div> -->

  </div>
</div>



<!-- maerial design -->
<section>
        <!--  <md-subheader class="md-primary">Unread Messages -->
        <md-subheader class="md-primary">Meeting Room Bookings</md-subheader>
        <md-list-item ng-repeat="booking in vm.bookings">
          <md-checkbox ng-model="booking.selected"></md-checkbox>
          <div class="md-list-item-text" layout="column">
            <h3>{{vm.ui.userInfo[booking.whome]}} Booked {{ booking.title }}</h3>
            <h4>{{ booking.from | date : "MM/dd/yyyy 'at' h:mma" : timezone }} - {{booking.to | date : "MM/dd/yyyy 'at' h:mma" : timezone}}</h4>
            <p>{{ booking.reason }}</p>
          </div>
          <!--  <p>{{message.title}}</p> -->
         <!--  <i class="material-icons">face</i> -->
          <ng-md-icon icon="twitter" size="24"><a ng-click></a></ng-md-icon>
          <!-- <md-icon class="md-secondary" ng-click="doSecondaryAction($event)" aria-label="Chat" md-svg-icon="communication:message"></md-icon> -->
        </md-list-item>
      </section>
      <md-divider></md-divider>


      <!-- Dashboard -->

      <div class="view-container" ui-view-container>
  <section id="content" autoscroll="false" class="ng-scope">
    <div class="page page-form-wizard">
      <!-- page header -->
      <div class="pageheader">
        <h2>{{vm.page.title}}

        </h2>
        <div class="page-bar">
          <ul class="page-breadcrumb">
            <li> <a ui-sref="app.dashboard" class="ng-binding" href="#/app/dashboard"><i class="fa fa-home"></i> Wams</a> </li>
            <li> <a href="javascript:;">Meeting Rooms</a> </li>
            <li> <a ui-sref="app.tables.bootstrap" class="ng-binding" href="#/app/tables/bootstrap">{{vm.page.title}}</a> </li>
          </ul>
        </div>
      </div>

      <div class="pagecontent">

        <div data-ui-view>
        </div>
      </div>


      <!-- /page content -->
    </div>
  </section>
</div>

