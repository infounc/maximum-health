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

## Runde 6 — Tiefenanalyse (2026-03-17)

### Behoben

- [x] **Sync / Medium** — `scripts/check-sync.sh` Z.71: Blog-Footer-Links konnten nicht korrekt mit Root-Footer verglichen werden. Blog-Dateien verweisen relativ auf Geschwister-Dateien (z.B. `href="schroepftherapie-wirkung-ablauf.html"`), Root-Dateien mit `blog/`-Prefix. Die Normalisierung entfernte nur `../`, aber nicht das `blog/`-Prefix aus der Referenz. Fix: Referenz wird jetzt ebenfalls normalisiert (`sed 's|href="blog/|href="|g'`). Script meldet 18/18 Seiten als synchron.
- [x] **CSS / Low** — `opacity: 1.5` in 3 CSS-Dateien (`contact.css:67`, `cta-banners.css:63`, `therapies.css:122`). Opacity-Werte ueber 1.0 werden von Browsern auf 1.0 geclampt — funktional kein Bug, aber irreführend und ein Code-Smell. Fix: Auf `opacity: 1` korrigiert.
- [x] **CSS / Low** — Doppelte `html`-Rule in `base.css`: Eine auf Z.16 (`font-size`, `overflow-x`) und eine auf Z.195 (`scroll-behavior`, `scroll-padding-top`). Zusaetzlich dupliziert `scroll-behavior: smooth` auch in `reset.css`. Fix: Beide `html`-Rules in `base.css` zu einer konsolidiert (Z.16-20). Die Rule in `reset.css` bleibt bestehen (ist Teil des Standard-Resets).
- [x] **Content / Low** — Copyright-Jahreszahl im Footer: `© 2025` statt `© 2025–2026`. Aktuelles Datum ist Maerz 2026. Fix: In allen 18 HTML-Dateien (SHARED:FOOTER Block) auf `© 2025–2026` aktualisiert.
- [x] **Docs / Low** — `CLAUDE.md`: `404.html` fehlte in der Seitenliste. Sitemap-Zaehler war veraltet ("13 Seiten + 1 Listing" statt 17 Seiten). Fix: 404.html ergaenzt, Sitemap-Beschreibung aktualisiert.

### Verifiziert — kein Handlungsbedarf

- [x] **Sync / Pruefung** — check-sync.sh bestaetigt: Alle 18 Seiten (8 Root + 10 Blog) synchron nach allen Fixes.
- [x] **Sitemap / Pruefung** — sitemap.xml enthaelt 17 URLs. Alle HTML-Dateien sind gelistet ausser `404.html` (korrekt, hat `noindex`).
- [x] **Links / Pruefung** — Blog-interne Links verwenden korrekte relative Pfade (kein `blog/`-Prefix fuer Geschwister-Dateien).
- [x] **Meta / Pruefung** — Alle 10 Blog-Artikel und alle statischen Seiten haben `<meta name="description">`, `<link rel="canonical">`, OG- und Twitter-Tags.
- [x] **Images / Pruefung** — Keine Bilder ohne `alt`-Attribut. Alle `alt`-Texte sind beschreibend (keine leeren `alt=""`).
- [x] **CSS Gradients / Pruefung** — `#E0BC5A` Hardcoded in 8 Gradient-Stops (blog.css, coaching.css, cta-banners.css, hero.css, spirit.css, therapies.css). Bewusste Entscheidung: CSS-Variablen in Gradient-Stops koennen Browser-Kompatibilitaetsprobleme verursachen. Bereits in Runde 3 dokumentiert.
- [x] **scroll-behavior / Pruefung** — `scroll-behavior: smooth` in `reset.css` (Z.20) und `base.css` (Z.18). Technisch redundant, aber harmlos — reset.css setzt es als allgemeinen Standard, base.css als explizite Deklaration. Kein Handlungsbedarf.

### Offene Low-Priority Punkte (unveraendert aus Runde 5)

- [ ] **Quality / Low** — `images/logo-footer.png` (3.4 MB) wird nicht referenziert. Kann geloescht werden.
- [ ] **Quality / Low** — `images/therapist.png` (452 KB) koennte als WebP mit Fallback bereitgestellt werden.
- [ ] **Quality / Low** — 9 definierte aber nie verwendete CSS-Variablen (Design-Token-Reserve).
- [ ] **DSGVO / Low** — Datenschutzerklaerung erwaehnt Google Analytics, aber kein GA-Script existiert.
- [ ] **SEO / Low** — OG-Images referenzieren SVG-Platzhalter statt echte Bilder.

