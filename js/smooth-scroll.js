/**
 * Smooth Scroll - maximum-health.de
 *
 * Scrolling wird komplett per CSS gesteuert (scroll-behavior: smooth + scroll-padding-top).
 * Dieses Script normalisiert nur same-page Links wie "index.html#coaching" zu "#coaching",
 * damit der Browser sie als Anker-Links erkennt und nativ smooth scrollt.
 */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      // Reine Anker-Links brauchen keine Behandlung — Browser handled sie nativ
      if (href.startsWith('#')) return;

      // Relative Links mit Anker: index.html#section oder ../index.html#section
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;

      const hash = href.substring(hashIndex);
      const linkUrl = new URL(href, window.location.href);

      // Nur eingreifen wenn der Link auf die aktuelle Seite zeigt
      if (linkUrl.pathname !== window.location.pathname) return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      // Hash setzen — Browser scrollt nativ mit CSS scroll-behavior: smooth
      history.pushState(null, '', hash);
      target.scrollIntoView();
    });
  });
});
