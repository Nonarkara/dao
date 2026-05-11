/* =============================================================
   READING DAO DE JING WITH DR. NON — interaction layer
   ============================================================ */
(function() {
  'use strict';
  const CH = window.CHAPTERS || [];
  const EX = window.EXTENDED || {};
  const PY = window.PINYIN || {};
  const SU = window.SUMMARIES || {};
  const CHARS = window.CHARACTERS || {};
  const CLOSERS = window.CLOSERS || {};
  const NPM = window.NPM_ART || {};
  const PT = (window.PINYIN_TITLES || {});
  const TITLE_PY    = PT.titles    || {};   // { "1": "tǐ dào", ... }
  const SUMMARY_PY  = PT.summaries || {};   // { "1": "míng zhī jí fù zhī", ... }
  const GLOSSARY    = PT.glossary  || {};   // { "識人": { p: "shí rén", g: "..." }, ... }
  const titlePy   = (n) => TITLE_PY[String(n)] || '';
  const summaryPy = (n) => SUMMARY_PY[String(n)] || '';
  const glossPy   = (s) => (GLOSSARY[s] && GLOSSARY[s].p) || '';
  const glossEn   = (s) => (GLOSSARY[s] && GLOSSARY[s].g) || '';

  // Mood-class palette — maps the existing mood field + a few hand-curated
  // chapter overrides to richer visual treatments. The treatments are defined
  // in CSS (.mood-cosmic, .mood-wabi, .mood-natural, .mood-civic, .mood-pop,
  // .mood-cryptic, .mood-physics, .mood-mirror).
  const MOOD_OVERRIDES = {
    1:  'cosmic',     // 體道 — the source
    2:  'cryptic',    // pairs / paradox
    4:  'ink',        // empty vessel — void, minimal
    5:  'cosmic',     // straw dogs
    6:  'natural',    // valley spirit
    8:  'sea',        // water — deep, cool, jade
    9:  'wabi',       // knowing when to stop — quiet, not noisy
    11: 'ink',        // use of nothing — emptiness
    14: 'cryptic',    // can't see, hear, grasp
    16: 'ember',      // returning to root — dimming down
    20: 'wabi',       // I alone
    21: 'cosmic',
    22: 'natural',
    23: 'weather',    // few words — gusts don't last the morning
    24: 'weather',    // tiptoe — transient
    25: 'physics',    // dao models on what is so of itself
    28: 'ink',        // holding the female — uncarved block
    29: 'weather',    // trying to run the world
    30: 'stone',      // not using the army — weight, funeral
    31: 'stone',      // weapons — iron, grey
    33: 'physics',    // metacognition / calibration
    36: 'ember',      // faint light — dying fire
    37: 'ink',        // doing nothing — emptiness
    38: 'pop',        // virtue ladder decay
    40: 'ember',      // reversal — turning point
    42: 'physics',    // 1 → 2 → 3 → ten thousand
    43: 'ink',        // softest thing — penetration, void
    44: 'flesh',      // name and body — organic
    47: 'ink',        // not going out — interior, minimal
    48: 'wabi',       // subtract
    50: 'flesh',      // coming and going — birth/death cycle
    51: 'flesh',      // nourishing — warmth, organic
    52: 'flesh',      // the Mother — warmth, intimacy
    55: 'flesh',      // the Infant — warmth, not blank cream
    56: 'ember',      // those who don't talk — obscurity
    61: 'sea',        // lowest place — water finds depth
    63: 'civic',      // tackle while easy
    64: 'civic',      // thousand-mile journey
    67: 'wabi',       // three treasures — kindness/thrift/humility need quiet
    68: 'stone',      // not fighting — weight, reluctance
    69: 'stone',      // reluctant soldier — iron, grey
    70: 'wabi',       // being misunderstood — solitude, not halftone
    71: 'cryptic',    // knowing not-knowing
    74: 'stone',      // killing — heavy, funeral
    76: 'natural',    // soft vs hard
    78: 'sea',        // water again — deep, cool
    80: 'wabi',       // small country
    81: 'mirror',     // closing — book ends by reversing on itself
  };
  function moodClassFor(ch) {
    if (MOOD_OVERRIDES[ch.n]) return 'mood-' + MOOD_OVERRIDES[ch.n];
    const m = (ch.mood || 'silence');
    if (m === 'practical') return 'mood-civic';
    if (m === 'witty')     return 'mood-pop';
    if (m === 'paradox')   return 'mood-cryptic';
    if (m === 'water')     return 'mood-natural';
    if (m === 'origin')    return 'mood-cosmic';
    return 'mood-wabi';   // silence → wabi
  }
  if (!CH.length) { console.error('No chapters'); return; }

  const $  = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
  const escapeHtml = (s) => String(s||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  function toRoman(n) {
    const map = [['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]];
    let out = ''; for (const [g,v] of map) { while (n >= v) { out += g; n -= v; } }
    return out;
  }

  // Naive but effective TS syntax highlighter for the code panel
  function highlightTS(code) {
    // First escape HTML, then layer regexes
    let s = escapeHtml(code);
    // Comments first (// to end of line)
    s = s.replace(/(\/\/[^\n]*)/g, '<span class="c-com">$1</span>');
    // Strings
    s = s.replace(/('[^'\n]*'|"[^"\n]*"|`[^`\n]*`)/g, '<span class="c-str">$1</span>');
    // Keywords
    const KW = ['type','interface','class','function','const','let','var','if','else','return','declare','readonly','extends','infer','as','new','void','null','undefined','true','false','this','typeof','keyof','in','enum','export','import','from','async','await','throw','of'];
    KW.forEach(k => {
      s = s.replace(new RegExp('\\b' + k + '\\b(?![^<]*</span>)', 'g'), '<span class="c-key">' + k + '</span>');
    });
    // Numbers (rough)
    s = s.replace(/\b(\d+(?:\.\d+)?)\b(?![^<]*<\/span>)/g, '<span class="c-num">$1</span>');
    // Type names — Capitalized identifiers (rough, may overshoot)
    s = s.replace(/\b([A-Z][A-Za-z0-9_]*)\b(?![^<]*<\/span>)/g, '<span class="c-type">$1</span>');
    return s;
  }

  // Render the chapter's Chinese body as a stack of lines.
  // Each line shows: pinyin (top) → Chinese characters (middle) → translation (bottom).
  // Pinyin uses our pinyin.js token map. Translation comes from ext.direct (literal)
  // when available, else falls back to ch.en. Thai mirrors via ext.direct_th / ch.th.
  function renderOriginLines(ch, ext) {
    const tokens = PY[ch.n] || [];
    // Group tokens into lines (split on \n tokens)
    const cnLines = [];
    let cur = [];
    if (tokens.length) {
      for (const t of tokens) {
        if (t.c === '\n') { if (cur.length) cnLines.push(cur); cur = []; }
        else cur.push(t);
      }
      if (cur.length) cnLines.push(cur);
    } else {
      // Fallback: build pseudo-tokens from ch.cn so we still render lines
      const raw = (ch.cn || '').split('\n').filter(Boolean);
      for (const ln of raw) {
        cnLines.push([...ln].map(c => ({ c, p: null })));
      }
    }

    // Translation lines — prefer the literal (direct) translation; fall back to the chapter body.
    const enLines = (ext.direct || ch.en || '').split('\n');
    const thLines = (ext.direct_th || ch.th || '').split('\n');

    return cnLines.map((line, i) => {
      const charsHTML = line.map(t => {
        const c = escapeHtml(t.c);
        if (t.p) {
          return `<span class="cn-stack-char">
            <span class="cs-py">${escapeHtml(t.p)}</span>
            <span class="cs-c">${c}</span>
          </span>`;
        }
        return `<span class="cn-stack-punct">${c}</span>`;
      }).join('');

      const en = escapeHtml((enLines[i] || '').trim());
      const th = escapeHtml((thLines[i] || enLines[i] || '').trim());

      return `
        <div class="origin-line">
          <div class="origin-chars">${charsHTML}</div>
          ${en ? `<p class="origin-gloss" data-lang="en"><span class="og-mark">→</span> ${en}</p>` : ''}
          ${th ? `<p class="origin-gloss" data-lang="th"><span class="og-mark">→</span> ${th}</p>` : ''}
        </div>
      `;
    }).join('');
  }

  // Image map for contemporary photos (light — reuse existing local art)
  const IMG_MAP = {
    'blank-page':  { src: 'img/sotatsu.jpg',     credit: 'Tawaraya Sōtatsu · Waves at Matsushima · 17th c.', cap: 'Before words.' },
    'river-stones': { src: 'img/hokusai-fuji.jpg', credit: 'Hokusai · Fine Wind, Clear Morning · c. 1830', cap: 'Water, doing its long careful sentence.' },
    'muji-room':   { src: 'img/sesshu.jpg',      credit: 'Sesshū Tōyō · Splashed-Ink Landscape · 1495',    cap: 'The void is the deliverable.' },
    'empty-desk':  { src: 'img/muqi.jpg',        credit: 'Muqi · Six Persimmons · 13th c.',                cap: 'Subtract until what remains is clearly working.' },
    'wanderer':    { src: 'img/wanderer.jpg',    credit: 'Caspar David Friedrich · Wanderer above the Sea of Fog · c. 1818', cap: 'The solitary figure above the mist — not wrong, just different.' },
    'monk-sea':    { src: 'img/monk-sea.jpg',    credit: 'Unknown · Monk Contemplating the Sea · 19th c.', cap: 'Stillness is the brain returning to its root.' },
    'hiroshige-rain': { src: 'img/hiroshige-rain.jpg', credit: 'Hiroshige · Rain on a Bridge · c. 1857', cap: 'A gust does not last the morning.' },
    'hammershoi':  { src: 'img/hammershoi.jpg', credit: 'Vilhelm Hammershøi · Empty Interior · c. 1900', cap: 'You can know the world without leaving the room.' },
    'hokusai-rainstorm': { src: 'img/hokusai-rainstorm.jpg', credit: 'Hokusai · Rainstorm Beneath the Summit · c. 1830', cap: 'Water as force, not just reflection.' },
  };

  // ----- RENDER CHAPTERS ----------------------------------------
  function chapterHTML(ch, idx) {
    const ext = EX[ch.n] || {};
    const prev = idx > 0 ? CH[idx-1] : null;
    const next = idx < CH.length-1 ? CH[idx+1] : null;

    const direct_en = ext.direct || '';
    const direct_th = ext.direct_th || '';
    const direct_th_is_fallback = !ext.direct_th && !!direct_en;
    const reading_en = ext.reading || '';
    const reading_th = ext.reading_th || '';
    const reading_th_is_fallback = !ext.reading_th && !!reading_en;
    const code = ext.code || '';
    // note_th is only shown when explicitly written — no fallback to English ch.note
    const note_en = ext.note_en || ch.note || '';
    const note_th = ext.note_th || '';
    const sources = ext.sources || [];
    const imgKey = ext.image;
    const img = imgKey ? IMG_MAP[imgKey] : null;
    const play = Array.isArray(ext.play) ? ext.play : [];
    const tsai = ext.tsai && ext.tsai.src ? ext.tsai : null;
    const compare = Array.isArray(ext.compare) ? ext.compare : [];

    const su = SU[ch.n];
    const moodClass = moodClassFor(ch);

    const tpy = titlePy(ch.n);
    const spy = summaryPy(ch.n);
    // Unique per-chapter accent: shift hue by chapter number so every chapter
    // has a subtly different warmth. All 81 chapters guaranteed distinct.
    const hueShift = ((ch.n * 37) % 60) - 30; // −30 to +29 degrees
    const satBoost = ((ch.n * 13) % 20);       // 0–19% saturation nudge
    const chStyle  = `--ch-hue: ${hueShift}deg; --ch-sat: ${satBoost}%;`;

    return `
      <article class="chapter ${moodClass}" id="ch${ch.n}" data-n="${ch.n}" data-mood="${ch.mood||'silence'}" style="${chStyle}">
        <div class="chapter-strip">
          <span class="cs-num">${toRoman(ch.n)} · 第 ${ch.n} 章 · <em class="cs-num-py">dì ${ch.n} zhāng</em></span>
          <button class="cs-cn cs-cn-link" data-char-jump="${ch.n}" title="Tap to learn this character" aria-label="Learn the key character for chapter ${ch.n}">
            ${tpy ? `<span class="cs-cn-py">${escapeHtml(tpy)}</span>` : ''}
            <span class="cs-cn-han">${escapeHtml(ch.cn_title || '')}</span>
          </button>
          <span class="cs-en">${escapeHtml(ch.en_title || '')}</span>
          <span class="cs-th">${escapeHtml(ch.th_title || '')}</span>
          <span class="cs-progress">${ch.n} / 81</span>
        </div>

        ${su ? `
        <!-- ONE-SENTENCE SUMMARY — Daily Stoic spine -->
        <section class="panel panel-summary">
          <div class="summary-frame">
            ${su.cn ? `
              ${spy ? `<p class="su-cn-py">${escapeHtml(spy)}</p>` : ''}
              <p class="su-cn">${escapeHtml(su.cn)}</p>
            ` : ''}
            <p class="su-en" data-lang="en">${escapeHtml(su.en || '')}</p>
            <p class="su-th" data-lang="th">${escapeHtml(su.th || su.en || '')}</p>
          </div>
        </section>
        ` : ''}

        <!-- 01 ORIGIN -->
        <section class="panel panel-origin">
          <div class="panel-label">
            <span class="pl-num">01</span><span>Origin</span><span class="pl-cn">原文 <em>yuán wén</em></span>
          </div>
          <header class="origin-head">
            <div class="origin-num-roman">${toRoman(ch.n)} · 第 ${ch.n} 章 · <em>dì ${ch.n} zhāng</em></div>
            ${tpy ? `<p class="origin-cn-title-py">${escapeHtml(tpy)}</p>` : ''}
            <h2 class="origin-cn-title">${escapeHtml(ch.cn_title || '')}</h2>
            <p class="origin-en-title">${escapeHtml(ch.en_title || '')}</p>
            <p class="origin-th-title">${escapeHtml(ch.th_title || '')}</p>
            <p class="origin-meta">
              Wang Bi 王弼 (wáng bì) recension · ${ch.n <= 37 ? '道經 dào jīng · the Way half' : '德經 dé jīng · the Virtue half'} · ${ch.n}/81
            </p>
            <audio id="cn-audio-${ch.n}" preload="none" src="audio/ch${String(ch.n).padStart(2,'0')}-cn.mp3"></audio>
            <button class="cn-listen-btn" aria-label="Listen to the Chinese" data-ch="${ch.n}">
              ▶ &nbsp;聽 <em>tīng</em> &nbsp;·&nbsp; Listen to the Chinese
            </button>
          </header>
          <div class="origin-stack">
            ${renderOriginLines(ch, ext)}
          </div>
        </section>

        ${CHARS[ch.n] ? (() => {
          const c = CHARS[ch.n];
          const hasStrokeGuide = Array.isArray(c.stroke_guide) && c.stroke_guide.length;
          const isSimple = c.strokes && c.strokes <= 7;
          return `
        <!-- CHARACTER OF THE CHAPTER · 字 -->
        <section class="panel panel-character" id="char-panel-${ch.n}">
          <div class="panel-label">
            <span class="pl-num">字</span><span>Character</span><span class="pl-cn">字 <em>zì</em></span>
          </div>
          <div class="character-frame">
            <div class="char-brush">
              ${c.strokes ? `<span class="char-stroke-count">${c.strokes} stroke${c.strokes === 1 ? '' : 's'}</span>` : ''}
              <div class="char-writer-wrap">
                <svg id="char-writer-${ch.n}" xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220"></svg>
              </div>
              <div class="char-py">${escapeHtml(c.py)}</div>
              <div class="char-meaning">${escapeHtml(c.meaning)}</div>
              <div class="char-controls">
                <button class="char-btn char-btn-animate" data-cn="${ch.n}" aria-label="Animate strokes for ${escapeHtml(c.char)}">
                  ▶ Watch it draw
                </button>
                ${isSimple ? `<button class="char-btn char-btn-quiz" data-cn="${ch.n}" aria-label="Quiz mode">✏ Try writing it</button>` : ''}
              </div>
            </div>
            <div class="char-detail">
              <p class="cd-label">
                <span data-lang="en">Breakdown · 字源 <em>zì yuán</em></span>
                <span data-lang="th" style="font-family:var(--th)">ที่มา · 字源 <em>zì yuán</em></span>
              </p>
              <p class="cd-breakdown" data-lang="en">${escapeHtml(c.breakdown)}</p>
              <p class="cd-breakdown" data-lang="th" style="font-family:var(--th)">${escapeHtml(c.breakdown_th || c.breakdown)}</p>
              <p class="cd-label">
                <span data-lang="en">Mnemonic · 記法 <em>jì fǎ</em></span>
                <span data-lang="th" style="font-family:var(--th)">วิธีจำ · 記法 <em>jì fǎ</em></span>
              </p>
              <p class="cd-mnemonic" data-lang="en">${escapeHtml(c.mnemonic)}</p>
              <p class="cd-mnemonic" data-lang="th" style="font-family:var(--th)">${escapeHtml(c.mnemonic_th || c.mnemonic)}</p>
              <p class="cd-label">
                <span data-lang="en">Why this character anchors the chapter</span>
                <span data-lang="th" style="font-family:var(--th)">ทำไมตัวอักษรนี้จึงสำคัญในบทนี้</span>
              </p>
              <p class="cd-pivot" data-lang="en">${escapeHtml(c.chapter_pivot)}</p>
              <p class="cd-pivot" data-lang="th" style="font-family:var(--th)">${escapeHtml(c.chapter_pivot_th || c.chapter_pivot)}</p>
              ${hasStrokeGuide ? `
              <p class="cd-label">Stroke by stroke · 筆順 <em>bǐ shùn</em></p>
              <ol class="stroke-guide">
                ${c.stroke_guide.map(s => `
                  <li class="sg-step">
                    <span class="sg-n">${s.n}</span>
                    <div class="sg-text">
                      <p class="sg-move">${escapeHtml(s.move)}</p>
                      ${s.note ? `<p class="sg-note">${escapeHtml(s.note)}</p>` : ''}
                    </div>
                  </li>
                `).join('')}
              </ol>
              ` : ''}
            </div>
          </div>
        </section>
          `;
        })() : ''}

        <!-- Direct panel merged into Origin -->\n
        ${tsai ? `
        <!-- TSAI CHIH-CHUNG CARTOON -->
        <section class="panel panel-tsai" data-tsai-host>
          <div class="panel-label">
            <span class="pl-num">畫</span><span>Tsai</span><span class="pl-cn">蔡志忠 <em>cài zhì zhōng</em></span>
          </div>
          <figure class="tsai-frame">
            <div class="tsai-img-wrap">
              <img src="${escapeHtml(tsai.src)}" alt="${escapeHtml(tsai.caption || 'Tsai Chih-chung cartoon')}" loading="lazy" onerror="this.closest('[data-tsai-host]').classList.add('is-missing')">
            </div>
            ${tsai.caption ? `<figcaption class="tsai-caption">${escapeHtml(tsai.caption)}</figcaption>` : ''}
            <p class="tsai-credit">${escapeHtml(tsai.credit || '蔡志忠 · Tsai Chih-chung')}</p>
          </figure>
        </section>
        ` : ''}

        ${reading_en ? `
        <!-- 02 READING -->
        <section class="panel panel-reading">
          <div class="panel-label">
            <span class="pl-num">02</span><span>Reading</span><span class="pl-cn">解讀 <em>jiě dú</em></span>
          </div>
          <div class="reading-frame">
            <aside class="reading-aside">
              <p class="ra-q">${escapeHtml(ch.en || '').split('\n')[0]}</p>
              <p>The chapter, restated.</p>
              <p>What if X because Y, and research Z supports it?</p>
            </aside>
            <div>
              <div class="reading-body" data-lang="en">${escapeHtml(reading_en)}</div>
              <div class="reading-body${reading_th_is_fallback ? ' is-fallback' : ''}" data-lang="th" style="${!reading_th && ch.th ? 'white-space:pre-line' : ''}">${reading_th_is_fallback ? '<span class="lang-fallback-tag">บทอ่านเชิงลึกภาษาไทยกำลังตามมา</span>' : ''}${escapeHtml(reading_th || (ch.th || ''))}</div>
              ${sources.length ? `
                <div class="reading-sources">
                  <span class="rs-label">Where this comes from</span>
                  <ul>${sources.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
                </div>
              ` : ''}
            </div>
          </div>
        </section>
        ` : `
        <!-- 02 READING (existing translation as reading) -->
        <section class="panel panel-reading">
          <div class="panel-label">
            <span class="pl-num">02</span><span>Reading</span><span class="pl-cn">解讀 <em>jiě dú</em></span>
          </div>
          <div class="reading-frame">
            <aside class="reading-aside">
              <p class="ra-q">${escapeHtml((ch.en||'').split('\n')[0] || '—')}</p>
              <p>Dr. Non's reading.</p>
              <p>The chapter, in modern English.</p>
            </aside>
            <div>
              <div class="reading-body" data-lang="en" style="white-space: pre-line;">${escapeHtml(ch.en || '')}</div>
              <div class="reading-body" data-lang="th" style="white-space: pre-line;">${escapeHtml(ch.th || '')}</div>
            </div>
          </div>
        </section>
        `}

        ${img ? `
        <section class="panel-image">
          <div class="image-bg" style="background-image: url('${img.src}')"></div>
          <div class="image-caption"><em>${escapeHtml(img.cap)}</em>${escapeHtml(img.credit)}</div>
        </section>
        ` : ''}

        <!-- Code panel removed per audit -->\n
        ${NPM[ch.n] ? (() => {
          const a = NPM[ch.n];
          return `
        <!-- 畫 NPM CHINESE PAINTING -->
        <section class="panel panel-npm" data-npm-host>
          <div class="panel-label">
            <span class="pl-num">畫</span><span>Painting</span><span class="pl-cn">畫 <em>huà</em></span>
          </div>
          <figure class="npm-frame">
            <div class="npm-img-wrap">
              <img src="${escapeHtml(a.src)}" alt="${escapeHtml(a.title_en)} by ${escapeHtml(a.artist)}" loading="lazy" onerror="this.closest('[data-npm-host]').classList.add('is-missing')">
            </div>
            <figcaption class="npm-meta">
              <p class="npm-title-cn">${escapeHtml(a.title_cn)} <em class="npm-title-py">${escapeHtml(a.title_py)}</em></p>
              <p class="npm-title-en"><em>${escapeHtml(a.title_en)}</em></p>
              <p class="npm-artist">${escapeHtml(a.artist)} · ${escapeHtml(a.dynasty)}</p>
              <p class="npm-label">What you are looking at</p>
              <p class="npm-meaning">${escapeHtml(a.meaning)}</p>
              <p class="npm-label">Why it reads with this chapter</p>
              <p class="npm-relevance">${escapeHtml(a.relevance)}</p>
              <p class="npm-credit">Public domain · National Palace Museum 故宮博物院 · via Wikimedia Commons</p>
            </figcaption>
          </figure>
        </section>
          `;
        })() : ''}

        ${(note_en || note_th) ? `
        <!-- 03 NOTE -->
        <section class="panel panel-note">
          <div class="panel-label">
            <span class="pl-num">03</span><span>Note</span><span class="pl-cn">注 <em>zhù</em></span>
          </div>
          <div class="note-frame">
            <p class="note-body" data-lang="en">${escapeHtml(note_en)}</p>
            <p class="note-body" data-lang="th" style="font-family: var(--th); font-style: normal;">${escapeHtml(note_th)}</p>
          </div>
        </section>
        ` : ''}

        ${CLOSERS[ch.n] ? `
        <!-- 問 wèn — closing question -->
        <section class="panel panel-closer">
          <div class="closer-frame">
            <p class="closer-kicker">問 <em>wèn</em> · A question for you, reader</p>
            <p class="closer-q" data-lang="en">${escapeHtml(CLOSERS[ch.n].en || '')}</p>
            <p class="closer-q" data-lang="th">${escapeHtml(CLOSERS[ch.n].th || CLOSERS[ch.n].en || '')}</p>
          </div>
        </section>
        ` : ''}

        <footer class="chapter-foot">
          <button data-jump="${prev ? prev.n : ''}" ${prev ? '' : 'disabled'}>
            ${prev ? '← ' + toRoman(prev.n) + ' · ' + (prev.cn_title||'') : '— Beginning —'}
          </button>
          <span class="ch-marker">第 ${ch.n} 章 / 81</span>
          <button data-jump="${next ? next.n : ''}" ${next ? '' : 'disabled'}>
            ${next ? toRoman(next.n) + ' · ' + (next.cn_title||'') + ' →' : '— End —'}
          </button>
        </footer>
      </article>
    `;
  }
  $('#chapters').innerHTML = CH.map(chapterHTML).join('');

  // ----- INDEX OVERLAY ------------------------------------------
  function indexItemHTML(ch) {
    const tpy = titlePy(ch.n);
    return `<li><a data-jump="${ch.n}">
      <span class="ix-n">${toRoman(ch.n)}</span>
      <span class="ix-titles">
        <span class="ix-cn">${escapeHtml(ch.cn_title||'')}</span>
        ${tpy ? `<span class="ix-py">${escapeHtml(tpy)}</span>` : ''}
        <em class="ix-en">${escapeHtml(ch.en_title||'')}</em>
      </span>
    </a></li>`;
  }
  $('#indexListDao').innerHTML = CH.filter(c => c.n <= 37).map(indexItemHTML).join('');
  $('#indexListDe' ).innerHTML = CH.filter(c => c.n >= 38).map(indexItemHTML).join('');

  // ----- LANGUAGE TOGGLE ----------------------------------------
  const KEY_LANG = 'dao:lang';
  let lang = 'en';
  try { lang = localStorage.getItem(KEY_LANG) || 'en'; } catch(e) {}
  function setLang(L) {
    lang = L;
    document.body.classList.toggle('lang-en', L === 'en');
    document.body.classList.toggle('lang-th', L === 'th');
    $('#langToggle').classList.toggle('is-th', L === 'th');
    try { localStorage.setItem(KEY_LANG, L); } catch(e) {}
  }
  setLang(lang);
  $('#langToggle').addEventListener('click', () => setLang(lang === 'en' ? 'th' : 'en'));

  // ----- PINYIN TOGGLE ------------------------------------------
  // Pinyin defaults to ON — the book is teaching, not displaying.
  // Key bumped from 'dao:pinyin' to 'dao:pinyin:v2' so any stale "off"
  // preference from earlier sessions is wiped and the reader sees pinyin.
  const KEY_PY = 'dao:pinyin:v2';
  let pinyinOn = true;
  try {
    const saved = localStorage.getItem(KEY_PY);
    if (saved !== null) pinyinOn = (saved === '1');
  } catch(e) {}
  function setPinyin(on) {
    pinyinOn = !!on;
    document.body.classList.toggle('pinyin-on', pinyinOn);
    document.body.classList.toggle('pinyin-off', !pinyinOn);
    const btn = $('#pinyinToggle');
    if (btn) {
      btn.classList.toggle('is-on', pinyinOn);
      btn.setAttribute('aria-pressed', pinyinOn ? 'true' : 'false');
      btn.title = pinyinOn ? 'Hide pinyin (P)' : 'Show pinyin (P)';
    }
    try { localStorage.setItem(KEY_PY, pinyinOn ? '1' : '0'); } catch(e) {}
  }
  setPinyin(pinyinOn);
  const pyBtn = $('#pinyinToggle');
  if (pyBtn) pyBtn.addEventListener('click', () => setPinyin(!pinyinOn));

  // ----- JUMPS --------------------------------------------------
  function jumpTo(n) {
    const el = document.getElementById('ch' + n);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      saveBookmark(n);
    }
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-jump]');
    if (!btn) return;
    const n = parseInt(btn.dataset.jump);
    if (!isNaN(n)) {
      e.preventDefault();
      jumpTo(n);
      indexOverlay.classList.remove('open');
      indexScrim.classList.remove('show');
    }
  });

  // ----- NOTES OVERLAY OPEN/CLOSE + TABS ------------------------
  const notesOverlay = $('#notesOverlay');
  const notesScrim   = $('#notesScrim');
  const notesBtn     = $('#notesBtn');
  const notesClose   = $('#notesClose');

  function openNotes(tab) {
    if (!notesOverlay) return;
    notesOverlay.classList.add('open');
    notesOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (tab) setNotesTab(tab);
  }
  function closeNotes() {
    if (!notesOverlay) return;
    notesOverlay.classList.remove('open');
    notesOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function setNotesTab(tab) {
    $$('.notes-tab').forEach(b => {
      const on = b.dataset.tab === tab;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    $$('.notes-pane').forEach(p => {
      p.classList.toggle('is-active', p.dataset.pane === tab);
    });
    // Reset scroll within the overlay so each tab opens at its top
    if (notesOverlay) notesOverlay.scrollTop = 0;
    // Reveal all animated children immediately — IntersectionObserver does not
    // fire reliably across display:none ↔ block transitions inside an overlay.
    requestAnimationFrame(() => {
      $$('.notes-pane.is-active .about-stanza, .notes-pane.is-active .era-card, .notes-pane.is-active .wild-mvt')
        .forEach(el => el.classList.add('is-visible'));
    });
  }
  if (notesBtn)   notesBtn.addEventListener('click', () => openNotes());
  if (notesClose) notesClose.addEventListener('click', closeNotes);
  $$('.notes-tab').forEach(btn => {
    btn.addEventListener('click', () => setNotesTab(btn.dataset.tab));
  });
  // Allow any element with data-open-notes="<tab>" to open the overlay on a chosen tab
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-notes]');
    if (!trigger) return;
    e.preventDefault();
    openNotes(trigger.dataset.openNotes || 'about');
  });

  // ----- INDEX OVERLAY OPEN/CLOSE -------------------------------
  const indexOverlay = $('#indexOverlay');
  const indexScrim   = $('#indexScrim');
  $('#indexBtn').addEventListener('click', () => {
    indexOverlay.classList.add('open');
    indexScrim.classList.add('show');
    updateIndexBookmark();
    updateIndexCurrent();
  });
  $('#indexClose').addEventListener('click', () => {
    indexOverlay.classList.remove('open');
    indexScrim.classList.remove('show');
  });
  indexScrim.addEventListener('click', () => {
    indexOverlay.classList.remove('open');
    indexScrim.classList.remove('show');
  });

  // ----- BOOKMARK -----------------------------------------------
  const KEY_BOOK = 'dao:bookmark';
  const KEY_TS   = 'dao:bookmark-ts';
  const KEY_VIS  = 'dao:visited';
  function getVisited() { try { return JSON.parse(localStorage.getItem(KEY_VIS) || '[]'); } catch(e) { return []; } }
  function saveBookmark(n) {
    try {
      localStorage.setItem(KEY_BOOK, String(n));
      localStorage.setItem(KEY_TS, String(Date.now()));
      const v = getVisited();
      if (!v.includes(n)) {
        v.push(n);
        localStorage.setItem(KEY_VIS, JSON.stringify(v));
        markVisited();
      }
    } catch(e) {}
  }
  function markVisited() {
    const v = getVisited();
    $$('.index-list a').forEach(a => {
      const n = parseInt(a.dataset.jump);
      a.classList.toggle('visited', v.includes(n));
    });
  }
  function currentChapter() {
    let cur = null;
    for (const el of $$('.chapter')) {
      if (el.getBoundingClientRect().top <= window.innerHeight * 0.4) cur = el;
    }
    return cur ? parseInt(cur.dataset.n) : null;
  }
  function updateIndexCurrent() {
    const n = currentChapter();
    $$('.index-list a').forEach(a => a.classList.toggle('current', parseInt(a.dataset.jump) === n));
  }
  function updateIndexBookmark() {
    let saved = null;
    try { saved = parseInt(localStorage.getItem(KEY_BOOK)); } catch(e) {}
    const bm = $('#indexBookmark');
    if (saved && CH.find(c => c.n === saved)) {
      const ch = CH.find(c => c.n === saved);
      bm.innerHTML = `<a data-jump="${saved}">第 ${saved} 章 · ${escapeHtml(ch.cn_title||'')}</a>`;
      bm.classList.add('show');
    } else { bm.classList.remove('show'); }
  }

  let scrollTick = false;
  let lastSaved = null;
  function onScroll() {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(() => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      $('#progress').style.width = pct + '%';
      const n = currentChapter();
      if (n && n !== lastSaved) {
        lastSaved = n;
        saveBookmark(n);
      }
      updateIndexCurrent();
      scrollTick = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  markVisited();

  // ----- KEYBOARD -----------------------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    if (e.key === 'ArrowRight' || e.key === 'j') {
      e.preventDefault();
      const cur = currentChapter() || 0;
      const next = CH.find(c => c.n > cur);
      if (next) jumpTo(next.n);
    } else if (e.key === 'ArrowLeft' || e.key === 'k') {
      e.preventDefault();
      const cur = currentChapter() || 1;
      const arr = CH.filter(c => c.n < cur);
      if (arr.length) jumpTo(arr[arr.length-1].n);
    } else if (e.key === 'l' || e.key === 'L') {
      e.preventDefault();
      setLang(lang === 'en' ? 'th' : 'en');
    } else if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      setPinyin(!pinyinOn);
    } else if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      if (notesOverlay && notesOverlay.classList.contains('open')) closeNotes();
      else openNotes();
    } else if (e.key === 'Escape') {
      indexOverlay.classList.remove('open');
      indexScrim.classList.remove('show');
      closeNotes();
    } else if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
      e.preventDefault();
      $('#indexBtn').click();
    }
  });

  // ----- HANZI WRITER — stroke order animation -----------------
  const writers = {};  // cache: chapter n → HanziWriter instance

  function getWriter(n) {
    if (writers[n]) return writers[n];
    if (!window.HanziWriter || !CHARS[n]) return null;
    const c = CHARS[n];
    const el = document.getElementById(`char-writer-${n}`);
    if (!el) return null;
    const isMoodDark = document.getElementById(`ch${n}`)?.classList.toString().includes('mood-cosmic') ||
                       document.getElementById(`ch${n}`)?.classList.toString().includes('mood-cryptic') ||
                       document.getElementById(`ch${n}`)?.classList.toString().includes('mood-mirror');
    const strokeColor = isMoodDark ? '#f4ebd5' : '#15140f';
    const radicalColor = isMoodDark ? '#b8893a' : '#a83332';
    try {
      writers[n] = HanziWriter.create(`char-writer-${n}`, c.char, {
        width: 220, height: 220, padding: 10,
        strokeColor, radicalColor,
        strokeAnimationSpeed: 1.2,
        delayBetweenStrokes: 200,
        delayBetweenLoops: 1200,
        showCharacter: true,
        showOutline: true,
        outlineColor: '#c0bcb1',
        outlineWidth: 1,
      });
    } catch(e) { return null; }
    return writers[n];
  }

  // Lazy-init writers when the panel scrolls into view
  if ('IntersectionObserver' in window) {
    const charObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const section = entry.target;
        const n = parseInt(section.id.replace('char-panel-', ''));
        if (!isNaN(n)) getWriter(n);
        charObserver.unobserve(section);
      });
    }, { threshold: 0.1 });
    $$('.panel-character[id^="char-panel-"]').forEach(el => charObserver.observe(el));
  }

  // Chapter-strip CN title → jump to character panel and animate
  document.addEventListener('click', (e) => {
    const charJump = e.target.closest('[data-char-jump]');
    if (charJump) {
      const n = parseInt(charJump.dataset.charJump);
      const el = document.getElementById(`char-panel-${n}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => { const w = getWriter(n); if (w) w.animateCharacter(); }, 700);
      }
    }
  });

  // Animate and Quiz buttons
  document.addEventListener('click', (e) => {
    const animBtn = e.target.closest('.char-btn-animate');
    if (animBtn) {
      const n = parseInt(animBtn.dataset.cn);
      const w = getWriter(n);
      if (w) { w.animateCharacter(); animBtn.textContent = '▶ Playing…'; setTimeout(() => { animBtn.textContent = '▶ Watch it draw'; }, (CHARS[n]?.strokes || 8) * 700 + 1400); }
      return;
    }
    const quizBtn = e.target.closest('.char-btn-quiz');
    if (quizBtn) {
      const n = parseInt(quizBtn.dataset.cn);
      const w = getWriter(n);
      if (w) {
        w.quiz({ onComplete: () => { quizBtn.textContent = '✓ Well done!'; setTimeout(() => quizBtn.textContent = '✏ Try writing it', 2000); } });
        quizBtn.textContent = '✏ Drawing…';
      }
      return;
    }
  });

  // ----- CHINESE AUDIO PLAYER ----------------------------------
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.cn-listen-btn');
    if (!btn) return;
    const ch = btn.dataset.ch;
    const audio = document.getElementById(`cn-audio-${ch}`);
    if (!audio) return;
    if (audio.paused) {
      // Stop any other playing
      $$('.cn-listen-btn').forEach(b => b.classList.remove('is-playing'));
      $$('audio[id^="cn-audio-"]').forEach(a => { if (!a.paused) a.pause(); });
      audio.play();
      btn.classList.add('is-playing');
      btn.innerHTML = '▐▐ &nbsp;聽 <em>tīng</em> &nbsp;·&nbsp; Pause';
      audio.onended = () => {
        btn.classList.remove('is-playing');
        btn.innerHTML = '▶ &nbsp;聽 <em>tīng</em> &nbsp;·&nbsp; Listen to the Chinese';
      };
    } else {
      audio.pause();
      btn.classList.remove('is-playing');
      btn.innerHTML = '▶ &nbsp;聽 <em>tīng</em> &nbsp;·&nbsp; Listen to the Chinese';
    }
  });

  // ----- SCROLL-REVEAL ANIMATIONS -------------------------------
  // Honour prefers-reduced-motion; otherwise let panels breathe in.
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealTargets = $$('.about-stanza, .era-card, .wild-mvt, .play-card, .panel-tsai');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(el => observer.observe(el));
  } else {
    // Reduced motion or no IO: show everything immediately, no transforms.
    $$('.about-stanza, .era-card, .wild-mvt, .play-card, .panel-tsai').forEach(el => el.classList.add('is-visible'));
  }

  // ----- INITIAL HASH -------------------------------------------
  if (location.hash) {
    const m = location.hash.match(/^#ch(\d+)$/);
    if (m) setTimeout(() => jumpTo(parseInt(m[1])), 800);
  }

  // ----- CONTINUE TOAST -----------------------------------------
  let savedN = null;
  try { savedN = parseInt(localStorage.getItem(KEY_BOOK)); } catch(e) {}
  if (savedN && CH.find(c => c.n === savedN)) {
    const ts = parseInt(localStorage.getItem(KEY_TS) || '0');
    const days = ts ? Math.floor((Date.now() - ts) / 86400000) : 0;
    const ago = days === 0 ? 'earlier today' : days === 1 ? 'yesterday' : `${days} days ago`;
    const ch = CH.find(c => c.n === savedN);
    setTimeout(() => {
      if (window.scrollY > 600) return;
      if (location.hash) return;
      const toast = document.createElement('div');
      toast.className = 'continue-toast';
      toast.innerHTML = `
        <span class="ct-ico">道</span>
        <div class="ct-meta">
          <small>You left off ${ago}</small>
          <strong>第 ${savedN} 章 · ${escapeHtml(ch.cn_title||'')}</strong>
        </div>
        <button class="ct-jump">Continue</button>
        <button class="ct-x" aria-label="Dismiss">×</button>
      `;
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));
      const dismiss = () => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 500); };
      toast.querySelector('.ct-jump').addEventListener('click', () => { jumpTo(savedN); dismiss(); });
      toast.querySelector('.ct-x').addEventListener('click', dismiss);
      setTimeout(dismiss, 14000);
    }, 1800);
  }

  console.log(`📖 Dao De Jing v2 · ${CH.length} chapters · ${Object.keys(EX).length} extended · lang=${lang}`);
})();