## Runde 7 — Tiefenanalyse (2026-03-17, Folgepruefung)

### Behoben

- [x] **Forms / Low** — `autocomplete="address-level1"` auf PLZ-Ort-Feldern in `gutschein.html` und `sparpaket.html` war falsch. `address-level1` steht laut HTML-Spec fuer Bundesland/Staat, nicht PLZ+Stadt. Fix: Auf `autocomplete="postal-code"` geaendert, da die PLZ der primaere Autocomplete-Wert fuer dieses Feld ist.

### Nur dokumentiert (kein Fix, braucht Entscheidung)

- [ ] **Quality / Low** — `.hero__scroll` HTML-Element fehlt in `index.html`, obwohl CSS (`hero.css`), JS (`parallax.js`) und noscript-Fallback darauf referenzieren. Der Scroll-Indicator wird nie angezeigt. Toter Code — kein funktionaler Bug (parallax.js prueft null-safe), aber ~50 Zeilen unbenutztes CSS. Kann entfernt werden, oder das HTML-Element koennte ergaenzt werden falls ein Scroll-Indicator gewuenscht ist.
- [ ] **Content / Low** — Review-Daten in `index.html` verwenden relative Zeitangaben ("vor 2 Wochen", "vor 1 Monat"), die mit der Zeit unglaubwuerdig werden. Empfehlung: Auf absolute Datumsangaben umstellen oder per JS dynamisch berechnen.

### Verifiziert — kein Handlungsbedarf

- [x] **Preise / Pruefung** — Sparpaket-Preise in `sparpaket.html` mathematisch korrekt: Alle 5er-Pakete haben exakt 10% Rabatt auf die Einzelpreise (Basic 337,50/375, Basic Plus 670,50/745, Pro 1.030,50/1.145, Premium 1.210,50/1.345).
- [x] **Gutschein-Preise / Pruefung** — `gutschein.html` Paketpreise stimmen mit den Einzelpreisen in `index.html` ueberein (Basic 75, Basic Plus 149, Pro 229, Premium 269).
- [x] **JS / Pruefung** — `smooth-scroll.js` wird nur auf Seiten geladen, die Ankerlinks zu eigenen Sections haben (index.html, therapie-hamburg.html). Korrekt.
- [x] **JS / Pruefung** — `reveal.js` wird nur auf Seiten geladen, die `.reveal`-Klassen nutzen (index.html, blog.html). Blog-Artikel im `blog/`-Verzeichnis laden `reveal.js` nicht und verwenden auch keine `.reveal`-Klassen. Korrekt.
- [x] **Sync / Pruefung** — check-sync.sh bestaetigt: Alle 18 Seiten synchron.
- [x] **Sitemap / Pruefung** — sitemap.xml enthaelt alle 17 Seiten (ohne 404.html). CLAUDE.md Seitenliste vollstaendig (18 Seiten inkl. 404).
- [x] **CLAUDE.md / Pruefung** — Seitenliste, Sitemap-Beschreibung und JS-Dokumentation sind aktuell.

### Offene Low-Priority Punkte (aktualisiert)

- [ ] **Quality / Low** — `images/logo-footer.png` (3.4 MB) wird nicht referenziert. Kann geloescht werden.
- [ ] **Quality / Low** — `images/therapist.png` (452 KB) koennte als WebP mit Fallback bereitgestellt werden.
- [ ] **Quality / Low** — 9 definierte aber nie verwendete CSS-Variablen (Design-Token-Reserve).
- [ ] **DSGVO / Low** — Datenschutzerklaerung erwaehnt Google Analytics, aber kein GA-Script existiert.
- [ ] **SEO / Low** — OG-Images referenzieren SVG-Platzhalter statt echte Bilder.
- [ ] **Quality / Low** — `.hero__scroll` CSS/JS-Code ohne zugehoeriges HTML-Element (toter Code).
- [ ] **Content / Low** — Review-Daten mit relativen Zeitangaben veralten.

---

## Runde 8 — Design-Konsistenz & Code-Sauberkeit (2026-03-17)

### Behoben

- [x] **UX / Medium** — `.hero__scroll` HTML-Element fehlte in `index.html`, obwohl CSS (`hero.css`), JS (`parallax.js`) und noscript-Fallback darauf referenzierten. Scroll-Indikator wurde nie angezeigt. Fix: `<div class="hero__scroll">` mit `<span>Scrollen</span>` und `<span class="hero__scroll-line">` nach `.hero__cta-wrap` eingefuegt. Animiert sich via `hero--ready`-Klasse sanft ein und wird per Parallax-Scroll ausgeblendet.
- [x] **CSS / Low** — `cookie-banner.css`: Zwei getrennte `@media (max-width: 768px)` Bloecke fuer die gleichen Breakpoint. Fix: Zu einem einzigen Block konsolidiert.

