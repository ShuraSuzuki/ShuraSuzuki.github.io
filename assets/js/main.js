/* =============================================================
   main.js — rendering + language/theme switching
   Content lives in data/site-data.js; this file only draws it.

   Every piece of editable text is tagged with data-edit="<path>",
   where <path> addresses the value inside window.SITE
   (e.g. research[0].title_ja). assets/js/edit.js uses those tags
   to let you rewrite the page in place.
   ============================================================= */
(function () {
  "use strict";

  var S = window.SITE || {};
  var ME = /^(Shura Suzuki|鈴木\s*朱羅)$/;

  /* ---------- small helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* Editable wrapper. kind: "text" (default) | "html" | "list" */
  function ed(path, inner, kind) {
    var attr = ' data-edit="' + path + '"';
    if (kind === "html") attr += ' data-edit-html="1"';
    if (kind === "list") attr += ' data-edit-list="1"';
    return "<span" + attr + ">" + inner + "</span>";
  }

  /* Bilingual pair. Only one is visible at a time (see CSS section 3). */
  function bi(en, ja, pEn, pJa, kind) {
    var a = '<span data-lang="en">' + (pEn ? ed(pEn, en, kind) : en) + "</span>";
    var b = '<span data-lang="ja">' + (pJa ? ed(pJa, ja, kind) : ja) + "</span>";
    return a + b;
  }

  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function fmtDate(d) {          // "2026-07" -> {en:"Jul 2026", ja:"2026年7月"}
    var p = String(d).split("-");
    if (p.length < 2) return { en: p[0], ja: p[0] + "年" };
    var m = parseInt(p[1], 10);
    return { en: MONTHS[m - 1] + " " + p[0], ja: p[0] + "年" + m + "月" };
  }
  function authors(list) {
    if (!list) return "";
    return list.map(function (a) {
      return ME.test(a) ? '<span class="me">' + esc(a) + "</span>" : esc(a);
    }).join(", ");
  }

  /* ---------- language ---------- */
  function currentLang() { return document.documentElement.classList.contains("lang-ja") ? "ja" : "en"; }
  function setLang(lang, persist) {
    var root = document.documentElement;
    root.classList.toggle("lang-ja", lang === "ja");
    root.setAttribute("lang", lang === "ja" ? "ja" : "en");
    if (persist !== false) { try { localStorage.setItem("lang", lang); } catch (e) {} }
    $$("[data-lang-toggle]").forEach(function (b) {
      b.textContent = lang === "ja" ? "EN" : "日本語";
      b.setAttribute("aria-label", lang === "ja" ? "Switch to English" : "日本語に切り替え");
    });
  }

  /* ---------- theme ---------- */
  var SUN = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"/></svg>';
  var MOON = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.4A8.6 8.6 0 1 1 9.6 3.5a6.9 6.9 0 0 0 10.9 10.9Z"/></svg>';
  function effectiveTheme() {
    var set = document.documentElement.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
    $$("[data-theme-toggle]").forEach(function (b) {
      b.innerHTML = theme === "dark" ? SUN : MOON;
      b.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    });
  }

  /* ---------- renderers ---------- */

  /* <p data-bi="pages.hero_statement"></p> -> bilingual prose from SITE.pages */
  function renderBiSlots() {
    $$("[data-bi]").forEach(function (el) {
      var path = el.getAttribute("data-bi");
      var parts = path.split(".");
      var obj = S;
      for (var i = 0; i < parts.length && obj; i++) obj = obj[parts[i]];
      if (!obj) return;
      el.innerHTML = bi(obj.en, obj.ja, path + ".en", path + ".ja", "html");
    });
  }

  /* 顔写真の縦横比・大きさ・切り抜き位置は data/site-data.js の
     profile.portrait で決まる（編集モードでその場で調整できる） */
  function renderPortrait() {
    var fig = $(".portrait"); if (!fig) return;
    var cfg = (S.profile && S.profile.portrait) || {};
    var img = $("img", fig);
    if (cfg.aspect) fig.style.aspectRatio = cfg.aspect;
    if (cfg.width)  fig.style.maxWidth = cfg.width + "px";
    if (img) {
      if (cfg.src && img.getAttribute("src") !== cfg.src) img.setAttribute("src", cfg.src);
      img.style.objectPosition = cfg.position || "50% 50%";
    }
  }

  /* メールアドレスは site-data.js の中でも分割して持ち、ここで繋ぐ。
     ファイルを機械的に漁られても "@" を含む文字列として見つからない。 */
  function emailOf(p) {
    if (p.email) return p.email;
    if (!p.email_user || !p.email_domain) return "";
    return p.email_user + String.fromCharCode(64) + p.email_domain;
  }

  function renderProfile() {
    var p = S.profile; if (!p) return;
    var mail = emailOf(p);
    $$("[data-fill]").forEach(function (el) {
      if (el.getAttribute("data-fill") === "email" && mail) {
        el.textContent = mail; el.href = "mailto:" + mail;
      }
    });
    var row = $("#linkrow"); if (!row) return;
    var L = p.links || {};
    var defs = [
      ["email", mail ? "mailto:" + mail : "", "Email", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6 9 6.5L21 6"/></svg>'],
      ["scholar", L.scholar, "Google Scholar", '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 1 8.5l11 6.5 11-6.5L12 2Zm-6.6 9.6v4.2c0 2.2 3 4 6.6 4s6.6-1.8 6.6-4v-4.2L12 15.9l-6.6-4.3Z"/></svg>'],
      ["researchmap", L.researchmap, "researchmap", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 5 5"/></svg>'],
      ["orcid", L.orcid, "ORCID", '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0ZM7.5 17.9H5.9V7.6h1.6v10.3Zm-.8-11.6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5 11.6H9.3V7.6h3.9c3.5 0 5 2.5 5 5.2 0 2.9-2.2 5.1-5.5 5.1Zm.2-8.9h-1v7.5h1c2.4 0 3.6-1.5 3.6-3.7 0-2-1.1-3.8-3.6-3.8Z"/></svg>'],
      ["github", L.github, "GitHub", '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.7 1.2 3.4.9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"/></svg>']
    ];
    row.innerHTML = defs.filter(function (d) { return d[1]; }).map(function (d) {
      var ext = d[0] === "email" ? "" : ' target="_blank" rel="noopener"';
      return '<li><a href="' + esc(d[1]) + '"' + ext + ">" + d[3] + "<span>" + esc(d[2]) + "</span></a></li>";
    }).join("");
  }

  /* 「最近の活動」は researchmap から自動生成した news に、
     手書きの news_extra（researchmap に載らない出来事）を混ぜて日付順に並べる。
     出すのは直近1年ぶん。ただし少なすぎると寂しいので最低 MIN_NEWS 件は残す。 */
  var NEWS_MONTHS = 12, MIN_NEWS = 4;

  function recentNews() {
    var all = (S.news || []).concat(S.news_extra || []);
    all = all.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    var d = new Date();
    d.setMonth(d.getMonth() - NEWS_MONTHS);
    var cutoff = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2);
    var within = all.filter(function (n) { return n.date >= cutoff; });
    return within.length >= MIN_NEWS ? within : all.slice(0, MIN_NEWS);
  }

  function renderNews(limit) {
    var el = $("#news"); if (!el) return;
    var news = recentNews();
    var items = limit ? news.slice(0, limit) : news;
    el.innerHTML = items.map(function (n, i) {
      var d = fmtDate(n.date);
      var link_en = n.link ? ' <a href="' + esc(n.link) + '" target="_blank" rel="noopener">Read &rarr;</a>' : "";
      var link_ja = n.link ? ' <a href="' + esc(n.link) + '" target="_blank" rel="noopener">詳細 &rarr;</a>' : "";
      /* 編集モードで直せるよう、元の配列での位置を渡す */
      var src = (S.news || []).indexOf(n) >= 0 ? "news" : "news_extra";
      var idx = (src === "news" ? (S.news || []) : (S.news_extra || [])).indexOf(n);
      var b = src + "[" + idx + "]";
      return "<li" + (n.ja_only ? ' class="ja-only"' : "") + '><time datetime="' + esc(n.date) + '">' + bi(d.en, d.ja) + "</time>" +
             '<div class="body">' +
               '<span data-lang="en">' + ed(b + ".en", n.en, "html") + link_en + "</span>" +
               '<span data-lang="ja">' + ed(b + ".ja", n.ja, "html") + link_ja + "</span>" +
             "</div></li>";
    }).join("");
  }

  function tagList(t, i) {
    return (t.keywords || []).map(function (k, j) {
      return "<li>" + ed("research[" + i + "].keywords[" + j + "]", esc(k)) + "</li>";
    }).join("");
  }

  function renderThemeCards() {
    var el = $("#themes"); if (!el || !S.research) return;
    el.innerHTML = S.research.map(function (t, i) {
      var b = "research[" + i + "]";
      return '<article class="theme">' +
        "<h3>" + bi(esc(t.title_en), esc(t.title_ja), b + ".title_en", b + ".title_ja") + "</h3>" +
        '<div class="lead">' + bi(esc(t.lead_en), esc(t.lead_ja), b + ".lead_en", b + ".lead_ja") + "</div>" +
        '<ul class="tags">' + tagList(t, i) + "</ul>" +
      "</article>";
    }).join("");
  }

  function renderThemesFull() {
    var el = $("#themes-full"); if (!el || !S.research) return;
    el.innerHTML = S.research.map(function (t, i) {
      var b = "research[" + i + "]";
      return '<section class="theme-full" id="' + esc(t.id) + '"><div class="inner">' +
        "<div><h2>" + bi(esc(t.title_en), esc(t.title_ja), b + ".title_en", b + ".title_ja") + "</h2>" +
        '<ul class="tags" style="margin-top:.8rem">' + tagList(t, i) + "</ul></div>" +
        '<div><div class="lead">' + bi(esc(t.lead_en), esc(t.lead_ja), b + ".lead_en", b + ".lead_ja") + "</div>" +
        '<div class="body measure"><p>' + bi(esc(t.body_en), esc(t.body_ja), b + ".body_en", b + ".body_ja") + "</p></div></div>" +
      "</div></section>";
    }).join("");
  }

  /* 日本語の論文は日本語で、英語の論文は英語で出す。
     _ja 付きの値があるときだけ言語で切り替える。 */
  function pubField(p, base, key, render) {
    var en = ed(base + "." + key, render(p[key]), key === "authors" ? "list" : undefined);
    var jaVal = p[key + "_ja"];
    if (!jaVal) return en;
    var ja = ed(base + "." + key + "_ja", render(jaVal), key === "authors" ? "list" : undefined);
    return '<span data-lang="en">' + en + '</span><span data-lang="ja">' + ja + "</span>";
  }

  function pubItem(p, base) {
    var t = pubField(p, base, "title", esc);
    var title = p.doi
      ? '<a class="t" href="https://doi.org/' + esc(p.doi) + '" target="_blank" rel="noopener">' + t + "</a>"
      : '<span class="t">' + t + "</span>";
    var meta = [];
    if (p.doi) meta.push('<a class="doi" href="https://doi.org/' + esc(p.doi) + '" target="_blank" rel="noopener">doi:' + esc(p.doi) + "</a>");
    return '<li class="pub' + (p.ja_only ? " ja-only" : "") + '">' +
      '<div class="yr">' + esc(p.year) + "</div><div>" + title +
      (p.authors ? '<div class="au">' + pubField(p, base, "authors", authors) + "</div>" : "") +
      '<div class="ve"><i>' + pubField(p, base, "venue", esc) + "</i>" +
        (p.detail ? ", " + ed(base + ".detail", esc(p.detail)) : "") + "</div>" +
      (meta.length ? '<div class="meta">' + meta.join("") + "</div>" : "") +
      "</div></li>";
  }

  /* トップページの論文欄。settings.home_papers で選び方が変わる。
     "recent" なら新しい順、"featured" なら researchmap の「重要な業績」 */
  function renderSelectedPubs() {
    var el = $("#selected-pubs"); if (!el || !S.journal) return;
    var st = S.settings || {};
    var featured = st.home_papers === "featured";
    var n = st.home_papers_count || 5;

    /* 見出しは文言として site-data.js に持つ。何を出すかとは独立に決められる */
    var head = $("#papers-heading");
    var h = (S.pages || {}).papers_heading;
    if (head && h) {
      head.innerHTML = bi(esc(h.en), esc(h.ja), "pages.papers_heading.en", "pages.papers_heading.ja");
    }

    var picked = [];
    S.journal.forEach(function (p, i) {
      if (featured ? p.featured : picked.length < n) picked.push({ p: p, i: i });
    });
    el.innerHTML = picked.map(function (x) { return pubItem(x.p, "journal[" + x.i + "]"); }).join("");
  }

  function renderAllPubs() {
    var map = { "pubs-journal": ["journal", S.journal], "pubs-invited": ["invited", S.invited], "pubs-conference": ["conference", S.conference] };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id); if (!el || !map[id][1]) return;
      var key = map[id][0];
      el.innerHTML = map[id][1].map(function (p, i) { return pubItem(p, key + "[" + i + "]"); }).join("");
    });
  }

  function cvRows(id, rows, fn) {
    var el = document.getElementById(id); if (!el || !rows) return;
    el.innerHTML = rows.map(fn).join("");
  }

  /* 英語表記が無い項目は日本語版だけに出す（CSS の .ja-only が効く） */
  function onlyJa(r) { return r && r.ja_only ? ' class="ja-only"' : ""; }

  function simpleRow(key) {
    return function (r, i) {
      var b = key + "[" + i + "]";
      return "<li" + onlyJa(r) + '><div class="when">' + ed(b + ".period", esc(r.period)) + '</div><div class="what">' +
             bi(esc(r.en), esc(r.ja), b + ".en", b + ".ja") + "</div></li>";
    };
  }

  function renderCV() {
    cvRows("cv-career", S.career, simpleRow("career"));
    cvRows("cv-education", S.education, simpleRow("education"));
    cvRows("cv-service", S.service, simpleRow("service"));

    cvRows("cv-awards", S.awards, function (r, i) {
      var b = "awards[" + i + "]";
      var d = fmtDate(r.date);
      /* 授与機関が無い受賞もあるので、両方そろったときだけ区切りを入れる */
      var work = r.for_ja ? "「" + ed(b + ".for_ja", esc(r.for_ja)) + "」" : "";
      function sub(lang) {
        var org = r["org_" + lang];
        var o = org ? ed(b + ".org_" + lang, esc(org)) : "";
        return o && work ? o + " — " + work : (o || work);
      }
      var sub_en = sub("en"), sub_ja = sub("ja");
      return "<li" + onlyJa(r) + '><div class="when">' + bi(d.en, d.ja) + '</div><div class="what">' +
             bi(esc(r.en), esc(r.ja), b + ".en", b + ".ja") +
             '<span class="sub">' + bi(sub_en, sub_ja) + "</span></div></li>";
    });

    cvRows("cv-grants", S.grants, function (r, i) {
      var b = "grants[" + i + "]";
      var role_en = r.role_en ? " · " + ed(b + ".role_en", esc(r.role_en)) : "";
      var role_ja = r.role_ja ? " · " + ed(b + ".role_ja", esc(r.role_ja)) : "";
      return "<li" + onlyJa(r) + '><div class="when">' + ed(b + ".period", esc(r.period)) + '</div><div class="what">' +
             bi(esc(r.title_en), esc(r.title_ja), b + ".title_en", b + ".title_ja") +
             '<span class="sub">' +
               bi(ed(b + ".scheme_en", esc(r.scheme_en)) + role_en, ed(b + ".scheme_ja", esc(r.scheme_ja)) + role_ja) +
             "</span></div></li>";
    });

    cvRows("cv-teaching", S.teaching, simpleRow("teaching"));

    cvRows("cv-memberships", S.memberships, simpleRow("memberships"));
  }

  function renderMedia() {
    var el = $("#media"); if (!el || !S.media) return;
    el.innerHTML = S.media.map(function (m, i) {
      var b = "media[" + i + "]";
      var d = fmtDate(m.date);
      var t = pubField(m, b, "title", esc);
      var title = m.url
        ? '<a href="' + esc(m.url) + '" target="_blank" rel="noopener">' + t + "</a>"
        : t;
      return '<li' + (m.ja_only ? ' class="ja-only"' : "") + '>' +
        '<time datetime="' + esc(m.date) + '">' + bi(d.en, d.ja) + "</time>" +
        '<div class="body">' + title +
          '<span class="pub-src"> — ' + pubField(m, b, "publisher", esc) + "</span></div></li>";
    }).join("");
  }

  function renderDomesticCount() {
    var el = $("#domestic-talks"); if (!el) return;
    var n = (S.stats || {}).domestic_talks || 0;
    el.textContent = n ? n + "件" : "";
  }

  /* 中身がすべて日本語のみの節は、見出しごと英語版から消す */
  function hideEmptyEnglishSections() {
    $$(".cvblock, .pubgroup").forEach(function (sec) {
      var rows = $$("li", sec);
      /* HTML 側で ja-only を直接書いた節を消してしまわないよう、印は別クラスにする */
      sec.classList.toggle("ja-only-auto",
        rows.length > 0 && rows.every(function (li) { return li.classList.contains("ja-only"); }));
    });
  }

  /* まだ出さない設定になっている節を消す（site-data.js の settings） */
  function hideSection(id) {
    var el = document.getElementById(id);
    if (el) (el.closest(".section") || el).style.display = "none";
  }

  function applySettings() {
    var st = S.settings || {};
    if (st.show_research === false) {
      $$('a[href="research.html"]').forEach(function (a) { a.style.display = "none"; });
      hideSection("research-section");
      hideSection("themes-full");
    }
    if (st.show_media === false) hideSection("media-section");
  }

  /* ---------- nav current page ---------- */
  function markCurrent() {
    $$(".site-nav a").forEach(function (a) {
      var target = a.getAttribute("href");
      if (!target || target.charAt(0) === "#") return;
      var abs = new URL(target, location.href).pathname.replace(/\/$/, "/index.html");
      var here = location.pathname.replace(/\/$/, "/index.html");
      if (abs === here) a.setAttribute("aria-current", "page");
    });
  }

  /* ---------- boot ---------- */
  function renderAll() {
    S = window.SITE || {};
    var lim = document.body.getAttribute("data-news-limit");
    renderBiSlots();
    renderPortrait();
    renderProfile();
    renderNews(lim ? parseInt(lim, 10) : 0);
    renderThemeCards();
    renderThemesFull();
    renderSelectedPubs();
    renderAllPubs();
    renderCV();
    renderMedia();
    renderDomesticCount();
    hideEmptyEnglishSections();
    applySettings();
  }
  window.SITE_RENDER = renderAll;   // edit.js re-draws through this

  function init() {
    renderAll();
    markCurrent();
    setLang(currentLang(), false);
    setTheme(effectiveTheme());

    document.addEventListener("click", function (e) {
      var lb = e.target.closest("[data-lang-toggle]");
      if (lb) { setLang(currentLang() === "ja" ? "en" : "ja"); return; }
      var tb = e.target.closest("[data-theme-toggle]");
      if (tb) { setTheme(effectiveTheme() === "dark" ? "light" : "dark"); }
    });

    var yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();
    document.dispatchEvent(new CustomEvent("site:rendered"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
