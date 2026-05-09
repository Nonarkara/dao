/* =============================================================
   READING DAO DE JING WITH DR. NON — interaction layer
   ============================================================ */
(function() {
  'use strict';
  const CH = window.CHAPTERS || [];
  if (!CH.length) { console.error('No chapters'); return; }

  const $  = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
  const escapeHtml = (s) => String(s||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  // Roman numerals 1–81
  function toRoman(n) {
    const map = [['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]];
    let out = ''; for (const [g,v] of map) { while (n >= v) { out += g; n -= v; } }
    return out;
  }

  // Build art map — chapters reference art keys; map to local files
  const ART_MAP = {
    'fan-kuan':       'img/sesshu.jpg',         // substitute (mountain landscape)
    'guo-xi':         'img/sotatsu.jpg',
    'ma-yuan':        'img/hiroshige-rain.jpg',
    'xia-gui':        'img/sesshu.jpg',
    'ni-zan':         'img/muqi.jpg',
    'mi-fu':          'img/sotatsu.jpg',
    'wang-hui':       'img/sesshu.jpg',
    'shen-zhou':      'img/wanderer.jpg',
    'sesshu':         'img/sesshu.jpg',
    'liang-kai':      'img/liang-kai.jpg',
    'hokusai-fuji':   'img/hokusai-fuji.jpg',
  };
  function artSrc(key) {
    return ART_MAP[key] || 'img/sesshu.jpg';
  }

  // ----- RENDER CHAPTERS ----------------------------------------
  function chapterHTML(ch, idx) {
    const prev = idx > 0 ? idx-1 : null;
    const next = idx < CH.length-1 ? idx+1 : null;
    return `
      <article class="chapter-page" id="ch${ch.n}" data-n="${ch.n}" data-mood="${ch.mood||'silence'}">
        <div class="chapter-art" style="background-image:url('${artSrc(ch.art)}')"></div>
        <div class="chapter-inner">
          <header class="chapter-head">
            <div class="chapter-num-line">
              <span class="num-roman">${toRoman(ch.n)}</span>
              <span>第 ${ch.n} 章 · Chapter ${ch.n}</span>
            </div>
            <h2 class="chapter-cn-title">${escapeHtml(ch.cn_title || '')}</h2>
            <p class="chapter-en-title">${escapeHtml(ch.en_title || '')}</p>
            <p class="chapter-th-title-display">${escapeHtml(ch.th_title || '')}</p>
            <div class="chapter-cn">${escapeHtml(ch.cn || '')}</div>
          </header>
          <div class="chapter-body">
            <p class="chapter-translation" data-lang="en">${escapeHtml(ch.en || '')}</p>
            <p class="chapter-translation" data-lang="th">${escapeHtml(ch.th || '')}</p>
            <p class="chapter-note">${escapeHtml(ch.note || '')}</p>
          </div>
          <footer class="chapter-foot">
            <button data-jump="${prev !== null ? CH[prev].n : ''}" ${prev === null ? 'disabled' : ''}>
              ${prev !== null ? '← ' + toRoman(CH[prev].n) + ' · ' + (CH[prev].cn_title||'') : '— Beginning —'}
            </button>
            <span class="ch-num">第 ${ch.n} 章 / 81</span>
            <button data-jump="${next !== null ? CH[next].n : ''}" ${next === null ? 'disabled' : ''}>
              ${next !== null ? toRoman(CH[next].n) + ' · ' + (CH[next].cn_title||'') + ' →' : '— End —'}
            </button>
          </footer>
        </div>
      </article>
    `;
  }
  $('#chapters').innerHTML = CH.map(chapterHTML).join('');

  // ----- RENDER INDEX -------------------------------------------
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

  // ----- CHAPTER JUMPS ------------------------------------------
  function jumpTo(n) {
    const el = document.getElementById('ch' + n);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      saveBookmark(n);
    }
  }
  // Click handlers on prev/next + index links
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-jump]');
    if (!btn) return;
    const n = parseInt(btn.dataset.jump);
    if (!isNaN(n)) {
      e.preventDefault();
      jumpTo(n);
      // close index if open
      indexOverlay.classList.remove('open');
      indexScrim.classList.remove('show');
    }
  });

  // ----- INDEX OVERLAY ------------------------------------------
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

  function getVisited() {
    try { return JSON.parse(localStorage.getItem(KEY_VIS) || '[]'); } catch(e) { return []; }
  }
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
    for (const el of $$('.chapter-page')) {
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
    } else {
      bm.classList.remove('show');
    }
  }

  // Auto-save bookmark as user scrolls past chapters
  let scrollTick = false;
  let lastSaved = null;
  function onScroll() {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(() => {
      // progress bar
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      $('#progress').style.width = pct + '%';
      // active chapter
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

  // ----- KEYBOARD NAV -------------------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    if (e.key === 'ArrowRight' || e.key === 'j') {
      e.preventDefault();
      const cur = currentChapter() || 0;
      const next = CH.find(c => c.n > cur);
      if (next) jumpTo(next.n);
    }
    else if (e.key === 'ArrowLeft' || e.key === 'k') {
      e.preventDefault();
      const cur = currentChapter() || 1;
      const arr = CH.filter(c => c.n < cur);
      if (arr.length) jumpTo(arr[arr.length-1].n);
    }
    else if (e.key === 'l' || e.key === 'L') {
      e.preventDefault();
      setLang(lang === 'en' ? 'th' : 'en');
    }
    else if (e.key === 'Escape') {
      indexOverlay.classList.remove('open');
      indexScrim.classList.remove('show');
    }
    else if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
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
      const dismiss = () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
      };
      toast.querySelector('.ct-jump').addEventListener('click', () => { jumpTo(savedN); dismiss(); });
      toast.querySelector('.ct-x').addEventListener('click', dismiss);
      setTimeout(dismiss, 14000);
    }, 1800);
  }

  console.log(`📖 Dao De Jing · ${CH.length} chapters loaded · lang=${lang}`);
})();
