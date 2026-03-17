# TASKS — Maximum Health Codebase-Analyse

Erstellt: 2026-03-17

---

## Sync-Probleme

- [x] **Sync / High** — `scripts/check-sync.sh` prueft nur Root-Level HTML-Dateien (`*.html`), nicht `blog/*.html`. Das bedeutet die 8 Blog-Artikel werden nie auf Sync-Abweichungen geprueft.
- [x] **Sync / Medium** — NAV-Block: index.html verwendet `#therapien` (Ankerlinks), alle Sub-Seiten verwenden `index.html#therapien`. Das ist *by design*, aber der check-sync.sh meldet es als Fehler. Skript muss index.html als Sonderfall behandeln oder die Shared-Block-Strategie muss ueberarbeitet werden. ENTSCHEIDUNG: NAV/FOOTER in index.html auf `index.html#`-Praefixe umstellen, damit sie identisch mit Sub-Seiten sind. So funktionieren Ankerlinks weiterhin korrekt, und die Sync-Pruefung wird konsistent.

## SEO-Probleme

- [x] **SEO / High** — `index.html` fehlt: `<link rel="canonical">`, Open Graph Tags, Twitter Card Tags.
- [x] **SEO / Medium** — `gutschein.html` fehlt: `<meta name="description">`, `<link rel="canonical">`, OG/Twitter-Tags.
- [x] **SEO / Medium** — `sparpaket.html` fehlt: `<meta name="description">`, `<link rel="canonical">`, OG/Twitter-Tags.
- [x] **SEO / Medium** — `impressum.html` fehlt: `<meta name="description">`, `<link rel="canonical">`.
- [x] **SEO / Medium** — `datenschutz.html` fehlt: `<meta name="description">`, `<link rel="canonical">`.
- [x] **SEO / Low** — `index.html`: JSON-LD Structured Data (LocalBusiness) fehlt.

## Accessibility-Probleme

- [x] **A11y / Medium** — Hamburger-Button (`navbar__hamburger`) hat kein `aria-expanded` Attribut. Screenreader wissen nicht, ob das Menu offen oder geschlossen ist.
- [x] **A11y / Medium** — Mobile Menu: Escape-Taste schliesst das Menu nicht. Keyboard-Nutzer koennen das Fullscreen-Overlay nicht per Tastatur schliessen. Fix: `keydown`-Handler fuer Escape in `navbar.js` ergaenzt, Focus kehrt zum Hamburger-Button zurueck.
- [x] **A11y / Medium** — `index.html` und `blog.html`: Seiteninhalt nicht in `<main>` gewrappt. Screenreader koennen den Hauptinhalt nicht als solchen identifizieren. Fix: `<main>`/`</main>` um den Content-Bereich (zwischen NAV und FOOTER) ergaenzt.
- [x] **A11y / Medium** — Alle 8 Blog-Artikel: Inhalt nicht in `<main>` gewrappt. Fix: `<main>`/`</main>` um header + article + cta + related Sections ergaenzt.

## Funktionale Probleme

- [x] **Funktion / Medium** — `form-handler.js`: Select-Felder nutzen `change`-Event, nicht `input`. Live-Validierung bei Select-Aenderung funktionierte nicht, Fehlermeldung blieb stehen. Fix: Event-Listener nutzt jetzt `change` fuer Select-Felder.
- [x] **Funktion / High** — `smooth-scroll.js`: Nach Umstellung der NAV/FOOTER-Links auf `index.html#`-Format greift der Selektor `a[href^="#"]` nicht mehr auf der Startseite. Smooth-Scrolling war komplett deaktiviert. Fix: Selektor auf `a[href*="#"]` erweitert mit intelligenter Same-Page-Erkennung via URL-Vergleich.

## Sicherheit

- [x] **Sicherheit / Medium** — Formulare (`gutschein.html`, `sparpaket.html`) ohne Honeypot-Feld. Spam-Bots koennen Formulare trivial abschicken. Fix: Verstecktes Honeypot-Feld `name="website"` ergaenzt, `form-handler.js` prueft und ignoriert das Feld bei Validierung und mailto-Bau.

## Performance

- [x] **Performance / Medium** — Kein `loading="lazy"` auf Bildern unterhalb des Viewports. Blog-Card-Bilder, Footer-Logos, Therapeuten-Bild und Author-Avatare werden alle sofort geladen. Fix: `loading="lazy"` fuer alle Below-the-fold Bilder ergaenzt (~50 img-Tags). Navbar-Logo und Hero-Bilder bleiben ohne lazy (above the fold).