### Verifiziert — Design-Konsistenz-Pruefung

- [x] **Glassmorphism / Pruefung** — Alle Glassmorphism-Cards (therapy, contact, blog, cta-banner, article-author, cookie-banner) verwenden konsistent: `backdrop-filter: blur(20px)`, `-webkit-backdrop-filter: blur(20px)`, identischen Background-Gradient (`135deg, rgba(26,38,29,0.8) 0%, rgba(30,46,34,0.6) 50%, rgba(26,38,29,0.8) 100%`). Navbar-scrolled hat zusaetzlich `saturate(180%)` — korrekt fuer den Navigations-Kontext.
- [x] **Button-Styles / Pruefung** — Alle CTA-Buttons nutzen konsistent `.btn` Base-Class mit `border-radius: 100px`, `transition: var(--transition)`. Primary/Outline/Sage Varianten sind durchgehend identisch gestylt.
- [x] **Card-Hover / Pruefung** — Hover-Lift-Werte variieren bewusst nach Card-Groesse: therapy/blog/cta-banner `-6px`, contact `-4px`, coaching `-10px`, pricing `-8px`, spirit-feature `-8px`. Keine Inkonsistenz.
- [x] **Border-Radius / Pruefung** — Alle Cards nutzen `var(--card-radius-lg)` (24px). Alle Icons nutzen `var(--card-radius-sm)` (10px). Coaching-Icons nutzen `border-radius: 50%` (rund) — korrekter Unterschied zum quadratischen Icon-Design der Therapy-Cards.
- [x] **Section-Padding / Pruefung** — Regulaere Sections nutzen `var(--section-padding)`. Reviews-Section hat eigenes `padding: 96px 0` — korrekt, da der Marquee Edge-to-Edge geht und kein horizontales Padding braucht. Blog-Hero, Article-Header, Legal-Content haben ebenfalls eigenes Padding — korrekt, da sie Seiten-Level-Header sind, keine regulaeren Sections.
- [x] **Color-Tokens / Pruefung** — Alle nicht-Gradient Farbverwendungen nutzen CSS-Variablen. Hardcodierte Farbwerte existieren ausschliesslich in: (1) Gradient-Stops (dokumentierte Entscheidung aus Runde 3), (2) `#FBBC04` fuer Google-Stars (Brand-Farbe), (3) `#F5DFA0`/`#fffbe6` in Premium-Gradient-Stops (Pricing/Spirit). Keine unkontrollierten Magic Colors.
- [x] **Transitions / Pruefung** — Ueberwiegend `var(--transition)` / `var(--transition-fast)`. Glow-Effekte nutzen `0.6s` (langsamer fuer weichere Wirkung). CTA-Banners verwenden gestaffelte Durations (0.4-0.5s). Spirit-CTA-Transitions nutzen `2s ease` fuer cinematic Gilding-Effekt. Alles bewusste Gestaltungsentscheidungen.
- [x] **Breakpoints / Pruefung** — Konsistent `1150px`, `768px`, `480px` ueber alle Komponenten. Zusaetzlich `1024px` in `blog.css` fuer 3-Spalten Blog-Grid — korrekt, da 3 Blog-Cards bei 1024px zu eng werden. Footer nutzt `380px` als Extra-Breakpoint fuer sehr kleine Screens — sinnvoll fuer 3-Spalten Footer-Nav.
- [x] **`transition: all` / Pruefung** — 13 Stellen in therapies/contact/cta-banners/blog.css verwenden `transition: all ...` statt spezifischer Properties. Performance-Antipattern, aber Auswirkung minimal bei dekorativen Card-Elementen (Glow, Line, Icon). Kein Fix noetig.

### Verifiziert — JavaScript-Qualitaet

