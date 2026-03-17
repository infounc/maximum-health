#!/usr/bin/env bash
# check-sync.sh — Vergleicht SHARED-Blöcke über alle HTML-Seiten
# Verwendung: bash scripts/check-sync.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

ROOT_HTML_FILES=("$PROJECT_DIR"/*.html)
BLOG_HTML_FILES=("$PROJECT_DIR"/blog/*.html)
SHARED_BLOCKS=("NAV" "FOOTER" "COOKIE" "HEAD-CSS")

total_files=$(( ${#ROOT_HTML_FILES[@]} + ${#BLOG_HTML_FILES[@]} ))
errors=0

for block in "${SHARED_BLOCKS[@]}"; do
  start_tag="<!-- SHARED:${block}:START -->"
  end_tag="<!-- SHARED:${block}:END -->"

  reference=""
  reference_file=""

  for file in "${ROOT_HTML_FILES[@]}"; do
    basename="$(basename "$file")"

    # Block extrahieren (zwischen START und END, exklusive der Marker)
    content=$(sed -n "/${start_tag}/,/${end_tag}/p" "$file" | sed '1d;$d')

    if [ -z "$content" ]; then
      echo "FEHLT: ${block} in ${basename}"
      errors=$((errors + 1))
      continue
    fi

    # Erste Datei als Referenz nutzen
    if [ -z "$reference" ]; then
      reference="$content"
      reference_file="$basename"
      echo "$content" > "$TMPDIR/ref_${block}"
      continue
    fi

    # Vergleichen
    echo "$content" > "$TMPDIR/cur_${block}"
    if ! diff -q "$TMPDIR/ref_${block}" "$TMPDIR/cur_${block}" > /dev/null 2>&1; then
      echo "UNTERSCHIED: ${block} — ${reference_file} vs ${basename}"
      diff --color=auto -u \
        --label "${reference_file}" "$TMPDIR/ref_${block}" \
        --label "${basename}" "$TMPDIR/cur_${block}" || true
      echo ""
      errors=$((errors + 1))
    fi
  done

  # Blog-Dateien pruefen: Pfad-Praefixe ../  werden fuer den Vergleich normalisiert
  for file in "${BLOG_HTML_FILES[@]}"; do
    relpath="blog/$(basename "$file")"

    content=$(sed -n "/${start_tag}/,/${end_tag}/p" "$file" | sed '1d;$d')

    if [ -z "$content" ]; then
      echo "FEHLT: ${block} in ${relpath}"
      errors=$((errors + 1))
      continue
    fi

    # Normalisiere blog-spezifische Pfade: ../ entfernen fuer Vergleich
    normalized=$(echo "$content" | sed 's|\.\./||g')
    echo "$normalized" > "$TMPDIR/cur_${block}"

    if [ -n "$reference" ]; then
      if ! diff -q "$TMPDIR/ref_${block}" "$TMPDIR/cur_${block}" > /dev/null 2>&1; then
        echo "UNTERSCHIED: ${block} — ${reference_file} vs ${relpath}"
        diff --color=auto -u \
          --label "${reference_file}" "$TMPDIR/ref_${block}" \
          --label "${relpath}" "$TMPDIR/cur_${block}" || true
        echo ""
        errors=$((errors + 1))
      fi
    fi
  done
done

if [ "$errors" -eq 0 ]; then
  echo "OK: Alle SHARED-Blöcke sind synchron über ${total_files} Seiten (${#ROOT_HTML_FILES[@]} Root + ${#BLOG_HTML_FILES[@]} Blog)."
else
  echo ""
  echo "WARNUNG: ${errors} Abweichung(en) gefunden."
  exit 1
fi
