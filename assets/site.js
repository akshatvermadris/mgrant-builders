/* ─────────────────────────────────────────────────────────────
   site.js — shared chrome for every page.
   Each page needs:
     <body data-root="" data-page="index">          (root pages)
     <body data-root="../" data-page="session-1.html" data-toc> (session pages)
   plus <script src="assets/sessions.js"></script> and this file.
   ───────────────────────────────────────────────────────────── */
(function () {
  var body = document.body;
  var R = body.getAttribute('data-root') || '';
  var PAGE = body.getAttribute('data-page') || '';
  var S = (window.MGB_SESSIONS || []).slice().sort(function (a, b) { return a.num - b.num; });
  var SITE = window.MGB_SITE || { name: 'mGrant Builders', sub: '' };

  function sget(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- theme (apply early) ---------- */
  var root = document.documentElement;
  var savedTheme = sget('mgb-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') root.setAttribute('data-theme', savedTheme);

  var LOGO = '<svg viewBox="0 0 150 150" aria-hidden="true"><path class="slide" d="M22 34 C 70 40, 96 70, 104 112" fill="none" stroke="#8B1A1A" stroke-width="16" stroke-linecap="round"/><circle class="dot" cx="104" cy="114" r="20" fill="#D4842A"/></svg>';

  /* ---------- sidebar ---------- */
  var done = S.filter(function (s) { return s.status === 'done'; });
  var onSession = /^session-/.test(PAGE);
  var groupOpen = onSession || PAGE === 'all-sessions' || sget('mgb-group-open') === '1';

  var html = '<a class="sidebar-logo" href="' + R + 'index.html">' + LOGO +
    '<div class="sidebar-title">' + esc(SITE.name) + '</div><div class="sidebar-sub">' + esc(SITE.sub) + '</div></a>';

  html += '<div class="sidebar-section">' +
    '<a class="sidebar-link' + (PAGE === 'index' ? ' current' : '') + '" href="' + R + 'index.html"><span class="link-icon">~</span> Home</a>' +
    '</div>';

  html += '<details class="sidebar-group"' + (groupOpen ? ' open' : '') + '><summary><span class="link-icon">S</span> Sessions' +
    '<span class="hint">' + (done.length > 1 ? 'S1&ndash;S' + done[done.length - 1].num : done.length ? 'S1' : '') + '</span><span class="chev">&#9656;</span></summary>' +
    '<div class="sidebar-children">' +
    '<a class="sidebar-link' + (PAGE === 'all-sessions' ? ' current' : '') + '" href="' + R + 'sessions/index.html"><span class="link-icon">&#9866;</span> All Sessions</a>';
  S.forEach(function (s) {
    var up = s.status !== 'done';
    html += '<a class="sidebar-link' + (up ? ' upcoming' : '') + (PAGE === s.slug ? ' current' : '') + '" href="' + (up ? '#' : R + 'sessions/' + s.slug) + '">' +
      '<span class="link-icon">' + s.num + '</span> ' + esc(s.short) +
      (s.latest ? '<span class="badge-new">New</span>' : up ? '<span class="badge-soon">Soon</span>' : '') + '</a>';
  });
  html += '</div></details>';

  if (body.hasAttribute('data-toc')) {
    var secs = document.querySelectorAll('section[id]');
    if (secs.length) {
      html += '<div class="sidebar-section sidebar-toc"><div class="sidebar-section-title">On this page</div>';
      secs.forEach(function (sec) {
        var h = sec.querySelector('h2');
        var label = sec.getAttribute('data-nav') || (h ? h.childNodes[0].textContent.trim() : sec.id);
        html += '<a class="sidebar-link" href="#' + sec.id + '"><span class="link-icon">&middot;</span> ' + esc(label) + '</a>';
      });
      html += '</div>';
    }
  }

  html += '<div class="sidebar-footer">' + esc(SITE.name) + ' &middot; Dhwani RIS<br><button class="theme-btn" id="themeBtn" type="button">Toggle theme</button></div>';

  var aside = document.querySelector('aside.sidebar');
  if (!aside) { aside = document.createElement('aside'); aside.className = 'sidebar'; body.insertBefore(aside, body.firstChild); }
  aside.setAttribute('aria-label', 'Site navigation');
  aside.innerHTML = html;

  var grp = aside.querySelector('details.sidebar-group');
  grp.addEventListener('toggle', function () { sset('mgb-group-open', grp.open ? '1' : '0'); });

  /* mobile header + overlay */
  var mh = document.createElement('div'); mh.className = 'mobile-header';
  mh.innerHTML = '<a href="' + R + 'index.html" style="display:flex;align-items:center;gap:10px;text-decoration:none"><span style="width:30px;height:30px;display:block">' + LOGO + '</span><span>' + esc(SITE.name) + '</span></a>' +
    '<button class="hamburger" type="button" aria-label="Open menu">&#9776;</button>';
  var ov = document.createElement('div'); ov.className = 'sidebar-overlay';
  body.insertBefore(ov, body.firstChild); body.insertBefore(mh, body.firstChild);
  function nav(open) { aside.classList.toggle('open', open); ov.classList.toggle('open', open); }
  window.toggleNav = nav;
  mh.querySelector('.hamburger').addEventListener('click', function () { nav(true); });
  ov.addEventListener('click', function () { nav(false); });
  aside.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { nav(false); }); });

  /* theme toggle */
  document.getElementById('themeBtn').addEventListener('click', function () {
    var cur = root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next); sset('mgb-theme', next);
  });

  /* active TOC link */
  var toc = Array.prototype.slice.call(aside.querySelectorAll('.sidebar-toc .sidebar-link'));
  if (toc.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) toc.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    document.querySelectorAll('section[id]').forEach(function (s) { io.observe(s); });
  }

  /* ---------- renderers (only run if the placeholder exists) ---------- */
  function href(s) { return R + 'sessions/' + s.slug; }

  var latest = S.filter(function (s) { return s.latest; })[0] || done[done.length - 1];
  var lb = document.getElementById('latestBanner');
  if (lb && latest) {
    lb.innerHTML = '<div class="home-last-label">Latest &middot; ' + esc(latest.date) + '</div>' +
      '<p class="home-last-text"><strong>Session ' + latest.num + ': ' + esc(latest.short) + '.</strong> ' + esc(latest.summary) + '</p>' +
      '<a class="home-last-cta" href="' + href(latest) + '">Read the session &rarr;</a>';
  }

  var grid = document.getElementById('sessionGrid');
  if (grid) {
    grid.innerHTML = S.map(function (s) {
      var up = s.status !== 'done';
      var tag = up ? 'div' : 'a';
      return '<' + tag + ' class="session-card' + (up ? ' upcoming' : '') + '"' + (up ? '' : ' href="' + href(s) + '"') + '>' +
        '<div class="sc-top"><div class="sc-num">' + s.num + '</div><div class="sc-date">' + esc(s.date) + '</div>' +
        (s.latest ? '<span class="sc-badge">Latest</span>' : '') + '</div>' +
        '<h3>' + esc(s.title) + '</h3><p>' + esc(s.summary) + '</p>' +
        '<div class="sc-tags">' + (s.tags || []).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
        '</' + tag + '>';
    }).join('');
  }

  var list = document.getElementById('sessionList');
  if (list) {
    list.innerHTML = S.map(function (s) {
      var up = s.status !== 'done';
      var tag = up ? 'div' : 'a';
      return '<' + tag + ' class="s-row' + (up ? ' upcoming' : '') + '"' + (up ? '' : ' href="' + href(s) + '"') + '>' +
        '<div class="s-num">' + s.num + '</div>' +
        '<div><div class="s-title">' + esc(s.title) + '</div><div class="s-desc">' + esc(s.summary) + '</div></div>' +
        '<div class="s-date">' + esc(s.date) + '</div></' + tag + '>';
    }).join('');
  }

  var planned = document.getElementById('plannedPills');
  if (planned) planned.innerHTML = (window.MGB_PLANNED || []).map(function (t) { return '<span class="pill dim">' + esc(t) + '</span>'; }).join('');

  var count = document.getElementById('sessionCount');
  if (count) count.textContent = done.length;

  /* prev / next pager on session pages */
  var pager = document.getElementById('pager');
  if (pager && onSession) {
    var i = -1; S.forEach(function (s, k) { if (s.slug === PAGE) i = k; });
    var prev = S[i - 1], next = S[i + 1];
    function cell(s, dir, cls) {
      if (!s) return '<span class="' + cls + '"><div class="dir">' + dir + '</div><div class="ttl">&mdash;</div></span>';
      if (s.status !== 'done') return '<span class="' + cls + '"><div class="dir">' + dir + ' &middot; soon</div><div class="ttl">Session ' + s.num + ': ' + esc(s.short) + '</div></span>';
      return '<a class="' + cls + '" href="' + s.slug + '"><div class="dir">' + dir + '</div><div class="ttl">Session ' + s.num + ': ' + esc(s.short) + '</div></a>';
    }
    pager.className = 'pager';
    pager.innerHTML = cell(prev, '&larr; Previous', 'prev') + cell(next, 'Next &rarr;', 'next');
  }
})();
