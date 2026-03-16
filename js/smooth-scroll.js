/**
 * Smooth Scroll - maximum-health.de
 * Sanftes Scrollen zu Anker-Links mit Offset fuer die fixe Navbar.
 */
document.addEventListener('DOMContentLoaded', () => {
  const NAVBAR_OFFSET = 70;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const targetPosition = target.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
});
