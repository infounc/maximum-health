/**
 * Scroll Reveal - maximum-health.de
 * Smooth fade-in-up when elements enter viewport.
 */
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Bei reduzierter Bewegung alle Elemente sofort sichtbar machen
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((el) => el.classList.add('reveal--visible'));
    return;
  }

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
      threshold: 0.15,
      rootMargin: '0px 0px -120px 0px'
    }
  );

  elements.forEach((el) => {
    const dir = el.dataset.revealFrom;
    if (dir === 'left')  el.classList.add('reveal--from-left');
    if (dir === 'right') el.classList.add('reveal--from-right');
    observer.observe(el);
  });
});