## Links / Sicherheit

- [x] **Links / Low** — Externe Links (`target="_blank"`) haben `rel="noopener"` aber fehlen `noreferrer`. Best Practice ist `rel="noopener noreferrer"`. Betrifft 23 Links in 14 Dateien (Instagram, Calendly, Google Maps). Fix: `noreferrer` ueberall ergaenzt.

## CSS

- [x] **CSS / Low** — `.form-group__error-msg` fehlt `display: block`. Das Element wird als `<span>` erstellt (default inline), wodurch `margin-top: 8px` ignoriert wird. Fix: `display: block` ergaenzt in `forms.css`.

## Bild-Probleme

- [ ] **Quality / Low** — `images/logo-footer.png` ist 3.4 MB gross (wird aktuell nicht verwendet — `logo-footer-white.png` wird referenziert). Kann geloescht oder komprimiert werden.
- [ ] **Quality / Low** — `images/therapist.png` ist 452 KB. Koennte als WebP/AVIF mit Fallback bereitgestellt werden fuer bessere Performance.
- [x] **Quality / Low** — Hero-Section bei deaktiviertem JavaScript: Hero-Bild und Text-Elemente starten mit `opacity: 0` und werden erst durch `parallax.js` via `hero--ready`-Klasse sichtbar. Bei deaktiviertem JS bleibt alles unsichtbar. Fix: `<noscript><style>` Block in `index.html` ergaenzt, der Hero-Elemente sofort mit `opacity: 1` und ohne Transform/Animation anzeigt.

## Accessibility — Runde 3

- [x] **A11y / High** — Reveal-Animationen (`.reveal`) starten mit `opacity: 0`. Bei `prefers-reduced-motion: reduce` waren Elemente trotzdem unsichtbar bis JS sie per IntersectionObserver einblendete. Fix: CSS-Rule `@media (prefers-reduced-motion: reduce)` setzt `.reveal` auf `opacity: 1; transform: none`. JS `reveal.js` setzt bei reduced-motion sofort alle Elemente auf `reveal--visible` ohne Observer.
- [x] **A11y / Medium** — Therapie-Cards mit `data-reveal-from` hatten eigene opacity/transform-Regeln, die nicht vom reduced-motion Reset erfasst wurden. Fix: Eigener `@media (prefers-reduced-motion: reduce)` Block in `therapies.css`.
- [x] **A11y / Medium** — Fehlende `:focus-visible` Styles fuer Links, Navbar-Links, Hamburger-Button, Mobile-Menu-Links, Footer-Social-Links. Keyboard-Navigation ohne sichtbaren Fokus-Indikator. Fix: `:focus-visible` mit `outline: 2px solid var(--color-gold)` fuer `a`-Tags (base.css), Hamburger/Navbar/Mobile-Menu (navbar.css), Social-Links (footer.css).
- [x] **A11y / Medium** — Footer-Links (`footer__col-links a`) nutzen `--color-text-dim` (Kontrast 3.8:1 auf bg-deep) — unter WCAG AA Minimum (4.5:1). Fix: Umgestellt auf `--color-text-muted` (6.1:1).
- [x] **A11y / Medium** — Hero-Portrait-Bild hat `alt=""` (leerer Alt-Text = dekorativ), ist aber ein bedeutungsvolles Bild des Therapeuten. Fix: Beschreibender Alt-Text ergaenzt.

## Cookie-Banner — Runde 3

- [x] **Robustheit / Medium** — `cookie-banner.js` greift direkt auf `localStorage` zu. In Safari Private Browsing und anderen restriktiven Umgebungen wirft `localStorage.getItem()`/`setItem()` Exceptions, was das Script zum Absturz bringt und den Cookie-Banner dauerhaft unsichtbar macht. Fix: localStorage-Zugriffe in try/catch gewrappt mit graceful Fallback.

## CSS-Variablen — Runde 3

