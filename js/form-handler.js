/**
 * Form Handler - maximum-health.de
 * Validierung und mailto-Versand fuer Gutschein- und Sparpaket-Formulare.
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('gutschein-form') || document.getElementById('sparpaket-form');
  if (!form) return;

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MAILTO_ADDRESS = 'info@maximum-health.de';

  /**
   * Zeigt eine Fehlermeldung unter dem Feld an.
   */
  const showError = (field, message) => {
    field.closest('.form-group').classList.add('form-group--error');
    let errorEl = field.parentElement.querySelector('.form-group__error-msg');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form-group__error-msg';
      field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  };

  /**
   * Entfernt die Fehlermeldung eines Feldes.
   */
  const clearError = (field) => {
    field.closest('.form-group').classList.remove('form-group--error');
    const errorEl = field.parentElement.querySelector('.form-group__error-msg');
    if (errorEl) {
      errorEl.textContent = '';
    }
  };

  /**
   * Validiert ein einzelnes Feld. Gibt true zurueck wenn valide.
   */
  const validateField = (field) => {
    const value = field.value.trim();

    // Pflichtfeld-Pruefung
    if (field.hasAttribute('required') && value === '') {
      showError(field, 'Dieses Feld ist erforderlich.');
      return false;
    }

    // E-Mail-Format
    if (field.type === 'email' && value !== '' && !EMAIL_REGEX.test(value)) {
      showError(field, 'Bitte eine gueltige E-Mail-Adresse eingeben.');
      return false;
    }

    clearError(field);
    return true;
  };

  /**
   * Validiert alle Felder im Formular.
   */
  const validateForm = () => {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;

    fields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  };

  /**
   * Baut den mailto-Link aus den Formulardaten.
   */
  const buildMailtoLink = () => {
    const formData = new FormData(form);
    const formName = form.id === 'gutschein-form' ? 'Gutschein-Anfrage' : 'Sparpaket-Anfrage';

    let bodyLines = [];
    for (const [key, value] of formData.entries()) {
      bodyLines.push(`${key}: ${value}`);
    }

    const subject = encodeURIComponent(formName + ' - maximum-health.de');
    const body = encodeURIComponent(bodyLines.join('\n'));

    return `mailto:${MAILTO_ADDRESS}?subject=${subject}&body=${body}`;
  };

  // Live-Validierung bei Eingabe
  form.querySelectorAll('input, textarea, select').forEach((field) => {
    field.addEventListener('blur', () => {
      validateField(field);
    });

    field.addEventListener('input', () => {
      if (field.closest('.form-group').classList.contains('form-group--error')) {
        validateField(field);
      }
    });
  });

  // Formular-Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    window.location.href = buildMailtoLink();
  });
});
