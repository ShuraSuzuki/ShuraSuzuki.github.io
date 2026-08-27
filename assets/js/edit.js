/* =============================================================
   edit.js — ページを見ながら文章を直すための編集モード

   入り方（どちらでも）
     ・キーボードで  Cmd(Ctrl) + Shift + E
     ・URL のうしろに ?edit を付ける   例) index.html?edit
   やめ方
     ・同じショートカット、または右下パネルの「編集モードを終了」

   ・serve.command でサイトを開いていれば、「保存」を押すだけで
     data/site-data.js が直接書き換わります（バックアップ付き）
   ・それ以外の場合は「保存」でファイルの場所を一度選べば、
     以後は同じファイルに上書きできます（Chrome など）
   ・どちらも使えないときだけ、ダウンロードになります
   ・編集内容はブラウザに一時保存されます。ただしファイルを直接開いた
     （file:// で見ている）場合は保存できないことがあるので、その場合は
     パネルに注意書きが出ます
   ・編集モードでないときは何も起きません。公開しても訪問者の見え方は
     変わりません（変更は自分のブラウザの中だけ）
   ============================================================= */
(function () {
  "use strict";

  var KEY_EDITS = "site-edits";
  var KEY_MODE  = "site-edit-mode";

  /* ---------- 保存先が使えるか（file:// では使えないことがある） ---------- */
  var STORAGE_OK = (function () {
    try { localStorage.setItem("__probe", "1"); localStorage.removeItem("__probe"); return true; }
    catch (e) { return false; }
  })();
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }

  /* ---------- パス操作: "research[0].title_ja" ---------- */
  function parsePath(path) {
    var keys = [], re = /([^.[\]]+)|\[(\d+)\]/g, m;
    while ((m = re.exec(path))) keys.push(m[2] !== undefined ? parseInt(m[2], 10) : m[1]);
    return keys;
  }
  function getPath(obj, path) {
    var k = parsePath(path);
    for (var i = 0; i < k.length && obj != null; i++) obj = obj[k[i]];
    return obj;
  }
  function setPath(obj, path, val) {
    var k = parsePath(path);
    for (var i = 0; i < k.length - 1 && obj != null; i++) obj = obj[k[i]];
    if (obj != null) obj[k[k.length - 1]] = val;
  }
  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  /* ---------- 元の内容を控えておく（差分表示・復元用） ---------- */
  var PRISTINE = clone(window.SITE || {});

  /* ---------- 編集内容 ---------- */
  var edits = {};
  try { edits = JSON.parse(lsGet(KEY_EDITS) || "{}"); } catch (e) { edits = {}; }
  function persist() { lsSet(KEY_EDITS, JSON.stringify(edits)); }

  var ACTIVE = false;
  var panel = null;

  /* ---------- スタイル ---------- */
  var CSS = [
    '[data-edit]{outline:1px dashed transparent;outline-offset:2px;border-radius:2px;transition:outline-color .12s,background .12s}',
    '[data-edit]:hover{outline-color:var(--rule-strong);background:color-mix(in srgb,var(--accent) 6%,transparent);cursor:text}',
    '[data-edit]:focus{outline:2px solid var(--accent);background:color-mix(in srgb,var(--accent) 9%,transparent)}',
    '[data-edit].is-changed{background:color-mix(in srgb,var(--accent) 12%,transparent);outline-color:var(--accent)}',
    /* 中身を空にしても、もう一度クリックして直せるように場所を残す */
    '[data-edit]:empty{display:inline-block;min-width:4rem;min-height:1.15em;vertical-align:-.15em;',
    '  outline:1px dashed var(--accent);background:color-mix(in srgb,var(--accent) 14%,transparent)}',
    '#ed-panel{position:fixed;right:1rem;bottom:1rem;z-index:9999;width:min(23rem,calc(100vw - 2rem));',
    '  background:var(--bg-raised);border:1px solid var(--rule-strong);border-radius:8px;',
    '  box-shadow:0 8px 32px rgba(0,0,0,.18);font-family:var(--sans);font-size:.82rem;color:var(--text);overflow:hidden}',
    '#ed-head{display:flex;align-items:center;gap:.5rem;padding:.6rem .8rem;background:var(--bg-sunken);border-bottom:1px solid var(--rule);cursor:pointer}',
    '#ed-head b{font-size:.82rem;font-weight:600}',
    '#ed-count{margin-left:auto;font-family:var(--mono);font-size:.72rem;color:var(--text-muted)}',
    '#ed-body{max-height:min(24rem,45vh);overflow:auto;padding:.3rem .8rem .6rem}',
    '#ed-panel.collapsed #ed-body,#ed-panel.collapsed #ed-foot,',
    '#ed-panel.collapsed #ed-note,#ed-panel.collapsed #ed-warn{display:none}',
    '.ed-item{padding:.5rem 0;border-bottom:1px solid var(--rule)}',
    '.ed-item:last-child{border-bottom:0}',
    '.ed-path{font-family:var(--mono);font-size:.68rem;color:var(--accent-text);margin-bottom:.25rem;word-break:break-all}',
    '.ed-old{color:var(--text-muted);text-decoration:line-through;font-size:.76rem;line-height:1.5}',
    '.ed-new{color:var(--text);font-size:.76rem;line-height:1.5;margin-top:.15rem}',
    '#ed-empty{color:var(--text-muted);padding:.7rem 0;line-height:1.6}',
    '.ed-revert{font:inherit;font-size:.66rem;padding:.05rem .35rem;margin-left:.35rem;cursor:pointer;',
    '  border:1px solid var(--rule-strong);border-radius:3px;background:var(--bg-raised);color:var(--text-muted)}',
    '.ed-revert:hover{color:var(--text);border-color:var(--text-muted)}',
    '#ed-warn{font-size:.72rem;line-height:1.55;padding:.55rem .8rem;background:color-mix(in srgb,#c2410c 14%,var(--bg-sunken));',
    '  color:var(--text);border-top:1px solid var(--rule)}',
    '#ed-foot{display:flex;flex-wrap:wrap;gap:.4rem;padding:.6rem .8rem;border-top:1px solid var(--rule);background:var(--bg-sunken)}',
    '.ed-btn{font:inherit;font-size:.76rem;font-weight:500;padding:.35rem .6rem;border-radius:5px;cursor:pointer;',
    '  border:1px solid var(--rule-strong);background:var(--bg-raised);color:var(--text-soft)}',
    '.ed-btn:hover{color:var(--text);border-color:var(--text-muted)}',
    '.ed-btn.primary{background:var(--accent);border-color:var(--accent);color:#fff;font-weight:600}',
    '.ed-btn.primary:hover{filter:brightness(1.08);color:#fff}',
    '.ed-btn:disabled{opacity:.45;cursor:not-allowed}',
    '#ed-note{font-size:.72rem;color:var(--text-muted);padding:0 .8rem .6rem;line-height:1.55;background:var(--bg-sunken)}',
    /* 顔写真の調整 */
    '.portrait.ed-live{cursor:grab;outline:2px solid var(--accent);outline-offset:2px}',
    '.portrait.ed-live:active{cursor:grabbing}',
    '.portrait.ed-live::after{content:"ドラッグで位置調整";position:absolute;left:0;right:0;bottom:0;',
    '  background:rgba(0,0,0,.55);color:#fff;font-family:var(--sans);font-size:.66rem;padding:.25rem;text-align:center;pointer-events:none}',
    '#ed-pf{margin-top:.6rem;max-width:min(100%,320px);display:flex;flex-direction:column;gap:.45rem;',
    '  font-family:var(--sans);font-size:.74rem;color:var(--text-soft);',
    '  border:1px solid var(--rule-strong);border-radius:6px;padding:.6rem .7rem;background:var(--bg-raised)}',
    '#ed-pf .row{display:flex;align-items:center;gap:.5rem}',
    '#ed-pf .row > span:first-child{width:3.6rem;flex:none;color:var(--text-muted)}',
    '#ed-pf select,#ed-pf input[type=range]{font:inherit;flex:1;min-width:0}',
    '#ed-pf select{padding:.2rem .3rem;border:1px solid var(--rule-strong);border-radius:4px;background:var(--bg);color:var(--text)}',
    '#ed-pf .val{width:3.4rem;text-align:right;font-family:var(--mono);font-size:.7rem;color:var(--text-muted)}',
    '#ed-pf button{font:inherit;font-size:.7rem;padding:.25rem .5rem;border:1px solid var(--rule-strong);',
    '  border-radius:4px;background:var(--bg);color:var(--text-soft);cursor:pointer}',
    '#ed-pf button:hover{color:var(--text);border-color:var(--text-muted)}'
  ].join("\n");

  /* ---------- 値の読み書き ---------- */
  function kindOf(el) {
    if (el.hasAttribute("data-edit-html")) return "html";
    if (el.hasAttribute("data-edit-list")) return "list";
    return "text";
  }
  function readEl(el) {
    var k = kindOf(el);
    if (k === "html") return el.innerHTML.trim();
    var t = el.innerText.replace(/\s+/g, " ").trim();
    if (k === "list") return t.split(/\s*,\s*/).filter(Boolean);
    return t;
  }
  function sameValue(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  function preview(v) {
    var s = Array.isArray(v) ? v.join(", ") : String(v == null ? "" : v);
    s = s.replace(/<[^>]+>/g, "").replace(/&mdash;/g, "—").replace(/&rarr;/g, "→");
    return s.length > 110 ? s.slice(0, 110) + "…" : s;
  }
  function escHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- パネル ---------- */
  function buildPanel() {
    var st = document.createElement("style");
    st.id = "ed-style"; st.textContent = CSS;
    document.head.appendChild(st);

    panel = document.createElement("div");
    panel.id = "ed-panel";
    panel.innerHTML =
      '<div id="ed-head"><b>編集モード</b><span id="ed-count"></span></div>' +
      '<div id="ed-body"></div>' +
      '<p id="ed-note">文字の上をクリックすると直せます。右上の「日本語 / EN」を切り替えれば、もう一方の言語も直せます。</p>' +
      (STORAGE_OK ? "" :
        '<div id="ed-warn">このページはファイルを直接開いて表示されているため、<b>変更をブラウザに保存できません</b>。' +
        'ページを閉じたり再読み込みすると消えます。書き終えたら必ずダウンロードしてください。</div>') +
      '<div id="ed-foot">' +
        '<button class="ed-btn primary" id="ed-save">保存</button>' +
        '<button class="ed-btn" id="ed-dl">ダウンロード</button>' +
        '<button class="ed-btn" id="ed-copy">変更点をコピー</button>' +
        '<button class="ed-btn" id="ed-reset">すべて破棄</button>' +
        '<button class="ed-btn" id="ed-exit">編集モードを終了</button>' +
      "</div>";
    document.body.appendChild(panel);

    document.getElementById("ed-head").addEventListener("click", function () {
      panel.classList.toggle("collapsed");
    });
    document.getElementById("ed-body").addEventListener("click", function (e) {
      var b = e.target.closest(".ed-revert");
      if (b) revert(b.getAttribute("data-path"));
    });
    document.getElementById("ed-save").addEventListener("click", save);
    document.getElementById("ed-dl").addEventListener("click", download);
    document.getElementById("ed-copy").addEventListener("click", copyDiff);
    document.getElementById("ed-reset").addEventListener("click", function () {
      if (!Object.keys(edits).length) return;
      if (!confirm("書き換えた内容をすべて捨てて、元の文章に戻します。よろしいですか？")) return;
      edits = {}; persist();
      window.SITE = clone(PRISTINE);
      redraw();
      refreshPanel();
    });
    document.getElementById("ed-exit").addEventListener("click", function () {
      if (Object.keys(edits).length) {
        var msg = STORAGE_OK
          ? "保存していない変更が " + Object.keys(edits).length + " 件あります。\nダウンロードせずに終了しますか？（変更はブラウザに残るので、あとで続きから編集できます）"
          : "変更が " + Object.keys(edits).length + " 件あります。\nこのページは変更を保存できないため、終了すると失われます。よろしいですか？";
        if (!confirm(msg)) return;
      }
      deactivate();
    });
  }

  function refreshPanel() {
    if (!panel) return;
    var keys = Object.keys(edits);
    document.getElementById("ed-count").textContent = keys.length ? keys.length + " 件変更" : "変更なし";
    var body = document.getElementById("ed-body");
    if (!keys.length) {
      body.innerHTML = '<p id="ed-empty">まだ変更はありません。<br>ページ上の文字をクリックして書き換えてください。</p>';
    } else {
      body.innerHTML = keys.map(function (p) {
        return '<div class="ed-item"><div class="ed-path">' + p +
               ' <button class="ed-revert" data-path="' + p + '" title="この項目だけ元に戻す">戻す</button></div>' +
               '<div class="ed-old">' + escHtml(preview(getPath(PRISTINE, p))) + "</div>" +
               '<div class="ed-new">' + escHtml(preview(edits[p])) + "</div></div>";
      }).join("");
    }
    document.getElementById("ed-save").disabled = !keys.length;
    document.getElementById("ed-dl").disabled = !keys.length;
    document.getElementById("ed-copy").disabled = !keys.length;
    document.getElementById("ed-save").textContent =
      SAVE_MODE === "server" ? "保存"
    : SAVE_MODE === "picker" ? (fileHandle ? "保存" : "保存先を選んで保存")
    : "保存（ダウンロード）";
    document.getElementById("ed-note").style.display = keys.length ? "none" : "";
  }

  /* ---------- 編集を有効にする ---------- */
  function wire() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-edit]"), function (el) {
      if (el.dataset.edWired) return;
      el.dataset.edWired = "1";

      var path = el.getAttribute("data-edit");
      el.setAttribute("contenteditable", "true");
      el.setAttribute("spellcheck", "false");
      if (edits.hasOwnProperty(path)) el.classList.add("is-changed");

      var composing = false;

      function commit() {
        var val = readEl(el);
        if (sameValue(val, getPath(PRISTINE, path))) {
          delete edits[path];
          el.classList.remove("is-changed");
        } else {
          edits[path] = val;
          el.classList.add("is-changed");
        }
        setPath(window.SITE, path, val);
        persist();
        refreshPanel();
      }

      /* --- 日本語入力（IME）対応 ---
         変換中は「まだ確定していない文字」が入っている状態なので、
         こちらから触らない。ここで Enter を横取りすると、変換を確定
         しようとした瞬間に入力中の文字が消えてしまう。 */
      el.addEventListener("compositionstart", function () { composing = true; });
      el.addEventListener("compositionend", function () { composing = false; commit(); });

      el.addEventListener("input", function () { if (!composing) commit(); });
      el.addEventListener("blur", function () { if (!composing) commit(); });

      el.addEventListener("keydown", function (e) {
        /* 変換中の Enter / Escape は IME のもの。奪ってはいけない。
           keyCode 229 は「IME が処理中」を表す古くからの目印。 */
        if (composing || e.isComposing || e.keyCode === 229) return;
        if (e.key === "Enter") { e.preventDefault(); el.blur(); }
        if (e.key === "Escape") { el.blur(); }
      });

      el.addEventListener("paste", function (e) {
        e.preventDefault();
        var t = (e.clipboardData || window.clipboardData).getData("text/plain");
        document.execCommand("insertText", false, t);
      });
    });
  }

  /* ---------- 顔写真の調整 ---------- */
  var PF = "profile.portrait.";

  function pfGet(k) { return getPath(window.SITE, PF + k); }

  function pfSet(k, v) {
    var path = PF + k;
    setPath(window.SITE, path, v);
    if (sameValue(v, getPath(PRISTINE, path))) delete edits[path];
    else edits[path] = v;
    persist();
    if (window.SITE_RENDER) window.SITE_RENDER();
    refreshPanel();
  }

  var RATIOS = [["4 / 5", "4:5（縦長・標準）"], ["1 / 1", "1:1（正方形）"],
                ["3 / 4", "3:4（やや縦長）"], ["2 / 3", "2:3（細長い）"],
                ["3 / 2", "3:2（横長）"], ["16 / 9", "16:9（横長）"]];

  function wirePortrait() {
    var fig = document.querySelector(".portrait");
    var img = fig && fig.querySelector("img");
    if (!fig || !img || fig.dataset.edWired) return;
    fig.dataset.edWired = "1";
    fig.classList.add("ed-live");

    /* --- ドラッグで切り抜き位置を動かす --- */
    var drag = null;
    fig.addEventListener("pointerdown", function (e) {
      var pos = String(pfGet("position") || "50% 50%").split(/\s+/);
      drag = { x: e.clientX, y: e.clientY,
               px: parseFloat(pos[0]) || 50, py: parseFloat(pos[1]) || 50,
               w: fig.clientWidth, h: fig.clientHeight };
      fig.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    fig.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var clamp = function (n) { return Math.max(0, Math.min(100, n)); };
      /* 下へドラッグ＝写真を下げる＝上側が見えるので、位置の％は減る */
      var nx = clamp(drag.px - (e.clientX - drag.x) / drag.w * 100);
      var ny = clamp(drag.py - (e.clientY - drag.y) / drag.h * 100);
      img.style.objectPosition = Math.round(nx) + "% " + Math.round(ny) + "%";
      drag.last = Math.round(nx) + "% " + Math.round(ny) + "%";
    });
    function endDrag(e) {
      if (!drag) return;
      var v = drag.last; drag = null;
      try { fig.releasePointerCapture(e.pointerId); } catch (err) {}
      if (v) pfSet("position", v);
    }
    fig.addEventListener("pointerup", endDrag);
    fig.addEventListener("pointercancel", endDrag);

    /* --- 縦横比・大きさのつまみ --- */
    var box = document.createElement("div");
    box.id = "ed-pf";
    box.innerHTML =
      '<div class="row"><span>縦横比</span><select id="ed-pf-ratio">' +
        RATIOS.map(function (r) { return '<option value="' + r[0] + '">' + r[1] + "</option>"; }).join("") +
      "</select></div>" +
      '<div class="row"><span>大きさ</span><input id="ed-pf-w" type="range" min="140" max="420" step="10">' +
        '<span class="val" id="ed-pf-wv"></span></div>' +
      '<div class="row"><span>位置</span><span class="val" id="ed-pf-pv" style="width:auto;text-align:left;flex:1"></span>' +
        '<button id="ed-pf-reset">中央に戻す</button></div>';
    fig.parentNode.insertBefore(box, fig.nextSibling);

    var sel = box.querySelector("#ed-pf-ratio");
    var rng = box.querySelector("#ed-pf-w");
    sel.value = String(pfGet("aspect") || "4 / 5");
    rng.value = String(pfGet("width") || 240);
    sel.addEventListener("change", function () { pfSet("aspect", sel.value); });
    rng.addEventListener("input", function () {
      var v = parseInt(rng.value, 10);
      fig.style.maxWidth = v + "px";
      box.querySelector("#ed-pf-wv").textContent = v + "px";
    });
    rng.addEventListener("change", function () { pfSet("width", parseInt(rng.value, 10)); });
    box.querySelector("#ed-pf-reset").addEventListener("click", function () {
      pfSet("position", "50% 50%");
    });
    pfRefresh();
  }

  function pfRefresh() {
    var box = document.getElementById("ed-pf"); if (!box) return;
    box.querySelector("#ed-pf-wv").textContent = (pfGet("width") || 240) + "px";
    box.querySelector("#ed-pf-pv").textContent = pfGet("position") || "50% 50%";
    box.querySelector("#ed-pf-ratio").value = String(pfGet("aspect") || "4 / 5");
    box.querySelector("#ed-pf-w").value = String(pfGet("width") || 240);
  }

  function unwirePortrait() {
    var fig = document.querySelector(".portrait");
    if (fig) { fig.classList.remove("ed-live"); delete fig.dataset.edWired; }
    var box = document.getElementById("ed-pf");
    if (box) box.remove();
  }

  function unwire() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-edit]"), function (el) {
      el.removeAttribute("contenteditable");
      el.classList.remove("is-changed");
      delete el.dataset.edWired;
    });
  }

  function redraw() {
    if (window.SITE_RENDER) window.SITE_RENDER();
    if (ACTIVE) { wire(); wirePortrait(); pfRefresh(); }
  }

  function revert(path) {
    setPath(window.SITE, path, clone(getPath(PRISTINE, path)));
    delete edits[path];
    persist();
    redraw();
    refreshPanel();
  }

  /* ---------- 出入り ---------- */
  function activate() {
    if (ACTIVE) return;
    ACTIVE = true;
    lsSet(KEY_MODE, "1");
    Object.keys(edits).forEach(function (p) { setPath(window.SITE, p, edits[p]); });
    if (!panel) buildPanel(); else panel.style.display = "";
    redraw();
    refreshPanel();
    detectSaveMode();
  }

  function deactivate() {
    if (!ACTIVE) return;
    ACTIVE = false;
    lsDel(KEY_MODE);
    window.SITE = clone(PRISTINE);
    unwire();
    unwirePortrait();
    if (window.SITE_RENDER) window.SITE_RENDER();
    if (panel) panel.style.display = "none";
    if (location.search) history.replaceState(null, "", location.pathname + location.hash);
  }

  /* ---------- リンク遮断（編集中のみ） ---------- */
  document.addEventListener("click", function (e) {
    if (!ACTIVE) return;
    var a = e.target.closest && e.target.closest("a");
    if (a && a.querySelector("[data-edit]")) e.preventDefault();
  }, true);

  /* ---------- ショートカット: Cmd/Ctrl + Shift + E ---------- */
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "E" || e.key === "e")) {
      e.preventDefault();
      if (ACTIVE) deactivate(); else activate();
    }
  });

  /* ---------- site-data.js の書き出し ---------- */
  function q(s) {
    return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"')
                          .replace(/\n/g, "\\n").replace(/\r/g, "") + '"';
  }
  var IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
  function ser(v, indent) {
    var pad = "  ".repeat(indent), pad1 = "  ".repeat(indent + 1);
    if (v === null || v === undefined) return "null";
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    if (typeof v === "string") return q(v);
    if (Array.isArray(v)) {
      if (!v.length) return "[]";
      if (v.every(function (x) { return typeof x === "string"; })) {
        var one = "[" + v.map(q).join(", ") + "]";
        if (one.length + pad.length <= 100) return one;
      }
      return "[\n" + v.map(function (x) { return pad1 + ser(x, indent + 1); }).join(",\n") + "\n" + pad + "]";
    }
    var ks = Object.keys(v);
    if (!ks.length) return "{}";
    return "{\n" + ks.map(function (k) {
      return pad1 + (IDENT.test(k) ? k : q(k)) + ": " + ser(v[k], indent + 1);
    }).join(",\n") + "\n" + pad + "}";
  }

  var SECTIONS = [
    ["profile",     "プロフィール"],
    ["pages",       "各ページの本文（HTMLタグ <b> <em> <br> が使えます）"],
    ["news",        "News（新しい順に上へ追加）"],
    ["research",    "研究テーマ"],
    ["journal",     "査読付き学術論文"],
    ["invited",     "招待講演"],
    ["conference",  "国際会議発表"],
    ["awards",      "受賞"],
    ["grants",      "外部資金"],
    ["career",      "職歴"],
    ["education",   "学歴"],
    ["service",     "委員歴"],
    ["memberships", "所属学会"]
  ];

  function buildFile() {
    var S = window.SITE, out = [];
    out.push("/* =============================================================");
    out.push("   site-data.js  —  サイトの中身はすべてここに入っています");
    out.push("   更新するときはこのファイルだけ編集すれば OK です。");
    out.push("   （HTML / CSS / JS は触らなくて構いません）");
    out.push("");
    out.push("   ページ上で直接書き換えることもできます。");
    out.push("   Cmd(Ctrl) + Shift + E で編集モードに入れます。");
    out.push("   ============================================================= */");
    out.push("");
    out.push("window.SITE = {");
    out.push("");
    var known = SECTIONS.map(function (s) { return s[0]; });
    var extra = Object.keys(S).filter(function (k) { return known.indexOf(k) === -1; });
    var order = SECTIONS.filter(function (s) { return s[0] in S; });
    order.forEach(function (sec, i) {
      var last = (i === order.length - 1) && !extra.length;
      out.push("  /* ---------- " + sec[1] + " ---------- */");
      out.push("  " + sec[0] + ": " + ser(S[sec[0]], 1) + (last ? "" : ","));
      out.push("");
    });
    extra.forEach(function (k, i) {
      out.push("  " + k + ": " + ser(S[k], 1) + (i === extra.length - 1 ? "" : ","));
      out.push("");
    });
    out.push("};");
    return out.join("\n") + "\n";
  }
  window.__EDIT_EXPORT = buildFile;   // 書き出し内容を確認したいとき用

  /* ---------- 保存 ----------
     1) serve.command 経由なら、その場でファイルを書き換える
     2) だめなら、ブラウザのファイル保存機能で上書き（Chrome など）
     3) それも無理ならダウンロード                             */
  var SAVE_MODE = "download";
  var fileHandle = null;

  function detectSaveMode() {
    if (window.showSaveFilePicker) SAVE_MODE = "picker";
    if (location.protocol.indexOf("http") !== 0) { refreshPanel(); return; }
    fetch("__can_save", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (j && j.ok) SAVE_MODE = "server"; })
      .catch(function () {})
      .then(function () { refreshPanel(); });
  }

  /* 保存できたら、その内容が新しい「元の文章」になる */
  function markSaved() {
    PRISTINE = clone(window.SITE);
    edits = {};
    persist();
    redraw();
    refreshPanel();
  }

  function save() {
    var text = buildFile();

    if (SAVE_MODE === "server") {
      fetch("__save", { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: text })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (!j.ok) throw new Error(j.error || "保存できませんでした");
          markSaved();
          flash("保存しました" + (j.backup ? "（バックアップ: " + j.backup + "）" : ""));
        })
        .catch(function (e) { alert("保存できませんでした: " + e.message + "\n\nかわりにダウンロードしてください。"); });
      return;
    }

    if (SAVE_MODE === "picker") {
      var go = fileHandle
        ? Promise.resolve(fileHandle)
        : window.showSaveFilePicker({
            suggestedName: "site-data.js",
            types: [{ description: "サイトのデータ", accept: { "text/javascript": [".js"] } }]
          });
      go.then(function (h) {
        fileHandle = h;
        return h.createWritable();
      }).then(function (w) {
        return w.write(text).then(function () { return w.close(); });
      }).then(function () {
        markSaved();
        flash("保存しました");
      }).catch(function (e) {
        if (e && e.name === "AbortError") return;      // 選択をやめただけ
        alert("保存できませんでした: " + e.message + "\n\nかわりにダウンロードしてください。");
      });
      return;
    }

    download();
  }

  function flash(msg) {
    var el = document.getElementById("ed-flash");
    if (!el) {
      el = document.createElement("div");
      el.id = "ed-flash";
      el.style.cssText = "position:fixed;left:50%;bottom:1.2rem;transform:translateX(-50%);z-index:10000;" +
        "background:var(--accent);color:#fff;font-family:var(--sans);font-size:.8rem;font-weight:600;" +
        "padding:.5rem .9rem;border-radius:6px;box-shadow:0 6px 20px rgba(0,0,0,.25);pointer-events:none;" +
        "transition:opacity .3s";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = "1";
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.style.opacity = "0"; }, 2600);
  }

  function download() {
    var blob = new Blob([buildFile()], { type: "text/javascript;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "site-data.js";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    alert("site-data.js をダウンロードしました。\n\nサイトのフォルダの data/site-data.js に上書きすれば確定です。" +
          (STORAGE_OK ? "\n上書きしたあと、このパネルの「すべて破棄」を押して一時保存を空にしてください。" : ""));
  }

  function copyDiff() {
    var lines = ["# 変更点\n"];
    Object.keys(edits).forEach(function (p) {
      lines.push("## " + p);
      lines.push("- 変更前: " + preview(getPath(PRISTINE, p)));
      lines.push("- 変更後: " + preview(edits[p]));
      lines.push("");
    });
    var text = lines.join("\n");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        function () { alert("変更点をコピーしました。"); },
        function () { window.prompt("コピーしてください:", text); }
      );
    } else {
      window.prompt("コピーしてください:", text);
    }
  }

  /* ---------- 起動時 ---------- */
  document.addEventListener("site:rendered", function () {
    if (/[?&]edit\b/.test(location.search) || lsGet(KEY_MODE) === "1") { activate(); detectSaveMode(); }
  });
})();