- [x] **Quality / Medium** — `#E0BC5A` (Gold-Hover-Farbe) als Magic Number an 13+ Stellen im CSS verwendet statt als Design-Token. Inkonsistenz: `contact.css` nutzte `#e0b53e` (leicht abweichend). Fix: `--color-gold-light: #E0BC5A` in `variables.css` definiert, an Stellen mit eigenstaendiger Farbverwendung (buttons, navbar, contact, spirit) durch Variable ersetzt. Gradient-Stops belassen, da CSS-Variablen in Gradients Browser-Kompatibilitaet einschraenken koennen.
- [ ] **Quality / Low** — 9 CSS-Variablen definiert aber nie verwendet: `--color-sage-deep`, `--color-sage-glow`, `--color-text-dark`, `--color-success`, `--ease-in-out`, `--duration-slow`, `--transition-slow`, `--shadow-sm`, `--grain-opacity`. Koennen zukuenftig benoetigt werden, daher nur dokumentiert.

## Print-Styles — Runde 3

- [x] **Quality / Medium** — Keine `@media print` Styles. Fuer eine Praxiswebsite relevant (Kontaktseite drucken, Impressum). Fix: Print-Stylesheet in `base.css` ergaenzt — entfernt Navigation, Cookie-Banner, Parallax-Layer, dekorative Overlays. Setzt weissen Hintergrund, schwarzen Text, zeigt URLs bei externen Links, verhindert Seitenumbrueche innerhalb von Karten.

## Code-Qualitaet

- [x] **Quality / Low** — `index.html` Zeile 572: Inline-Style `style="margin-top: 48px;"` statt CSS-Klasse. Fix: Neue CSS-Klasse `.home-blog__cta` in `blog.css`.

## Runde 4 — Integritaets- und SEO-Pruefung

### Behoben

- [x] **SEO / Medium** — Kein Favicon auf der gesamten Website. Weder `<link rel="icon">` in HTML noch eine Favicon-Datei im Dateisystem. Suchmaschinen zeigen kein Site-Icon in den Ergebnissen, Browser zeigen ein generisches Tab-Icon. Fix: SVG-Favicon (`images/favicon.svg`) erstellt mit goldenem "M" auf dunklem Hintergrund. `<link rel="icon" type="image/svg+xml">` in alle 14 HTML-Dateien eingefuegt.
- [x] **UX / Medium** — Keine 404-Fehlerseite vorhanden. Besucher sehen bei nicht existierenden URLs die Standard-Fehlerseite des Servers. Fix: `404.html` erstellt mit Shared-Blocks (NAV/FOOTER/COOKIE), Design-konformem Layout und Link zur Startseite. `<meta name="robots" content="noindex">` gesetzt.
- [x] **Funktion / Medium** — `form-handler.js`: Submit-Button wird nach Absenden nicht deaktiviert. Doppel-Klick kann zu mehrfachem Oeffnen des Mail-Clients fuehren. Fix: Button wird nach Submit sofort disabled mit Text "Wird gesendet...", nach 2 Sekunden wieder aktiviert (da mailto externes Programm oeffnet).
- [x] **SEO / Medium** — `sitemap.xml` hatte keine `<lastmod>` Eintraege. Suchmaschinen koennen so nicht erkennen, wann Seiten zuletzt aktualisiert wurden. Fix: `<lastmod>` fuer alle 14 Seiten ergaenzt, basierend auf den article:published_time Meta-Tags der Blog-Artikel und dem Launch-Datum der statischen Seiten.
- [x] **SEO / Medium** — Keine AggregateRating im LocalBusiness JSON-LD. Google Reviews-Section (5.0 / 12 Bewertungen) war nur visuell, nicht als Structured Data. Fix: `aggregateRating` mit `ratingValue: 5.0` und `ratingCount: 12` zum HealthAndBeautyBusiness JSON-LD hinzugefuegt.

### Verifiziert — kein Handlungsbedarf

