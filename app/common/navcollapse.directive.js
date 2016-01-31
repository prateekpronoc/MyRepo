(function () {
  'use strict';

  angular.module('hp.common')
    .directive('navCollapse', navCollapse);



  function navCollapse() {
    return {
      restrict: 'A',
      link: function (a, b) {
        var c = b.find('ul').parent('li'),
          d = c.children('a'),
          e = b.children('li').not(c),
          f = e.children('a'),
          g = angular.element('#minovate'),
          h = angular.element('#sidebar'),
          i = angular.element('#controls');
        c.addClass('dropdown');
        var j = c.find('ul >.dropdown');
        j.addClass('submenu');
        d.append('<i class=\'fa fa-plus\'></i>');
        d.on('click', function (a) {
          if (g.hasClass('sidebar-sm') || g.hasClass('sidebar-xs') || g.hasClass('hz-menu')) return !1;
          var b = angular.element(this),
            d = b.parent('li'),
            e = angular.element('.submenu.open');
          d.hasClass('submenu') || c.not(d).removeClass('open').find('ul').slideUp();
          e.not(b.parents(
            '.submenu')).removeClass('open').find('ul').slideUp();
          d.toggleClass('open').find('>ul').stop()
            .slideToggle(),
            a.preventDefault()
        });
        c.on('mouseenter', function () {
          h.addClass('dropdown-open');
          i.addClass('dropdown-open')
        });
        c.on('mouseleave', function () {
          h.removeClass('dropdown-open');
          i.removeClass('dropdown-open')
        });
        f.on('click', function () {
          c.removeClass('open').find('ul').slideUp();
        });
        var k = angular.element('.dropdown>ul>.active').parent();
        k.css('display', 'block');
      }
    }
  }
})();

