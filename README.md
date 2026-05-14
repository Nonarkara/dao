<p align="center">
  <img src="assets/reading-dao-hero.png" alt="Reading Dao De Jing with Dr Non illustrated hero" width="100%">
</p>

# Reading Dao De Jing with Dr. Non

A playful, serious, trilingual reading of the **Dao De Jing**: Chinese, English, and Thai side by side, with comics, pinyin, character notes, Buddhist parallels, psychology notes, and a growing reference shelf.

The live site is designed as a reading room, not a landing page. Open a chapter, change language, tap the character title, open the Tsai comic notes, or fall into the reference library.

## What Makes It Fun

- **81 chapters in three languages**: English, Thai, and Chinese modes switch the whole page.
- **Tsai Chih-chung galleries**: every chapter has a subtle `漫 Tsai` button with C. C. Tsai illustrations and short Thai/Chinese explanations under the English comic panels.
- **Comparative notes**: a quiet `同 Echoes` button opens Buddhist, religious, and psychological parallels.
- **Chinese character learning**: tap a chapter character for pinyin, stroke logic, Thai/Chinese notes, and cultural context.
- **Reference library**: covers and reading notes for Slingerland, Tsai, Mitchell, Derek Lin, Holmes Welch, Jonathan Star, and more.
- **Not precious**: it is meant to be forked, argued with, translated better, and improved.

## Run Locally

This is a static site. Any simple server works:

```bash
python3 -m http.server 4177
```

Then open:

```text
http://127.0.0.1:4177/
```

No build step is required.

## Project Map

- `index.html` is the reading shell and notes overlay.
- `app.js` is the interaction layer: language switching, notes, galleries, overlays, character tools.
- `chapters.js` contains the 81 core chapters.
- `extended.js` contains deeper readings, code metaphors, notes, play cards, and some inline artwork hooks.
- `comparative_notes.js` maps chapters to Buddhist/religious/psychological parallels.
- `tsai_laozi.js` maps every chapter to extracted Tsai illustration pages.
- `reference_library.js` powers the reference shelf.
- `styles.css` is the full visual system.
- `tsai/`, `reference-covers/`, `img/`, and `assets/` contain visual materials.

## Why Tsai

C. C. Tsai has been making Chinese classics friendly, funny, and memorable for more than fifty years. This project uses his illustrations as a grateful study aid, with credit, because many readers first understand Laozi visually before they understand him philologically.

The comic pages are here to help people read. They are not presented as original site artwork.

## Why Slingerland

Edward Slingerland is the best modern doorway into this genre because he explains **wu-wei** as trained spontaneity, not laziness; **de** as embodied credibility, not moral decoration; and Daoist paradox as something cognitive science can help clarify without replacing the Chinese text.

## Fork Ideas

- Improve the Thai translation chapter by chapter.
- Add Cantonese, Teochew, Hokkien, or Japanese readings.
- Add more Buddhist parallels, especially Theravada and Chan/Zen.
- Add audio narration for all three languages.
- Replace or refine chapter summaries.
- Build a teacher mode, classroom worksheets, or printable zines.
- Add better source notes for each translation decision.

## Rights And Respect

Code in this repository is provided for learning and remixing. Text, translations, notes, and generated site material should be treated as authored content by Non Arkaraprasertkul unless otherwise credited. Third-party materials, book covers, and Tsai illustrations remain the property of their respective rights holders and are included here as credited study/reference material.

If you fork this project publicly, please keep attribution visible and do not present third-party illustrations as your own.
