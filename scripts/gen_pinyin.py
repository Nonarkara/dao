#!/usr/bin/env python3
"""
Generate per-character pinyin for every chapter of the Dao De Jing.

Reads chapters.js, extracts the `cn` field from each chapter object,
runs pypinyin (TONE style — diacritic marks like dào, kě), and writes
pinyin.js — a window.PINYIN map keyed by chapter number, where each
entry is an array of token objects:

    { c: "道", p: "dào" }   // a Chinese character with its pinyin
    { c: "，", p: null  }   // punctuation, no pinyin
    { c: "\\n", p: null }   // newline preserved for line breaks

The renderer in app.js wraps Chinese-character tokens in <ruby> only
when pinyin mode is on.
"""
import json
import re
import sys
from pathlib import Path

try:
    from pypinyin import pinyin, Style
except ImportError:
    sys.stderr.write("pypinyin not installed. Run: pip3 install pypinyin\n")
    sys.exit(1)


HERE = Path(__file__).parent
ROOT = HERE.parent
CHAPTERS_JS = ROOT / "chapters.js"
SUMMARIES_JS = ROOT / "summaries.js"
OUT_PY_JS = ROOT / "pinyin.js"
OUT_TITLES_JS = ROOT / "pinyin_titles.js"

# A small curated dictionary of Chinese phrases used throughout the book chrome.
# These appear in section labels, button text, panel labels — everywhere a
# reader sees Chinese outside the chapter body. Pinyin and short English gloss.
CHROME_GLOSSARY = [
    # section labels & navigation
    ("識人", "Reading the Reader · About"),
    ("源流", "Currents · the Lineage"),
    ("在野", "In the Wild · the Living Tradition"),
    ("注",   "Notes"),
    ("章",   "Chapter"),
    ("拼音", "Pinyin · sound-out the Chinese"),
    # the five panel labels
    ("原文", "Origin · the Chinese text"),
    ("直譯", "Direct · faithfully literal"),
    ("解讀", "Reading · what it might mean"),
    ("程式", "Code · TypeScript distillation"),
    ("玩",   "Play · games and asides"),
    ("畫",   "Tsai · cartoon by 蔡志忠"),
    # core terms
    ("道",   "the Way"),
    ("德",   "virtue, charisma, power"),
    ("經",   "classic, scripture"),
    ("道德經", "Dao De Jing · the book"),
    ("無為", "wu-wei · effortless action"),
    ("無",   "non-being, emptiness"),
    ("有",   "having, being"),
    ("陰陽", "yin yang · the two complementary forces"),
    ("天",   "Heaven · the cosmic order"),
    ("自然", "ziran · what is so of itself"),
    # eras
    ("春秋戰國", "Spring & Autumn · Warring States"),
    ("漢",   "Han · the Han dynasty"),
    ("格義", "geyi · matching meanings"),
    ("大乘", "Mahayana · the Greater Vehicle"),
    ("禪",   "Chan · the school that became Zen"),
    ("今",   "now · today"),
    # About stanza labels
    ("名",   "name"),
    ("源",   "source · ancestry"),
    ("學",   "study"),
    ("師",   "teacher"),
    ("行",   "field · practice"),
    ("業",   "work · profession"),
    ("教",   "teaching · office"),
    ("矛",   "contradiction"),
    ("讀",   "reading"),
    ("譯",   "translation"),
    ("終",   "closing"),
    # people
    ("老子", "Laozi · Lao Tzu, 'Old Master'"),
    ("莊子", "Zhuangzi · the laughing Daoist"),
    ("列子", "Liezi · the third Daoist master"),
    ("孔子", "Kongzi · Confucius"),
    ("蔡志忠", "Cai Zhizhong · Tsai Chih-chung, the cartoonist"),
    ("王弼", "Wang Bi · the standard commentator (3rd c. CE)"),
    # parts of the book
    ("道經", "Dao Jing · the Way half (chapters 1–37)"),
    ("德經", "De Jing · the Virtue half (chapters 38–81)"),
    # the seal/header
    ("第",   "ordinal · 'the Nth'"),
]

# A character is "Chinese" for our purposes if it lies in CJK Unified Ideographs.
CJK = re.compile(r"[一-鿿㐀-䶿]")


def extract_chapters(text: str):
    """Extract each chapter's number and `cn` field from the chapters.js source.

    chapters.js is a window.CHAPTERS = [{...}, {...}] array of objects.
    Each object has fields like:
        n: 1, mood: "...", art: "...", cn_title: "體道",
        cn: "道可道，非常道...", en_title: "...", en: "...", th: "...", note: "..."

    We pull `n` and `cn` per chapter using a tolerant regex.
    """
    # Match each "{...}" object that contains an `n:` field.
    obj_re = re.compile(r"\{[^{}]*?\bn:\s*(\d+)[^{}]*?\}", re.DOTALL)
    cn_re = re.compile(r'\bcn:\s*"((?:[^"\\]|\\.)*)"', re.DOTALL)

    chapters = []
    for m in obj_re.finditer(text):
        block = m.group(0)
        n = int(m.group(1))
        cn_match = cn_re.search(block)
        if not cn_match:
            continue
        cn_raw = cn_match.group(1)
        # Decode common JS escapes
        cn = (
            cn_raw.replace(r"\n", "\n")
                  .replace(r"\"", '"')
                  .replace(r"\\", "\\")
        )
        chapters.append((n, cn))
    return chapters


