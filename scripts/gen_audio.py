#!/usr/bin/env python3
"""
Generate Mandarin TTS audio for the Chinese text of all 81 Dao De Jing chapters.
Uses gTTS (Google Translate TTS, free, no API key required).
Output: dao/audio/ch{NN}-cn.mp3  (zero-padded chapter number)

Run: python3 scripts/gen_audio.py
Regenerate a single chapter: python3 scripts/gen_audio.py 8
"""
import json, re, sys, time
from pathlib import Path
try:
    from gtts import gTTS
except ImportError:
    print("pip3 install gTTS"); sys.exit(1)

ROOT = Path(__file__).parent.parent
CHAPTERS_JS = ROOT / "chapters.js"
AUDIO_DIR = ROOT / "audio"
AUDIO_DIR.mkdir(exist_ok=True)

# ── parse chapters.js ──────────────────────────────────────────────────────
def extract_chapters(src: str):
    obj_re = re.compile(r"\{[^{}]*?\bn:\s*(\d+)[^{}]*?\}", re.DOTALL)
    cn_re  = re.compile(r'\bcn:\s*"((?:[^"\\]|\\.)*)"')
    out = []
    for m in obj_re.finditer(src):
        block = m.group(0)
        n = int(m.group(1))
        cm = cn_re.search(block)
        if cm:
            cn = cm.group(1).replace(r"\n", "\n").replace(r"\"", '"').replace(r"\\", "\\")
            out.append((n, cn))
    return out

src = CHAPTERS_JS.read_text("utf-8")
chapters = extract_chapters(src)
if not chapters:
    print("ERROR: no chapters extracted from chapters.js"); sys.exit(1)

# ── select which chapters to generate ─────────────────────────────────────
targets = [int(x) for x in sys.argv[1:]] if len(sys.argv) > 1 else None

ok = skip = err = 0
for n, cn in chapters:
    if targets and n not in targets:
        continue
    out_path = AUDIO_DIR / f"ch{n:02d}-cn.mp3"
    if out_path.exists() and not targets:
        skip += 1
        continue
    try:
        tts = gTTS(text=cn, lang="zh-TW", slow=False)
        tts.save(str(out_path))
        kb = out_path.stat().st_size // 1024
        print(f"  ch{n:02d} → {out_path.name} ({kb} KB)")
        ok += 1
        time.sleep(0.4)          # gentle rate-limit
    except Exception as e:
        print(f"  ch{n:02d} ERROR: {e}")
        err += 1

print(f"\nDone: {ok} generated, {skip} skipped (already exist), {err} errors")
print(f"Files in: {AUDIO_DIR}")
