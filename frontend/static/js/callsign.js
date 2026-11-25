/*
 * Callsign: cara tipográfica de trazos, arte de dos tintas e interruptor de tema.
 * La cara y las proporciones provienen de la plantilla "Radio Station Landing Page"
 * (Kedhareswer Naidu, licencia MIT), trasladadas a JavaScript sin dependencias.
 */
(function () {
  var GSW = 30, GK = 22, GGAP = 14, GH = 200;
  var go = function () { return { z: false, p: [].slice.call(arguments) }; };
  var gz = function () { return { z: true, p: [].slice.call(arguments) }; };
  var G_O = gz([15, 15], [85, 15], [85, 185], [15, 185]);
  var G_P = go([15, 200], [15, 15, 0], [85, 15], [85, 108], [15, 108, 0]);

  var GLYPHS = {
    A: { w: 100, l: [go([15, 200], [15, 15], [85, 15], [85, 200]), go([15, 108], [85, 108])] },
    B: { w: 100, l: [go([15, 100, 0], [79, 100], [79, 15], [15, 15, 0], [15, 185, 0], [85, 185], [85, 100], [15, 100, 0])] },
    C: { w: 100, l: [go([85, 64], [85, 15], [15, 15], [15, 185], [85, 185], [85, 136])] },
    D: { w: 100, l: [gz([15, 15, 0], [85, 15], [85, 185], [15, 185, 0])] },
    E: { w: 96, l: [go([96, 15], [15, 15, 0], [15, 185, 0], [96, 185]), go([15, 100], [84, 100])] },
    F: { w: 94, l: [go([94, 15], [15, 15, 0], [15, 200]), go([15, 104], [82, 104])] },
    G: { w: 100, l: [go([85, 64], [85, 15], [15, 15], [15, 185], [85, 185], [85, 104, 0], [50, 104])] },
    H: { w: 100, l: [go([15, 0], [15, 200]), go([85, 0], [85, 200]), go([15, 100], [85, 100])] },
    I: { w: 30, l: [go([15, 0], [15, 200])] },
    J: { w: 96, l: [go([81, 0], [81, 185], [15, 185], [15, 138])] },
    K: { w: 100, l: [go([15, 0], [15, 200]), go([96, -6], [26, 104, 0], [96, 206])] },
    L: { w: 92, l: [go([15, 0], [15, 185, 0], [92, 185])] },
    M: { w: 126, l: [go([15, 200], [15, 15, 0], [63, 118, 0], [111, 15, 0], [111, 200])] },
    N: { w: 104, l: [go([15, 0], [15, 200]), go([89, 0], [89, 200]), go([8, -12], [96, 212])] },
    O: { w: 100, l: [G_O] },
    P: { w: 100, l: [G_P] },
    Q: { w: 100, l: [G_O, go([54, 142, 0], [98, 210, 0])] },
    R: { w: 100, l: [G_P, go([44, 108], [92, 208])] },
    S: { w: 100, l: [go([100, 15], [15, 15], [15, 100], [85, 100], [85, 185], [0, 185])] },
    T: { w: 100, l: [go([0, 15], [100, 15]), go([50, 15], [50, 200])] },
    U: { w: 100, l: [go([15, 0], [15, 185], [85, 185], [85, 0])] },
    V: { w: 104, l: [go([6, -14], [52, 196, 0], [98, -14])] },
    W: { w: 126, l: [go([15, 0], [15, 185, 0], [63, 96, 0], [111, 185, 0], [111, 0])] },
    X: { w: 104, l: [go([4, -14], [100, 214]), go([100, -14], [4, 214])] },
    Y: { w: 104, l: [go([4, -14], [52, 96, 0], [100, -14]), go([52, 96], [52, 200])] },
    Z: { w: 100, l: [go([0, 15], [85, 15, 0], [15, 185, 0], [100, 185])] },
    "0": { w: 100, l: [G_O] },
    "1": { w: 60, l: [go([0, 15], [36, 15, 0], [36, 200])] },
    "2": { w: 100, l: [go([0, 15], [85, 15], [85, 100], [15, 100], [15, 185, 0], [100, 185])] },
    "3": { w: 100, l: [go([0, 15], [85, 15], [85, 185], [0, 185]), go([30, 100], [85, 100])] },
    "4": { w: 100, l: [go([70, 4, 0], [14, 124, 0], [100, 124]), go([70, 0], [70, 200])] },
    "5": { w: 100, l: [go([100, 15], [15, 15, 0], [15, 100], [85, 100], [85, 185], [0, 185])] },
    "6": { w: 100, l: [go([92, 15], [15, 15], [15, 185], [85, 185], [85, 100], [15, 100, 0])] },
    "7": { w: 96, l: [go([0, 15], [81, 15, 0], [34, 212, 0])] },
    "8": { w: 100, l: [G_O, go([15, 100], [85, 100])] },
    "9": { w: 100, l: [go([8, 185], [85, 185], [85, 15], [15, 15], [15, 100], [85, 100, 0])] },
    ".": { w: 50, l: [go([10, 185], [40, 185])] },
    ":": { w: 50, l: [go([10, 70], [40, 70]), go([10, 185], [40, 185])] },
    "-": { w: 80, l: [go([8, 104], [72, 104])] },
    "+": { w: 100, l: [go([10, 104], [90, 104]), go([50, 64], [50, 144])] },
    "/": { w: 80, l: [go([2, 214], [78, -14])] },
    "?": { w: 92, l: [go([4, 15], [77, 15], [77, 100], [40, 100, 0], [40, 142]), go([25, 185], [55, 185])] },
    "!": { w: 40, l: [go([20, 0], [20, 140]), go([5, 185], [35, 185])] },
    " ": { w: 44, l: [] }
  };

  function fx(n) { return String(Math.round(n * 100) / 100); }

  function corner(v, p, q, dx) {
    var r = v.length > 2 ? v[2] : GK;
    var l1 = Math.hypot(v[0] - p[0], v[1] - p[1]);
    var l2 = Math.hypot(q[0] - v[0], q[1] - v[1]);
    var c = Math.min(r, l1 / 2, l2 / 2);
    if (!(c > 0) || !l1 || !l2) return "L" + fx(v[0] + dx) + " " + fx(v[1]);
    var ax = v[0] + ((p[0] - v[0]) / l1) * c, ay = v[1] + ((p[1] - v[1]) / l1) * c;
    var bx = v[0] + ((q[0] - v[0]) / l2) * c, by = v[1] + ((q[1] - v[1]) / l2) * c;
    return "L" + fx(ax + dx) + " " + fx(ay) + "Q" + fx(v[0] + dx) + " " + fx(v[1]) + " " + fx(bx + dx) + " " + fx(by);
  }

  function linePath(line, dx) {
    var p = line.p, n = p.length, d, i;
    if (n < 2) return "";
    if (line.z) {
      d = "M" + fx((p[n - 1][0] + p[0][0]) / 2 + dx) + " " + fx((p[n - 1][1] + p[0][1]) / 2);
      for (i = 0; i < n; i++) d += corner(p[i], p[(i - 1 + n) % n], p[(i + 1) % n], dx);
      return d + "Z";
    }
    d = "M" + fx(p[0][0] + dx) + " " + fx(p[0][1]);
    for (i = 1; i < n - 1; i++) d += corner(p[i], p[i - 1], p[i + 1], dx);
    return d + "L" + fx(p[n - 1][0] + dx) + " " + fx(p[n - 1][1]);
  }

  function norm(ch) {
    var c = ch.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
    if (c === "_") return " ";
    if (c === "'" || c === "’") return "";
    if (c === "&") return "+";
    return GLYPHS[c] ? c : (c.trim() ? "-" : " ");
  }

  function chars(text) {
    return Array.from(text).map(norm).filter(function (c) { return c !== ""; });
  }

  function width(text) {
    var cs = chars(text), x = 0;
    cs.forEach(function (c, i) { x += GLYPHS[c].w + (i < cs.length - 1 ? GGAP : 0); });
    return x;
  }

  // Trazos de una línea, con cada corrida en su propio grupo (para colorearla).
  function runsMarkup(runs) {
    var x = 0, out = "", total = 0;
    runs.forEach(function (r) { total += chars(r.text).length; });
    var seen = 0;
    runs.forEach(function (r) {
      var d = "";
      chars(r.text).forEach(function (c) {
        var g = GLYPHS[c];
        d += g.l.map(function (l) { return linePath(l, x); }).join("");
        seen++;
        x += g.w + (seen < total ? GGAP : 0);
      });
      out += '<path d="' + d + '"' + (r.cls ? ' class="' + r.cls + '"' : "") + "/>";
    });
    return { markup: out, width: x };
  }

  var CS = (window.CS = {});

  // Texto horizontal. runs: [{text, cls}] o una cadena.
  CS.svg = function (runs) {
    if (typeof runs === "string") runs = [{ text: runs }];
    var r = runsMarkup(runs);
    return '<svg class="cs-glyphs" viewBox="-16 -32 ' + (r.width + 32) + ' 264" aria-hidden="true" focusable="false">' +
      '<g fill="none" stroke="currentColor" stroke-width="' + GSW + '" stroke-linecap="butt" stroke-linejoin="round">' + r.markup + "</g></svg>";
  };

  // Texto en varias líneas, partido por palabras hasta maxW unidades.
  CS.block = function (text, maxW) {
    var words = text.replace(/_/g, " ").trim().split(/\s+/), lines = [], cur = "";
    words.forEach(function (w) {
      var next = cur ? cur + " " + w : w;
      if (!cur || width(next) <= maxW) cur = next; else { lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    var step = 250, w = 0, body = "";
    lines.forEach(function (ln, i) {
      var r = runsMarkup([{ text: ln }]);
      w = Math.max(w, r.width);
      body += '<g transform="translate(0 ' + i * step + ')">' + r.markup + "</g>";
    });
    return '<svg class="cs-glyphs" viewBox="-16 -32 ' + (w + 32) + " " + (lines.length * step + 14) + '" aria-hidden="true" focusable="false">' +
      '<g fill="none" stroke="currentColor" stroke-width="' + GSW + '" stroke-linecap="butt" stroke-linejoin="round">' + body + "</g></svg>";
  };

  // Titular vertical que se lee de abajo hacia arriba, como un mástil.
  CS.mast = function (runs) {
    var r = runsMarkup(runs);
    return '<svg class="cs-glyphs" viewBox="0 0 280 ' + (r.width + 32) + '" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMax meet">' +
      '<g transform="translate(32 ' + (r.width + 16) + ') rotate(-90)" fill="none" stroke="currentColor" stroke-width="' + GSW + '" stroke-linecap="butt" stroke-linejoin="round">' + r.markup + "</g></svg>";
  };

  // Arte de dos tintas, determinista según el nivel.
  var INKS = [["#ff48b0", "#0078bf"], ["#00a95c", "#ff48b0"], ["#ff6c2f", "#3255a4"], ["#ffe800", "#ff665e"],
              ["#3255a4", "#ffb300"], ["#00a95c", "#ff6c2f"], ["#ff665e", "#0078bf"], ["#ffe800", "#00a95c"]];
  CS.art = function (n) {
    var ink = INKS[n % INKS.length], a = ink[0], b = ink[1], kind = n % 5, id = "g" + n, s = "";
    if (kind === 0) {
      for (var i = 0; i < 6; i++) s += '<circle cx="200" cy="200" r="' + (170 - i * 28) + '" fill="' + (i % 2 ? b : a) + '"/>';
    } else if (kind === 1) {
      for (var j = 0; j < 9; j++) s += '<rect x="0" y="' + j * 46 + '" width="400" height="24" fill="' + (j % 2 ? b : a) + '"/>';
      s += '<circle cx="200" cy="190" r="118" fill="' + a + '" style="mix-blend-mode:multiply"/>';
    } else if (kind === 2) {
      for (var y = 0; y < 8; y++) for (var x = 0; x < 8; x++)
        s += '<circle cx="' + (25 + x * 50) + '" cy="' + (25 + y * 50) + '" r="' + (8 + ((x + y + n) % 5) * 4) + '" fill="' + ((x + y) % 2 ? b : a) + '"/>';
    } else if (kind === 3) {
      for (var k = -8; k < 12; k++) s += '<rect x="' + k * 44 + '" y="-100" width="22" height="600" fill="' + (k % 2 ? b : a) + '" transform="rotate(35 200 200)"/>';
      s += '<circle cx="200" cy="200" r="96" fill="' + b + '" style="mix-blend-mode:multiply"/>';
    } else {
      s += '<rect x="30" y="30" width="190" height="190" fill="' + a + '"/><rect x="150" y="150" width="220" height="220" fill="' + b + '" style="mix-blend-mode:multiply"/>';
      s += '<rect x="250" y="40" width="100" height="100" fill="' + b + '"/>';
    }
    return '<svg class="cs-art-svg" viewBox="0 0 400 400" role="img" aria-label="Ilustración del reto" preserveAspectRatio="xMidYMid slice">' +
      '<defs><filter id="' + id + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="' + (n + 3) + '" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 9 -3.9" result="m"/>' +
      '<feComposite in="SourceGraphic" in2="m" operator="out"/></filter></defs>' +
      '<rect width="400" height="400" fill="#eeefea"/><g filter="url(#' + id + ')">' + s + "</g></svg>";
  };

  // Pinta todo elemento con data-cs-text.
  CS.render = function (root) {
    (root || document).querySelectorAll("[data-cs-text]").forEach(function (el) {
      var t = el.getAttribute("data-cs-text"), mode = el.getAttribute("data-cs-mode"), extra = el.getAttribute("data-cs-red");
      if (mode === "mast") {
        el.innerHTML = CS.mast([{ text: t }, { text: " " + (extra || "") , cls: "cs-red" }]);
      } else if (mode === "block") {
        el.innerHTML = CS.block(t, parseInt(el.getAttribute("data-cs-max") || "900", 10));
      } else {
        el.innerHTML = CS.svg(extra ? [{ text: t }, { text: " " + extra, cls: "cs-red" }] : t);
      }
      el.setAttribute("role", "img");
      el.setAttribute("aria-label", t.replace(/_/g, " ") + (extra ? " " + extra : ""));
    });
  };

  // Tema día/noche, recordado si el navegador lo permite.
  CS.setTheme = function (t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("cs-theme", t); } catch (e) { /* sin almacenamiento */ }
    var b = document.getElementById("cs-theme");
    if (b) {
      b.setAttribute("aria-pressed", t === "dark" ? "true" : "false");
      b.querySelector("span").textContent = t === "dark" ? "Noche" : "Día";
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    CS.render();
    var b = document.getElementById("cs-theme");
    if (b) {
      var cur = document.documentElement.getAttribute("data-theme") || "dark";
      b.setAttribute("aria-pressed", cur === "dark" ? "true" : "false");
      b.querySelector("span").textContent = cur === "dark" ? "Noche" : "Día";
      b.addEventListener("click", function () {
        CS.setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
      });
    }
  });
})();
