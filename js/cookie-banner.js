/**
 * Cookie Banner - maximum-health.de
 * Zeigt Cookie-Banner an und speichert Einwilligung in localStorage.
 */
document.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  const consent = localStorage.getItem('cookieConsent');

  if (consent) {
    banner.style.display = 'none';
    return;
  }

  banner.style.display = '';
  document.body.classList.add('has-cookie-banner');

  const hideBanner = () => {
    banner.style.display = 'none';
    document.body.classList.remove('has-cookie-banner');
  };

  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      hideBanner();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'rejected');
      hideBanner();
    });
  }
});
