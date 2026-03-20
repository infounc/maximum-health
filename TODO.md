# TODO — Maximum Health Website (Launch-Checkliste)

Stand: 2026-03-18

Die technische Grundlage ist fertig (9 Code-Analyse-Runden abgeschlossen, alle Bugs gefixt).
Diese Liste enthält nur noch die Punkte, die für einen vollständigen, professionellen Launch fehlen.

---

## 🔴 Muss vor Launch

### Bilder — Blog

Alle 10 Blog-Artikel und die Blog-Übersichtsseite (`blog.html`) verwenden noch `placeholder-blog.svg`.
SVG-Platzhalter funktionieren **nicht** auf Social Media (kein OG-Preview-Bild beim Teilen).

Für jeden Artikel wird benötigt:
- **1 Hero-Bild** (Header des Artikels, wird groß angezeigt)
- **1 Card-Bild** (Vorschaubild auf blog.html und in "Weitere Artikel")

| Artikel | Hero-Bild | Card-Bild |
|---------|-----------|-----------|
| Schröpftherapie — Wirkung & Ablauf | ❌ | ❌ |
| Rückenschmerzen natürlich behandeln | ❌ | ❌ |
| Tiefenmuskulaturtherapie & Stress | ❌ | ❌ |
| Nackenverspannungen lösen | ❌ | ❌ |
| Faszientherapie — Wirkung & Behandlung | ❌ | ❌ |
| Verklebte Faszien — Symptome & Behandlung | ❌ | ❌ |
| Muskelverhärtungen lösen | ❌ | ❌ |
| Durchblutung fördern | ❌ | ❌ |
| Verspannungen lösen | ❌ | ❌ |
| Schröpfen am Rücken | ❌ | ❌ |

**Technisch:** Bilder unter `images/blog/[artikel-slug].jpg` ablegen, dann in HTML und `og:image`-Tag eintragen.
Empfohlene Größe: 1200×630px (optimal für Social Media und Hero).

---

### Bilder — Startseite & Allgemein

- [ ] **Hero-Bild finalisieren** — `portrait_mh1.jpeg` wird aktuell als Hero verwendet. Qualität und Bildausschnitt final freigeben.
- [ ] **Therapeuten-Foto** — `therapist.png` (452 KB) wird in der Über-mich-Sektion gezeigt. Bild final freigeben. Optional: Als WebP konvertieren für bessere Performance.

---

### Content — Texte final freigeben

- [ ] **Alle Seiten-Texte gegengelesen und freigegeben?** (Startseite, Therapiebeschreibungen, Preise, Blog-Artikel)
- [ ] **Preise aktuell und korrekt?**
  - Basic 75 € | Basic Plus 149 € | Pro 229 € | Premium 269 €
  - 5er-Pakete mit 10% Rabatt (Sparpaket-Seite)
- [ ] **Öffnungszeiten** — Werden die Zeiten auf der Website korrekt angezeigt? (aktuell: Mo–Fr 8–20 Uhr, Sa 9–16 Uhr — bitte prüfen)
- [ ] **Calendly-Links** — Es gibt 8 verschiedene Calendly-Event-URLs, alle müssen existieren und aktiv sein:
  - `calendly.com/maximum-health/basic`
  - `calendly.com/maximum-health/basic-plus`
  - `calendly.com/maximum-health/pro`
  - `calendly.com/maximum-health/premium`
  - `calendly.com/maximum-health/lebensfunke` (Coaching)
  - `calendly.com/maximum-health/balancequelle` (Coaching)
  - `calendly.com/maximum-health/seelenkompass` (Coaching)
  - `calendly.com/maximum-health/spirit` (Spirit-CTA)
- [ ] **Instagram-Link** — `instagram.com/maximum_health.de` — Profil-URL korrekt? (Punkt im Namen ungewöhnlich)

---

### Hosting & Server

- [ ] **`.htaccess` erstellen** — Ohne diese Datei wird `404.html` niemals ausgeliefert. Apache braucht `ErrorDocument 404 /404.html`. Außerdem: HTTPS-Redirect von http → https konfigurieren.
- [ ] **Hosting/Provider gewählt?** — Statische Site, Empfehlung: Webspace mit Apache (z.B. All-Inkl, Strato, Hetzner) oder CDN (Netlify, Vercel, Cloudflare Pages)
- [ ] **SSL-Zertifikat** — HTTPS muss aktiv sein (Let's Encrypt via Hosting-Provider oder Cloudflare)
- [ ] **Domain maximum-health.de** — DNS auf Hosting zeigen (A-Record / CNAME)

---

## 🟡 Sollte vor Launch (aber kein Blocker)

### DSGVO & Cookie

- [ ] **Cookie-Banner Entscheidung** — Momentan kein Analytics/Tracking eingebunden. Datenschutz-Erklärung sagt "aktuell keine Webanalyse-Tools". Falls Google Analytics oder ähnliches eingebunden werden soll: Cookie-Banner um Kategorie-Auswahl (notwendig / Analytics) erweitern und GA-Script mit Consent-Check einbinden.

### SEO nach Launch

- [ ] **Google Search Console** — Domain verifizieren, `sitemap.xml` einreichen
- [ ] **Google Business Profile** — Praxis-Eintrag prüfen/anlegen (Name, Adresse, Öffnungszeiten, Website-Link)
- [ ] **Bing Webmaster Tools** — Optional, aber einfach: sitemap.xml einreichen

---

## 🟢 Kann nach Launch (Low Priority)

- [ ] **`images/logo-footer.png` löschen** — 3,4 MB, wird nirgends verwendet (nur `logo-footer-white.png` ist im Footer)
- [ ] **`transition: all`** — 13 Stellen in CSS verwenden `transition: all` statt spezifischer Properties. Minimal-Auswirkung, rein kosmetisch
- [ ] **therapist.png als WebP** — Performance-Optimierung (~50% kleinere Datei). Erfordert Bildkonvertierung + `<picture>`-Element im HTML

---

## ✅ Technisch fertig (kein Handlungsbedarf)

- [x] Alle internen Links funktionieren
- [x] Alle 18 Seiten synchron (NAV, FOOTER, COOKIE shared blocks)
- [x] sitemap.xml vollständig (17 Seiten, 404 korrekt ausgeschlossen)
- [x] robots.txt korrekt
- [x] Favicon vorhanden (SVG)
- [x] 404-Seite vorhanden
- [x] SEO-Meta-Tags (canonical, OG, Twitter, JSON-LD) auf allen Seiten
- [x] Accessibility (ARIA, Focus-Visible, reduced-motion, Kontrast)
- [x] DSGVO — Cookie-Banner, Datenschutzerklärung, Impressum
- [x] Formulare (Gutschein & Sparpaket) mit Validierung und Honeypot
- [x] Mobile Responsive
- [x] Print-Styles
- [x] Performance (lazy-loading, passive event listeners)
