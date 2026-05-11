# Audit: Reading Dao De Jing with Dr. Non
## 11 May 2026 · One honest read-through

---

## 0. The Voice Test

I read your 100 Days blog. The voice is clear: you talk to the reader like a friend who stayed up too late thinking. You use your own life as the door into the idea. You end with questions, not answers. You hate pretension. You trust the short sentence after the long build.

The Dao De Jing project does not always sound like that voice. In places it sounds like a very good product. In places it sounds like a museum. The blog never sounds like a museum. The blog sounds like someone who would punch a man for intentionally cracking his phone to make it "wabi-sabi."

That person needs to edit this book.

---

## 1. The Big Problem: Too Much Book

You built six panels per chapter. That was the right impulse for a prototype. Now it is the wrong shape for a finished thing. Let me be direct:

**The reader who encounters this book on their phone during a commute does not need six panels. They need one clear hit, and maybe a second if the first one landed.**

The current structure:
- 01 Origin (Chinese + pinyin + literal)
- 字 Character (HanziWriter stroke animation)
- 02 Direct (literal translation)
- 畫 Tsai (cartoon)
- 03 Reading (your commentary + science)
- 畫 Painting (NPM artwork)
- 04 Code (TypeScript)
- 05 Note (personal story)
- 比 Compare (other translators)
- 06 Play (what-ifs, games)
- 問 Closer ("Have you ever...")

That is eleven possible elements per chapter. For 81 chapters. The math is cruel: 891 potential panels, most of which say roughly the same thing in different registers.

**My recommendation: cut to three panels per chapter, maximum.**

| Keep | Cut or Merge |
|------|-------------|
| **Origin** (Chinese + pinyin + your English) — this is the book | Direct — merge into Origin; the literal gloss under each character IS the direct translation |
| **Reading** — but only where you actually have something to say | Code — all of it. TypeScript-as-philosophy is clever but it is a party trick that stops being funny by chapter 20. The reader who needs code to understand Daoism is not your reader. |
| **Note** — but only where the story is real and specific | Compare — merge into Reading, one sentence: "Mitchell says X; I say Y because Z." |
| **Closers** — keep, they are good | Play — cut 80%. Most of these read like filler. The Slingerland asides belong in the Notes overlay, not in the chapter. |
| **Character** — keep but only for chapters where the character actually teaches something | Tsai cartoons — keep only where the image genuinely illuminates the text (Ch 1, 8, 11, 20, 48). The other cartoons sit there like homework. |
| **NPM paintings** — keep all 10, they are the most stunning thing in the book | Data wall — cut it. The live market noise was a clever concept ("civilization's signals before the substance") but it is visual clutter. It makes the book feel like a dashboard. You hate dashboards. |

**The tightened chapter:**
1. **Origin** — Chinese, pinyin, your English, one-line literal gloss. One panel.
2. **Reading** — your actual thought, plus science if it genuinely supports (not decorates).
3. **Note OR Painting OR Character** — whichever one actually adds something the other two don't.
4. **Closer** — one question. End.

If a chapter doesn't have a real Note, don't include the Note panel. If a chapter doesn't have a real Reading, don't include the Reading panel. **The emptiness is the teaching.** Chapter 11 is literally about the use of nothing. Give it nothing.

---

## 2. Design: Every Chapter Must Look Like What It Says

You have 8 moods for 81 chapters. That is like having 8 shirts for 81 days. The current mapping:

| Mood | Chapters | Problem |
|------|----------|---------|
| civic (newspaper) | ~29 | War chapters in tabloid layout. Infant chapter on blank cream. |
| wabi (empty cream) | ~19 | Everything looks like a minimalist furniture catalogue |
| pop (Warhol) | ~15 | Ch 67 "Three Treasures" in primary colors — kindness does not look like this |
| cryptic (cyberpunk) | ~7 | Ch 50 "Birth and Death" in neon — mortality is not a video game |
| cosmic (dark stars) | ~10 | This one works |
| natural (jade water) | ~6 | This one works |
| physics (graph paper) | ~4 | This one works |
| mirror (ink reversal) | 1 | Ch 81 only — this one works brilliantly |

**The principle:** A chapter about water should feel wet. A chapter about emptiness should feel empty. A chapter about war should feel heavy. A chapter about the infant should feel warm.

**Immediate fixes (no new code needed):**

