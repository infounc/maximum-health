#!/usr/bin/env bash
# check-sync.sh — Vergleicht SHARED-Blöcke über alle HTML-Seiten
# Verwendung: bash scripts/check-sync.sh
#
# Unterstützte Verzeichnisstruktur (Clean URLs):
#   Tiefe 0 (Root):  index.html, 404.html
#   Tiefe 1:         blog/index.html, impressum/index.html, etc.
#   Tiefe 2:         blog/slug/index.html

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

# Sammle alle index.html-Dateien nach Tiefe
DEPTH0_FILES=("$PROJECT_DIR"/*.html)
DEPTH1_FILES=()
DEPTH2_FILES=()

# Tiefe 1: direkte Unterverzeichnisse mit index.html
for dir in "$PROJECT_DIR"/*/; do
  if [ -f "${dir}index.html" ]; then
    DEPTH1_FILES+=("${dir}index.html")
  fi
done

# Tiefe 2: blog/slug/index.html
for dir in "$PROJECT_DIR"/blog/*/; do
  if [ -f "${dir}index.html" ]; then
    DEPTH2_FILES+=("${dir}index.html")
  fi
done

SHARED_BLOCKS=("NAV" "FOOTER" "COOKIE" "HEAD-CSS")

total_files=$(( ${#DEPTH0_FILES[@]} + ${#DEPTH1_FILES[@]} + ${#DEPTH2_FILES[@]} ))
errors=0

# ----------------------------------------------------------------
# Normalisierungsfunktionen: Alle Pfade auf Root-Äquivalent bringen
# ----------------------------------------------------------------

# Tiefe 1 → Root:
#   "../"        → "index.html"  (oder "../index.html" als Sonderfallvariante)
#   "../index.html" → "index.html"
#   "../X"       → "X"           (css/, js/, images/, etc.)
#   "../blog/"   → "blog/"
#   "../sparpaket/" etc. → "sparpaket/" etc.
normalize_d1_to_root() {
  sed \
    -e 's|href="\.\./"|href="index.html"|g' \
    -e 's|href="\.\./index\.html|href="index.html|g' \
    -e 's|href="\.\./|href="|g' \
    -e 's|src="\.\./|src="|g'
}

# Tiefe 2 → Root:
#   "../../"          → "index.html"
#   "../../index.html"→ "index.html"
#   "../../X"         → "X"
#   "../schroepf/"    → "blog/schroepf/"  (Artikel-Geschwister-Links)
#   "../Y/"           → "blog/Y/"
normalize_d2_to_root() {
  sed \
    -e 's|href="\.\./\.\./"|href="index.html"|g' \
    -e 's|href="\.\./\.\./index\.html|href="index.html|g' \
    -e 's|href="\.\./\.\./|href="|g' \
    -e 's|src="\.\./\.\./|src="|g' \
    -e 's|href="\.\./|href="blog/|g' \
    -e 's|src="\.\./|src="blog/|g'
}

for block in "${SHARED_BLOCKS[@]}"; do
  start_tag="<!-- SHARED:${block}:START -->"
  end_tag="<!-- SHARED:${block}:END -->"

  reference=""
  reference_file=""

  # --- Tiefe 0 (Root): erste Datei als Referenz, alle anderen direkt vergleichen ---
  for file in "${DEPTH0_FILES[@]}"; do
    basename="$(basename "$file")"
    content=$(sed -n "/${start_tag}/,/${end_tag}/p" "$file" | sed '1d;$d')

    if [ -z "$content" ]; then
      echo "FEHLT: ${block} in ${basename}"
      errors=$((errors + 1))
      continue
    fi

    if [ -z "$reference" ]; then
      reference="$content"
      reference_file="$basename"
      echo "$content" > "$TMPDIR/ref_${block}"
      continue
    fi

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

  if [ -z "$reference" ]; then
    echo "FEHLER: Keine Referenz für ${block} gefunden."
    errors=$((errors + 1))
    continue
  fi

  # --- Tiefe 1: normalisiert auf Root-Niveau, dann gegen Referenz ---
  for file in "${DEPTH1_FILES[@]}"; do
    relpath="${file#$PROJECT_DIR/}"
    content=$(sed -n "/${start_tag}/,/${end_tag}/p" "$file" | sed '1d;$d')

    if [ -z "$content" ]; then
      echo "FEHLT: ${block} in ${relpath}"
      errors=$((errors + 1))
      continue
    fi

    echo "$content" | normalize_d1_to_root > "$TMPDIR/cur_${block}"

    if ! diff -q "$TMPDIR/ref_${block}" "$TMPDIR/cur_${block}" > /dev/null 2>&1; then
      echo "UNTERSCHIED: ${block} — ${reference_file} vs ${relpath}"
      diff --color=auto -u \
        --label "${reference_file}" "$TMPDIR/ref_${block}" \
        --label "${relpath}" "$TMPDIR/cur_${block}" || true
      echo ""
      errors=$((errors + 1))
    fi
  done

  # --- Tiefe 2: normalisiert auf Root-Niveau, dann gegen Referenz ---
  for file in "${DEPTH2_FILES[@]}"; do
    relpath="${file#$PROJECT_DIR/}"
    content=$(sed -n "/${start_tag}/,/${end_tag}/p" "$file" | sed '1d;$d')

    if [ -z "$content" ]; then
      echo "FEHLT: ${block} in ${relpath}"
      errors=$((errors + 1))
      continue
    fi

    echo "$content" | normalize_d2_to_root > "$TMPDIR/cur_${block}"

    if ! diff -q "$TMPDIR/ref_${block}" "$TMPDIR/cur_${block}" > /dev/null 2>&1; then
      echo "UNTERSCHIED: ${block} — ${reference_file} vs ${relpath}"
      diff --color=auto -u \
        --label "${reference_file}" "$TMPDIR/ref_${block}" \
        --label "${relpath}" "$TMPDIR/cur_${block}" || true
      echo ""
      errors=$((errors + 1))
    fi
  done
done

if [ "$errors" -eq 0 ]; then
  echo "OK: Alle SHARED-Blöcke sind synchron über ${total_files} Seiten (${#DEPTH0_FILES[@]} Root + ${#DEPTH1_FILES[@]} Tiefe-1 + ${#DEPTH2_FILES[@]} Tiefe-2)."
else
  echo ""
  echo "WARNUNG: ${errors} Abweichung(en) gefunden."
  exit 1
fi
