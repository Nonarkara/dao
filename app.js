/* =============================================================
   READING DAO DE JING WITH DR. NON — interaction layer
   ============================================================ */
(function() {
  'use strict';
  const CH = window.CHAPTERS || [];
  const EX = window.EXTENDED || {};
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

  // Image map for contemporary photos (light — reuse existing local art)
  const IMG_MAP = {
    'blank-page':  { src: 'img/sotatsu.jpg',     credit: 'Tawaraya Sōtatsu · Waves at Matsushima · 17th c.', cap: 'Before words.' },
    'river-stones': { src: 'img/hokusai-fuji.jpg', credit: 'Hokusai · Fine Wind, Clear Morning · c. 1830', cap: 'Water, doing its long careful sentence.' },
    'muji-room':   { src: 'img/sesshu.jpg',      credit: 'Sesshū Tōyō · Splashed-Ink Landscape · 1495',    cap: 'The void is the deliverable.' },
    'empty-desk':  { src: 'img/muqi.jpg',        credit: 'Muqi · Six Persimmons · 13th c.',                cap: 'Subtract until what remains is clearly working.' },
  };

  // ----- RENDER CHAPTERS ----------------------------------------
  function chapterHTML(ch, idx) {
    const ext = EX[ch.n] || {};
    const prev = idx > 0 ? CH[idx-1] : null;
    const next = idx < CH.length-1 ? CH[idx+1] : null;

    const direct_en = ext.direct || '';
    const direct_th = ext.direct_th || '';
    const reading_en = ext.reading || '';
    const reading_th = ext.reading_th || '';
    const code = ext.code || '';
    const sources = ext.sources || [];
    const imgKey = ext.image;
    const img = imgKey ? IMG_MAP[imgKey] : null;

    return `
      <article class="chapter" id="ch${ch.n}" data-n="${ch.n}" data-mood="${ch.mood||'silence'}">
        <div class="chapter-strip">
          <span class="cs-num">${toRoman(ch.n)} · 第 ${ch.n} 章</span>
          <span class="cs-cn">${escapeHtml(ch.cn_title || '')}</span>
          <span class="cs-en">${escapeHtml(ch.en_title || '')}</span>
          <span class="cs-th">${escapeHtml(ch.th_title || '')}</span>
          <span class="cs-progress">${ch.n} / 81</span>
        </div>

        <!-- 01 ORIGIN -->
        <section class="panel panel-origin">
          <div class="panel-label">
            <span class="pl-num">01</span><span>Origin</span><span class="pl-cn">原文</span>
          </div>
          <div class="origin-grid">
            <div class="origin-title-block">
              <div class="origin-num-roman">${toRoman(ch.n)}</div>
              <h2 class="origin-cn-title">${escapeHtml(ch.cn_title || '')}</h2>
              <p class="origin-en-title">${escapeHtml(ch.en_title || '')}</p>
              <p class="origin-th-title">${escapeHtml(ch.th_title || '')}</p>
              <div class="origin-divider"></div>
              <p style="font-family: var(--mono); font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: var(--ink-fade); margin: 0;">
                Wang Bi recension · ${ch.n <= 37 ? '道經 · Dao Jing' : '德經 · De Jing'}
              </p>
            </div>
            <div class="origin-cn">${escapeHtml(ch.cn || '')}</div>
          </div>
        </section>

        ${direct_en ? `
        <!-- 02 DIRECT -->
        <section class="panel panel-direct">
          <div class="panel-label">
            <span class="pl-num">02</span><span>Direct</span><span class="pl-cn">直譯</span>
          </div>
          <p class="direct-text" data-lang="en">${escapeHtml(direct_en)}</p>
          <p class="direct-text" data-lang="th">${escapeHtml(direct_th || direct_en)}</p>
        </section>
        ` : ''}

        ${reading_en ? `
        <!-- 03 READING -->
        <section class="panel panel-reading">
          <div class="panel-label">
            <span class="pl-num">03</span><span>Reading</span><span class="pl-cn">解讀</span>
          </div>
          <div class="reading-frame">
            <aside class="reading-aside">
              <p class="ra-q">${escapeHtml(ch.en || '').split('\n')[0]}</p>
              <p>The chapter, restated.</p>
              <p>What if X because Y, and research Z supports it?</p>
            </aside>
            <div>
              <div class="reading-body" data-lang="en">${escapeHtml(reading_en)}</div>
              <div class="reading-body" data-lang="th">${escapeHtml(reading_th || reading_en)}</div>
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
        <!-- 03 READING (existing translation as reading) -->
        <section class="panel panel-reading">
          <div class="panel-label">
            <span class="pl-num">03</span><span>Reading</span><span class="pl-cn">解讀</span>
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

        ${code ? `
        <!-- 04 CODE -->
        <section class="panel panel-code">
          <div class="panel-label">
            <span class="pl-num">04</span><span>Code</span><span class="pl-cn">程式</span>
          </div>
          <div class="code-frame">
            <pre class="code-block">${highlightTS(code)}</pre>
            <p class="code-caption">A philosophical compression. Read it like a poem.</p>
          </div>
        </section>
        ` : ''}

        ${ch.note ? `
        <!-- 05 NOTE -->
        <section class="panel panel-note">
          <div class="panel-label">
            <span class="pl-num">05</span><span>Note</span><span class="pl-cn">注</span>
          </div>
          <div class="note-frame">
            <p class="note-body">${escapeHtml(ch.note)}</p>
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
    return `<li><a data-jump="${ch.n}">
      <span class="ix-n">${toRoman(ch.n)}</span>
      <span><span class="ix-cn">${escapeHtml(ch.cn_title||'')}</span> · <em>${escapeHtml(ch.en_title||'')}</em></span>
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
    } else if (e.key === 'Escape') {
      indexOverlay.classList.remove('open');
      indexScrim.classList.remove('show');
    } else if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
      e.preventDefault();
      $('#indexBtn').click();
    }
  });

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
