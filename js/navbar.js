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

  // Sticky navbar: Auf der Startseite (mit Hero-Section) wird der Scroll-Effekt
  // dynamisch gesteuert — transparent oben, dunkel beim Scrollen.
  // Auf Sub-Seiten ohne Hero bleibt navbar--scrolled permanent gesetzt.
  const hasHero = document.getElementById('hero') !== null;

  if (hasHero) {
    // Startseite: Scroll-Effekt aktivieren
    navbar.classList.remove('navbar--scrolled');

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

  // Mobile hamburger toggle (fullscreen overlay)
  if (toggle && menu) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = toggle.classList.toggle('navbar__hamburger--active');
      menu.classList.toggle('navbar__mobile-menu--open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Helper: Menü schließen
  const closeMenu = () => {
    if (toggle) {
      toggle.classList.remove('navbar__hamburger--active');
      toggle.setAttribute('aria-expanded', 'false');
    }
    if (menu) menu.classList.remove('navbar__mobile-menu--open');
    document.body.style.overflow = '';
  };

  // Nav-Links schliessen das Mobile Menu
  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Klick ausserhalb schliesst das Mobile Menu
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      closeMenu();
    }
  });

  // Escape-Taste schliesst das Mobile Menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu && menu.classList.contains('navbar__mobile-menu--open')) {
      closeMenu();
      if (toggle) toggle.focus();
    }
  });
});