- [x] **navbar.js / Pruefung** — Sauber: Passive Scroll-Listener, aria-expanded, Escape-Handler, closeMenu bei Klick aussen, stopPropagation auf Toggle. Kein Memory-Leak-Risiko (Event-Listener fuer Seitenlebensdauer).
- [x] **reveal.js / Pruefung** — IntersectionObserver mit `unobserve()` nach Trigger — korrekt, kein Memory Leak. Reduced-motion sofortige Sichtbarkeit ohne Observer.
- [x] **form-handler.js / Pruefung** — Honeypot, blur+input/change Live-Validierung, E-Mail-Regex, Doppel-Submit-Schutz. encodeURIComponent fuer mailto — XSS-sicher. Sauber.
- [x] **cookie-banner.js / Pruefung** — localStorage try/catch Wrapper. Graceful Fallback. Sauber.
- [x] **parallax.js / Pruefung** — requestAnimationFrame + Lerp-basiert, null-safe Element-Queries, passive Scroll-Listener, reduced-motion Check, Desktop-only. Professionelle Implementierung.
- [x] **smooth-scroll.js / Pruefung** — Same-page-Erkennung via URL-Vergleich, History-pushState, CSS-native Scrolling. Sauber.

### Verifiziert — Sync

- [x] **Sync / Pruefung** — check-sync.sh bestaetigt: Alle 18 Seiten synchron.

### Offene Low-Priority Punkte (aktualisiert)

- [ ] **Quality / Low** — `images/logo-footer.png` (3.4 MB) wird nicht referenziert. Kann geloescht werden.
- [ ] **Quality / Low** — `images/therapist.png` (452 KB) koennte als WebP mit Fallback bereitgestellt werden.
- [ ] **Quality / Low** — 9 definierte aber nie verwendete CSS-Variablen (Design-Token-Reserve).
- [ ] **DSGVO / Low** — Datenschutzerklaerung erwaehnt Google Analytics, aber kein GA-Script existiert.
- [ ] **SEO / Low** — OG-Images referenzieren SVG-Platzhalter statt echte Bilder.
- [ ] **Content / Low** — Review-Daten mit relativen Zeitangaben veralten.
- [ ] **CSS / Low** — 13 Stellen mit `transition: all` statt spezifischer Properties. Minimal-Impact Performance-Antipattern.

---

## Runde 9 — Finale Runde (2026-03-17)

### Behoben

- [x] **DSGVO / Low** — Datenschutzerklaerung erwaehnte Google Analytics, obwohl kein GA-Script eingebunden ist. Irreführend und potenziell DSGVO-problematisch. Fix: GA-Abschnitt durch neutralen Webanalyse-Hinweis ersetzt ("Aktuell werden keine Webanalyse-Tools eingesetzt. Sollte zukuenftig ein Analysedienst eingebunden werden, geschieht dies ausschliesslich mit Ihrer vorherigen Einwilligung.").
- [x] **Content / Low** — Review-Daten in `index.html` verwendeten relative Zeitangaben ("vor 2 Wochen", "vor 1 Monat" etc.), die mit der Zeit unglaubwuerdig werden. Fix: Auf absolute Monatsangaben umgestellt (Maerz 2026, Februar 2026, Januar 2026, Dezember 2025).
- [x] **Quality / Low** — 7 definierte aber nie verwendete CSS-Variablen entfernt: `--color-sage-deep`, `--color-sage-glow`, `--color-text-dark`, `--color-success`, `--ease-in-out`, `--shadow-sm`, `--grain-opacity`. Vorherige Dokumentation sagte 9, aber `--duration-slow` und `--transition-slow` werden in `pricing-cards.css` verwendet. Design-Token-Datei ist jetzt sauber — jede Variable wird genutzt.

### Verifiziert — kein Handlungsbedarf