| Chapter | Teaching | Current | Fix |
|---------|----------|---------|-----|
| 6 | Valley Spirit / Dark Mother | water | **mood-natural** is fine but add the actual valley imagery you have sitting unused (`monk-sea.jpg`) |
| 9 | Knowing When to Stop | pop (Warhol) | → **mood-wabi**. "Stop" should not shout. |
| 14 | The Subtle (can't see/hear/grasp) | origin | → **mood-cryptic** but go further: fade the text in, don't just reveal it. Make the reader squint. |
| 20 | Being the Strange One | wabi | Good. But use the `wanderer.jpg` you have sitting there. Friedrich's solitary figure above the mist IS this chapter. |
| 30 | Not Using the Army | civic (newspaper) | → **mood-cosmic** or new **mood-stone**. War needs weight, not editorial distance. |
| 31 | Weapons | civic (newspaper) | → **mood-stone**. Funeral rites in newsprint is tonally wrong. |
| 47 | Not Going Out | silence | Use `hammershoi.jpg`. Hammershøi's empty Danish interior IS "not going out." You have the image. Use it. |
| 52 | The Mother | civic | → **mood-wabi** or warm. Maternal intimacy in heavy black rules is cold. |
| 55 | The Infant | wabi | → new **mood-flesh**. A blank cream page for newborn vitality is inhuman. Warm rose, rounded forms. |
| 67 | Three Treasures | pop (Warhol) | → **mood-wabi** or **mood-stone**. Kindness + thrift + humility in Warhol halftone is deeply wrong. |
| 70 | Being Misunderstood | pop | → **mood-wabi**. Solitude needs quiet, not a POW badge. |
| 76 | Soft vs Hard | natural | Good. But use `hokusai-rainstorm.jpg` — water as force, not just Fuji. |
| 78 | Water / Soft Beats Hard | natural | Good. But use `hiroshige-rain.jpg` for the rain chapter. |

**Use your unused images.** You have 12 images in `img/`. Only 4 are used. The other 8 are thematically perfect for chapters that never got them. This is the lowest-hanging fruit in the entire audit. Map them. Done.

**Animations need to be thematic, not uniform.** One `fade + translateY(14px)` for all 81 chapters is like playing the same song at every funeral and wedding. Water chapters should flow in. Cryptic chapters should glitch. Wabi chapters should breathe. This is CSS keyframes, not rocket science.

---

## 3. English: The Good, the Bad, and the Fixable

Your English voice is mostly excellent. The Hemingway-direct style works. But there are cracks.

### 3.1 Critical Errors (Fix Today)

| Location | Issue | Fix |
|----------|-------|-----|
| `chapters.js` line 3 | "Wang Bi 王弼 (public domain · 4th c. BCE)" | **Wang Bi lived 226–249 CE.** This is a 700-year dating error. Fix: "3rd c. CE" |
| Ch 23 | "If trust is short, the lack of trust is plenty" | Mistranslation of 信不足焉，有不信焉. Fix: "When trust is insufficient, there is distrust." |
| Ch 27 | "Good doors lock without a bar" | 閉 means "close/shut," not "lock." Fix: "Good closing needs no bolt." |
| Ch 28 | "Be the brook of the world" | 谿 means ravine/valley. "Brook" changes the image. Fix: "Be the valley of the world." |
| Ch 42 | "The forceful do not die well" | Softens 強梁者不得其死. Fix: "The violent do not meet a natural death." |
| Ch 52 | "Make yourself useful. And you're never saved" | 濟其事 means "meddle in affairs," not "make yourself useful." This inverts the meaning. Fix: "Meddle in affairs. And you're never saved." |
| Ch 70 | "Nobody can do them" | 行 means "practice/act." Fix: "Nobody can practice them." |

### 3.2 British/American Spelling (Pick One)

You describe the English as "Hemingway-direct." Hemingway was American. But British spellings appear throughout:
- "honours" (Ch 31) → "honors"
- "realised" (closers) → "realized"
- "behavioural" (extended) → "behavioral"
- "centre" (summaries Ch 26) → "center"
- "Haemodynamic" (extended Ch 76) → "Hemodynamic"

**Standardize to American spelling.** It matches the sparse, punchy register.

### 3.3 Awkward / Verbose Phrasing (Tighten)

| Location | Current | Tighter |
|----------|---------|---------|
| Ch 5 | "The wise person is the same. They treat the people the same way." | "The wise person is no different." |
| Ch 5 | "The ninth-floor balcony does not refund." | "The ninth-floor balcony does not warn you." ("Refund" on a balcony is almost clever but doesn't land.) |
| Ch 20 | "But the joke goes on forever." | 荒兮其未央哉 means "vast and boundless." "Joke" is a creative stretch that doesn't pay off. Fix: "But it goes on forever." |
| Ch 24 | "all this is leftovers and growths" | "Growths" is medical. Fix: "leftovers and excrescences" or just "leftovers." |
| Ch 33 | "Beat yourself — mighty." | "Mighty" feels epic, clashing with Daoist tone. Fix: "Beat yourself — strong." |
| Ch 46 | "Know that enough is enough — and you will always have enough." | Three "enoughs." Fix: "Knowing enough is enough." |
| Ch 68 | "We call this matching the old extremity of heaven." | Very cryptic. Fix: "We call this: aligning with heaven, the oldest extreme." |
| Ch 75 | "Only those who don't make a project of living..." | Creative but unclear. Fix: "Only those who do not treat living as a project..." |

### 3.4 Notes That Need Honesty

Some notes repeat. "My favourite chapter" appears in Ch 8 and Ch 20, almost verbatim. Pick one. The other should admit something else.

Some notes are much more personal than others. Chapters 1, 7, 8, 33, 38, 44, 48 have long stories. Many have none. This is not a flaw per se, but the book feels slightly uneven. **If you don't have a real story for a chapter, don't force one. The blank is better than the filler.**

The smart-city/dashboard references appear in multiple notes (Ch 3, 17, 38). They effectively anchor the text to your expertise, but by the third appearance the reader starts to notice the repetition. Either vary the domain or drop the third one.

---

## 4. Thai: Almost There

Thai is not a translation layer in this project. It is co-equal. That is the right choice and it is working. The Thai translations are native-quality, professional, and stylistically consistent. The voice uses **ผม** first-person throughout. The tone marks are correct. The scientific terminology is well-handled.

### 4.1 What's Complete (81/81)
- Core verse translations (`ch.th`)
- Chapter titles (`th_title`)
- One-sentence summaries
- Closing questions (`closers.js`)

### 4.2 What's Missing (The Real Gap)
- **Extended direct translations (`direct_th`)**: ~25 chapters have it. ~56 fall back to English with a tag.
- **Extended readings (`reading_th`)**: Same ~25 chapters.
- **Notes (`note_th`)**: Only ~15 chapters.
- **Character breakdowns**: Only 4 of 81 characters have Thai mnemonics.

A Thai reader can read the entire book comfortably. But they get less depth than an English reader on the extended commentary. The fallback tags — *"บทแปลไทยเชิงอรรถาธิบายกำลังตามมา"* — are honest but they become wallpaper after the tenth chapter.

### 4.3 One Stylistic Fix
Ch 78: *"อ่อนชนะแข็ง อ่อนชนะแข็งกระด้าง"* — the second clause repeats `อ่อน` instead of varying it to match the English "soft beats the hard." Consider: *"อ่อนชนะแข็ง นุ่มชนะกระด้าง"* or *"อ่อนชนะแข็ง อ่อนนุ่มชนะกระด้าง"*.

### 4.4 The Hard Truth About Thai Extended Content
Writing 56 more direct translations, 56 more readings, and 66 more character breakdowns is a lot of work. It is probably 40-60 hours of focused writing. The question is: does a Thai reader need the extended layers to understand the book?

My read: **No.** The core verse translation + your note + the closer is enough for almost every chapter. The extended layers are gravy. If you have Thai for the chapters where the teaching is genuinely difficult (Ch 1, 14, 25, 38, 40, 56, 81), that is sufficient. For the rest, let the Chinese and the English carry the scholarly weight, and let the Thai carry the poem.

**Do not let perfect Thai completeness block shipping.** The book is already good in Thai. Make it great in the chapters that matter most.

---

## 5. What to Cut (The Honest List)

### Cut entirely:
1. **Data wall** (`datawall.js`). The live market noise was conceptually interesting but it makes the book feel like a Bloomberg terminal. The cover should be quiet.
2. **Code panels** (all of `ext.code`). TypeScript-as-philosophy is a good tweet. It is not a good panel, repeated 20 times. The reader who understands code does not need it to understand Daoism. The reader who does not understand code is alienated.
3. **Play cards** (most of `ext.play`). Keep only the genuinely illuminating ones. Cut the ChatGPT references — they will date faster than milk.
4. **Compare panels** (merge into Reading, one sentence).

### Cut conditionally:
5. **Tsai cartoons** — keep only where the image genuinely teaches (Ch 1, 8, 11, 20, 48). The rest are decoration.
6. **NPM paintings** — keep all 10. They are the most stunning visual moments.
7. **Character panels** — keep but add Thai breakdowns for the chapters that matter most.

### Keep everything:
8. **Origin** (Chinese + pinyin + English + Thai). This IS the book.
9. **Reading** — but only where you have something real to say.
10. **Note** — but only where the story is specific and personal.
11. **Closer** — all 81. They are good.
12. **Summaries** — all 81. They are the spine.
13. **Prologue** — all four acts. They set the voice.
14. **Notes overlay** (About / Currents / In the Wild). This is where the extra material goes. The sidebar is the right container for overflow.

---

## 6. The Design Prescription: Chapter by Chapter

I am not going to prescribe 81 custom designs. That is not how your voice works. Your voice says: here is the principle, now apply it. So here is the principle:

**Each chapter gets ONE visual idea. Not two. Not six. One.**

| Teaching | Visual Idea | Example Chapters |
|----------|-------------|-----------------|
| Water, softness, valley | Flowing jade, organic curves, water imagery | 6, 8, 22, 28, 43, 76, 78 |
| Emptiness, nothing, stillness | Maximum margin, almost empty, one line centered | 4, 11, 16, 20, 48, 56 |
| War, weapons, force | Stone texture, heavy serif, no color | 30, 31, 69 |
| Paradox, reversal, cryptic | Glitch, scanlines, text that reveals wrong | 2, 14, 36, 50, 71 |
| Cosmic, origin, the Way | Dark smoke, gold accents, depth | 1, 4, 5, 21, 25 |
| Infant, mother, flesh | Warm rose, rounded forms, slower animations | 6, 52, 55 |
| Practical, civic, governance | Newspaper is fine but use it sparingly | 17, 26, 29, 60, 61 |
| Witty, pop, social critique | Warhol only for chapters that are actually funny | 12, 18, 38, 41 |
| Mirror, reversal, end | Ink inversion, upside-down, the book folding on itself | 81 |

**The rule:** If a chapter's mood does not make a stranger feel something different from the previous chapter, change the mood.

---

## 7. The Language Prescription: Fix in This Order

1. **Fix the Wang Bi dating error today.** Line 3 of `chapters.js`. 700 years is not a typo. It undermines credibility.
2. **Fix the six mistranslations.** Ch 23, 27, 28, 42, 52, 70. These shift or obscure meaning.
3. **Standardize spelling to American.** One pass with find-and-replace.
4. **Tighten the 14 awkward phrases.** One editing pass.
5. **Audit every Note for repetition.** "My favourite chapter" gets one slot. Smart-city dashboards get two slots, max.
6. **Write Thai for the heavy chapters** (Ch 1, 14, 25, 38, 40, 56, 81) if you haven't already. Let the rest be.

---

## 8. The One Thing That Would Make This Stunning

The book is beautiful. The typography is exquisite. The trilingual structure is genuinely first-class. The notes are smart. The paintings are world-class. But it is not yet stunning because **it is too careful.**

You have 81 chapters that mostly look like 8 chapters. You have extended layers that repeat the same moves. You have animations that never vary. You have images sitting unused on your hard drive.

Stunning would be:
- Chapter 11 (Use of Nothing) with so much margin that the text is a whisper in a field of cream.
- Chapter 20 (Being the Strange One) with Friedrich's wanderer as the only image, full-bleed, and the text small at the bottom.
- Chapter 47 (Not Going Out) with Hammershøi's empty interior, and the text so sparse it feels like a letter from someone who has not left their house in years.
- Chapter 55 (The Infant) in warm rose, with rounded type, and no sharp corners anywhere.
- Chapter 81 (Mirror) reversed, so the reader has to mentally flip it — the book folding back on itself.

The design system is mature enough to support this audacity. The reader who scrolls through chapter after chapter of beautiful but similar pages begins to trust the beauty and stop noticing the teaching. **Make them notice.** Make chapter 67 so visually wrong for "kindness" that the reader stops and thinks: why does this look like this? And then they read the text, and they understand.

That is the job. Not decoration. Teaching through the eye.

---

## 9. Final Word

You wrote in your blog: *"Writing is essential to people like me, who write to learn."* This book is you learning the Dao De Jing in public. That is its strength and its risk. The risk is that you built too much — too many panels, too many moods, too many clever moves. The strength is that the voice is real, the scholarship is deep, and the translations are among the best modern English versions of this text.

Cut what is not you. Keep what is. The book will be shorter, stranger, and better.

The book is not impatient. But the reader is. Give them one clear hit per chapter. Then let them go.

— Non · Bangkok · 2026
