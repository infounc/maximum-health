# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt

Statische Website für **Maximum Health** — Therapiepraxis von Maximilian Mix in Bönningstedt bei Hamburg (maximum-health.de). Deutsch-sprachige Seite mit "Organic Luxury" Dark-Design (Forest Sage + Warm Amber Farbschema).

## Tech-Stack

Reines HTML/CSS/JS — kein Build-System, kein Bundler, kein Framework. Dateien werden direkt ausgeliefert.

## Lokale Vorschau

```bash
python3 -m http.server 8080 --bind 127.0.0.1 --directory .
```

## Architektur

### CSS-Schichtung

1. `css/variables.css` — Design-Tokens (Farben, Fonts, Spacing, Shadows, Motion)
2. `css/reset.css` — CSS-Reset
3. `css/base.css` — Grundlegende Elemente
4. `css/layout.css` — Container- und Section-System
5. `css/components/*.css` — Einzelne UI-Komponenten (navbar, hero, footer etc.)

Fonts: **Playfair Display** (Display/Headings) + **Outfit** (Body) via Google Fonts.

### Shared Blocks (wichtig!)

HTML-Blöcke die über alle Seiten identisch sein müssen, sind mit Markern gekennzeichnet:

```html
<!-- SHARED:NAV:START --> ... <!-- SHARED:NAV:END -->
<!-- SHARED:FOOTER:START --> ... <!-- SHARED:FOOTER:END -->
<!-- SHARED:COOKIE:START --> ... <!-- SHARED:COOKIE:END -->
<!-- SHARED:HEAD-CSS:START --> ... <!-- SHARED:HEAD-CSS:END -->
```

**Bei Änderungen an Shared Blocks müssen alle HTML-Dateien synchron aktualisiert werden.** Prüfung:

```bash
bash scripts/check-sync.sh
```

### Seiten

- `index.html` — Hauptseite (Hero, Therapien, Profil, Preise, Coaching, Reviews, Kontakt)
- `blog.html` — Blog-Übersichtsseite mit Artikel-Cards
- `blog/schroepftherapie-wirkung-ablauf.html` — Artikel: Schröpftherapie
- `blog/rueckenschmerzen-natuerlich-behandeln.html` — Artikel: Rückenschmerzen
- `blog/tiefenmuskulaturtherapie-stress.html` — Artikel: Tiefenmuskulaturtherapie
- `blog/nackenverspannungen-loesen.html` — Artikel: Nackenverspannungen lösen
- `blog/faszientherapie-wirkung-behandlung.html` — Artikel: Faszientherapie
- `blog/verklebte-faszien-symptome-behandlung.html` — Artikel: Verklebte Faszien
- `blog/muskelverhaertungen-loesen.html` — Artikel: Muskelverhärtungen lösen
- `blog/durchblutung-foerdern.html` — Artikel: Durchblutung fördern
- `gutschein.html` — Gutschein-Bestellformular
- `sparpaket.html` — Sparpaket-Bestellformular
- `impressum.html` — Impressum
- `datenschutz.html` — Datenschutzerklärung

### SEO

- `robots.txt` — Crawler-Anweisungen
- `sitemap.xml` — Sitemap mit allen 13 Seiten + 1 Listing

### JavaScript

- `js/navbar.js` — Mobile-Menü, Scroll-Verhalten
- `js/smooth-scroll.js` — Smooth-Scrolling für Ankerlinks
- `js/reveal.js` — Scroll-basierte Reveal-Animationen
- `js/parallax.js` — Parallax-Effekte
- `js/cookie-banner.js` — Cookie-Consent
- `js/form-handler.js` — Formularvalidierung, mailto-Versand (Ziel: info@maximum-health.de)
