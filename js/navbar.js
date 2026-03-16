/**
 * Navbar - maximum-health.de
 * Sticky Navbar mit Scroll-Effekt und Mobile Hamburger Menu.
 */
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const toggle = navbar.querySelector('.navbar__hamburger');
  const menu = navbar.querySelector('.navbar__mobile-menu');
  const navLinks = navbar.querySelectorAll('.navbar__mobile-menu a, .navbar__links a');

  // Sticky navbar: Klasse hinzufuegen/entfernen bei Scroll
  // Auf Sub-Seiten (navbar--scrolled als Default im HTML) bleibt die Navbar immer scrolled
  const isAlwaysScrolled = navbar.classList.contains('navbar--scrolled');

  if (!isAlwaysScrolled) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar--scrolled');
      } else {
        navbar.classList.remove('navbar--scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  // Mobile hamburger toggle
  if (toggle && menu) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle.classList.toggle('navbar__hamburger--active');
      menu.classList.toggle('navbar__mobile-menu--open');
    });
  }

  // Nav-Links schliessen das Mobile Menu
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (toggle) toggle.classList.remove('navbar__hamburger--active');
      if (menu) menu.classList.remove('navbar__mobile-menu--open');
    });
  });

  // Klick ausserhalb schliesst das Mobile Menu
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      if (toggle) toggle.classList.remove('navbar__hamburger--active');
      if (menu) menu.classList.remove('navbar__mobile-menu--open');
    }
  });
});
