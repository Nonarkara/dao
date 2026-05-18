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
  const COMP = window.COMPARATIVE_NOTES || {};
  const TSAI = window.TSAI_LAOZI || {};
  const REF_LIBRARY = window.REFERENCE_LIBRARY || [];
  const SLINGERLAND_DEEP = window.SLINGERLAND_DEEP || {};
  const REF_I18N = window.REFERENCE_TRANSLATIONS || {};
  const SLINGERLAND_I18N = window.SLINGERLAND_TRANSLATIONS || {};
  const IDEA_THREADS = window.IDEA_THREADS || [];
  const REFLECTION_QUESTIONS = window.REFLECTION_QUESTIONS || {};
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
    // ── Book of the Way (道經, ch 1–37) ────────────────────────
    1:  'cosmic',     // 體道 — the source
    2:  'cryptic',    // pairs / paradox
    4:  'ink',        // empty vessel — void, minimal
    5:  'cosmic',     // straw dogs — heaven/earth scale
    6:  'natural',    // valley spirit — springs, feminine
    8:  'sea',        // water — deep, cool, jade
    9:  'wabi',       // knowing when to stop — quiet
    10: 'flesh',      // carrying the soul, embracing the one — body, warmth
    11: 'ink',        // use of nothing — emptiness
    13: 'ember',      // praise and disgrace — the burning of reputation
    14: 'cryptic',    // can't see, hear, grasp — paradox
    16: 'ember',      // returning to root — dimming down
    20: 'wabi',       // I alone — solitude
    21: 'cosmic',     // form of virtue — formless vastness
    22: 'natural',    // bending — yielding like a branch
    23: 'weather',    // few words — gusts don't last the morning
    24: 'weather',    // tiptoe — transient
    25: 'physics',    // Dao models on what is so of itself
    26: 'stone',      // heaviness as root — gravity, weight
    27: 'wabi',       // good work leaves no track — quiet craft
    28: 'ink',        // holding the female — uncarved block
    29: 'weather',    // trying to run the world — storms
    30: 'stone',      // not using the army — weight, funeral
    31: 'stone',      // weapons — iron, grey
    33: 'physics',    // metacognition / calibration
    34: 'natural',    // Dao flows everywhere — a river finding its way
    35: 'cosmic',     // great image — hold it and the world comes
    36: 'ember',      // faint light — dying fire
    37: 'ink',        // doing nothing — emptiness
    // ── Book of Virtue (德經, ch 38–81) ────────────────────────
    38: 'pop',        // virtue ladder decay — bold editorial
    40: 'ember',      // reversal — turning point
    42: 'physics',    // 1 → 2 → 3 → ten thousand
    43: 'ink',        // softest thing — penetration, void
    44: 'flesh',      // name and body — organic
    46: 'wabi',       // enough — contentment is still
    47: 'ink',        // not going out — interior, minimal
    48: 'wabi',       // subtract — less and less
    49: 'flesh',      // borrowed heart — the sage takes people's warmth
    50: 'flesh',      // coming and going — birth/death cycle
    51: 'natural',    // nourishing — organic growth, not forced
    52: 'flesh',      // the Mother — warmth, intimacy
    53: 'stone',      // crooked path — weight of corruption
    54: 'natural',    // cultivation — growing things
    55: 'flesh',      // the Infant — warmth, origin of life
    56: 'ember',      // those who don't talk — obscurity
    57: 'weather',    // not governing — let the winds blow
    58: 'ember',      // dim government, blunt policies — fading light
    59: 'ink',        // saving, thrift — void, minimalism
    60: 'flesh',      // cooking small fish — intimate, organic
    61: 'sea',        // lowest place — water finds depth
    62: 'ink',        // practising the Way, storehouse — emptiness
    63: 'ember',      // tackle hard while easy — before the fire spreads
    64: 'natural',    // thousand-mile journey begins — earth, growth
    65: 'stone',      // simplicity of virtue — foundational weight
    66: 'sea',        // why the sea is king — water!
    67: 'wabi',       // three treasures — kindness/thrift/humility
    68: 'stone',      // not fighting — weight, reluctance
    69: 'stone',      // reluctant soldier — iron, grey
    70: 'wabi',       // being misunderstood — solitude
    71: 'cryptic',    // knowing not-knowing — paradox
    72: 'weather',    // when people fear no more — atmospheric shift
    74: 'stone',      // killing — heavy, funeral
    75: 'flesh',      // greed, hunger — bodily need
    76: 'natural',    // soft vs hard — living tree
    77: 'physics',    // Way of Heaven, the bow — structural, precise
    78: 'sea',        // water again — return to source
    79: 'ember',      // settled grievances — old embers
    80: 'wabi',       // small country — intimacy
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
    // 10: M (default) — Carrying the Soul — measured breath
    12: 'S',   // Five Colours — vivid but tight
    13: 'S',   // Praise — sharp, short
    // 15: M (default) — Old Masters — a measured list poem
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
    // 32: M (default) — The Unnamed — cosmic at S was cramped
    // 35: M (default) — Great Image — holds the whole world
    37: 'S',   // Doing Nothing — minimal
    39: 'S',   // One — singular, tight
    // 41: M (default) — Three Hearers — the laughter chapter
    45: 'S',   // Looking Wrong — sharp
    // 46: M (default) — Enough — contentment needs room
    47: 'S',   // Not Going Out — interior, compact
    49: 'S',   // Borrowed Heart — brief
    51: 'S',   // Nourishing — intimate, small
    52: 'S',   // Mother — tight warmth
    // 53: M (default) — Crooked Path — weight of corruption
    54: 'S',   // Cultivation — compact
    // 57: M (default) — Not Governing — atmosphere needs space
    58: 'S',   // Dim Government — brief
    59: 'S',   // Saving — compact
    60: 'S',   // Cooking Small Fish — intimate
    61: 'S',   // Lowest Place — tight depth
    // 62: M (default) — Storehouse of the Way — void, spacious
    63: 'S',   // Hard from Easy — brief
    65: 'S',   // Not Making Clever — tight
    // 66: M (default) — Why the Sea Is King — depth
    68: 'S',   // Not Fighting — brief
    69: 'S',   // Reluctant Soldier — tight
    70: 'S',   // Misunderstood — compact solitude
    71: 'S',   // Knowing Not Knowing — brief
    72: 'S',   // Fear — tight
    // 73: M (default) — Net of Heaven — big net, wide cast
    74: 'S',   // Killing — sharp, brief
    75: 'S',   // Hungry — tight
    // 77: M (default) — Way of Heaven, the Bow — structural
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
      walk: ['Read each character', 'อ่านทีละตัว', '逐字朗读'],
      stop: ['Stop', 'หยุด', '停止'],
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
    { until: 15, en: 'Emptiness is part of the use.', th: 'ความว่างคือส่วนหนึ่งของการใช้งาน', cn: '空处本身就是用途' },
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
    // Only show on the exact milestone chapter (n === until), not every chapter before it
    return LEARNER_CHECKPOINTS.find(cp => n === cp.until) || null;
  }

  // ============================================================
  // CHAPTER WEIGHT — vary the rhythm.
  // 'standard' (default): all sections render if data exists.
  // 'light': cryptic short chapters — only Origin + Reading. Skip character study,
  //   Tsai panel, Note, Play, Closer, Reflection. The cryptic chapters of the DDJ
  //   work better as snacks than tasting menus. Reader breath.
  // 'wordless': radical — render the chapter character HUGE with a single line.
  //   No reading, no commentary. Earned by CH 40 (the shortest in the book).
  // ============================================================
  const CHAPTER_WEIGHT = {
    // Short cryptic chapters — let them breathe
    6: 'light', 16: 'light', 22: 'light', 24: 'light', 43: 'light',
    44: 'light', 47: 'light', 56: 'light', 67: 'light', 78: 'light',
    // CH 40 — the shortest chapter in the book (4 lines): wordless treatment
    40: 'wordless',
  };
  function weightOf(n) { return CHAPTER_WEIGHT[n] || 'standard'; }

  // ============================================================
  // SECTION BREAKS — thematic transitions between groups of chapters.
  // Rendered AFTER the chapter whose number is the key.
  // 37→38 is the only true textual division (道經 ends, 德經 begins).
  // The rest are reader-experience pauses Dr Non designed.
  // ============================================================
  const SECTION_BREAKS = {
    10: { mark: '水', kicker: { en: 'Pause 1', th: 'พัก 1', cn: '驻足 一' },
          en: 'Ten chapters in. The book has stopped trying to define the Way and has started showing you water.',
          th: 'สิบบทผ่านไป หนังสือเลิกพยายามนิยามเต๋าแล้ว มันเริ่มชี้ให้ดูน้ำ',
          cn: '十章过去了。书已经不再去定义"道"，开始让你看水。' },
    20: { mark: '獨', kicker: { en: 'Pause 2', th: 'พัก 2', cn: '驻足 二' },
          en: 'You have just read the loneliest chapter. The narrator is out of step with everyone at the banquet. Sit with that for a moment.',
          th: 'คุณเพิ่งอ่านบทที่เหงาที่สุดของหนังสือ ผู้เล่าไม่เข้ากับใครในงานเลี้ยง นั่งกับความรู้สึกนั้นสักครู่',
          cn: '你刚读完全书最孤独的一章。讲述者在宴席上与所有人格格不入。陪那种感觉坐一会儿。' },
    30: { mark: '不爭', kicker: { en: 'Pause 3', th: 'พัก 3', cn: '驻足 三' },
          en: 'Three chapters about not using force have just passed under you. The book is not pacifist. It is realist about what force costs.',
          th: 'สามบทที่ว่าด้วยการไม่ใช้กำลังเพิ่งผ่านคุณไป หนังสือเล่มนี้ไม่ใช่หนังสือสันติวิธี มันเป็นหนังสือที่มองความจริงว่ากำลังเสียอะไร',
          cn: '三章关于"不动武"刚刚翻过去。这本书不是和平主义，它是现实主义——它看清动武付出什么代价。' },
    37: { mark: '德', kicker: { en: 'Half Book', th: 'ครึ่งทาง', cn: '过半 · 德经开始' },
          en: 'You have finished 道經 — the half about the Way itself. The next 44 chapters are 德經 — the half about how the Way moves through people. Same book, second movement.',
          th: 'คุณอ่านจบ 道經 — ครึ่งที่ว่าด้วยตัวเต๋าเอง 44 บทถัดไปคือ 德經 — ครึ่งที่ว่าด้วยเต๋าเคลื่อนผ่านผู้คนอย่างไร หนังสือเล่มเดียวกัน ท่อนที่สอง',
          cn: '《道经》三十七章读完了——讲"道"本身。接下来四十四章是《德经》——讲道如何穿过人活动。同一本书，第二乐章。' },
    50: { mark: '生死', kicker: { en: 'Pause 4', th: 'พัก 4', cn: '驻足 四' },
          en: 'Halfway through. The book just walked you past death and back. Drink water.',
          th: 'เดินมาครึ่งทาง หนังสือเพิ่งพาคุณเดินผ่านความตายและกลับมา ดื่มน้ำสักแก้ว',
          cn: '走到一半了。书刚带你走过死亡又走回来。喝口水。' },
    65: { mark: '愚', kicker: { en: 'Pause 5', th: 'พัก 5', cn: '驻足 五' },
          en: 'The chapters around here praise foolishness — not stupidity, but the willingness to look stupid. Foolishness in this book is a sophisticated calibration. Try it for ten minutes after you close the tab.',
          th: 'บทแถวนี้ยกย่องความโง่ — ไม่ใช่ความโง่เง่า แต่คือความเต็มใจที่จะดูโง่ ความโง่ในหนังสือเล่มนี้คือการตั้งค่าเครื่องอย่างประณีต ลองสิบนาทีหลังปิดแท็บนี้',
          cn: '这一带的章节赞美"愚"——不是真笨，是甘愿显得笨。这本书里的"愚"是一种精细的校准。关掉标签页后试十分钟。' },
    80: { mark: '小國', kicker: { en: 'Last Pause', th: 'พักสุดท้าย', cn: '末驻足' },
          en: 'One chapter left. The book is about to end on a sentence about trust, not about cosmology. Notice the choice.',
          th: 'เหลืออีกบทเดียว หนังสือกำลังจะจบด้วยประโยคเกี่ยวกับความไว้วางใจ ไม่ใช่จักรวาลวิทยา สังเกตการเลือกนั้น',
          cn: '只剩一章。这本书的最后一句不是讲宇宙，是讲信任。留意这个选择。' },
  };

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
  function tsaiChapterFor(n) {
    return (TSAI.chapters && TSAI.chapters[String(n)]) || (TSAI.chapters && TSAI.chapters[n]) || null;
  }
  function tsaiShortNotes(tsai, chapterTsai) {
    return {
      en: (chapterTsai && chapterTsai.note && chapterTsai.note.en) || (TSAI.note && TSAI.note.en) || '',
      th: tsai && tsai.caption_th ? tsai.caption_th : (chapterTsai && chapterTsai.note && chapterTsai.note.th) || (TSAI.note && TSAI.note.th) || '',
      cn: tsai && tsai.caption_cn ? tsai.caption_cn : (chapterTsai && chapterTsai.note && chapterTsai.note.cn) || (TSAI.note && TSAI.note.cn) || ''
    };
  }
  function tsaiCaptionHTML(ch, tsai, chapterTsai) {
    const cap = tsaiCaptionFor(ch, tsai);
    const notes = tsaiShortNotes(tsai, chapterTsai);
    if (!cap && !notes.en && !notes.th && !notes.cn) return '';
    return `<figcaption class="tsai-caption">
      ${cap ? `<p class="tsai-caption-main">${triText(cap)}</p>` : ''}
      ${notes.en ? `<p class="tsai-caption-note" data-lang="en">${escapeHtml(notes.en)}</p>` : ''}
      ${notes.th ? `<p class="tsai-caption-note tsai-caption-note--th" data-lang="th">${escapeHtml(notes.th)}</p>` : ''}
      ${notes.cn ? `<p class="tsai-caption-note tsai-caption-note--cn" data-lang="cn">${escapeHtml(notes.cn)}</p>` : ''}
    </figcaption>`;
  }

  // ----- RENDER CHAPTERS ----------------------------------------
  // Wordless chapter renderer — the shortest chapter in the book (CH 40, 4 lines)
  // gets a radically different treatment: just the original characters, vertical,
  // huge, with the title character standing alone. No reading. No commentary.
  // The reader stops here and breathes. Some chapters teach by withholding.
  function wordlessChapterHTML(ch, idx, prev, next) {
    const tpy = titlePy(ch.n);
    const lines = (ch.cn || '').split('\n').filter(Boolean);
    return `
      <article class="chapter chapter-wordless" id="ch${ch.n}" data-n="${ch.n}">
        <div class="chapter-strip">
          <span class="cs-num">${toRoman(ch.n)} · 第 ${ch.n} 章 · <em class="cs-num-py">dì ${ch.n} zhāng</em></span>
          <span class="cs-cn"><span class="cs-cn-han">${escapeHtml(ch.cn_title || '')}</span></span>
          <span class="cs-en">${escapeHtml(ch.en_title || '')}</span>
          <span class="cs-th">${escapeHtml(ch.th_title || '')}</span>
          <span class="cs-progress">${ch.n} / 81</span>
        </div>
        <section class="panel panel-wordless">
          <div class="wordless-frame">
            <p class="wordless-kicker">
              <span data-lang="en">No commentary. No reading. Sit with the four lines.</span>
              <span data-lang="th" style="font-family:var(--th)">ไม่มีอรรถาธิบาย ไม่มีบทอ่าน นั่งกับสี่บรรทัด</span>
              <span data-lang="cn" style="font-family:var(--cn-serif)">没有解读，没有注。和这四行坐在一起。</span>
            </p>
            <div class="wordless-cn">
              ${lines.map(l => `<p>${escapeHtml(l)}</p>`).join('')}
            </div>
            ${tpy ? `<p class="wordless-py">${escapeHtml(tpy)}</p>` : ''}
            <p class="wordless-title-en">${escapeHtml(ch.en_title || '')}</p>
            <p class="wordless-title-th" style="font-family:var(--th)">${escapeHtml(ch.th_title || '')}</p>
            <p class="wordless-coda">
              <span data-lang="en">This is the shortest chapter in the book. The author thought that was enough.</span>
              <span data-lang="th" style="font-family:var(--th)">นี่คือบทที่สั้นที่สุดในหนังสือ ผู้เขียนคิดว่าแค่นี้พอ</span>
              <span data-lang="cn" style="font-family:var(--cn-serif)">这是全书最短的一章。作者认为这就够了。</span>
            </p>
          </div>
        </section>
        <footer class="chapter-foot">
          <button data-jump="${prev ? prev.n : ''}" ${prev ? '' : 'disabled'}>
            ${prev ? '← ' + toRoman(prev.n) + ' · ' + (prev.cn_title||'') : '— beginning —'}
          </button>
          <span class="ch-marker">第 ${ch.n} 章 / 81</span>
          <button data-jump="${next ? next.n : ''}" ${next ? '' : 'disabled'}>
            ${next ? toRoman(next.n) + ' · ' + (next.cn_title||'') + ' →' : '— end —'}
          </button>
        </footer>
      </article>
    `;
  }

  function chapterHTML(ch, idx) {
    const ext = EX[ch.n] || {};
    const prev = idx > 0 ? CH[idx-1] : null;
    const next = idx < CH.length-1 ? CH[idx+1] : null;
    const weight = weightOf(ch.n);
    // Wordless chapters get their own renderer — radical visual treatment.
    if (weight === 'wordless') return wordlessChapterHTML(ch, idx, prev, next);

    const direct_en = ext.direct || '';
    const direct_th = ext.direct_th || '';
    const direct_cn = ext.direct_cn || '';
    const direct_th_is_fallback = !ext.direct_th && !!direct_en;
    const reading_en = ext.reading || '';
    const reading_th = ext.reading_th || '';
    const reading_cn = ext.reading_cn || '';
    const reading_th_is_fallback = !ext.reading_th && !!reading_en;
    const reading_cn_is_fallback = !ext.reading_cn && !!reading_en;
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
    const chapterTsai = tsaiChapterFor(ch.n);
    const tsai = ext.tsai && ext.tsai.src && AVAILABLE_LOCAL_IMAGES.has(ext.tsai.src)
      ? ext.tsai
      : (chapterTsai && chapterTsai.inline && chapterTsai.pages && chapterTsai.pages[0])
        ? { src: chapterTsai.pages[0], caption: (chapterTsai.title && chapterTsai.title.en) || `Tsai visual reading for chapter ${ch.n}`, credit: TSAI.source || 'C. C. Tsai · Dao De Jing' }
        : null;
    const compare = Array.isArray(ext.compare) ? ext.compare : [];
    const reflection = REFLECTION_QUESTIONS[ch.n] || REFLECTION_QUESTIONS[String(ch.n)];

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
          <button class="cs-echo-btn" data-open-echo="${ch.n}" title="Comparative notes: Buddhism, religion, psychology" aria-label="Open comparative notes for chapter ${ch.n}">
            <span class="cs-echo-han">同</span>
            <span class="cs-echo-copy">${tri('Echoes', 'แสงสะท้อน', '相應')}</span>
          </button>
          ${chapterTsai ? `<button class="cs-echo-btn cs-tsai-btn" data-open-tsai="${ch.n}" title="Open Tsai illustrations" aria-label="Open Tsai illustrations for chapter ${ch.n}">
            <span class="cs-echo-han">漫</span>
            <span class="cs-echo-copy">${tri('Tsai', 'ไช่จื๋อจง', '蔡志忠')}</span>
          </button>` : ''}
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
            <p class="checkpoint-kicker">${tri('Checkpoint', 'จุดเช็กอิน', '检查点')} · <em>${tri('chapters 1–' + checkpoint.until, 'บทที่ 1–' + checkpoint.until, '第1–' + checkpoint.until + '章')}</em></p>
            <p class="checkpoint-main" data-lang="en">${escapeHtml(checkpoint.en)}</p>
            <p class="checkpoint-main" data-lang="th">${escapeHtml(checkpoint.th)}</p>
            <p class="checkpoint-main" data-lang="cn" style="font-family:var(--cn-serif)">${escapeHtml(checkpoint.cn)}</p>
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
            <div class="cn-listen-row">
              <button class="cn-listen-btn" aria-label="Listen to the Chinese" data-ch="${ch.n}">
                ▶ &nbsp;聽 <em>tīng</em> &nbsp;·&nbsp; ${uiButton('listen')}
              </button>
              <button class="cn-walk-btn" aria-label="Read each character one by one" data-ch="${ch.n}">
                ▶ &nbsp;字 <em>zì</em> &nbsp;·&nbsp; ${uiButton('walk')}
              </button>
            </div>
          </header>
          <div class="origin-stack" id="cn-stack-${ch.n}">
            ${renderOriginLines(ch, ext)}
          </div>
        </section>

        ${(weight !== 'light') && CHARS[ch.n] ? (() => {
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
            ${tsaiCaptionHTML(ch, tsai, chapterTsai)}
            <p class="tsai-credit">${escapeHtml(tsai.credit || '蔡志忠 · Tsai Chih-chung')}</p>
          </figure>
        </section>
        ` : ''}

        ${reading_en ? `
        <!-- 02 READING -->
        <section class="panel panel-reading" data-cn-glyph="${escapeHtml(ch.cn_title || '')}">
          ${panelLabel('02', 'Reading', 'ตีความ', '解读', '解讀', 'jiě dú')}
          <div class="reading-frame">
            <aside class="reading-aside">
              <p class="ra-q">${escapeHtml(ch.en || '').split('\n')[0]}</p>
              <p data-lang="en">The chapter, made practical.</p>
              <p data-lang="th">บทนี้ในชีวิตจริง</p>
              <p data-lang="cn">把这一章放回生活里</p>
              <p data-lang="en">One idea, one example, no fog.</p>
              <p data-lang="th">หนึ่งความคิด หนึ่งตัวอย่าง ไม่คลุมเครือ</p>
              <p data-lang="cn">一个意思，一个例子，不绕雾。</p>
            </aside>
            <div>
              <div class="reading-body" data-lang="en" lang="en">${escapeHtml(reading_en)}</div>
              <div class="reading-body${reading_cn_is_fallback ? ' is-fallback' : ''}" data-lang="cn" lang="zh">${reading_cn_is_fallback ? `<div class="reading-pending"><span class="rp-mark">${ch.n}</span><span class="rp-line">本章中文深度解读，作者正在打磨</span><span class="rp-sub">先以英文或泰文阅读，待中文版上线</span></div>` : escapeHtml(reading_cn)}</div>
              <div class="reading-body${reading_th_is_fallback ? ' is-fallback' : ''}" data-lang="th" lang="th" style="${!reading_th && ch.th ? 'white-space:pre-line' : ''}">${reading_th_is_fallback ? `<div class="reading-pending"><span class="rp-mark">${ch.n}</span><span class="rp-line">บทอ่านลึกภาษาไทย ผมกำลังเขียน</span><span class="rp-sub">อ่านภาษาอังกฤษหรือจีนไปก่อน ฉบับไทยจะมาถึง</span></div>` : escapeHtml(reading_th || (ch.th || ''))}</div>
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
        <section class="panel panel-reading" data-cn-glyph="${escapeHtml(ch.cn_title || '')}">
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

        ${(weight !== 'light') && (note_en || note_th || note_cn) ? `
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

        ${(weight !== 'light') && CLOSERS[ch.n] ? `
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

        ${(weight !== 'light') && reflection ? `
        <!-- 深問 shen wen — deeper life questions -->
        <section class="panel panel-reflection">
          <div class="reflection-frame">
            <p class="reflection-kicker">深問 <em>shēn wèn</em> · ${tri('Go deeper', 'ถามให้ลึกขึ้น', '深问')}</p>
            <h3 class="reflection-title">${triText(reflection.title || {})}</h3>
            <div class="reflection-lists">
              <ol data-lang="en">${((reflection.questions && reflection.questions.en) || []).map(q => `<li>${escapeHtml(q)}</li>`).join('')}</ol>
              <ol data-lang="th">${((reflection.questions && reflection.questions.th) || []).map(q => `<li>${escapeHtml(q)}</li>`).join('')}</ol>
              <ol data-lang="cn" style="font-family: var(--cn-serif);">${((reflection.questions && reflection.questions.cn) || []).map(q => `<li>${escapeHtml(q)}</li>`).join('')}</ol>
            </div>
            ${reflection.practice ? `<p class="reflection-practice">${triText(reflection.practice)}</p>` : ''}
          </div>
        </section>
        ` : ''}

        ${weight === 'light' ? `
        <!-- LIGHT CHAPTER BRIDGE — make the absence of commentary feel intentional, not broken -->
        <aside class="light-bridge" aria-label="About this chapter's treatment">
          <p data-lang="en">Some chapters work better as a snack than a tasting menu. This is one. The original text was enough for the author. We left it alone.</p>
          <p data-lang="th" style="font-family:var(--th)">บางบทเหมาะกับการเป็นของว่างมากกว่ามื้อใหญ่ บทนี้คือหนึ่งในนั้น ผู้เขียนคิดว่าต้นฉบับพอแล้ว ผมเลยไม่แตะ</p>
          <p data-lang="cn" style="font-family:var(--cn-serif)">有些章节做小食比做大餐好。这是其中之一。原文已经够了，作者觉得够，我们就没动它。</p>
        </aside>
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
  // Illustrated breaks — visual breathing room every 3-4 chapters
  const CHAPTER_BREAKS = {
    3:  { src: 'public/banners/lao-tzu-grand-palace.jpg', alt: 'Dr Non and Laozi at the Grand Palace, Bangkok',
          en: 'Every journey begins at a gate. This one happens to be gilded.',
          th: 'ทุกการเดินทางเริ่มต้นที่ประตู ประตูนี้บังเอิญเป็นทอง',
          cn: '每一段旅程都从一扇门开始。这扇门恰好是镀金的。' },
    7:  { src: 'public/banners/dogs-expo-mali.jpg', alt: 'Expo and Mali, two dogs who understand wu wei',
          en: 'Expo and Mali know the Dao. They never read it.',
          th: 'เอ็กซ์โปกับมาลีรู้เต๋า โดยไม่เคยอ่านมัน',
          cn: 'Expo和Mali懂道，但从没读过。' },
    10: { src: 'public/banners/lao-tzu-underwater.jpg', alt: 'Laozi and Dr Non reading underwater — be like water',
          en: 'Chapter 8 says be like water. We took it literally.',
          th: 'บทที่ 8 บอกว่าจงเป็นดั่งน้ำ ผมเลยพาเลาจื่อดำน้ำ',
          cn: '第八章说上善若水。我们就真的下水了。' },
    14: { src: 'public/banners/lao-tzu-train-classroom.jpg', alt: 'Laozi teaching on a moving train through the mountains',
          en: 'Somewhere between Bangkok and Chiang Mai, Laozi started a book club.',
          th: 'ระหว่างกรุงเทพกับเชียงใหม่ เลาจื่อเปิดชมรมหนังสือ',
          cn: '在曼谷和清迈之间，老子办了个读书会。' },
    17: { src: 'public/banners/lao-tzu-buffalo-parade.jpg', alt: 'Laozi and readers riding water buffaloes through the city gate',
          en: 'He left through the pass on a buffalo. We followed.',
          th: 'ท่านขี่ควายออกด่าน พวกเราตามไป',
          cn: '他骑牛出关。我们跟上了。' },
    21: { src: 'public/banners/mom-dad-2006.jpg', alt: 'Dr Non\'s parents walking together in Hong Kong, 2006',
          en: 'Mom and Dad, Hong Kong, 2006. The Dao was there before I found the book.',
          th: 'พ่อกับแม่ ฮ่องกง 2549 เต๋าอยู่ตรงนั้นก่อนผมจะเจอหนังสือ',
          cn: '爸妈，香港，2006年。在我找到这本书之前，道就在那里了。' },
    24: { src: 'public/banners/lao-tzu-taipei.jpg', alt: 'Dr Non and Laozi walking through Ximending, Taipei at night',
          en: 'Ximending at midnight. Bubble tea and the nameless.',
          th: 'ซีเหมินติงตอนเที่ยงคืน ชานมไข่มุกกับสิ่งที่ไร้ชื่อ',
          cn: '西门町午夜。珍珠奶茶与无名。' },
    27: { src: 'public/banners/train.jpg', alt: 'Travellers on the way — a train of readers moving through the Dao',
          en: 'Travellers on the way — the Dao moves, so do we.',
          th: 'คนเดินทางบนเส้นทาง — เต๋าเคลื่อน เราก็เคลื่อน',
          cn: '行者在途——道动，我们也动。' },
    31: { src: 'public/banners/my-house-184.jpg', alt: 'House 184, the house Dr Non\'s father built',
          en: '184. The house my father built. The first architecture I ever studied.',
          th: '184 บ้านที่พ่อสร้าง สถาปัตยกรรมชิ้นแรกที่ผมเคยเรียนรู้',
          cn: '184号。父亲建的房子。我学过的第一件建筑作品。' },
    34: { src: 'public/banners/lao-tzu-harvard.jpg', alt: 'Dr Non graduating at Harvard Yard with Laozi',
          en: 'Harvard Yard. The degree was a detour. The Dao was the shortcut.',
          th: 'ฮาร์วาร์ดยาร์ด ปริญญาเป็นทางอ้อม เต๋าเป็นทางลัด',
          cn: '哈佛院子。学位是绕路。道是捷径。' },
    38: { src: 'public/banners/lao-tzu-athens.jpg', alt: 'Dr Non and Laozi in the School of Athens with Plato and Aristotle',
          en: 'Plato points up, Aristotle points down. Laozi laughs.',
          th: 'เพลโตชี้ขึ้น อริสโตเติลชี้ลง เลาจื่อหัวเราะ',
          cn: '柏拉图指天，亚里士多德指地。老子笑了。' },
    41: { src: 'public/banners/lao-tzu-shanghai.jpg', alt: 'Dr Non and Laozi walking through old Shanghai with Pudong skyline',
          en: 'Shanghai, where I watched one city become three cities in ten years.',
          th: 'เซี่ยงไฮ้ ที่ผมดูเมืองเดียวกลายเป็นสามเมืองในสิบปี',
          cn: '上海——我看着一座城在十年里变成三座城。' },
    45: { src: 'public/banners/lao-tzu-vienna.jpg', alt: 'Dr Non and Laozi at Café Central, Vienna with Freud and friends',
          en: 'Café Central, Vienna. Freud, Trotsky, and now Laozi walk in.',
          th: 'คาเฟ่เซ็นทรัล เวียนนา ฟรอยด์ ทร็อตสกี้ แล้วก็เลาจื่อเดินเข้ามา',
          cn: '中央咖啡馆，维也纳。弗洛伊德、托洛茨基，现在老子也来了。' },
    48: { src: 'public/banners/lao-tzu-tibet.jpg', alt: 'Dr Non and Laozi on the Qinghai-Tibet Railway',
          en: 'The world\'s highest railway. Subtract until only the plateau remains.',
          th: 'รถไฟสูงที่สุดในโลก ลดทอนจนเหลือแต่ที่ราบสูง',
          cn: '世界最高铁路。减去一切，只剩高原。' },
    52: { src: 'public/banners/lao-tzu-sydney.jpg', alt: 'Dr Non and Laozi at Sydney Harbour with the Opera House',
          en: 'Circular Quay. The water doesn\'t care about the Opera House.',
          th: 'เซอร์คิวลาร์คีย์ น้ำไม่สนใจโรงอุปรากร',
          cn: '环形码头。水不在乎歌剧院。' },
    56: { src: 'public/banners/lao-tzu-heaven.jpg', alt: 'Dr Non and Laozi meeting the gods of Chinese mythology',
          en: 'The gods of China. All symbols. All constructions. We work with them anyway.',
          th: 'เทพเจ้าจีน สัญลักษณ์ทั้งนั้น สิ่งประดิษฐ์ทั้งนั้น แต่เราใช้มันอยู่ดี',
          cn: '中国诸神。都是符号。都是建构。我们照用不误。' },
    60: { src: 'public/banners/lao-tzu-family-home.jpg', alt: 'Dr Non introducing Laozi to his parents at the family home',
          en: 'The Way begins at the front door. Mom\'s flowers are already there.',
          th: 'เต๋าเริ่มที่ประตูหน้าบ้าน ดอกไม้ของแม่อยู่ตรงนั้นแล้ว',
          cn: '道从家门口开始。妈妈的花已经在那里了。' },
    64: { src: 'public/banners/lao-tzu-yaowarat.jpg', alt: 'Dr Non and Laozi walking through Yaowarat, Bangkok Chinatown at night',
          en: 'Yaowarat after dark. Three treasures: compassion, frugality, and a good bowl of noodles.',
          th: 'เยาวราชยามค่ำ สามสมบัติ: เมตตา ประหยัด และก๋วยเตี๋ยวชามดี ๆ',
          cn: '夜晚的耀华力路。三宝：慈、俭、还有一碗好面。' },
    69: { src: 'public/banners/lao-tzu-space.jpg', alt: 'Dr Non and Laozi reading in a space station — the Way has no gravity',
          en: 'The Way has no gravity. Neither does reading.',
          th: 'เต๋าไม่มีแรงโน้มถ่วง การอ่านก็ไม่มี',
          cn: '道没有引力。阅读也没有。' },
    76: { src: 'public/banners/gemini-train.jpg', alt: 'Readers on a train through mountain and bamboo — still reading',
          en: 'Still reading on the train. The destination was never the point.',
          th: 'ยังอ่านบนรถไฟ จุดหมายไม่เคยเป็นประเด็น',
          cn: '还在火车上读。目的地从来不是重点。' },
  };
  $('#chapters').innerHTML = CH.map((ch, idx) => {
    const html = chapterHTML(ch, idx);
    const brk = CHAPTER_BREAKS[ch.n];
    const sect = SECTION_BREAKS[ch.n];
    const isMajor = (ch.n === 37); // 道經 → 德經 the only true textual division
    const sectionHTML = sect ? `
      <section class="section-break${isMajor ? ' section-break-major' : ''}" aria-label="${escapeHtml(sect.kicker.en)}">
        <div class="sb-frame">
          <p class="sb-kicker">
            <span data-lang="en">${escapeHtml(sect.kicker.en)}</span><span data-lang="th" style="font-family:var(--th)">${escapeHtml(sect.kicker.th)}</span><span data-lang="cn" style="font-family:var(--cn-serif)">${escapeHtml(sect.kicker.cn)}</span>
          </p>
          <div class="sb-mark" aria-hidden="true">${escapeHtml(sect.mark)}</div>
          <p class="sb-line" data-lang="en">${escapeHtml(sect.en)}</p>
          <p class="sb-line" data-lang="th" style="font-family:var(--th)">${escapeHtml(sect.th)}</p>
          <p class="sb-line" data-lang="cn" style="font-family:var(--cn-serif)">${escapeHtml(sect.cn)}</p>
        </div>
      </section>` : '';
    const breakHTML = brk
      ? `<div class="chapter-break"><img src="${brk.src}" alt="${brk.alt}" loading="lazy"><p class="break-caption" data-lang="en">${brk.en}</p><p class="break-caption" data-lang="th">${brk.th}</p><p class="break-caption" data-lang="cn">${brk.cn}</p></div>`
      : '';
    return html + sectionHTML + breakHTML;
  }).join('');

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
    const activeEcho = window.__daoActiveEchoChapter;
    const echoNode = document.getElementById('echoOverlay');
    if (activeEcho && echoNode && echoNode.classList.contains('open')) openEcho(activeEcho);
    if (typeof window.__daoRefreshTsaiGallery === 'function') window.__daoRefreshTsaiGallery();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: L } }));
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

  // ----- QUIET MODE TOGGLE --------------------------------------
  // Strips the maximalism: removes mood treatments, hides image-spotlight,
  // Tsai, NPM art, jokes, checkpoint banners. Keeps Origin + Reading +
  // Note + Closer. For learners who came for the text, not the show.
  // The chapter still teaches; the page just gets out of the way.
  const KEY_QUIET = 'dao:quiet:v1';
  let quietOn = false;
  try {
    const saved = localStorage.getItem(KEY_QUIET);
    if (saved !== null) quietOn = (saved === '1');
  } catch(e) {}
  function setQuiet(on) {
    quietOn = !!on;
    document.body.classList.toggle('quiet-mode', quietOn);
    const btn = $('#quietToggle');
    if (btn) {
      btn.classList.toggle('is-on', quietOn);
      btn.setAttribute('aria-pressed', quietOn ? 'true' : 'false');
      btn.title = quietOn ? 'Quiet mode is on — tap to bring the maximalism back (W)' : 'Quiet mode — strip the maximalism (W)';
    }
    try { localStorage.setItem(KEY_QUIET, quietOn ? '1' : '0'); } catch(e) {}
  }
  setQuiet(quietOn);
  const qBtn = $('#quietToggle');
  if (qBtn) qBtn.addEventListener('click', () => setQuiet(!quietOn));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'w' && e.key !== 'W') return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
    setQuiet(!quietOn);
  });

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
      $$('.notes-pane.is-active .about-stanza, .notes-pane.is-active .era-card, .notes-pane.is-active .wild-mvt, .notes-pane.is-active .reference-card, .notes-pane.is-active .idea-card')
        .forEach(el => el.classList.add('is-visible'));
    });
  }
  if (notesBtn)   notesBtn.addEventListener('click', () => openNotes());
  if (notesClose) notesClose.addEventListener('click', closeNotes);
  if (notesScrim) notesScrim.addEventListener('click', closeNotes);
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

  // ----- CHARACTERS OVERLAY (字 zì) ------------------------------
  // The 828 unique characters of the Wang Bi text, in order of first appearance.
  const charsOverlay = $('#charsOverlay');
  const charsScrim   = $('#charsScrim');
  const charsBtn     = $('#charsBtn');
  const charsClose   = $('#charsClose');
  const charsGrid    = $('#charsGrid');
  const charsSearch  = $('#charsSearch');
  const charsCounter = $('#charsCounter');

  function openChars() {
    if (!charsOverlay) return;
    if (!charsGrid.dataset.rendered) {
      renderCharsGrid('first', '');
      charsGrid.dataset.rendered = '1';
    }
    charsOverlay.classList.add('open');
    charsOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeChars() {
    if (!charsOverlay) return;
    charsOverlay.classList.remove('open');
    charsOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderCharsGrid(sortMode, query) {
    if (!charsGrid) return;
    const all = (window.DAO_CHARACTERS || []);
    let items = all.slice();
    if (sortMode === 'freq') items.sort((a, b) => b.f - a.f || a.n - b.n);
    else if (sortMode === 'stroke') items.sort((a, b) => (a.p || 'zzz').localeCompare(b.p || 'zzz'));
    // 'first' = original order (already in first-appearance order)
    const q = (query || '').trim().toLowerCase();
    if (q) {
      items = items.filter(e =>
        e.c === q ||
        (e.s && e.s === q) ||
        (e.p && e.p.toLowerCase().includes(q)) ||
        (e.g && e.g.toLowerCase().includes(q))
      );
    }
    charsCounter.textContent = `${items.length} / ${all.length}`;
    const html = items.map((e, i) => {
      const idx = i + 1;
      const simplifiedLine = e.s ? `<span class="ch-simp" title="Simplified form" lang="zh">${e.s}</span>` : '';
      const glossEn = e.g ? `<p class="ch-g" data-lang="en">${escapeHtml(e.g)}</p>` : '';
      const glossTh = e.g_th ? `<p class="ch-g" data-lang="th" style="font-family:var(--th)">${escapeHtml(e.g_th)}</p>` : '';
      const breakdown = e.b ? `<p class="ch-b">${escapeHtml(e.b)}</p>` : '';
      const mnemonic = e.m ? `<p class="ch-m">${escapeHtml(e.m)}</p>` : '';
      return `
        <article class="ch-cell" data-char="${escapeHtml(e.c)}" data-py="${escapeHtml(e.p || '')}">
          <div class="ch-mark"><span class="ch-rank">${idx.toString().padStart(3, '0')}</span><a class="ch-firstchap" href="#ch${e.n}" aria-label="Go to chapter ${e.n}">CH ${e.n}</a></div>
          <div class="ch-glyph" lang="zh">${e.c}${simplifiedLine}</div>
          <div class="ch-py">${escapeHtml(e.p || '—')}</div>
          ${glossEn}${glossTh}${breakdown}${mnemonic}
          <div class="ch-stats">
            <span class="ch-freq" title="Times the character appears in the book">×${e.f}</span>
            <button class="ch-speak" aria-label="Pronounce ${escapeHtml(e.c)}">▶ <em>tīng</em></button>
          </div>
        </article>
      `;
    }).join('');
    charsGrid.innerHTML = html;
  }

  if (charsBtn)   charsBtn.addEventListener('click', openChars);
  if (charsClose) charsClose.addEventListener('click', closeChars);
  if (charsScrim) charsScrim.addEventListener('click', closeChars);
  if (charsSearch) {
    let searchTimer = null;
    charsSearch.addEventListener('input', () => {
      clearTimeout(searchTimer);
      const activeSortBtn = $$('.chars-sort-btn.is-active')[0];
      const mode = (activeSortBtn && activeSortBtn.dataset.sort) || 'first';
      searchTimer = setTimeout(() => renderCharsGrid(mode, charsSearch.value), 100);
    });
  }
  $$('.chars-sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.chars-sort-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderCharsGrid(btn.dataset.sort, (charsSearch && charsSearch.value) || '');
    });
  });
  // Per-cell speak button
  document.addEventListener('click', (e) => {
    const speakBtn = e.target.closest('.ch-speak');
    if (!speakBtn) return;
    const cell = speakBtn.closest('.ch-cell');
    const c = cell && cell.dataset.char;
    if (c) speakChinese(c, { rate: 0.7 });
  });
  // Clicking the glyph itself also speaks it
  document.addEventListener('click', (e) => {
    const glyph = e.target.closest('.ch-glyph');
    if (!glyph) return;
    if (e.target.closest('.ch-speak')) return;
    const cell = glyph.closest('.ch-cell');
    const c = cell && cell.dataset.char;
    if (c) speakChinese(c, { rate: 0.7 });
  });
  // Keyboard shortcut: Z opens / closes
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'z' && e.key !== 'Z') return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
    if (charsOverlay && charsOverlay.classList.contains('open')) closeChars();
    else openChars();
  });
  // Allow href="#chars-howread" to open the overlay + scroll to that section
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href="#chars-howread"]');
    if (!a) return;
    e.preventDefault();
    openChars();
    setTimeout(() => {
      const target = document.getElementById('chars-howread');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  });

  // ----- DAILY CHECK-IN OVERLAY (問 wèn) -----------------------------
  // A reflective notebook. One question per day, drawn from CHECKIN_QUESTIONS
  // (~30 prompts in rotation). User answers via text or voice (Web Speech API).
  // Entries persist in localStorage. If the user opts in, an anonymized copy
  // is POSTed to https://checkin.nonarkara.org/submit (a small Cloudflare
  // Worker backed by D1). No PII is ever sent — see worker source.
  const checkinOverlay = $('#checkinOverlay');
  const checkinScrim   = $('#checkinScrim');
  const checkinBtn     = $('#checkinBtn');
  const checkinClose   = $('#checkinClose');
  const checkinAnswer  = $('#checkinAnswer');
  const checkinMic     = $('#checkinMic');
  const checkinSave    = $('#checkinSave');
  const checkinShare   = $('#checkinShare');
  const checkinCounter = $('#checkinCounter');
  const checkinExport  = $('#checkinExport');
  const CHECKIN_ENDPOINT = 'https://checkin.nonarkara.org/submit';
  const CHECKIN_LS_ENTRIES = 'dao:checkin:entries';
  const CHECKIN_LS_UUID    = 'dao:checkin:anon-uuid';
  const CHECKIN_LS_SHARE   = 'dao:checkin:share-default';

  // Stable anonymous UUID for this browser. Generated once, never sent
  // raw — the Worker stores only a salted SHA-256 hash. Wipe by clearing
  // localStorage.
  function getAnonUuid() {
    try {
      let u = localStorage.getItem(CHECKIN_LS_UUID);
      if (!u) {
        const rand = (crypto && crypto.randomUUID) ? crypto.randomUUID() :
          ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
          });
        u = rand;
        localStorage.setItem(CHECKIN_LS_UUID, u);
      }
      return u;
    } catch (e) { return 'no-storage-' + Date.now(); }
  }

  // Day-of-year → question index. Same prompt repeats every 30 days.
  function questionForToday() {
    const Q = window.CHECKIN_QUESTIONS || [];
    if (!Q.length) return null;
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return Q[dayOfYear % Q.length];
  }

  function localizedThemeName(themeKey) {
    const T = window.CHECKIN_THEMES || {};
    const t = T[themeKey];
    if (!t) return themeKey;
    const lang = (document.body.classList.contains('lang-th') ? 'th'
      : document.body.classList.contains('lang-cn') ? 'cn' : 'en');
    return t[lang] || t.en;
  }

  function formatLongDate() {
    const lang = (document.body.classList.contains('lang-th') ? 'th-TH'
      : document.body.classList.contains('lang-cn') ? 'zh-CN' : 'en-US');
    try {
      return new Date().toLocaleDateString(lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) { return new Date().toDateString(); }
  }

  function renderTodayQuestion() {
    const q = questionForToday();
    if (!q) return;
    const dateEl = $('#checkinDate');
    const themeEl = $('#checkinTheme');
    const qEl = $('#checkinQuestion');
    const nudgeEl = $('#checkinNudge');
    const lang = document.body.classList.contains('lang-th') ? 'th'
      : document.body.classList.contains('lang-cn') ? 'cn' : 'en';
    if (dateEl) dateEl.textContent = formatLongDate();
    if (themeEl) themeEl.textContent = localizedThemeName(q.theme);
    if (qEl) qEl.textContent = q['q_' + lang] || q.q_en;
    if (nudgeEl) {
      const nudge = q['nudge_' + lang] || q.nudge_en || '';
      nudgeEl.textContent = nudge;
      nudgeEl.style.display = nudge ? 'block' : 'none';
    }
    // Placeholder text on the textarea, also localised
    if (checkinAnswer) {
      checkinAnswer.placeholder = (
        lang === 'th' ? 'พิมพ์หรือกดไมค์เพื่อพูด...' :
        lang === 'cn' ? '可以打字，也可以点麦克风说...' :
                        'Type or tap the mic to speak...'
      );
    }
    // Stash the question id on the textarea so save handlers can read it
    if (checkinAnswer) checkinAnswer.dataset.questionId = q.id;
  }

  function getStoredEntries() {
    try {
      const raw = localStorage.getItem(CHECKIN_LS_ENTRIES);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function saveEntryLocal(entry) {
    try {
      const all = getStoredEntries();
      all.unshift(entry);
      // Cap at 365 entries to avoid runaway localStorage
      const capped = all.slice(0, 365);
      localStorage.setItem(CHECKIN_LS_ENTRIES, JSON.stringify(capped));
    } catch (e) { /* quota or no-storage; ignore */ }
  }

  function renderHistory() {
    const host = $('#checkinEntries');
    if (!host) return;
    const all = getStoredEntries();
    if (!all.length) {
      host.innerHTML = `<p class="ce-empty"><span data-lang="en">No entries yet. Start with today.</span><span data-lang="th" style="font-family:var(--th)">ยังไม่มีบันทึก เริ่มจากวันนี้</span><span data-lang="cn" style="font-family:var(--cn-serif)">还没有内容。从今天开始。</span></p>`;
      return;
    }
    host.innerHTML = all.map(e => {
      const d = new Date(e.created_at);
      const iso = d.toISOString().slice(0, 10);
      const time = d.toTimeString().slice(0, 5);
      const langClass = 'ce-lang-' + (e.lang || 'en');
      return `<article class="ce-entry ${langClass}">
        <header class="ce-head">
          <span class="ce-date">${iso} · <em>${time}</em></span>
          <span class="ce-q">${escapeHtml(e.question_text || '')}</span>
          ${e.shared ? '<span class="ce-shared" title="Anonymously shared">⌁</span>' : ''}
        </header>
        <p class="ce-body">${escapeHtml(e.answer_text || '')}</p>
      </article>`;
    }).join('');
  }

  function updateCounter() {
    const txt = (checkinAnswer && checkinAnswer.value) || '';
    if (!checkinCounter) return;
    // Count words: CJK = char count, others = whitespace split
    const cjk = (txt.match(/[一-鿿]/g) || []).length;
    const latin = txt.replace(/[一-鿿]+/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    checkinCounter.textContent = String(cjk + latin);
  }

  // --- Web Speech API (speech-to-text) ---
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let recognising = false;
  function ensureRecognition() {
    if (!SR) return null;
    if (recognition) return recognition;
    recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    let finalTranscript = '';
    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) finalTranscript += r[0].transcript;
        else interim += r[0].transcript;
      }
      // Append final to the textarea; show interim as a small preview after
      if (checkinAnswer && finalTranscript) {
        const sep = checkinAnswer.value && !checkinAnswer.value.endsWith(' ') ? ' ' : '';
        checkinAnswer.value = checkinAnswer.value + sep + finalTranscript;
        finalTranscript = '';
        updateCounter();
      }
    };
    recognition.onerror = () => stopRecognition();
    recognition.onend = () => stopRecognition();
    return recognition;
  }
  function startRecognition() {
    const r = ensureRecognition();
    if (!r) {
      alert('Speech recognition is not supported in this browser. Try Chrome or Safari.');
      return;
    }
    const lang = document.body.classList.contains('lang-th') ? 'th-TH'
      : document.body.classList.contains('lang-cn') ? 'zh-CN' : 'en-US';
    r.lang = lang;
    try { r.start(); recognising = true; checkinMic.classList.add('is-recording'); }
    catch (e) { /* already started; ignore */ }
  }
  function stopRecognition() {
    if (recognition && recognising) {
      try { recognition.stop(); } catch (e) {}
    }
    recognising = false;
    if (checkinMic) checkinMic.classList.remove('is-recording');
  }
  function toggleRecognition() {
    if (recognising) stopRecognition();
    else startRecognition();
  }

  async function handleSubmit() {
    const text = (checkinAnswer && checkinAnswer.value || '').trim();
    if (!text) return;
    const q = questionForToday();
    if (!q) return;
    const lang = document.body.classList.contains('lang-th') ? 'th'
      : document.body.classList.contains('lang-cn') ? 'cn' : 'en';
    const question_text = q['q_' + lang] || q.q_en;
    const wantShare = !!(checkinShare && checkinShare.checked);
    const entry = {
      created_at: Date.now(),
      lang,
      question_id: q.id,
      question_text,
      answer_text: text,
      shared: wantShare,
    };

    saveEntryLocal(entry);

    // Remember last share preference so user doesn't re-tick every time
    try { localStorage.setItem(CHECKIN_LS_SHARE, wantShare ? '1' : '0'); } catch (e) {}

    if (wantShare) {
      // Fire-and-forget; don't block the save UI on network
      fetch(CHECKIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: q.id,
          question_text,
          answer_text: text,
          lang,
          anon_uuid: getAnonUuid(),
        }),
      }).catch(() => { /* offline or worker down — no-op */ });
    }

    // Visual save acknowledgement
    if (checkinSave) {
      const orig = checkinSave.innerHTML;
      checkinSave.innerHTML = `<span data-lang="en">Saved ✓</span><span data-lang="th" style="font-family:var(--th)">บันทึกแล้ว ✓</span><span data-lang="cn" style="font-family:var(--cn-serif)">已保存 ✓</span>`;
      checkinSave.classList.add('is-saved');
      setTimeout(() => {
        checkinSave.innerHTML = orig;
        checkinSave.classList.remove('is-saved');
      }, 1600);
    }
    checkinAnswer.value = '';
    updateCounter();
    renderHistory();
  }

  function handleExport() {
    const all = getStoredEntries();
    if (!all.length) { alert('No entries yet.'); return; }
    const lines = ['# Dao De Jing · Daily Check-In · Export', '', `Generated ${new Date().toISOString()}`, ''];
    for (const e of all) {
      const d = new Date(e.created_at);
      lines.push('## ' + d.toISOString().slice(0, 16).replace('T', ' ') + ' · ' + (e.lang || 'en'));
      lines.push('');
      lines.push('**' + (e.question_text || '') + '**');
      lines.push('');
      lines.push(e.answer_text || '');
      lines.push('');
      lines.push('---');
      lines.push('');
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dao-checkin-' + new Date().toISOString().slice(0, 10) + '.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function openCheckin() {
    if (!checkinOverlay) return;
    renderTodayQuestion();
    renderHistory();
    // Restore last share preference
    try {
      const last = localStorage.getItem(CHECKIN_LS_SHARE);
      if (checkinShare) checkinShare.checked = (last === '1');
    } catch (e) {}
    checkinOverlay.classList.add('open');
    checkinOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { if (checkinAnswer) checkinAnswer.focus(); }, 100);
  }
  function closeCheckin() {
    stopRecognition();
    if (!checkinOverlay) return;
    checkinOverlay.classList.remove('open');
    checkinOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (checkinBtn)    checkinBtn.addEventListener('click', openCheckin);
  if (checkinClose)  checkinClose.addEventListener('click', closeCheckin);
  if (checkinScrim)  checkinScrim.addEventListener('click', closeCheckin);
  if (checkinAnswer) checkinAnswer.addEventListener('input', updateCounter);
  if (checkinMic)    checkinMic.addEventListener('click', toggleRecognition);
  if (checkinSave)   checkinSave.addEventListener('click', handleSubmit);
  if (checkinExport) checkinExport.addEventListener('click', handleExport);

  // Re-render the question when language toggles while overlay is open
  document.addEventListener('langchange', renderTodayQuestion);

  // Keyboard shortcut: Q opens / closes
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'q' && e.key !== 'Q') return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
    if (checkinOverlay && checkinOverlay.classList.contains('open')) closeCheckin();
    else openCheckin();
  });

  // ----- REFERENCE LIBRARY TAB ---------------------------------
  function renderReferenceLibrary() {
    const grid = $('#referenceGrid');
    const deep = $('#slingerlandDeep');
    if (deep && SLINGERLAND_DEEP.title) {
      const deepTitle = SLINGERLAND_I18N.title || { en: SLINGERLAND_DEEP.title };
      const deepPoints = SLINGERLAND_DEEP.points || [];
      const deepPointCopies = deepPoints.map((point, i) => (SLINGERLAND_I18N.points && SLINGERLAND_I18N.points[i]) || { en: point });
      const deepCaution = SLINGERLAND_I18N.caution || { en: SLINGERLAND_DEEP.caution || '' };
      deep.innerHTML = `
        <p class="slingerland-kicker">Edward Slingerland</p>
        <h3>${triText(deepTitle)}</h3>
        <ul>${deepPointCopies.map(p => `<li>${triText(p)}</li>`).join('')}</ul>
        <p>${triText(deepCaution)}</p>`;
    }
    if (!grid || !REF_LIBRARY.length) return;
    grid.innerHTML = REF_LIBRARY.map((item, i) => {
      const ref = REF_I18N[item.slug] || {};
      const copy = key => ref[key] || { en: item[key] || '' };
      return `
      <article class="reference-card" style="--ref-hue:${(i * 31) % 360}deg">
        <img src="${escapeHtml(item.cover)}" alt="${escapeHtml(item.title)} cover" loading="lazy">
        <div class="reference-card-copy">
          <p class="reference-kind">${triText(copy('kind'))}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="reference-author">${escapeHtml(item.author)}</p>
          <dl>
            <dt>${tri('Why I read it', 'ทำไมผมอ่าน', '为什么读')}</dt><dd>${triText(copy('why'))}</dd>
            <dt>${tri('Gets right', 'ทำได้ดี', '说得对')}</dt><dd>${triText(copy('right'))}</dd>
            <dt>${tri('Gets wrong', 'ข้อจำกัด', '局限')}</dt><dd>${triText(copy('wrong'))}</dd>
          </dl>
        </div>
      </article>`;
    }).join('');
  }
  renderReferenceLibrary();

  // ----- LIVING IDEAS TAB --------------------------------------
  function renderIdeaThreads() {
    const grid = $('#ideaThreadsGrid');
    if (!grid || !IDEA_THREADS.length) return;
    grid.innerHTML = IDEA_THREADS.map((item, i) => `
      <article class="idea-card" style="--idea-i:${i}">
        <p class="idea-index">${String(i + 1).padStart(2, '0')} · ${escapeHtml(item.chapters || '')}</p>
        <h3>${triText(item.title || {})}</h3>
        <p class="idea-body">${triText(item.body || {})}</p>
        <p class="idea-question"><span>${tri('Question', 'คำถาม', '一问')}</span>${triText(item.question || {})}</p>
        <p class="idea-source">${escapeHtml(item.source || '')}</p>
      </article>`).join('');
  }
  renderIdeaThreads();

  // ----- CHAPTER COMPARATIVE NOTES -----------------------------
  const echoOverlay = document.createElement('aside');
  echoOverlay.className = 'echo-overlay';
  echoOverlay.id = 'echoOverlay';
  echoOverlay.setAttribute('aria-hidden', 'true');
  echoOverlay.innerHTML = `
    <div class="echo-shell" role="dialog" aria-modal="true" aria-labelledby="echoTitle">
      <button class="echo-close" type="button" aria-label="Close comparative notes">×</button>
      <p class="echo-kicker" data-echo="kicker"></p>
      <h2 class="echo-title" id="echoTitle"></h2>
      <p class="echo-sub"></p>
      <div class="echo-grid">
        <section class="echo-card echo-card--buddhist">
          <p class="echo-label" data-echo-label="buddhism"></p>
          <p class="echo-copy" data-echo="buddhism"></p>
        </section>
        <section class="echo-card">
          <p class="echo-label" data-echo-label="parallels"></p>
          <ul class="echo-list" data-echo="parallels"></ul>
        </section>
        <section class="echo-card echo-card--science">
          <p class="echo-label" data-echo-label="psychology"></p>
          <p class="echo-copy" data-echo="psychology"></p>
        </section>
      </div>
      <p class="echo-caveat" data-echo="caveat"></p>
    </div>`;
  document.body.appendChild(echoOverlay);
  const echoClose = $('.echo-close', echoOverlay);

  function comparativeNoteFor(n) {
    const themeKey = COMP.chapters && COMP.chapters[String(n)];
    return themeKey && COMP.themes ? COMP.themes[themeKey] : null;
  }
  function localize(copy, fallback='') {
    if (typeof copy === 'string') return copy;
    if (!copy) return fallback;
    return copy[lang] || copy.en || fallback;
  }
  function echoUi(key) {
    const ui = (COMP.ui && COMP.ui[key]) || {};
    return localize(ui, key);
  }
  function closeEcho() {
    echoOverlay.classList.remove('open');
    echoOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    window.__daoActiveEchoChapter = null;
  }
  function openEcho(n) {
    const ch = CH.find(c => c.n === n);
    const note = comparativeNoteFor(n);
    if (!ch || !note) return;
    window.__daoActiveEchoChapter = n;
    const chapterTitle = lang === 'cn'
      ? `第 ${n} 章：${ch.cn_title || ch.en_title || '道德經'}`
      : lang === 'th'
        ? `บทที่ ${n}: ${ch.th_title || ch.en_title || ch.cn_title || 'เต้าเต๋อจิง'}`
        : `Chapter ${n}: ${ch.en_title || ch.cn_title || 'Dao De Jing'}`;
    $('.echo-title', echoOverlay).textContent = chapterTitle;
    $('.echo-sub', echoOverlay).textContent = localize(note.title, echoUi('fallbackTitle'));
    $('[data-echo="kicker"]', echoOverlay).innerHTML = echoUi('kicker');
    $('[data-echo-label="buddhism"]', echoOverlay).textContent = echoUi('buddhism');
    $('[data-echo-label="parallels"]', echoOverlay).textContent = echoUi('parallels');
    $('[data-echo-label="psychology"]', echoOverlay).textContent = echoUi('psychology');
    $('[data-echo="caveat"]', echoOverlay).textContent = echoUi('caveat');
    $('[data-echo="buddhism"]', echoOverlay).textContent = localize(note.buddhism);
    $('[data-echo="psychology"]', echoOverlay).textContent = localize(note.psychology);
    $('[data-echo="parallels"]', echoOverlay).innerHTML = localize(note.parallels, [])
      .map(item => `<li>${escapeHtml(item)}</li>`).join('');
    echoOverlay.setAttribute('lang', lang === 'cn' ? 'zh' : lang);
    echoOverlay.classList.add('open');
    echoOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (echoClose) echoClose.focus({ preventScroll: true });
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-open-echo]');
    if (!btn) return;
    e.preventDefault();
    openEcho(parseInt(btn.dataset.openEcho, 10));
  });
  if (echoClose) echoClose.addEventListener('click', closeEcho);
  echoOverlay.addEventListener('click', (e) => {
    if (e.target === echoOverlay) closeEcho();
  });

  // ----- TSAI ILLUSTRATION GALLERY -----------------------------
  const tsaiOverlay = document.createElement('aside');
  tsaiOverlay.className = 'tsai-overlay';
  tsaiOverlay.id = 'tsaiOverlay';
  tsaiOverlay.setAttribute('aria-hidden', 'true');
  tsaiOverlay.innerHTML = `
    <div class="tsai-gallery-shell" role="dialog" aria-modal="true" aria-labelledby="tsaiGalleryTitle">
      <button class="tsai-gallery-close" type="button" aria-label="Close Tsai illustrations">×</button>
      <div class="tsai-gallery-head">
        <p class="tsai-gallery-kicker">漫 <em>màn</em> · C. C. Tsai</p>
        <h2 class="tsai-gallery-title" id="tsaiGalleryTitle"></h2>
        <p class="tsai-gallery-credit"></p>
      </div>
      <div class="tsai-album" data-tsai-album>
        <button class="tsai-album-nav tsai-album-nav--prev" type="button" aria-label="Previous Tsai page">‹</button>
        <figure class="tsai-album-page">
          <div class="tsai-album-image-wrap">
            <img class="tsai-album-image" alt="" loading="eager">
          </div>
          <figcaption class="tsai-album-caption">
            <span class="tsai-album-count"></span>
            <p class="tsai-album-note" data-lang="en"></p>
            <p class="tsai-album-note tsai-album-note--th" data-lang="th"></p>
            <p class="tsai-album-note tsai-album-note--cn" data-lang="cn"></p>
          </figcaption>
        </figure>
        <button class="tsai-album-nav tsai-album-nav--next" type="button" aria-label="Next Tsai page">›</button>
      </div>
      <div class="tsai-album-dots" aria-label="Tsai page picker"></div>
    </div>`;
  document.body.appendChild(tsaiOverlay);
  const tsaiGalleryClose = $('.tsai-gallery-close', tsaiOverlay);
  const tsaiAlbum = $('[data-tsai-album]', tsaiOverlay);
  const tsaiPrev = $('.tsai-album-nav--prev', tsaiOverlay);
  const tsaiNext = $('.tsai-album-nav--next', tsaiOverlay);
  const tsaiAlbumImage = $('.tsai-album-image', tsaiOverlay);
  const tsaiAlbumCount = $('.tsai-album-count', tsaiOverlay);
  const tsaiDots = $('.tsai-album-dots', tsaiOverlay);
  const tsaiGalleryState = { chapter: null, entry: null, page: 0, startX: 0, startY: 0 };

  function tsaiPageLabel(index, total) {
    if (lang === 'th') return `หน้า ${index + 1} / ${total}`;
    if (lang === 'cn') return `第 ${index + 1} / ${total} 页`;
    return `Page ${index + 1} of ${total}`;
  }
  function tsaiArrowLabel(which) {
    if (which === 'prev') return lang === 'th' ? 'หน้าก่อนหน้า' : lang === 'cn' ? '上一页' : 'Previous Tsai page';
    return lang === 'th' ? 'หน้าถัดไป' : lang === 'cn' ? '下一页' : 'Next Tsai page';
  }
  function tsaiFallbackNote(chapter, entry) {
    const title = chapter ? (chapter.en_title || `Chapter ${chapter.n}`) : 'this chapter';
    return (entry && entry.note && entry.note.en) ||
      (TSAI.note && TSAI.note.en) ||
      `Read the page as a visual doorway into ${title}: first notice the action, then return to Laozi's sentence with that scene in mind.`;
  }
  function refreshTsaiGalleryChrome() {
    if (!tsaiGalleryState.entry || !tsaiGalleryState.chapter) return;
    const n = tsaiGalleryState.chapter.n;
    const entry = tsaiGalleryState.entry;
    $('.tsai-gallery-title', tsaiOverlay).textContent = localize(entry.title, `Chapter ${n}: Tsai`);
    $('.tsai-gallery-credit', tsaiOverlay).textContent = localize(TSAI.credit, TSAI.source || 'C. C. Tsai');
    if (tsaiPrev) tsaiPrev.setAttribute('aria-label', tsaiArrowLabel('prev'));
    if (tsaiNext) tsaiNext.setAttribute('aria-label', tsaiArrowLabel('next'));
  }
  function renderTsaiAlbum() {
    const entry = tsaiGalleryState.entry;
    const ch = tsaiGalleryState.chapter;
    if (!entry || !entry.pages || !entry.pages.length || !ch) return;
    const total = entry.pages.length;
    tsaiGalleryState.page = Math.max(0, Math.min(tsaiGalleryState.page, total - 1));
    const index = tsaiGalleryState.page;
    const src = entry.pages[index];
    refreshTsaiGalleryChrome();
    // After image loads, shrink the shell to match the rendered image width
    // so the popup IS the shape of the cartoon frame, not a wider landscape box.
    const shell = tsaiOverlay.querySelector('.tsai-gallery-shell');
    tsaiAlbumImage.onload = () => {
      if (!shell || !tsaiAlbumImage.clientWidth) return;
      // shell target = image rendered width + two 48px arrow columns + two gaps (14px each) + 2× padding
      const padding = parseFloat(getComputedStyle(shell).paddingLeft) || 24;
      const target = tsaiAlbumImage.clientWidth + 96 + 28 + padding * 2;
      const maxW = Math.min(900, window.innerWidth - 32);
      shell.style.width = Math.min(target, maxW) + 'px';
    };
    tsaiAlbumImage.src = src;
    tsaiAlbumImage.alt = `C. C. Tsai illustration for chapter ${ch.n}, page ${index + 1}`;
    tsaiAlbumCount.textContent = tsaiPageLabel(index, total);
    $('.tsai-album-note[data-lang="en"]', tsaiOverlay).textContent = tsaiFallbackNote(ch, entry);
    $('.tsai-album-note[data-lang="th"]', tsaiOverlay).textContent = (entry.note && entry.note.th) || (TSAI.note && TSAI.note.th) || '';
    $('.tsai-album-note[data-lang="cn"]', tsaiOverlay).textContent = (entry.note && entry.note.cn) || (TSAI.note && TSAI.note.cn) || '';
    if (tsaiPrev) tsaiPrev.disabled = index === 0;
    if (tsaiNext) tsaiNext.disabled = index === total - 1;
    if (tsaiDots) {
      tsaiDots.innerHTML = entry.pages.map((_, i) => {
        const active = i === index ? ' is-active' : '';
        return `<button class="tsai-album-dot${active}" type="button" data-tsai-page="${i}" aria-label="${escapeHtml(tsaiPageLabel(i, total))}" aria-current="${i === index ? 'page' : 'false'}"></button>`;
      }).join('');
    }
  }
  function showTsaiPage(index) {
    if (!tsaiGalleryState.entry || !tsaiGalleryState.entry.pages) return;
    const total = tsaiGalleryState.entry.pages.length;
    const nextIndex = Math.max(0, Math.min(index, total - 1));
    if (nextIndex === tsaiGalleryState.page) return;
    tsaiGalleryState.page = nextIndex;
    renderTsaiAlbum();
  }
  function closeTsaiGallery() {
    tsaiOverlay.classList.remove('open');
    tsaiOverlay.setAttribute('aria-hidden', 'true');
    window.__daoActiveTsaiChapter = null;
    document.body.style.overflow = '';
  }
  function openTsaiGallery(n) {
    const ch = CH.find(c => c.n === n);
    const entry = tsaiChapterFor(n);
    if (!ch || !entry || !entry.pages) return;
    tsaiGalleryState.chapter = ch;
    tsaiGalleryState.entry = entry;
    tsaiGalleryState.page = 0;
    window.__daoActiveTsaiChapter = n;
    renderTsaiAlbum();
    tsaiOverlay.classList.add('open');
    tsaiOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (tsaiNext && entry.pages.length > 1) tsaiNext.focus({ preventScroll: true });
    else if (tsaiGalleryClose) tsaiGalleryClose.focus({ preventScroll: true });
  }
  window.__daoRefreshTsaiGallery = () => {
    if (tsaiOverlay.classList.contains('open')) renderTsaiAlbum();
  };
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-open-tsai]');
    if (!btn) return;
    e.preventDefault();
    openTsaiGallery(parseInt(btn.dataset.openTsai, 10));
  });
  if (tsaiGalleryClose) tsaiGalleryClose.addEventListener('click', closeTsaiGallery);
  if (tsaiPrev) tsaiPrev.addEventListener('click', () => showTsaiPage(tsaiGalleryState.page - 1));
  if (tsaiNext) tsaiNext.addEventListener('click', () => showTsaiPage(tsaiGalleryState.page + 1));
  if (tsaiDots) {
    tsaiDots.addEventListener('click', (e) => {
      const dot = e.target.closest('[data-tsai-page]');
      if (dot) showTsaiPage(parseInt(dot.dataset.tsaiPage, 10));
    });
  }
  if (tsaiAlbum) {
    tsaiAlbum.addEventListener('pointerdown', (e) => {
      tsaiGalleryState.startX = e.clientX;
      tsaiGalleryState.startY = e.clientY;
    }, { passive: true });
    tsaiAlbum.addEventListener('pointerup', (e) => {
      const dx = e.clientX - tsaiGalleryState.startX;
      const dy = e.clientY - tsaiGalleryState.startY;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        showTsaiPage(tsaiGalleryState.page + (dx > 0 ? 1 : -1));
      }
    }, { passive: true });
  }
  tsaiOverlay.addEventListener('click', (e) => {
    if (e.target === tsaiOverlay) closeTsaiGallery();
  });

  // ----- DEEPWORK SUMMARY OPEN/CLOSE ---------------------------
  // The 5-second hold-to-close was a wu-wei joke that landed as a trap.
  // Now: tap to close, Escape to close. The label still says "leave"
  // (not "X") to keep the ritual without the forced delay.
  const deepworkOverlay = $('#deepworkOverlay');
  const deepworkBtn = $('#deepworkBtn');
  const deepworkClose = $('#deepworkClose');

  function closeDeepwork() {
    if (!deepworkOverlay) return;
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
  }
  if (deepworkBtn) deepworkBtn.addEventListener('click', openDeepwork);
  if (deepworkClose) {
    deepworkClose.addEventListener('click', closeDeepwork);
    // Update the hint text once so the UI doesn't promise a hold gesture
    const hint = $('.deepwork-close-hint', deepworkClose);
    if (hint) hint.textContent = 'leave';
  }
  // Escape key always closes the deepwork overlay if it's open
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (deepworkOverlay && deepworkOverlay.classList.contains('open')) closeDeepwork();
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
    const tsaiIsOpen = tsaiOverlay && tsaiOverlay.classList.contains('open');
    if (tsaiIsOpen) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        showTsaiPage(tsaiGalleryState.page + 1);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showTsaiPage(tsaiGalleryState.page - 1);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        closeTsaiGallery();
        return;
      }
    }
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
      closeEcho();
      closeTsaiGallery();
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

  // ----- PER-CHARACTER PRONUNCIATION (Web Speech API) ---------------
  // Click any Chinese character in the chapter Chinese text → speak it.
  // Falls back silently on browsers that don't support speechSynthesis.
  const speechAvailable = (typeof window !== 'undefined') && ('speechSynthesis' in window);
  let zhVoice = null;
  if (speechAvailable) {
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Prefer a native zh-CN voice; fall back to any zh-*.
      zhVoice = voices.find(v => /^zh-CN/i.test(v.lang))
             || voices.find(v => /^zh/i.test(v.lang))
             || null;
    };
    pickVoice();
    window.speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
  }
  function speakChinese(text, opts = {}) {
    if (!speechAvailable || !text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      if (zhVoice) u.voice = zhVoice;
      u.rate = opts.rate ?? 0.75;
      u.pitch = opts.pitch ?? 1.0;
      if (opts.onend) u.onend = opts.onend;
      if (opts.onstart) u.onstart = opts.onstart;
      window.speechSynthesis.speak(u);
    } catch (err) { /* silent */ }
  }
  // Single-character click → speak it. Delegated for performance.
  document.addEventListener('click', (e) => {
    const charEl = e.target.closest('.cn-stack-char');
    if (!charEl) return;
    if (e.target.closest('.cn-listen-btn')) return; // don't intercept chapter listen
    const ch = charEl.querySelector('.cs-c')?.textContent?.trim();
    if (!ch) return;
    // Visual feedback — pulse
    charEl.classList.add('is-speaking');
    speakChinese(ch, {
      rate: 0.7,
      onend: () => charEl.classList.remove('is-speaking')
    });
  });
  // Sequential "read every character" walker — triggered from the new button.
  let walkAbort = null;
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.cn-walk-btn');
    if (!btn) return;
    const chN = btn.dataset.ch;
    const section = document.querySelector(`#cn-stack-${chN}`) || btn.closest('section');
    if (!section) return;
    const chars = [...section.querySelectorAll('.cn-stack-char')];
    if (!chars.length) return;
    if (btn.classList.contains('is-walking')) {
      // Stop
      walkAbort = true;
      window.speechSynthesis.cancel();
      chars.forEach(c => c.classList.remove('is-speaking'));
      btn.classList.remove('is-walking');
      btn.innerHTML = `▶ &nbsp;字 <em>zì</em> &nbsp;·&nbsp; ${uiButton('walk')}`;
      return;
    }
    walkAbort = false;
    btn.classList.add('is-walking');
    btn.innerHTML = `▐▐ &nbsp;字 <em>zì</em> &nbsp;·&nbsp; ${uiButton('stop')}`;
    let i = 0;
    const next = () => {
      if (walkAbort || i >= chars.length) {
        chars.forEach(c => c.classList.remove('is-speaking'));
        btn.classList.remove('is-walking');
        btn.innerHTML = `▶ &nbsp;字 <em>zì</em> &nbsp;·&nbsp; ${uiButton('walk')}`;
        return;
      }
      const el = chars[i++];
      const c = el.querySelector('.cs-c')?.textContent?.trim();
      chars.forEach(x => x.classList.remove('is-speaking'));
      el.classList.add('is-speaking');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (!c) { setTimeout(next, 180); return; }
      speakChinese(c, { rate: 0.6, onend: () => setTimeout(next, 260) });
    };
    next();
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