- [x] **logo-footer.png / Pruefung** — `images/logo-footer.png` (3.4 MB) wird in keiner HTML/CSS/JS-Datei referenziert. Nur `logo-footer-white.png` wird im Footer verwendet. Datei kann geloescht werden — manuell pruefen ob sie anderweitig benoetigt wird.
- [x] **therapist.webp / Pruefung** — Keine WebP-Version von `images/therapist.png` vorhanden. Optimierung erfordert Bildkonvertierung (manuell oder via Build-Tool).
- [x] **OG-Images / Pruefung** — 10 Blog-Seiten referenzieren `placeholder-blog.svg` als og:image (SVGs funktionieren nicht auf Social Media). 4 statische Seiten (index, therapie-hamburg, gutschein, sparpaket) verwenden `logo-white.png` (funktioniert). Fix erfordert echte Blog-Bilder.
- [x] **Blog-Konsistenz / Pruefung** — Alle Blog-Artikel haben identische Struktur: Breadcrumb (HTML + JSON-LD BreadcrumbList), Article-Header (Kategorie, Datum, Lesezeit), Hero-Image, Article-Body (mit itemprop Microdata), Author-Box, CTA-Banner, Related Articles (2 Cards). BlogPosting JSON-LD und FAQPage JSON-LD konsistent vorhanden. Interne Verlinkung zwischen Artikeln intensiv.
- [x] **Formulare / Pruefung** — `gutschein.html` und `sparpaket.html`: Alle Felder haben korrekte `<label for="">` Verknuepfungen, `required`+`aria-required="true"` auf Pflichtfeldern, Honeypot vorhanden, `autocomplete` korrekt. Keine fieldset/legend fuer Gruppen — bei diesen einfachen linearen Formularen nicht noetig.
- [x] **404-Seite / Pruefung** — Design konsistent mit Hauptseite (gleiche CSS-Variablen, Navbar, Footer, Cookie-Banner). Zwei sinnvolle CTAs (Startseite, Therapien). `noindex` gesetzt. `prefers-reduced-motion` beruecksichtigt.
- [x] **CSS !important / Pruefung** — Nur in `@media print` (base.css) und `@media (prefers-reduced-motion: reduce)` (reset.css, spirit.css) verwendet. Beides korrekte Anwendungsfaelle fuer !important.
- [x] **@keyframes / Pruefung** — Alle 17 definierten @keyframes-Animationen werden in derselben CSS-Datei referenziert. Keine ungenutzten Animationen.
- [x] **Auskommentierter Code / Pruefung** — Keine auskommentierten CSS-Bloecke in der Codebase.
- [x] **Sync / Pruefung** — check-sync.sh bestaetigt: Alle 18 Seiten synchron nach allen Aenderungen.

### Verbleibende Punkte (nur mit externen Assets loesbar)

- [ ] **Quality / Low** — `images/logo-footer.png` (3.4 MB) wird nicht referenziert. Manuell pruefen ob anderweitig benoetigt, dann loeschen.
- [ ] **Quality / Low** — `images/therapist.png` (452 KB) koennte als WebP mit Fallback bereitgestellt werden. Erfordert Bildkonvertierung.
- [ ] **SEO / Low** — OG-Images der Blog-Seiten referenzieren SVG-Platzhalter. Erfordert echte Blog-Bilder.
- [ ] **CSS / Low** — 13 Stellen mit `transition: all` statt spezifischer Properties. Minimal-Impact Performance-Antipattern bei dekorativen Elementen.

---

## LOOP_COMPLETE

Die Codebase ist nach 9 Analyserunden in produktionsreifem Zustand. Begruendung:

**Keine kritischen, hohen oder mittleren Probleme offen.** Alle Sicherheits-, Funktions-, A11y- und DSGVO-Probleme wurden behoben.

**Verbleibende 4 offene Punkte sind ausschliesslich Low-Priority** und betreffen:
- Asset-Optimierung (Bildkompression/Konvertierung) — erfordert Bildbearbeitung
- Ungenutztes Bild loeschen — erfordert manuelle Bestaetigung
- OG-Images — erfordert echte Blog-Bilder
- `transition: all` — bewusste Entscheidung, minimal-impact

**Was wurde in 9 Runden behoben:**
- 7 SEO-Probleme (Meta-Tags, Canonical, JSON-LD, Favicon, Sitemap, AggregateRating)
- 9 Accessibility-Probleme (ARIA, Focus-Visible, Kontrast, prefers-reduced-motion, noscript)
- 4 funktionale Bugs (Smooth-Scroll, Select-Validierung, Doppel-Submit, Live-Validierung)
- 3 Sicherheitsverbesserungen (Honeypot, noreferrer, localStorage try/catch)
- 2 Sync-Probleme (check-sync.sh Blog-Support, NAV-Block-Konsistenz)
- 2 Performance-Verbesserungen (lazy-loading, CSS-Klasse statt Inline-Style)
- 4 HTML-Qualitaet (button type, autocomplete, noscript Fallback, autocomplete postal-code)
- 5 CSS-Fixes (opacity >1, doppelte html-Rule, form error display, Copyright-Jahr, duplizierter Media-Query)
- 1 UX-Fix (hero__scroll Scroll-Indikator eingefuegt)
- 1 DSGVO-Fix (GA-Passus in Datenschutzerklaerung korrigiert)
- 1 Content-Fix (Review-Zeitangaben auf absolute Daten umgestellt)
- 7 ungenutzte CSS-Variablen entfernt (Design-Token-Bereinigung)
- 1 Print-Stylesheet, 1 404-Seite, 1 CSS-Token-Konsolidierung, 1 CLAUDE.md-Aktualisierung
