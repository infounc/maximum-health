/**
 * Scroll Reveal - maximum-health.de
 * Smooth fade-in-up when elements enter viewport.
 */
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: '0px 0px -80px 0px'
    }
  );

  elements.forEach((el) => observer.observe(el));
});
