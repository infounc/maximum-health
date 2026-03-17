/**
 * Cookie Banner - maximum-health.de
 * Zeigt Cookie-Banner an und speichert Einwilligung in localStorage.
 */
document.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  /**
   * Sichere localStorage-Wrapper. Safari Private Browsing und andere
   * Szenarien koennen bei localStorage-Zugriff Exceptions werfen.
   */
  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        // localStorage nicht verfuegbar — Consent gilt nur fuer diese Session
      }
    }
  };

  const consent = storage.get('cookieConsent');

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
      storage.set('cookieConsent', 'accepted');
      hideBanner();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      storage.set('cookieConsent', 'rejected');
      hideBanner();
    });
  }
});
