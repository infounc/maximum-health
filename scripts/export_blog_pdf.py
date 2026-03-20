#!/usr/bin/env python3
"""Extrahiert alle Blog-Artikel und erstellt eine PDF-Datei."""

import os
import re
from pathlib import Path
from bs4 import BeautifulSoup

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, HRFlowable
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY

# --- Konfiguration ---
BASE_DIR = Path(__file__).parent.parent
BLOG_DIR = BASE_DIR / "blog"
OUTPUT_PDF = BASE_DIR / "blog-export.pdf"

BLOG_FILES = [
    "schroepftherapie-wirkung-ablauf.html",
    "rueckenschmerzen-natuerlich-behandeln.html",
    "tiefenmuskulaturtherapie-stress.html",
    "nackenverspannungen-loesen.html",
    "faszientherapie-wirkung-behandlung.html",
    "verklebte-faszien-symptome-behandlung.html",
    "muskelverhaertungen-loesen.html",
    "durchblutung-foerdern.html",
    "verspannungen-loesen.html",
    "schroepfen-ruecken.html",
]

# --- Styles ---
def build_styles():
    styles = getSampleStyleSheet()
    dark_green = colors.HexColor("#2D4A3E")
    amber = colors.HexColor("#D4A853")
    gray = colors.HexColor("#555555")
    light_gray = colors.HexColor("#888888")

    style_map = {
        "cover_title": ParagraphStyle(
            "cover_title",
            fontName="Helvetica-Bold",
            fontSize=32,
            leading=40,
            textColor=dark_green,
            alignment=TA_CENTER,
            spaceAfter=16,
        ),
        "cover_subtitle": ParagraphStyle(
            "cover_subtitle",
            fontName="Helvetica",
            fontSize=14,
            leading=20,
            textColor=gray,
            alignment=TA_CENTER,
            spaceAfter=8,
        ),
        "article_title": ParagraphStyle(
            "article_title",
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=28,
            textColor=dark_green,
            spaceBefore=0,
            spaceAfter=8,
        ),
        "article_meta": ParagraphStyle(
            "article_meta",
            fontName="Helvetica",
            fontSize=9,
            leading=14,
            textColor=light_gray,
            spaceAfter=6,
        ),
        "article_intro": ParagraphStyle(
            "article_intro",
            fontName="Helvetica-Oblique",
            fontSize=12,
            leading=18,
            textColor=gray,
            spaceAfter=14,
        ),
        "h2": ParagraphStyle(
            "h2",
            fontName="Helvetica-Bold",
            fontSize=15,
            leading=20,
            textColor=dark_green,
            spaceBefore=16,
            spaceAfter=6,
        ),
        "h3": ParagraphStyle(
            "h3",
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=17,
            textColor=colors.HexColor("#3A5C4E"),
            spaceBefore=10,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "body",
            fontName="Helvetica",
            fontSize=10,
            leading=16,
            textColor=colors.HexColor("#333333"),
            alignment=TA_JUSTIFY,
            spaceAfter=8,
        ),
        "li": ParagraphStyle(
            "li",
            fontName="Helvetica",
            fontSize=10,
            leading=15,
            textColor=colors.HexColor("#333333"),
            leftIndent=16,
            spaceAfter=4,
        ),
        "blockquote": ParagraphStyle(
            "blockquote",
            fontName="Helvetica-Oblique",
            fontSize=10,
            leading=15,
            textColor=gray,
            leftIndent=20,
            rightIndent=20,
            borderPadding=(8, 12, 8, 12),
            backColor=colors.HexColor("#F5F0E8"),
            spaceAfter=10,
            spaceBefore=6,
        ),
        "toc_title": ParagraphStyle(
            "toc_title",
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=22,
            textColor=dark_green,
            spaceAfter=12,
        ),
        "toc_entry": ParagraphStyle(
            "toc_entry",
            fontName="Helvetica",
            fontSize=11,
            leading=18,
            textColor=gray,
            leftIndent=12,
        ),
    }
    return style_map


def clean_text(text):
    """Bereinigt Leerzeichen und Steuerzeichen."""
    text = re.sub(r'\s+', ' ', text).strip()
    # HTML-Entities ersetzen
    text = text.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    text = text.replace('&nbsp;', ' ').replace('&#39;', "'").replace('&quot;', '"')
    return text


