/* =============================================================
   DATA WALL — 世界亂象 · The Chaos of Life
   Full-viewport live market data, city clocks, and big numbers.
   Renders above the book cover. The reader scrolls through the
   noise of the world, then discovers a 2,500-year-old answer.
   ============================================================ */
(function() {
  'use strict';

  // ── CONFIG ─────────────────────────────────────────────────
  const REFRESH_MS  = 30_000;  // refresh every 30s
  const LS_KEY      = 'dao:wall:data';

  // Cities with their IANA timezone, flag, city name
  const CITIES = [
    { tz:"Asia/Bangkok",       flag:"🇹🇭", city:"Bangkok",   label:"BKK" },
    { tz:"Asia/Singapore",     flag:"🇸🇬", city:"Singapore", label:"SGP" },
    { tz:"Asia/Tokyo",         flag:"🇯🇵", city:"Tokyo",     label:"TYO" },
    { tz:"Asia/Seoul",         flag:"🇰🇷", city:"Seoul",     label:"SEL" },
    { tz:"Asia/Manila",        flag:"🇵🇭", city:"Manila",    label:"MNL" },
    { tz:"Asia/Shanghai",      flag:"🇨🇳", city:"Shanghai",  label:"SHA" },
    { tz:"Europe/London",      flag:"🇬🇧", city:"London",    label:"LON" },
    { tz:"Europe/Paris",       flag:"🇫🇷", city:"Paris",     label:"PAR" },
    { tz:"Europe/Moscow",      flag:"🇷🇺", city:"Moscow",    label:"MSK" },
    { tz:"America/New_York",   flag:"🇺🇸", city:"New York",  label:"NYC" },
    { tz:"America/Los_Angeles",flag:"🇺🇸", city:"Los Angeles","label":"LAX"},
  ];

  // FX rates to show against USD
  const FX_PAIRS = [
    { code:"THB", label:"USD/THB", desc:"Thai Baht" },
    { code:"EUR", label:"EUR/USD", desc:"Euro", invert:true, base:"EUR" },
    { code:"GBP", label:"GBP/USD", desc:"British Pound", invert:true, base:"GBP" },
    { code:"JPY", label:"USD/JPY", desc:"Japanese Yen" },
    { code:"CNY", label:"USD/CNY", desc:"Chinese Yuan" },
    { code:"SGD", label:"USD/SGD", desc:"Singapore Dollar" },
    { code:"KRW", label:"USD/KRW", desc:"Korean Won" },
    { code:"AUD", label:"USD/AUD", desc:"Australian Dollar" },
  ];

  // US markets / big stocks (fallback values if live fetch fails)
  const EQUITIES = [
    { sym:"^DJI",  label:"DOW",    last:39118, chg: 0.32 },
    { sym:"^IXIC", label:"NASDAQ", last:18188, chg: 0.55 },
    { sym:"^GSPC", label:"S&P 500",last: 5308, chg: 0.40 },
    { sym:"NVDA",  label:"NVDA",   last:  875, chg: 1.20 },
    { sym:"TSLA",  label:"TSLA",   last:  248, chg:-0.80 },
    { sym:"GOOGL", label:"GOOGL",  last:  176, chg: 0.40 },
    { sym:"AAPL",  label:"AAPL",   last:  189, chg: 0.22 },
    { sym:"AMZN",  label:"AMZN",   last:  183, chg:-0.30 },
  ];

  // Big-picture numbers (world-scale, seldom changes, manually updated)
  const BIG_NUMBERS = [
    { label:"World GDP",     value:"$105T",   sub:"USD 2024 est." },
    { label:"World trade",   value:"$32T",    sub:"exports/year" },
    { label:"BTC market cap",value:"~$1.3T",  sub:"if you're curious" },
    { label:"World debt",    value:"$315T",   sub:"IIF estimate" },
    { label:"Human beings",  value:"8.1B",    sub:"and counting" },
    { label:"Internet users",value:"5.4B",    sub:"67% of world" },
  ];

  // ── STATE ──────────────────────────────────────────────────
  let state = loadCache() || {
    fx: {},
    btc: { price: 67240, change: 2.3 },
    eth: { price: 3512, change:-0.8 },
    equities: EQUITIES.map(e => ({ ...e })),
    lastFetch: null,
    live: false,
  };

  function loadCache() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { return null; }
  }
  function saveCache() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
  }

  // ── DOM ROOT ───────────────────────────────────────────────
  const root = document.getElementById('data-wall');
  if (!root) return;

  // ── FETCH DATA ─────────────────────────────────────────────
  async function fetchAll() {
    await Promise.allSettled([fetchFX(), fetchCrypto()]);
    state.lastFetch = new Date().toISOString();
    state.live = true;
    saveCache();
    render();
  }

  async function fetchFX() {
    const r = await fetch('https://open.er-api.com/v6/latest/USD', { cache:'no-store' });
    const d = await r.json();
    if (d.result === 'success') state.fx = d.rates;
  }

  async function fetchCrypto() {
    const [bRes, eRes] = await Promise.all([
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT'),
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT'),
    ]);
    const b = await bRes.json(); const e = await eRes.json();
    if (b.lastPrice) state.btc = { price: +b.lastPrice, change: +b.priceChangePercent };
    if (e.lastPrice) state.eth = { price: +e.lastPrice, change: +e.priceChangePercent };
  }

  // ── HELPERS ────────────────────────────────────────────────
  function timeFor(tz) {
    return new Intl.DateTimeFormat('en-US',{ timeZone:tz, hour:'2-digit', minute:'2-digit', hour12:false }).format(new Date());
  }
  function dayFor(tz) {
    return new Intl.DateTimeFormat('en-US',{ timeZone:tz, weekday:'short' }).format(new Date());
  }
  function isNight(tz) {
    const h = parseInt(new Intl.DateTimeFormat('en-US',{ timeZone:tz, hour:'2-digit', hour12:false }).format(new Date()), 10);
    return h >= 22 || h < 6;
  }
  function fmtNum(n, decimals=2) {
    if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
    return n.toFixed(decimals).replace(/\.00$/, '');
  }
  function chgClass(v) { return v > 0 ? 'dw-up' : v < 0 ? 'dw-down' : 'dw-flat'; }
  function arrow(v) { return v > 0 ? '↑' : v < 0 ? '↓' : '—'; }
  function fxVal(code) {
    const r = state.fx[code];
    return r ? fmtNum(r, code === 'JPY' || code === 'KRW' ? 0 : 2) : '—';
  }

  // ── RENDER ─────────────────────────────────────────────────
  function render() {
    const now = new Date();
    const liveTag = state.live ? '<span class="dw-live">● LIVE</span>' : '<span class="dw-delayed">CACHED</span>';

    root.innerHTML = `
    <div class="dw-inner">

      <!-- HEADER BAR -->
      <div class="dw-header">
        <span class="dw-header-left">世界亂象 &nbsp;·&nbsp; WORLD NOISE ${liveTag}</span>
        <span class="dw-header-right">${now.toLocaleString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false})} UTC${now.toISOString().slice(-6,5)}</span>
      </div>

      <!-- CITY CLOCKS -->
      <div class="dw-section-label">🕐 WORLD CLOCKS</div>
      <div class="dw-clocks">
        ${CITIES.map(c => `
          <div class="dw-clock ${isNight(c.tz) ? 'dw-night' : ''}">
            <div class="dw-clock-time">${timeFor(c.tz)}</div>
            <div class="dw-clock-city">${c.flag} ${c.label}</div>
            <div class="dw-clock-day">${dayFor(c.tz)}</div>
          </div>
        `).join('')}
      </div>

      <!-- FX + CRYPTO -->
      <div class="dw-two-col">
        <div>
          <div class="dw-section-label">💱 FOREX (USD BASE)</div>
          <div class="dw-rows">
            ${FX_PAIRS.map(p => `
              <div class="dw-row">
                <span class="dw-row-label">${p.label}</span>
                <span class="dw-row-val">${fxVal(p.code)}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div>
          <div class="dw-section-label">₿ CRYPTO</div>
          <div class="dw-rows">
            <div class="dw-row">
              <span class="dw-row-label">BTC/USD</span>
              <span class="dw-row-val">
                ${fmtNum(state.btc.price, 0)}
                <span class="${chgClass(state.btc.change)}">${arrow(state.btc.change)}${Math.abs(state.btc.change).toFixed(1)}%</span>
              </span>
            </div>
            <div class="dw-row">
              <span class="dw-row-label">ETH/USD</span>
              <span class="dw-row-val">
                ${fmtNum(state.eth.price, 0)}
                <span class="${chgClass(state.eth.change)}">${arrow(state.eth.change)}${Math.abs(state.eth.change).toFixed(1)}%</span>
              </span>
            </div>
          </div>

          <div class="dw-section-label" style="margin-top:14px">📊 US EQUITY</div>
          <div class="dw-rows">
            ${state.equities.map(e => `
              <div class="dw-row">
                <span class="dw-row-label">${e.label}</span>
                <span class="dw-row-val">
                  ${fmtNum(e.last, e.last >= 1000 ? 0 : 2)}
                  <span class="${chgClass(e.chg)}">${arrow(e.chg)}${Math.abs(e.chg).toFixed(1)}%</span>
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- BIG NUMBERS -->
      <div class="dw-section-label">🌍 SCALE OF THINGS</div>
      <div class="dw-big-nums">
        ${BIG_NUMBERS.map(n => `
          <div class="dw-big-card">
            <div class="dw-big-val">${n.value}</div>
            <div class="dw-big-label">${n.label}</div>
            <div class="dw-big-sub">${n.sub}</div>
          </div>
        `).join('')}
      </div>

      <!-- THE REVEAL LINE -->
      <div class="dw-reveal">
        <div class="dw-reveal-cn">道可道，非常道</div>
        <div class="dw-reveal-py">dào kě dào &nbsp;·&nbsp; fēi cháng dào</div>
        <div class="dw-reveal-en">All of the above. And still: the way that can be named is not the constant way.</div>
        <div class="dw-reveal-scroll">↓ &nbsp; Scroll for the book that answers this &nbsp; ↓</div>
      </div>

    </div>
    `;
  }

  // ── CLOCK TICK ─────────────────────────────────────────────
  function tickClocks() {
    const clocks = root.querySelectorAll('.dw-clock');
    CITIES.forEach((c, i) => {
      if (!clocks[i]) return;
      const t = clocks[i].querySelector('.dw-clock-time');
      const d = clocks[i].querySelector('.dw-clock-day');
      if (t) t.textContent = timeFor(c.tz);
      if (d) d.textContent = dayFor(c.tz);
      clocks[i].classList.toggle('dw-night', isNight(c.tz));
    });
  }

  // ── BOOT ──────────────────────────────────────────────────
  render();                      // render with cached/fallback data first
  fetchAll();                    // then fetch live
  setInterval(tickClocks, 1000); // clocks update every second
  setInterval(fetchAll, REFRESH_MS); // full refresh every 30s

})();