- [x] **Links / Pruefung** — Alle internen Links (href) in 14 HTML-Dateien geprueft: Alle Zieldateien existieren. Alle Anchor-IDs (#therapien, #coaching, #ueber-uns, #preise, #kontakt, #spirit, #hero) existieren in den Zieldateien.
- [x] **Assets / Pruefung** — Alle img-src und script-src Pfade in 14 HTML-Dateien geprueft: Alle referenzierten Dateien existieren (Bilder, CSS, JS).
- [x] **CSS / Pruefung** — Alle in HTML verlinkten CSS-Dateien existieren (variables, reset, base, layout, 12 Komponenten-CSS-Dateien).
- [x] **JS / Pruefung** — Alle in HTML verlinkten JS-Dateien existieren (cookie-banner, navbar, form-handler, smooth-scroll, reveal, parallax).
- [x] **Duplicate / Pruefung** — Alle H1-Tags und Title-Tags sind einzigartig ueber alle 14 Seiten.
- [x] **Nav / Pruefung** — Mobile-Menu: Overflow wird bei closeMenu() korrekt zurueckgesetzt (body.style.overflow = ''). Bei Seitenwechsel wird ohnehin eine neue Seite geladen.
- [x] **Sync / Pruefung** — check-sync.sh meldet alle 15 Seiten (7 Root inkl. 404 + 8 Blog) als synchron.
- [x] **hreflang / Pruefung** — Nur deutschsprachige Seite, `<html lang="de">` korrekt gesetzt. hreflang-Tag nur bei mehrsprachigen Seiten notwendig.
- [x] **Scroll / Pruefung** — Browser scrollt bei Seitenwechsel standardmaessig nach oben. Kein Problem.

### Nur dokumentiert (kein Fix, Feature-Request)

- [ ] **DSGVO / Low** — Cookie-Banner bietet nur Accept/Reject, keine granulare Kategorien-Kontrolle (notwendig vs. Analytics). Datenschutzseite erwaehnt Google Analytics mit Cookie-Banner-Einwilligung, aber es gibt kein GA-Script auf der Website. Fuer vollstaendige DSGVO-Konformitaet waere ein Consent-Management mit Kategorien besser — oder die Datenschutzseite muesste den GA-Passus entfernen, falls GA nicht genutzt wird.
- [ ] **SEO / Low** — OG-Images der Blog-Seiten referenzieren `placeholder-blog.svg`. Social-Media-Plattformen koennen SVGs nicht als Preview-Bild rendern. Wird beim Ersetzen durch echte Blog-Bilder automatisch geloest.

## Runde 5 — Abschlusspruefung

### Behoben

- [x] **Quality / Low** — Hero-Section noscript Fallback: Bei deaktiviertem JS blieben Hero-Elemente mit `opacity: 0` unsichtbar. Fix: `<noscript><style>` Block in `index.html` setzt Hero-Bild und Text-Elemente auf sofort sichtbar (`opacity: 1`, keine Transform/Animation).
- [x] **A11y / Low** — Cookie-Banner Buttons (`cookie-accept`, `cookie-reject`) hatten kein explizites `type` Attribut. Default `type="submit"` kann in manchen Kontexten unerwartetes Verhalten ausloesen. Fix: `type="button"` in allen 15 HTML-Dateien ergaenzt (SHARED:COOKIE Block).
- [x] **A11y / Low** — Hamburger-Button (`navbar__hamburger`) hatte kein explizites `type` Attribut. Fix: `type="button"` in allen 15 HTML-Dateien ergaenzt (SHARED:NAV Block).
- [x] **Forms / Low** — PLZ-Ort-Eingabefelder in `gutschein.html` und `sparpaket.html` hatten kein `autocomplete` Attribut. Browser koennen so keine Adressdaten vorausfuellen. Fix: `autocomplete="address-level1"` ergaenzt.

### Verifiziert — kein Handlungsbedarf

- [x] **OG-Images / Pruefung** — Blog-Seiten referenzieren `placeholder-blog.svg` als og:image. SVGs funktionieren nicht auf Social Media. Aber ohne echte Bilder kann das nicht gefixt werden — bereits als "SEO / Low" dokumentiert.
- [x] **DSGVO / Pruefung** — Cookie-Banner speichert nur localStorage-Eintrag bei Accept/Reject. Es wird kein Tracking-Script geladen, obwohl die Datenschutzseite Google Analytics erwaehnt. Kein funktionales DSGVO-Problem, aber inhaltliche Inkonsistenz in der Datenschutzerklaerung.
- [x] **CSS-Imports / Pruefung** — Alle 5 CSS-Schichten (variables, reset, base, layout, Komponenten) werden korrekt geladen. Keine fehlenden oder doppelten Importe. Jede Seite laedt genau die Komponenten-CSS die sie braucht.
- [x] **Blog Pagination / Pruefung** — blog.html zeigt alle 8 Artikel auf einer Seite. Bei dieser Groesse ist keine Pagination noetig. Grid-Layout passt sich responsiv an (3 Spalten → 2 → 1).
- [x] **Breadcrumbs / Pruefung** — Alle Blog-Artikel und blog.html haben sichtbare HTML-Breadcrumbs UND JSON-LD BreadcrumbList Structured Data. Breadcrumb-Navigation ist visuell und semantisch vollstaendig.
- [x] **Interne Verlinkung / Pruefung** — Blog-Artikel verlinken intensiv untereinander (z.B. Schroepftherapie → Rueckenschmerzen, Nackenverspannungen, Durchblutung, Faszien, Stress). SEO-freundliches internes Verlinkungsnetzwerk ist vorhanden.
- [x] **Related Posts / Pruefung** — Alle Blog-Artikel haben einen "Weitere Artikel" Abschnitt mit 2 verwandten Artikeln als Blog-Cards.
- [x] **Kontakt-Sektion / Pruefung** — Adresse (Hasloher Weg 3, 25474 Boenningstedt), E-Mail und Termininfo sind visuell im HTML dargestellt. Adresse/Telefon/Email sind zusaetzlich in JSON-LD (HealthAndBeautyBusiness) als Structured Data hinterlegt.
- [x] **CSS Transitions / Pruefung** — Transitions nutzen ueberwiegend konsistent `var(--transition)` / `var(--transition-fast)` aus `variables.css`. CTA-Banners verwenden bewusst verschiedene Hardcoded-Dauern (0.4s-0.6s) fuer gestaffelte Animation — gestalterische Entscheidung, kein Bug.
- [x] **Button type / Pruefung** — Alle `<button>` Elemente haben jetzt ein explizites `type` Attribut: `type="submit"` fuer Formular-Buttons, `type="button"` fuer Hamburger und Cookie-Banner.
- [x] **Input autocomplete / Pruefung** — Alle Formularfelder haben sinnvolle `autocomplete` Werte: `name`, `family-name`, `email`, `tel`, `street-address`, `address-level1`. Empfaenger-Vorname in Gutschein-Formular hat korrekterweise `autocomplete="off"` (anderer Name als der eigene).
- [x] **Sync / Pruefung** — check-sync.sh bestaetigt: Alle 15 Seiten (7 Root + 8 Blog) haben identische Shared-Blocks nach den Aenderungen in Runde 5.

### Nur dokumentiert (kein Fix, braucht Content/Entscheidung)

- [ ] **Quality / Low** — `images/logo-footer.png` (3.4 MB) wird nicht referenziert. Kann geloescht werden.
- [ ] **Quality / Low** — `images/therapist.png` (452 KB) koennte als WebP mit Fallback bereitgestellt werden.
- [ ] **Quality / Low** — 9 definierte aber nie verwendete CSS-Variablen (Design-Token-Reserve).
- [ ] **DSGVO / Low** — Datenschutzerklaerung erwaehnt Google Analytics, aber kein GA-Script existiert.
- [ ] **SEO / Low** — OG-Images referenzieren SVG-Platzhalter statt echte Bilder.

---

## LOOP_COMPLETE

Die Codebase ist nach 5 Analyserunden in produktionsreifem Zustand. Begruendung:

**Keine kritischen oder hohen Probleme offen.** Alle Sicherheits-, Funktions- und A11y-Probleme wurden behoben.

**Verbleibende offene Punkte sind ausschliesslich Low-Priority** und betreffen:
- Asset-Optimierung (Bildkompression) — braucht echte Bilder
- DSGVO-Textkorrektur — juristische Entscheidung
- Ungenutztes Bild loeschen — kosmetisch
- Ungenutzte CSS-Variablen — Reserve fuer zukuenftige Features

**Was wurde in 5 Runden behoben:**
- 7 SEO-Probleme (Meta-Tags, Canonical, JSON-LD, Favicon, Sitemap, AggregateRating)
- 9 Accessibility-Probleme (ARIA, Focus-Visible, Kontrast, prefers-reduced-motion, noscript)
- 4 funktionale Bugs (Smooth-Scroll, Select-Validierung, Doppel-Submit, Live-Validierung)
- 3 Sicherheitsverbesserungen (Honeypot, noreferrer, localStorage try/catch)
- 2 Sync-Probleme (check-sync.sh Blog-Support, NAV-Block-Konsistenz)
- 2 Performance-Verbesserungen (lazy-loading, CSS-Klasse statt Inline-Style)
- 3 HTML-Qualitaet (button type, autocomplete, noscript Fallback)
- 1 Print-Stylesheet, 1 404-Seite, 1 CSS-Token-Konsolidierung, 1 Error-Display-Fix
