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
  const CHARACTER_NOTES_CN = window.CHARACTER_NOTES_CN || {};
  const CHARACTER_NOTES_TH = window.CHARACTER_NOTES_TH || {};
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

  const SCALE_OVERRIDES = {
    1: 'XL',   // 體道 — the source, monumental
    8: 'XL',   // On Water — deep, expansive
    11: 'XL',  // Use of Nothing — architectural emptiness
    16: 'XL',  // Returning to Root — stillness as space
    20: 'XL',  // Being Strange — solitude as architecture
    25: 'XL',  // Four Greats — cosmic scale
    38: 'XL',  // Decline of Virtue — the long fall
    40: 'XL',  // Reversal — the turning point
    42: 'XL',  // Three — generative explosion
    48: 'XL',  // Learning and Doing — subtracting as monument
    55: 'XL',  // Infant — origin of life
    78: 'XL',  // Water Again — return to source
    81: 'XL',  // Last Word — closing monument
    2: 'L',    // Pairs — expansive pairs
    4: 'L',    // Empty Vessel — spacious void
    5: 'L',    // Bellows — breathing room
    6: 'L',    // Valley — natural expanse
    7: 'L',    // Lasting — long view
    14: 'L',   // Subtle — delicate expanse
    21: 'L',   // Form of Virtue — substantial
    22: 'L',   // Bending — flexible space
    28: 'L',   // Holding Female — receptive space
    33: 'L',   // Knowing — knowledge as room
    36: 'L',   // Faint Light — dimming expanse
    43: 'L',   // Softest Thing — penetrating depth
    44: 'L',   // Name and Body — embodied space
    50: 'L',   // Coming and Going — cycle room
    56: 'L',   // Ones Who Don't Talk — quiet expanse
    64: 'L',   // Beginnings — thousand-mile journey
    67: 'L',   // Three Treasures — generous space
    76: 'L',   // Soft and Hard — material depth
    3: 'S',    // Not Goading — tight, practical
    9: 'S',    // Knowing When to Stop — compact wisdom
    10: 'S',   // Holding One — brief
    12: 'S',   // Five Colours — vivid but tight
    13: 'S',   // Praise — sharp, short
    15: 'S',   // Old Masters — brief lesson
    17: 'S',   // Quiet Leadership — tight
    18: 'S',   // Loss of Way — compact lament
    19: 'S',   // Dropping Categories — brief
    23: 'S',   // Few Words — concise
    24: 'S',   // Tiptoe — transient, small
    26: 'S',   // Heaviness — weight, compact
    27: 'S',   // Good Work — tight craft
    29: 'S',   // Running World — brief warning
    30: 'S',   // Not Using Army — funeral compact
    31: 'S',   // Weapons — sharp, brief
    32: 'S',   // Names — tight
    34: 'S',   // Going Both Ways — brief
    35: 'S',   // Great Image — compact
    37: 'S',   // Doing Nothing — minimal
    39: 'S',   // One — singular, tight
    41: 'S',   // Three Hearers — brief
    45: 'S',   // Looking Wrong — sharp
    46: 'S',   // Enough — complete, tight
    47: 'S',   // Not Going Out — interior, compact
    49: 'S',   // Borrowed Heart — brief
    51: 'S',   // Nourishing — intimate, small
    52: 'S',   // Mother — tight warmth
    53: 'S',   // Crooked Path — brief
    54: 'S',   // Cultivation — compact
    57: 'S',   // Less Government — tight
    58: 'S',   // Dim Government — brief
    59: 'S',   // Saving — compact
    60: 'S',   // Cooking Small Fish — intimate
    61: 'S',   // Lowest Place — tight depth
    62: 'S',   // Storehouse — compact
    63: 'S',   // Hard from Easy — brief
    65: 'S',   // Not Making Clever — tight
    66: 'S',   // Sea Wins — compact
    68: 'S',   // Not Fighting — brief
    69: 'S',   // Reluctant Soldier — tight
    70: 'S',   // Misunderstood — compact solitude
    71: 'S',   // Knowing Not Knowing — brief
    72: 'S',   // Fear — tight
    73: 'S',   // Net of Heaven — compact
    74: 'S',   // Killing — sharp, brief
    75: 'S',   // Hungry — tight
    77: 'S',   // Way of Heaven — compact
    79: 'S',   // Settled Grievances — brief
    80: 'S',   // Small Country — intimate, tight
  };
  function scaleClassFor(ch) {
    return 'scale-' + (SCALE_OVERRIDES[ch.n] || 'M');
  }
  if (!CH.length) { console.error('No chapters'); return; }

  const $  = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
  const escapeHtml = (s) => String(s||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const tri = (en, th, cn, cls='') => {
    const klass = cls ? ` class="${cls}"` : '';
    return `<span${klass} data-lang="en">${escapeHtml(en)}</span><span${klass} data-lang="th">${escapeHtml(th || en)}</span><span${klass} data-lang="cn">${escapeHtml(cn || en)}</span>`;
  };
  const triText = (copy, cls='') => {
    const text = typeof copy === 'string' ? { en: copy, th: copy, cn: copy } : (copy || {});
    return tri(text.en || '', text.th || text.en || '', text.cn || text.en || '', cls);
  };
  const triBlock = (tag, cls, copy) => {
    const text = typeof copy === 'string' ? { en: copy, th: copy, cn: copy } : (copy || {});
    return `<${tag} class="${cls}" data-lang="en">${escapeHtml(text.en || '')}</${tag}>
            <${tag} class="${cls}" data-lang="th">${escapeHtml(text.th || text.en || '')}</${tag}>
            <${tag} class="${cls}" data-lang="cn">${escapeHtml(text.cn || text.en || '')}</${tag}>`;
  };
  const panelLabel = (num, en, th, cn, han, py) => `
    <div class="panel-label">
      <span class="pl-num">${escapeHtml(num)}</span>
      ${tri(en, th, cn)}
      <span class="pl-cn">${escapeHtml(han)} <em>${escapeHtml(py)}</em></span>
    </div>`;
  const uiButton = (key) => {
    const copy = {
      listen: ['Listen', 'ฟังภาษาจีน', '听中文'],
      pause: ['Pause', 'พักเสียง', '暂停'],
      watch: ['Watch strokes', 'ดูเส้นเขียน', '看笔顺'],
      playing: ['Drawing...', 'กำลังเขียน...', '正在写...'],
      try: ['Try writing', 'ลองเขียน', '试写'],
      drawing: ['Your turn...', 'ถึงตาคุณ...', '轮到你写...'],
      done: ['Well done', 'ทำได้ดี', '写得好'],
      beginning: ['Beginning', 'จุดเริ่มต้น', '开始'],
      end: ['End', 'จบบท', '结束'],
    }[key] || ['', '', ''];
    return tri(copy[0], copy[1], copy[2]);
  };
  const LEARNER_CHECKPOINTS = [
    { until: 5, en: 'Language creates the first split.', th: 'ภาษาเริ่มต้นการแบ่งโลกเป็นคู่ตรงข้าม', cn: '语言先把世界切成对立面' },
    { until: 10, en: 'Water wins by going low.', th: 'น้ำชนะเพราะยอมลงต่ำ', cn: '水因居下而得胜' },
    { until: 15, en: 'Emptiness is part of the use.', th: 'ความว่างเปล่าคือส่วนหนึ่งของการใช้งาน', cn: '空处本身就是用途' },
    { until: 20, en: 'Do less. Let the mud settle.', th: 'ทำให้น้อยลง แล้วรอให้โคลนตกตะกอน', cn: '少做一点，让泥自己沉下去' },
    { until: 25, en: 'Sacred foolishness can see more.', th: 'ความโง่ศักดิ์สิทธิ์มองเห็นได้มากกว่า', cn: '有时“愚”比聪明看得更远' },
    { until: 30, en: 'Tiptoe living collapses.', th: 'ชีวิตแบบเขย่งปลายเท้าอยู่ได้ไม่นาน', cn: '踮脚的人生站不久' },
    { until: 35, en: 'The world resists being forced.', th: 'โลกต่อต้านคนที่พยายามฝืนมัน', cn: '世界最怕被硬拧' },
    { until: 40, en: 'Know yourself before naming virtue.', th: 'รู้จักใจตัวเองก่อนนิยามความดี', cn: '先认识自己，再谈德行' },
    { until: 45, en: 'Return is how the Way moves.', th: 'การย้อนกลับคือวิธีเคลื่อนไหวของเต๋า', cn: '回返就是道的运动' },
    { until: 50, en: 'In study you add; in Dao you subtract.', th: 'หาความรู้คือการเพิ่ม แต่ปฏิบัติเต๋าคือการทิ้ง', cn: '求学是加法，入道是减法' },
    { until: 55, en: 'Trust and inequality reveal a society.', th: 'ความไว้ใจและความเหลื่อมล้ำบอกอาการของสังคม', cn: '信任与贫富差距最能暴露社会病灶' },
    { until: 60, en: 'Govern lightly. Do not over-stir.', th: 'บริหารเบามือ อย่าเขี่ยปลาตัวเล็กจนเละ', cn: '治大事要轻手，别把小鱼翻烂' },
    { until: 65, en: 'Silence, infancy, and softness are strengths.', th: 'ความเงียบ ความเป็นทารก และความอ่อนโยนคือพลัง', cn: '安静、婴儿、柔软，本身就是力量' },
    { until: 70, en: 'A thousand miles still begins below your feet.', th: 'หนทางหมื่นลี้ ยังเริ่มต้นที่ใต้ฝ่าเท้า', cn: '千里之行，仍从脚下开始' },
    { until: 75, en: 'Mercy, thrift, and staying behind are not weakness.', th: 'เมตตา มัธยัสถ์ และการไม่แย่งนำ ไม่ใช่ความอ่อนแอ', cn: '慈、俭、不争先，并不软弱' },
    { until: 81, en: 'Softness belongs to life; plain truth closes the book.', th: 'ความอ่อนโยนอยู่ฝ่ายชีวิต และคำจริงที่ไม่เพราะคือบทสรุปสุดท้าย', cn: '柔属于生命，而不好听的真话收束全书' },
  ];
  function checkpointFor(n) {
    return LEARNER_CHECKPOINTS.find(cp => n <= cp.until) || LEARNER_CHECKPOINTS[LEARNER_CHECKPOINTS.length - 1];
  }

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
    const cnDirectLines = (ext.direct_cn || '').split('\n');

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
      const cn = escapeHtml((cnDirectLines[i] || '').trim());

      return `
        <div class="origin-line">
          <div class="origin-chars">${charsHTML}</div>
          ${cn ? `<p class="origin-gloss" data-lang="cn"><span class="og-mark">→</span> ${cn}</p>` : ''}
          ${en ? `<p class="origin-gloss" data-lang="en"><span class="og-mark">→</span> ${en}</p>` : ''}
          ${th ? `<p class="origin-gloss" data-lang="th"><span class="og-mark">→</span> ${th}</p>` : ''}
        </div>
      `;
    }).join('');
  }

  // Image map for contemporary photos (light — reuse existing local art)
  const IMG_MAP = {
    'blank-page':  { src: 'img/sotatsu.jpg',     credit: 'Tawaraya Sōtatsu · Waves at Matsushima · 17th c.', cap: { en:'Before words.', th:'ก่อนคำพูด', cn:'在语言之前。' } },
    'sotatsu':     { src: 'img/sotatsu.jpg',     credit: 'Tawaraya Sōtatsu · Waves at Matsushima · 17th c.', cap: { en:'The world before explanation.', th:'โลกก่อนคำอธิบาย', cn:'解释之前的世界。' } },
    'river-stones': { src: 'img/hokusai-fuji.jpg', credit: 'Hokusai · Fine Wind, Clear Morning · c. 1830', cap: { en:'Water, making its long sentence.', th:'น้ำกำลังเขียนประโยคยาวของมัน', cn:'水写着自己的长句。' } },
    'muji-room':   { src: 'img/sesshu.jpg',      credit: 'Sesshū Tōyō · Splashed-Ink Landscape · 1495',    cap: { en:'The void is the work.', th:'ความว่างคืองาน', cn:'空白就是作品。' } },
    'sesshu':      { src: 'img/sesshu.jpg',      credit: 'Sesshū Tōyō · Splashed-Ink Landscape · 1495',    cap: { en:'A few marks. Enough.', th:'ไม่กี่รอย ก็พอแล้ว', cn:'几笔，已经足够。' } },
    'empty-desk':  { src: 'img/muqi.jpg',        credit: 'Muqi · Six Persimmons · 13th c.',                cap: { en:'Subtract until it works.', th:'ลบออกจนมันทำงานได้', cn:'减到它开始有用。' } },
    'wanderer':    { src: 'img/wanderer.jpg',    credit: 'Caspar David Friedrich · Wanderer above the Sea of Fog · c. 1818', cap: { en:'A person above mist, still unsure.', th:'คนหนึ่งเหนือหมอก ยังไม่แน่ใจ', cn:'人在雾上，仍不确定。' } },
    'monk-sea':    { src: 'img/monk-sea.jpg',    credit: 'Unknown · Monk Contemplating the Sea · 19th c.', cap: { en:'Stillness returns to root.', th:'ความนิ่งกลับสู่ราก', cn:'静，返回根。' } },
    'hiroshige-rain': { src: 'img/hiroshige-rain.jpg', credit: 'Hiroshige · Rain on a Bridge · c. 1857', cap: { en:'A gust does not last.', th:'ลมแรงอยู่ไม่นาน', cn:'疾风不会久留。' } },
    'hammershoi':  { src: 'img/hammershoi.jpg', credit: 'Vilhelm Hammershøi · Empty Interior · c. 1900', cap: { en:'The room already knows.', th:'ห้องรู้อยู่แล้ว', cn:'房间已经知道。' } },
    'hokusai-rainstorm': { src: 'img/hokusai-rainstorm.jpg', credit: 'Hokusai · Rainstorm Beneath the Summit · c. 1830', cap: { en:'Water as force.', th:'น้ำในฐานะแรง', cn:'水也是力量。' } },
    'liang-kai':     { src: 'img/liang-kai.jpg',     credit: 'Liang Kai · Sixth Patriarch Cutting Bamboo · 13th c.', cap: { en:'Knowledge in the hand.', th:'ความรู้อยู่ในมือ', cn:'知识在手上。' } },
    'whistler':      { src: 'img/whistler.jpg',      credit: 'Whistler · Nocturne in Black and Gold · c. 1875', cap: { en:'Beauty because it vanishes.', th:'งาม เพราะมันหายไป', cn:'因消逝而美。' } },
  };
  const DEFAULT_IMAGE_BY_CHAPTER = {
    6: 'monk-sea',
    9: 'muji-room',
    14: 'whistler',
    20: 'wanderer',
    23: 'hiroshige-rain',
    30: 'hammershoi',
    31: 'liang-kai',
    47: 'hammershoi',
    52: 'muji-room',
    55: 'sotatsu',
    67: 'muji-room',
    70: 'wanderer',
    76: 'hokusai-rainstorm',
    78: 'hiroshige-rain',
    80: 'sesshu',
  };
  const AVAILABLE_LOCAL_IMAGES = new Set([
    'tsai/ch01-no-name.jpg',
    'tsai/laozi-departure.jpg',
    'tsai/laozi-studies.jpg',
    'tsai/liezi-on-wind.jpg',
    'tsai/phases-of-the-way.jpg',
    'tsai/tsai-portrait.jpg',
  ]);
  const NPM_COPY = {
    1:  { meaning:{en:'A small temple sits in mist and high rocks.', th:'วัดเล็กอยู่กลางหมอกและผาสูง', cn:'小寺在雾和高岩之间。'}, relevance:{en:'The named temple is tiny. The unnamed mist carries the painting.', th:'วัดมีชื่อแต่เล็ก หมอกไร้ชื่อคือสิ่งที่พาภาพไป', cn:'有名的寺很小；无名的雾托住整幅画。'} },
    4:  { meaning:{en:'Tiny travelers move under a huge mountain.', th:'นักเดินทางเล็กมากอยู่ใต้ภูเขาใหญ่', cn:'小旅人在大山下行走。'}, relevance:{en:'The empty silk gives the mountain its weight.', th:'ผ้าไหมที่ว่างทำให้ภูเขามีน้ำหนัก', cn:'空白的绢让山有重量。'} },
    6:  { meaning:{en:'Mist holds valleys, streams, and a tiny bridge.', th:'หมอกโอบหุบเขา ลำธาร และสะพานเล็ก', cn:'雾托着山谷、溪水和小桥。'}, relevance:{en:'The valley is not a gap. It is where life gathers.', th:'หุบเขาไม่ใช่ช่องว่าง แต่คือที่ชีวิตมารวมตัว', cn:'山谷不是空缺，是生命聚集的地方。'} },
    8:  { meaning:{en:'Water is barely drawn. You feel it in the blank space.', th:'น้ำแทบไม่ถูกวาด แต่รู้สึกได้ในที่ว่าง', cn:'水几乎没画出来，却在空白里被感到。'}, relevance:{en:'The painting flows around force, like the chapter.', th:'ภาพไหลอ้อมแรง เหมือนบทนี้', cn:'画绕过力量流动，像这一章。'} },
    11: { meaning:{en:'Six fruit. Much empty paper.', th:'ผลไม้หกลูก กระดาษว่างจำนวนมาก', cn:'六个柿子，大量空白。'}, relevance:{en:'The space around them is the real lesson.', th:'ที่ว่างรอบผลไม้คือบทเรียนจริง', cn:'它们周围的空白才是真课。'} },
    16: { meaning:{en:'Six trees stand in silence across water.', th:'ต้นไม้หกต้นยืนเงียบเหนือน้ำ', cn:'六棵树隔水静立。'}, relevance:{en:'Stillness is not empty. It is return.', th:'ความนิ่งไม่ใช่ความว่าง มันคือการกลับคืน', cn:'静不是空，是返回。'} },
    17: { meaning:{en:'No hero stands in the center. The land simply works.', th:'ไม่มีวีรบุรุษกลางภาพ แผ่นดินทำงานเอง', cn:'画中没有主角，土地自己运作。'}, relevance:{en:'The best leader feels like this: present, almost unseen.', th:'ผู้นำที่ดีที่สุดก็แบบนี้ อยู่ แต่แทบไม่เห็น', cn:'最好的领导像这样：在场，却几乎不可见。'} },
    25: { meaning:{en:'Mountains and river are watched, not invented.', th:'ภูเขาและแม่น้ำถูกสังเกต ไม่ได้ถูกประดิษฐ์', cn:'山水是被观看的，不是被发明的。'}, relevance:{en:'This is ziran: letting the thing be itself.', th:'นี่คือจื้อหราน ปล่อยให้สิ่งนั้นเป็นตัวเอง', cn:'这就是自然：让事物成为自己。'} },
    48: { meaning:{en:'A sage appears in a few wet strokes.', th:'ปราชญ์ปรากฏจากหมึกเปียกไม่กี่เส้น', cn:'几笔湿墨，一个仙人出现。'}, relevance:{en:'The missing strokes are the practice.', th:'เส้นที่หายไปคือการฝึก', cn:'少掉的笔画就是修行。'} },
    56: { meaning:{en:'Bamboo bends in a wind you cannot see.', th:'ไผ่โค้งในลมที่มองไม่เห็น', cn:'竹子在看不见的风里弯。'}, relevance:{en:'It says nothing. You still know the wind is there.', th:'มันไม่พูดอะไร แต่คุณรู้ว่าลมอยู่ตรงนั้น', cn:'它什么都不说，你仍知道风在那里。'} },
    76: { meaning:{en:'Pines bend. Rock holds. Wind moves both.', th:'สนโค้ง หินตั้ง ลมขยับทั้งสอง', cn:'松树弯，岩石立，风推动两者。'}, relevance:{en:'Life stays flexible. What cannot bend is already near death.', th:'ชีวิตยืดหยุ่น สิ่งที่โค้งไม่ได้ใกล้ตายแล้ว', cn:'生命保持柔韧；不能弯的，已靠近死亡。'} },
  };
  function tsaiCaptionFor(ch, tsai) {
    if (!tsai) return null;
    const bySrc = {
      'tsai/ch01-no-name.jpg': {
        en: 'A doorway, a sage, and a name too small for the Way.',
        th: 'ประตูหนึ่ง บัณฑิตหนึ่ง และชื่อที่เล็กเกินกว่าจะกักทางไว้',
        cn: '一扇门，一位圣人，一个装不下道的名字。'
      },
      'tsai/laozi-studies.jpg': {
        en: 'Laozi as archivist: the man of decrease first had to read too much.',
        th: 'เหล่าจื๊อในฐานะบรรณารักษ์: คนที่สอนการลด ต้องเคยอ่านมากเกินไปก่อน',
        cn: '作为档案官的老子：讲“减少”的人，先读过太多。'
      },
      'tsai/laozi-departure.jpg': {
        en: 'The old teacher leaves. The gatekeeper receives the book.',
        th: 'ครูเฒ่าจากไป ผู้รักษาด่านรับหนังสือไว้',
        cn: '老教师离开，守关人留下书。'
      },
      'tsai/liezi-on-wind.jpg': {
        en: 'Liezi rides the wind: the quietest Daoist master becomes the lightest.',
        th: 'เลี่ยจื๊อขี่ลม: ปรมาจารย์เต๋าที่เงียบที่สุด กลายเป็นผู้เบาที่สุด',
        cn: '列子御风：最安静的道家大师，变得最轻。'
      },
      'tsai/phases-of-the-way.jpg': {
        en: 'The horse is the same horse. The rider has stopped fighting it.',
        th: 'ม้ายังเป็นม้าตัวเดิม คนขี่เลิกสู้กับมันแล้ว',
        cn: '马还是那匹马；骑者不再与它搏斗。'
      },
    };
    return bySrc[tsai.src] || { en: tsai.caption || '', th: tsai.caption_th || tsai.caption || '', cn: tsai.caption_cn || tsai.caption || '' };
  }

  // ----- RENDER CHAPTERS ----------------------------------------
  function chapterHTML(ch, idx) {
    const ext = EX[ch.n] || {};
    const prev = idx > 0 ? CH[idx-1] : null;
    const next = idx < CH.length-1 ? CH[idx+1] : null;

    const direct_en = ext.direct || '';
    const direct_th = ext.direct_th || '';
    const direct_cn = ext.direct_cn || '';
    const direct_th_is_fallback = !ext.direct_th && !!direct_en;
    const reading_en = ext.reading || '';
    const reading_th = ext.reading_th || '';
    const reading_cn = ext.reading_cn || '';
    const reading_th_is_fallback = !ext.reading_th && !!reading_en;
    const code = ext.code || '';
    // note_th is only shown when explicitly written — no fallback to English ch.note
    const note_en = ext.note_en || ch.note || '';
    const note_th = ext.note_th || '';
    const note_cn = ext.note_cn || '';
    const sources = ext.sources || [];
    const imgKey = ext.image || DEFAULT_IMAGE_BY_CHAPTER[ch.n];
    const img = imgKey ? IMG_MAP[imgKey] : null;
    const play = Array.isArray(ext.play) ? ext.play : [];
    const jokes = Array.isArray(ext.jokes) ? ext.jokes : [];
    const tsai = ext.tsai && ext.tsai.src && AVAILABLE_LOCAL_IMAGES.has(ext.tsai.src) ? ext.tsai : null;
    const compare = Array.isArray(ext.compare) ? ext.compare : [];

    const su = SU[ch.n];
    const checkpoint = checkpointFor(ch.n);
    const moodClass = moodClassFor(ch);
    const scaleClass = scaleClassFor(ch);

    const tpy = titlePy(ch.n);
    const spy = summaryPy(ch.n);
    // Unique per-chapter accent: shift hue by chapter number so every chapter
    // has a subtly different warmth. All 81 chapters guaranteed distinct.
    const hueShift = ((ch.n * 37) % 60) - 30; // −30 to +29 degrees
    const satBoost = ((ch.n * 13) % 20);       // 0–19% saturation nudge
    const chStyle  = `--ch-hue: ${hueShift}deg; --ch-sat: ${satBoost}%;`;

    return `
      <article class="chapter ${moodClass} ${scaleClass}${img ? ' image-spotlight' : ''}" id="ch${ch.n}" data-n="${ch.n}" data-mood="${ch.mood||'silence'}" data-scale="${scaleClass.replace('scale-','')}" style="${chStyle}">
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

        ${checkpoint ? `
        <section class="panel panel-checkpoint">
          <div class="checkpoint-frame">
            <p class="checkpoint-kicker">${tri('Checkpoint for learners', 'จุดเช็กอินสำหรับผู้เรียน', '给学习者的检查点')}</p>
            <p class="checkpoint-main">${escapeHtml(checkpoint.th)}</p>
            <p class="checkpoint-gloss" data-lang="en">${escapeHtml(checkpoint.en)}</p>
            <p class="checkpoint-gloss" data-lang="cn" style="font-family:var(--cn-serif)">${escapeHtml(checkpoint.cn)}</p>
          </div>
        </section>
        ` : ''}

        <!-- 01 ORIGIN -->
        <section class="panel panel-origin">
          ${panelLabel('01', 'Origin', 'ต้นฉบับ', '原文', '原文', 'yuán wén')}
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
              ▶ &nbsp;聽 <em>tīng</em> &nbsp;·&nbsp; ${uiButton('listen')}
            </button>
          </header>
          <div class="origin-stack">
            ${renderOriginLines(ch, ext)}
          </div>
        </section>

        ${CHARS[ch.n] ? (() => {
          const c = CHARS[ch.n];
          const cnNotes = CHARACTER_NOTES_CN[ch.n] || {};
          const thNotes = CHARACTER_NOTES_TH[ch.n] || {};
          const hasStrokeGuide = Array.isArray(c.stroke_guide) && c.stroke_guide.length;
          const isSimple = c.strokes && c.strokes <= 7;
          return `
        <!-- CHARACTER OF THE CHAPTER · 字 -->
        <section class="panel panel-character" id="char-panel-${ch.n}">
          ${panelLabel('字', 'Character', 'ตัวอักษร', '汉字', '字', 'zì')}
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
                  ▶ ${uiButton('watch')}
                </button>
                ${isSimple ? `<button class="char-btn char-btn-quiz" data-cn="${ch.n}" aria-label="Quiz mode">✏ ${uiButton('try')}</button>` : ''}
              </div>
            </div>
            <div class="char-detail">
              <p class="cd-label">
                <span data-lang="en">Breakdown · 字源 <em>zì yuán</em></span>
                <span data-lang="th" style="font-family:var(--th)">ที่มา · 字源 <em>zì yuán</em></span>
                <span data-lang="cn" style="font-family:var(--cn-serif)">字源 <em>zì yuán</em></span>
              </p>
              <p class="cd-breakdown" data-lang="en">${escapeHtml(c.breakdown)}</p>
              <p class="cd-breakdown" data-lang="th" style="font-family:var(--th)">${escapeHtml(thNotes.breakdown || c.breakdown_th || c.breakdown)}</p>
              <p class="cd-breakdown" data-lang="cn" style="font-family:var(--cn-serif)">${escapeHtml(c.breakdown_cn || cnNotes.breakdown || c.breakdown)}</p>
              <p class="cd-label">
                <span data-lang="en">Mnemonic · 記法 <em>jì fǎ</em></span>
                <span data-lang="th" style="font-family:var(--th)">วิธีจำ · 記法 <em>jì fǎ</em></span>
                <span data-lang="cn" style="font-family:var(--cn-serif)">记法 <em>jì fǎ</em></span>
              </p>
              <p class="cd-mnemonic" data-lang="en">${escapeHtml(c.mnemonic)}</p>
              <p class="cd-mnemonic" data-lang="th" style="font-family:var(--th)">${escapeHtml(thNotes.mnemonic || c.mnemonic_th || c.mnemonic)}</p>
              <p class="cd-mnemonic" data-lang="cn" style="font-family:var(--cn-serif)">${escapeHtml(c.mnemonic_cn || cnNotes.mnemonic || c.mnemonic)}</p>
              <p class="cd-label">
                <span data-lang="en">Why this character anchors the chapter</span>
                <span data-lang="th" style="font-family:var(--th)">ทำไมตัวอักษรนี้จึงสำคัญในบทนี้</span>
                <span data-lang="cn" style="font-family:var(--cn-serif)">为什么这个字支撑本章</span>
              </p>
              <p class="cd-pivot" data-lang="en">${escapeHtml(c.chapter_pivot)}</p>
              <p class="cd-pivot" data-lang="th" style="font-family:var(--th)">${escapeHtml(thNotes.chapter_pivot || c.chapter_pivot_th || c.chapter_pivot)}</p>
              <p class="cd-pivot" data-lang="cn" style="font-family:var(--cn-serif)">${escapeHtml(c.chapter_pivot_cn || cnNotes.chapter_pivot || c.chapter_pivot)}</p>
              ${hasStrokeGuide ? `
              <p class="cd-label">${tri('Stroke by stroke', 'ทีละเส้น', '一笔一画')} · 筆順 <em>bǐ shùn</em></p>
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
          ${panelLabel('畫', 'Tsai', 'ไช่จื๋อจง', '蔡志忠', '蔡志忠', 'cài zhì zhōng')}
          <figure class="tsai-frame">
            <div class="tsai-img-wrap">
              <img src="${escapeHtml(tsai.src)}" alt="${escapeHtml(tsai.caption || 'Tsai Chih-chung cartoon')}" loading="lazy" onerror="this.closest('[data-tsai-host]').classList.add('is-missing')">
            </div>
            ${tsai.caption ? `<figcaption class="tsai-caption">${triText(tsaiCaptionFor(ch, tsai))}</figcaption>` : ''}
            <p class="tsai-credit">${escapeHtml(tsai.credit || '蔡志忠 · Tsai Chih-chung')}</p>
          </figure>
        </section>
        ` : ''}

        ${reading_en ? `
        <!-- 02 READING -->
        <section class="panel panel-reading">
          ${panelLabel('02', 'Reading', 'ตีความ', '解读', '解讀', 'jiě dú')}
          <div class="reading-frame">
            <aside class="reading-aside">
              <p class="ra-q">${escapeHtml(ch.en || '').split('\n')[0]}</p>
              <p data-lang="en">The chapter, made practical.</p>
              <p data-lang="th">บทนี้ในชีวิตจริง</p>
              <p data-lang="cn">把这一章放回生活里</p>
              <p data-lang="en">One idea, one example, no fog.</p>
              <p data-lang="th">หนึ่งความคิด หนึ่งตัวอย่าง ไม่พร่าเลือน</p>
              <p data-lang="cn">一个意思，一个例子，不绕雾。</p>
            </aside>
            <div>
              <div class="reading-body" data-lang="en" lang="en">${escapeHtml(reading_en)}</div>
              <div class="reading-body" data-lang="cn" lang="zh" style="font-family: var(--cn-serif);">${escapeHtml(reading_cn)}</div>
              <div class="reading-body${reading_th_is_fallback ? ' is-fallback' : ''}" data-lang="th" lang="th" style="${!reading_th && ch.th ? 'white-space:pre-line' : ''}">${reading_th_is_fallback ? '<span class="lang-fallback-tag">ไทย · บทอ่านลึก · กำลังเขียน</span>' : ''}${escapeHtml(reading_th || (ch.th || ''))}</div>
              ${sources.length ? `
                <div class="reading-sources">
                  <span class="rs-label">${tri('Sources', 'แหล่งอ้างอิง', '来源')}</span>
                  <ul>${sources.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
                </div>
              ` : ''}
            </div>
          </div>
        </section>
        ` : `
        <!-- 02 READING (existing translation as reading) -->
        <section class="panel panel-reading">
          ${panelLabel('02', 'Reading', 'ตีความ', '解读', '解讀', 'jiě dú')}
          <div class="reading-frame">
            <aside class="reading-aside">
              <p class="ra-q">${escapeHtml((ch.en||'').split('\n')[0] || '—')}</p>
              <p data-lang="en">Dr. Non's reading.</p>
              <p data-lang="th">คำอ่านของอาจารย์นน</p>
              <p data-lang="cn">農博士的读法</p>
              <p data-lang="en">Plain language first.</p>
              <p data-lang="th">เริ่มจากภาษาที่เข้าใจง่าย</p>
              <p data-lang="cn">先用明白的话。</p>
            </aside>
            <div>
              <div class="reading-body" data-lang="en" style="white-space: pre-line;">${escapeHtml(ch.en || '')}</div>
              <div class="reading-body" data-lang="cn" style="white-space: pre-line; font-family: var(--cn-serif);">${escapeHtml(ch.cn || '')}</div>
              <div class="reading-body" data-lang="th" style="white-space: pre-line;">${escapeHtml(ch.th || '')}</div>
            </div>
          </div>
        </section>
        `}

        ${img ? `
        <section class="panel-image">
          <div class="image-bg" style="background-image: url('${img.src}')"></div>
          <div class="image-caption"><em>${triText(img.cap)}</em>${escapeHtml(img.credit)}</div>
        </section>
        ` : ''}

        <!-- Code panel removed per audit -->\n
        ${NPM[ch.n] ? (() => {
          const a = NPM[ch.n];
          return `
        <!-- 畫 NPM CHINESE PAINTING -->
        <section class="panel panel-npm" data-npm-host>
          ${panelLabel('畫', 'Painting', 'ภาพเขียน', '绘画', '畫', 'huà')}
          <figure class="npm-frame">
            <div class="npm-img-wrap">
              <img src="${escapeHtml(a.src)}" alt="${escapeHtml(a.title_en)} by ${escapeHtml(a.artist)}" loading="lazy" onerror="this.closest('[data-npm-host]').classList.add('is-missing')">
            </div>
            <figcaption class="npm-meta">
              <p class="npm-title-cn">${escapeHtml(a.title_cn)} <em class="npm-title-py">${escapeHtml(a.title_py)}</em></p>
              <p class="npm-title-en"><em>${escapeHtml(a.title_en)}</em></p>
              <p class="npm-artist">${escapeHtml(a.artist)} · ${escapeHtml(a.dynasty)}</p>
              <p class="npm-label">${tri('What you see', 'คุณกำลังเห็นอะไร', '你看到什么')}</p>
              ${triBlock('p', 'npm-meaning', (NPM_COPY[ch.n] && NPM_COPY[ch.n].meaning) || a.meaning)}
              <p class="npm-label">${tri('Why this chapter', 'เกี่ยวกับบทนี้อย่างไร', '为什么配这一章')}</p>
              ${triBlock('p', 'npm-relevance', (NPM_COPY[ch.n] && NPM_COPY[ch.n].relevance) || a.relevance)}
              <p class="npm-credit">${tri('Public domain · National Palace Museum · Wikimedia Commons', 'สาธารณสมบัติ · พิพิธภัณฑ์กู้กง · Wikimedia Commons', '公有领域 · 故宫博物院 · Wikimedia Commons')}</p>
            </figcaption>
          </figure>
        </section>
          `;
        })() : ''}

        ${(note_en || note_th || note_cn) ? `
        <!-- 03 NOTE -->
        <section class="panel panel-note">
          ${panelLabel('03', 'Note', 'บันทึก', '注', '注', 'zhù')}
          <div class="note-frame">
            <p class="note-body" data-lang="en">${escapeHtml(note_en)}</p>
            <p class="note-body" data-lang="cn" style="font-family: var(--cn-serif); font-style: normal;">${escapeHtml(note_cn)}</p>
            <p class="note-body" data-lang="th" style="font-family: var(--th); font-style: normal;">${escapeHtml(note_th)}</p>
          </div>
        </section>
        ` : ''}

        ${jokes.length ? `
        <section class="panel panel-play">
          ${panelLabel('笑', 'Side Door', 'ทางขำเล็ก ๆ', '旁门小笑', '笑', 'xiào')}
          <div class="play-frame">
            ${jokes.map((j, jIdx) => `
              <details class="play-details">
                <summary class="play-summary">
                  <span class="play-summary-mark">▸</span>
                  <span class="play-summary-copy">
                    ${triText({
                      en: j.summary_en || j.title_en || `Daoist joke ${jIdx + 1}`,
                      th: j.summary_th || j.title_th || j.summary_en || j.title_en || `Daoist joke ${jIdx + 1}`,
                      cn: j.summary_cn || j.title_cn || j.summary_en || j.title_en || `Daoist joke ${jIdx + 1}`
                    })}
                  </span>
                </summary>
                <article class="play-card">
                  ${j.tag ? `<span class="pc-tag">${escapeHtml(j.tag)}</span>` : ''}
                  ${j.title_en || j.title_th || j.title_cn ? `<h3 class="pc-title">${triText({ en: j.title_en || '', th: j.title_th || j.title_en || '', cn: j.title_cn || j.title_en || '' })}</h3>` : ''}
                  ${j.body_en || j.body_th || j.body_cn ? `
                    <div class="pc-body-stack">
                      <p class="pc-body" data-lang="en">${escapeHtml(j.body_en || '')}</p>
                      <p class="pc-body" data-lang="th" style="font-family:var(--th)">${escapeHtml(j.body_th || j.body_en || '')}</p>
                      <p class="pc-body" data-lang="cn" style="font-family:var(--cn-serif)">${escapeHtml(j.body_cn || j.body_en || '')}</p>
                    </div>
                  ` : ''}
                  ${j.illustration && j.illustration.src ? `
                    <figure class="play-figure">
                      <img src="${escapeHtml(j.illustration.src)}" alt="${escapeHtml(j.illustration.alt || j.title_en || 'Daoist joke illustration')}" loading="lazy">
                      ${j.illustration.cap ? `<figcaption class="play-figcaption">${triText(j.illustration.cap)}</figcaption>` : ''}
                    </figure>
                  ` : ''}
                  ${j.cite ? `<span class="pc-cite">${escapeHtml(j.cite)}</span>` : ''}
                </article>
              </details>
            `).join('')}
          </div>
        </section>
        ` : ''}

        ${CLOSERS[ch.n] ? `
        <!-- 問 wèn — closing question -->
        <section class="panel panel-closer">
          <div class="closer-frame">
            <p class="closer-kicker">問 <em>wèn</em> · ${tri('A question for you', 'คำถามสำหรับคุณ', '给你的问题')}</p>
            <p class="closer-q" data-lang="en">${escapeHtml(CLOSERS[ch.n].en || '')}</p>
            <p class="closer-q" data-lang="cn" style="font-family: var(--cn-serif);">${escapeHtml(CLOSERS[ch.n].cn || CLOSERS[ch.n].en || '')}</p>
            <p class="closer-q" data-lang="th">${escapeHtml(CLOSERS[ch.n].th || CLOSERS[ch.n].en || '')}</p>
          </div>
        </section>
        ` : ''}

        <footer class="chapter-foot">
          <button data-jump="${prev ? prev.n : ''}" ${prev ? '' : 'disabled'}
            aria-label="${prev ? 'Previous chapter: ' + prev.en_title : 'Beginning of book'}">
            ${prev ? '← ' + toRoman(prev.n) + ' · ' + (prev.cn_title||'') : `— ${uiButton('beginning')} —`}
          </button>
          <span class="ch-marker" aria-label="Chapter ${ch.n} of 81">第 ${ch.n} 章 / 81</span>
          <button data-jump="${next ? next.n : ''}" ${next ? '' : 'disabled'}
            aria-label="${next ? 'Next chapter: ' + next.en_title : 'End of book'}">
            ${next ? toRoman(next.n) + ' · ' + (next.cn_title||'') + ' →' : `— ${uiButton('end')} —`}
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
  const KEY_LANG = 'dao:lang:v2';
  let lang = 'en';
  try { lang = localStorage.getItem(KEY_LANG) || 'en'; } catch(e) {}
  const LANGS = ['en', 'th', 'cn'];
  function setLang(L) {
    lang = L;
    document.body.classList.toggle('lang-en', L === 'en');
    document.body.classList.toggle('lang-th', L === 'th');
    document.body.classList.toggle('lang-cn', L === 'cn');
    // Update <html lang> so screen readers announce the active language correctly
    document.documentElement.lang = L === 'cn' ? 'zh' : L === 'th' ? 'th' : 'en';
    const toggle = $('#langToggle');
    if (toggle) {
      toggle.querySelectorAll('.lang-pill').forEach(pill => {
        pill.classList.toggle('is-active', pill.dataset.langCode === L);
      });
      toggle.setAttribute('aria-label',
        L === 'th' ? 'เปลี่ยนภาษา — ไทย' : L === 'cn' ? '切换语言 — 中文' : 'Switch language — English');
    }
    try { localStorage.setItem(KEY_LANG, L); } catch(e) {}
  }
  setLang(lang);
  $('#langToggle').addEventListener('click', () => {
    const idx = LANGS.indexOf(lang);
    setLang(LANGS[(idx + 1) % LANGS.length]);
  });

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

  // ----- DEEPWORK SUMMARY OPEN/CLOSE ---------------------------
  const deepworkOverlay = $('#deepworkOverlay');
  const deepworkBtn = $('#deepworkBtn');
  const deepworkClose = $('#deepworkClose');
  let deepworkHoldTimer = null;
  let deepworkHoldStarted = 0;
  let deepworkHoldRaf = null;

  function resetDeepworkHold() {
    if (!deepworkClose) return;
    if (deepworkHoldTimer) {
      clearTimeout(deepworkHoldTimer);
      deepworkHoldTimer = null;
    }
    if (deepworkHoldRaf) {
      cancelAnimationFrame(deepworkHoldRaf);
      deepworkHoldRaf = null;
    }
    deepworkClose.classList.remove('is-holding');
    deepworkClose.style.setProperty('--hold-pct', '0%');
    const hint = $('.deepwork-close-hint', deepworkClose);
    if (hint) hint.textContent = 'hold to leave';
  }
  function closeDeepwork() {
    if (!deepworkOverlay) return;
    resetDeepworkHold();
    deepworkOverlay.classList.remove('open');
    deepworkOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function openDeepwork() {
    if (!deepworkOverlay) return;
    closeNotes();
    if (indexOverlay) indexOverlay.classList.remove('open');
    if (indexScrim) indexScrim.classList.remove('show');
    deepworkOverlay.classList.add('open');
    deepworkOverlay.setAttribute('aria-hidden', 'false');
    deepworkOverlay.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    resetDeepworkHold();
  }
  function tickDeepworkHold() {
    if (!deepworkClose || !deepworkHoldStarted) return;
    const elapsed = Date.now() - deepworkHoldStarted;
    const pct = Math.min(100, (elapsed / 5000) * 100);
    deepworkClose.style.setProperty('--hold-pct', pct + '%');
    const hint = $('.deepwork-close-hint', deepworkClose);
    if (hint) hint.textContent = elapsed >= 5000 ? 'leaving…' : `keep holding ${Math.max(1, Math.ceil((5000 - elapsed) / 1000))}s`;
    if (elapsed < 5000) deepworkHoldRaf = requestAnimationFrame(tickDeepworkHold);
  }
  function startDeepworkHold(e) {
    if (!deepworkClose) return;
    e.preventDefault();
    resetDeepworkHold();
    deepworkHoldStarted = Date.now();
    deepworkClose.classList.add('is-holding');
    deepworkHoldTimer = setTimeout(closeDeepwork, 5000);
    deepworkHoldRaf = requestAnimationFrame(tickDeepworkHold);
  }
  function stopDeepworkHold() {
    deepworkHoldStarted = 0;
    resetDeepworkHold();
  }
  if (deepworkBtn) deepworkBtn.addEventListener('click', openDeepwork);
  if (deepworkClose) {
    deepworkClose.addEventListener('pointerdown', startDeepworkHold);
    deepworkClose.addEventListener('pointerup', stopDeepworkHold);
    deepworkClose.addEventListener('pointerleave', stopDeepworkHold);
    deepworkClose.addEventListener('pointercancel', stopDeepworkHold);
  }

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
      const idx = LANGS.indexOf(lang);
      setLang(LANGS[(idx + 1) % LANGS.length]);
    } else if (e.key === 'c' || e.key === 'C') {
      e.preventDefault();
      setLang('cn');
    } else if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      setPinyin(!pinyinOn);
    } else if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      if (notesOverlay && notesOverlay.classList.contains('open')) closeNotes();
      else openNotes();
    } else if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      if (deepworkOverlay && deepworkOverlay.classList.contains('open')) return;
      openDeepwork();
    } else if (e.key === 'Escape') {
      if (deepworkOverlay && deepworkOverlay.classList.contains('open')) {
        resetDeepworkHold();
        return;
      }
      indexOverlay.classList.remove('open');
      indexScrim.classList.remove('show');
      closeNotes();
    } else if (e.key === 'e' || e.key === 'E') {
      e.preventDefault();
      if (deepworkOverlay && deepworkOverlay.classList.contains('open')) {
        resetDeepworkHold();
      } else {
        openDeepwork();
      }
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
      if (w) { w.animateCharacter(); animBtn.innerHTML = `▶ ${uiButton('playing')}`; setTimeout(() => { animBtn.innerHTML = `▶ ${uiButton('watch')}`; }, (CHARS[n]?.strokes || 8) * 700 + 1400); }
      return;
    }
    const quizBtn = e.target.closest('.char-btn-quiz');
    if (quizBtn) {
      const n = parseInt(quizBtn.dataset.cn);
      const w = getWriter(n);
      if (w) {
        w.quiz({ onComplete: () => { quizBtn.innerHTML = `✓ ${uiButton('done')}`; setTimeout(() => quizBtn.innerHTML = `✏ ${uiButton('try')}`, 2000); } });
        quizBtn.innerHTML = `✏ ${uiButton('drawing')}`;
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
      btn.innerHTML = `▐▐ &nbsp;聽 <em>tīng</em> &nbsp;·&nbsp; ${uiButton('pause')}`;
      audio.onended = () => {
        btn.classList.remove('is-playing');
        btn.innerHTML = `▶ &nbsp;聽 <em>tīng</em> &nbsp;·&nbsp; ${uiButton('listen')}`;
      };
    } else {
      audio.pause();
      btn.classList.remove('is-playing');
      btn.innerHTML = `▶ &nbsp;聽 <em>tīng</em> &nbsp;·&nbsp; ${uiButton('listen')}`;
    }
  });

  // ----- SCROLL-REVEAL ANIMATIONS -------------------------------
  // Honour prefers-reduced-motion; otherwise let panels breathe in.
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealTargets = $$('.about-stanza, .era-card, .wild-mvt, .play-card, .panel-tsai, .chapter');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.02, rootMargin: '0px 0px -4% 0px' });
    revealTargets.forEach(el => observer.observe(el));
  } else {
    // Reduced motion or no IO: show everything immediately, no transforms.
    $$('.about-stanza, .era-card, .wild-mvt, .play-card, .panel-tsai, .chapter').forEach(el => el.classList.add('is-visible'));
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
