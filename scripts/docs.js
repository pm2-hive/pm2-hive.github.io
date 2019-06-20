(function() {

  $(document).ready(function() {

    redirectStuff()

    function FormatForUrl(str) {
      return str.replace(/_/g, '-')
        .replace(/ /g, '-')
        .replace(/:/g, '-')
        .replace(/\\/g, '-')
        .replace(/\//g, '-')
        .replace(/[^a-zA-Z0-9\-]+/g, '')
        .replace(/-{2,}/g, '-')
        .toLowerCase();
    };

    $('.docs-content').find('h2, h3, h1').each(function() {
      var anchor = FormatForUrl($(this).text());
      $(this).wrap('<a class="auto-anchor" href="#' + anchor + '"></a>');
    });

    var STRING_DECAMELIZE_REGEXP = (/([a-z\d])([A-Z])/g);
    var STRING_STRIP_HTML_REGEXP = (/(<[^>]*>)/g);
    var STRING_DASHERIZE_REGEXP  = (/[^a-z\d]+/g);

    var decamelize = _.memoize(function(str) {
      return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
    });

    var stripHtml = _.memoize(function(str) {
      return str.replace(STRING_STRIP_HTML_REGEXP, '');
    });

    var dasherize = _.memoize(function(str) {
      return decamelize(stripHtml(str)).replace(STRING_DASHERIZE_REGEXP, '-');
    });

    var headings = [];

    $('h2, h3').each(function(index, heading) {
      var textContent = heading.textContent;
      var id = dasherize(textContent);

      heading.id = id;

      var value = {
        el: headings,
        id: heading.id,
        text: textContent,
        children: []
      };

      var current

      if (heading.tagName.toUpperCase() === 'H2') {
        headings.push(value);
        current = value;
      } else {
        //current.children.push(value);
      }
    });

    var selects = $('.nav .active .dropdown-menu li');

    selects.each(function () {
      var title = $(this);

      if (title.attr('class') == 'active') {
        var usage = title.next().children().attr('href');
        $('.sidebar .next-page').attr('href', usage);

        if (usage != undefined) {
          $('.sidebar .next-page').show();
        }

      }

    });

    function renderHeadings(headings) {
      var template = '';

      _.each(headings, function(heading) {
        template += '<li><a href="#' + heading.id + '">' + heading.text + '</a>';

        if (heading.children.length) {
          template += '<ul class="nav">';
          template += renderHeadings(heading.children);
          template += '</ul>';
        }

        navContent += '</li>';
      }, this);

      return template;
    }

    var navContent = renderHeadings(headings);

    var $sidebar = $('.sidebar');

    $sidebar.find('.auto-nav').html(navContent);

    var navigator = $('#navigator');
    if (navigator && navigator.offset()) {
      var navtop = navigator.offset().top;

      $(document).scroll(function() {
        if (navtop < $(document).scrollTop())
          navigator.addClass('navigator-fixed');
        else
          navigator.removeClass('navigator-fixed');
      });
    }

    // $sidebar.affix({
    //   offset: {
    //     top: _.memoize(function() {
    //       var offsetTop = $sidebar.offset().top;
    //       var navbarOuterHeight = $('.navbar').height();
    //       var sidebarMargin = parseInt($sidebar.children(0).css('margin-top'), 10);

    //       return offsetTop - navbarOuterHeight - sidebarMargin;
    //     }),
    //     bottom: _.memoize(function() {
    //       return $('.footer').outerHeight(true);
    //     })
    //   }
    // });

    var $body = $(document.body);

    $body.scrollspy({
      target: '.sidebar',
      offset: 100
    });

    //$('td:contains("✓")').addClass('bg-success');
  });


  function redirectStuff() {
    function getNewUrl() {
      var mapping = {
        "/": "/runtime/overview/",
        "/docs/usage/quick-start/": "/runtime/quick-start/",
        "/docs/faq/": "/plus/faq/",
        "/docs/usage/process-management/": "/runtime/guide/process-management/",
        "/docs/usage/cluster-mode/": "/runtime/guide/load-balancing/",
        "/docs/usage/application-declaration/": "/runtime/guide/ecosystem-file/",
        "/docs/usage/signals-clean-restart/": "/runtime/best-practices/graceful-shutdown/",
        "/docs/usage/environment/": "/runtime/guide/ecosystem-file/",
        "/docs/usage/log-management/": "/runtime/guide/log-management/",
        "/docs/usage/update-pm2/": "/runtime/guide/installation/",
        "/docs/usage/deployment/": "/runtime/guide/easy-deploy-with-ssh/",
        "/docs/usage/startup/": "/runtime/guide/startup-hook/",
        "/docs/usage/docker-pm2-nodejs/": "/runtime/integration/docker/",
        "/docs/usage/process-metrics/": "/plus/reference/pmx/",
        "/docs/usage/process-actions/": "/plus/reference/pmx/",
        "/docs/usage/watch-and-restart/": "/runtime/guide/development-tools/",
        "/docs/usage/monitoring/": "/runtime/guide/process-management/",
        "/docs/usage/source-map-support/": "/runtime/guide/installation/",
        "/docs/usage/specifics/": "/runtime/overview/",
        "/docs/usage/pm2-api/": "/runtime/references/pm2-programmatic/",
        "/docs/usage/use-pm2-with-cloud-providers/": "/runtime/integration/cloud-providers/",
        "/docs/usage/expose/": "/runtime/guide/development-tools/",
        "/docs/usage/install-as-deb/": "runtime/guide/installation/",
        "/docs/usage/contributing/": "/runtime/overview/",
        "/docs/tutorials/capistrano-like-deployments": "/runtime/overview/",
        "/docs/tutorials/pm2-nginx-production-setup": "/runtime/overview/",
        "/docs/tutorials/using-transpilers-with-pm2": "/runtime/integration/transpilers/",
        "/docs/tutorials/use-pm2-with-aws-elastic-beanstalk/": "/runtime/integration/elastic-beanstalk/",
        "/docs/advanced/pm2-module-system/": "/plus/guide/modules/",
        "/docs/usage/pm2-development/": "/runtime/guide/development-tools/",
        "/hall-of-fame/": "/runtime/overview/",
        "/docs/usage/pm2-doc-single-page/": "/runtime/overview/",
        "/docs/usage/knowledge/": "/runtime/overview/",
        "/docs/usage/auto-completion/": "/runtime/guide/installation/",
      }
      return "https://pm2.io/doc/en" + mapping[document.location.pathname] + "?utm_source=pm2&utm_medium=website&utm_campaign=rebranding";
    }

    var newUrl = getNewUrl();
    if (document.querySelector('.call-to-action-container a')) {
      document.querySelector('.call-to-action-container a').href = newUrl;
    }
  }

}());
