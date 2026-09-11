/* Progressive enhancement: navigation and disclosure controls work without JavaScript. */
(function () {
  'use strict';

  var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hasObserver = 'IntersectionObserver' in window;

  if (hasObserver && !motionPreference.matches) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.rv').forEach(function (element) {
      revealObserver.observe(element);
    });
    // Preserve the theme class. Content is hidden only after observers are ready.
    document.documentElement.classList.add('anim');
  }

  var mobileMenu = document.querySelector('.mobile-sections');
  if (mobileMenu) {
    mobileMenu.addEventListener('click', function (event) {
      if (event.target.closest('a')) mobileMenu.open = false;
    });
    mobileMenu.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        mobileMenu.open = false;
        mobileMenu.querySelector('summary').focus();
      }
    });
  }

  var sections = Array.from(document.querySelectorAll('main > section[id]'));
  var navigationLinks = Array.from(document.querySelectorAll('[data-section]'));
  var progress = document.getElementById('prog');
  var framePending = false;
  function updateNavigation() {
    framePending = false;
    var threshold = window.innerWidth < 1100 ? 150 : 100;
    var activeSection = sections[0];
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= threshold) activeSection = section;
    });
    var scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollableHeight > 0 && window.scrollY >= scrollableHeight - 2) {
      activeSection = sections[sections.length - 1];
    }
    navigationLinks.forEach(function (link) {
      if (activeSection && link.getAttribute('href') === '#' + activeSection.id) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
    if (progress) {
      var fraction = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      progress.style.width = Math.min(100, Math.max(0, fraction * 100)) + '%';
    }
  }

  function scheduleNavigationUpdate() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateNavigation);
  }

  window.addEventListener('scroll', scheduleNavigationUpdate, { passive: true });
  window.addEventListener('resize', scheduleNavigationUpdate);
  document.addEventListener('toggle', scheduleNavigationUpdate, true);
  updateNavigation();

  // Changing the OS preference mid-session also makes all revealed content visible.
  motionPreference.addEventListener('change', function (event) {
    if (event.matches) {
      document.documentElement.classList.remove('anim');
    }
  });
})();