def tokenize_with_pinyin(cn_text: str):
    """Produce a list of {c, p} tokens covering every character in cn_text.

    Pinyin is generated only for CJK characters; punctuation and whitespace
    pass through with p=None so the renderer keeps spacing intact.
    """
    out = []
    for char in cn_text:
        if CJK.match(char):
            py = pinyin(char, style=Style.TONE, errors="default")
            # pypinyin returns [['dào']]
            p = py[0][0] if py and py[0] else ""
            out.append({"c": char, "p": p})
        else:
            out.append({"c": char, "p": None})
    return out


def phrase_pinyin(s: str) -> str:
    """Return a space-separated tone-marked pinyin string for a CN phrase."""
    if not s:
        return ""
    syllables = pinyin(s, style=Style.TONE, errors="default")
    parts = []
    for grp in syllables:
        if grp and grp[0]:
            parts.append(grp[0])
    return " ".join(parts)


def extract_titles(text: str):
    """Extract (n, cn_title) per chapter for chapter-strip pinyin."""
    obj_re = re.compile(r"\{[^{}]*?\bn:\s*(\d+)[^{}]*?\}", re.DOTALL)
    title_re = re.compile(r'\bcn_title:\s*"((?:[^"\\]|\\.)*)"')
    out = []
    for m in obj_re.finditer(text):
        block = m.group(0)
        n = int(m.group(1))
        tm = title_re.search(block)
        if tm:
            out.append((n, tm.group(1)))
    return out


def extract_summary_cns(text: str):
    """Extract (n, summary_cn) from summaries.js — the 4-8 char motto per chapter."""
    # Match: 1: { cn:"名之即縛之", en:"...", ... }
    line_re = re.compile(r"(\d+):\s*\{\s*cn:\s*\"((?:[^\"\\]|\\.)*)\"")
    out = []
    for m in line_re.finditer(text):
        n = int(m.group(1))
        out.append((n, m.group(2)))
    return out


def main():
    if not CHAPTERS_JS.exists():
        sys.stderr.write(f"Not found: {CHAPTERS_JS}\n")
        sys.exit(1)

    src = CHAPTERS_JS.read_text(encoding="utf-8")
    chapters = extract_chapters(src)
    titles   = extract_titles(src)
    if not chapters:
        sys.stderr.write("No chapters extracted from chapters.js — aborting.\n")
        sys.exit(1)

    # 1) per-character body pinyin (the existing PINYIN map)
    pinyin_map = {}
    for n, cn in chapters:
        pinyin_map[n] = tokenize_with_pinyin(cn)

    body = json.dumps(pinyin_map, ensure_ascii=False, separators=(",", ":"))
    out = (
        "/* Auto-generated by scripts/gen_pinyin.py — do not edit by hand. */\n"
        "/* Regenerate after editing chapters.js: python3 scripts/gen_pinyin.py */\n"
        f"window.PINYIN = {body};\n"
    )
    OUT_PY_JS.write_text(out, encoding="utf-8")

    # 2) chapter titles → pinyin string (for chapter strip + Origin head)
    title_map = {n: phrase_pinyin(t) for n, t in titles}

    # 3) summary mottos → pinyin string
    summary_map = {}
    if SUMMARIES_JS.exists():
        sumtext = SUMMARIES_JS.read_text(encoding="utf-8")
        for n, cn in extract_summary_cns(sumtext):
            summary_map[n] = phrase_pinyin(cn)

    # 4) chrome glossary → { phrase: { p: "...", g: "english gloss" } }
    glossary = {}
    for phrase, gloss in CHROME_GLOSSARY:
        glossary[phrase] = {"p": phrase_pinyin(phrase), "g": gloss}

    titles_blob = {
        "titles": title_map,
        "summaries": summary_map,
        "glossary": glossary,
    }
    out2 = (
        "/* Auto-generated by scripts/gen_pinyin.py. Pinyin + glosses for the\n"
        "   book's chrome — chapter titles, summary mottos, panel labels, etc. */\n"
        f"window.PINYIN_TITLES = {json.dumps(titles_blob, ensure_ascii=False, separators=(',', ':'))};\n"
    )
    OUT_TITLES_JS.write_text(out2, encoding="utf-8")

    print(f"Wrote {OUT_PY_JS}        — {len(chapters)} chapters, "
          f"{sum(len(v) for v in pinyin_map.values())} tokens")
    print(f"Wrote {OUT_TITLES_JS} — {len(title_map)} title pinyins, "
          f"{len(summary_map)} summary pinyins, {len(glossary)} chrome entries")


if __name__ == "__main__":
    main()