def extract_article(filepath):
    """Extrahiert Titel, Meta-Info, Intro und Body-Elemente aus einem Blog-Artikel."""
    with open(filepath, encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")

    # Titel
    h1 = soup.find("h1", class_="article-header__title")
    title = clean_text(h1.get_text()) if h1 else filepath.stem

    # Datum & Meta
    time_tag = soup.find("time")
    date_str = clean_text(time_tag.get_text()) if time_tag else ""
    read_time = ""
    meta_spans = soup.select(".article-header__meta span")
    for span in meta_spans:
        t = span.get_text()
        if "Min" in t:
            read_time = clean_text(t)

    # Intro
    intro_tag = soup.find("p", class_="article-header__intro")
    intro = clean_text(intro_tag.get_text()) if intro_tag else ""

    # Artikel-Body
    article = soup.find("article", class_="article-body")
    elements = []
    if article:
        for el in article.find_all(["h2", "h3", "p", "ul", "ol", "blockquote"], recursive=True):
            tag = el.name
            text = clean_text(el.get_text())
            if not text:
                continue
            if tag == "h2":
                elements.append(("h2", text))
            elif tag == "h3":
                elements.append(("h3", text))
            elif tag == "p":
                # Meta-itemprop überspringen (leer oder sehr kurz durch meta-tags)
                if len(text) > 2:
                    elements.append(("p", text))
            elif tag in ("ul", "ol"):
                for li in el.find_all("li", recursive=False):
                    li_text = clean_text(li.get_text())
                    if li_text:
                        elements.append(("li", li_text))
            elif tag == "blockquote":
                elements.append(("blockquote", text))

    # Duplikate entfernen (verschachtelte Tags können doppelt erscheinen)
    seen = set()
    deduped = []
    for typ, txt in elements:
        key = (typ, txt[:60])
        if key not in seen:
            seen.add(key)
            deduped.append((typ, txt))

    return {
        "title": title,
        "date": date_str,
        "read_time": read_time,
        "intro": intro,
        "elements": deduped,
    }


def build_pdf(articles, styles):
    doc = SimpleDocTemplate(
        str(OUTPUT_PDF),
        pagesize=A4,
        leftMargin=2.5 * cm,
        rightMargin=2.5 * cm,
        topMargin=2.5 * cm,
        bottomMargin=2.5 * cm,
        title="Maximum Health – Blog-Artikel",
        author="Maximilian Mix",
        subject="Alle Blog-Artikel von maximum-health.de",
    )

    story = []
    dark_green = colors.HexColor("#2D4A3E")
    amber = colors.HexColor("#D4A853")

    # --- Titelseite ---
    story.append(Spacer(1, 4 * cm))
    story.append(Paragraph("Maximum Health", styles["cover_title"]))
    story.append(HRFlowable(width="60%", thickness=2, color=amber, hAlign="CENTER", spaceAfter=16))
    story.append(Paragraph("Blog-Artikel", styles["cover_subtitle"]))
    story.append(Spacer(1, 0.5 * cm))
    story.append(Paragraph("Alle Artikel von maximum-health.de", styles["cover_subtitle"]))
    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph("Therapeut: Maximilian Mix · Bönningstedt bei Hamburg", styles["cover_subtitle"]))
    story.append(Spacer(1, 4 * cm))

    # Inhaltsverzeichnis
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#DDDDDD"), spaceAfter=12))
    story.append(Paragraph("Inhalt", styles["toc_title"]))
    for i, art in enumerate(articles, 1):
        story.append(Paragraph(f"{i}. {art['title']}", styles["toc_entry"]))
    story.append(PageBreak())

    # --- Artikel ---
    for art in articles:
        # Artikelkopf
        story.append(Paragraph(art["title"], styles["article_title"]))
        meta_parts = [p for p in [art["date"], art["read_time"]] if p]
        if meta_parts:
            story.append(Paragraph(" · ".join(meta_parts), styles["article_meta"]))
        if art["intro"]:
            story.append(Paragraph(art["intro"], styles["article_intro"]))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#DDDDDD"), spaceAfter=10))

        # Body
        for typ, text in art["elements"]:
            if typ == "h2":
                story.append(Paragraph(text, styles["h2"]))
            elif typ == "h3":
                story.append(Paragraph(text, styles["h3"]))
            elif typ == "p":
                story.append(Paragraph(text, styles["body"]))
            elif typ == "li":
                story.append(Paragraph(f"• {text}", styles["li"]))
            elif typ == "blockquote":
                story.append(Paragraph(text, styles["blockquote"]))

        story.append(PageBreak())

    doc.build(story)
    print(f"PDF erstellt: {OUTPUT_PDF}")
    print(f"Groesse: {OUTPUT_PDF.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    styles = build_styles()
    articles = []
    for filename in BLOG_FILES:
        path = BLOG_DIR / filename
        if path.exists():
            print(f"Lese: {filename}")
            articles.append(extract_article(path))
        else:
            print(f"WARNUNG: {filename} nicht gefunden")

    print(f"\n{len(articles)} Artikel gefunden. Erstelle PDF...")
    build_pdf(articles, styles)
