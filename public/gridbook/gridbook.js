import { createClient } from "@supabase/supabase-js";


const COLS = 26, DEF_ROWS = 200, DEF_W = 104, HEAD_W = 48, MAX_ROWS = 5000;
const $ = id => document.getElementById(id);
const colName = c => String.fromCharCode(65 + c);
const colIndex = s => { s = s.toUpperCase(); let n = 0; for (const ch of s) n = n * 26 + (ch.charCodeAt(0) - 64); return n - 1; };
const keyOf = (r, c) => colName(c) + (r + 1);
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)));

/* ---------- state ---------- */
let sheets = [];
let activeId = null;
let sel = { ar: 0, ac: 0, fr: 0, fc: 0 };         // anchor + focus
let editing = null;                                 // {r,c,mode,orig}
let undoStack = [], redoStack = [];
let internalClip = null;
const sh = () => sheets.find(s => s.id === activeId) || sheets[0];

function newSheet(name) {
  const order = sheets.reduce((m, s) => Math.max(m, s.order || 0), 0) + 1;
  return { id: uid(), name, order, rows: DEF_ROWS, colW: {}, cells: {} };
}
function exampleSheet() {
  const s = { id: uid(), name: "Example", order: 1, rows: DEF_ROWS, colW: { A: 150 }, cells: {} };
  const put = (k, v, st) => { s.cells[k] = Object.assign({ v }, st || {}); };
  const H = { b: true, fill: "green" };
  put("A1", "Expense", H); put("B1", "Jan", Object.assign({ a: "r" }, H)); put("C1", "Feb", Object.assign({ a: "r" }, H));
  put("D1", "Mar", Object.assign({ a: "r" }, H)); put("E1", "Q1 total", Object.assign({ a: "r" }, H));
  const rows = [["Rent", 1800, 1800, 1800], ["Software", 240, 260, 255], ["Payroll", 6200, 6200, 6800], ["Marketing", 900, 1150, 700], ["Fuel", 410, 385, 460]];
  rows.forEach((r, i) => {
    const n = i + 2;
    put("A" + n, r[0]);
    ["B", "C", "D"].forEach((c, j) => put(c + n, String(r[j + 1]), { nf: "cur" }));
    put("E" + n, `=SUM(B${n}:D${n})`, { nf: "cur" });
  });
  put("A7", "Total", { b: true });
  ["B", "C", "D", "E"].forEach(c => put(c + "7", `=SUM(${c}2:${c}6)`, { nf: "cur", b: true }));
  put("A9", "Average month"); put("B9", "=AVERAGE(B7:D7)", { nf: "cur" });
  put("A10", "Largest expense"); put("B10", "=INDEX(A2:A6,MATCH(MAX(E2:E6),E2:E6,0))");
  put("A11", "Payroll share"); put("B11", "=E4/E7", { nf: "pct" });
  put("A12", "Months over $9k"); put("B12", '=COUNTIF(B7:D7,">9000")');
  put("A14", "Sample data", { i: true });
  return s;
}

/* ---------- values ---------- */
class XErr { constructor(code) { this.code = code; } }
const E = c => { throw new XErr(c); };
const EPOCH = Date.UTC(1899, 11, 30);
const toSerial = (y, m, d) => Math.round((Date.UTC(y, m - 1, d) - EPOCH) / 864e5);
const fromSerial = n => { const dt = new Date(EPOCH + Math.floor(n) * 864e5); return `${dt.getUTCMonth() + 1}/${dt.getUTCDate()}/${dt.getUTCFullYear()}`; };
function serialParts(n) { const dt = new Date(EPOCH + Math.floor(n) * 864e5); return [dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate()]; }
function parseDate(t) {
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(t), y, mo, d;
  if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; }
  else if ((m = /^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/.exec(t))) { mo = +m[1]; d = +m[2]; y = +m[3]; if (y < 100) y += 2000; }
  else return null;
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return toSerial(y, mo, d);
}
function literal(s) {
  if (s == null) return null;
  const t = String(s).trim();
  if (t === "") return null;
  let m;
  if (/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(t)) return parseFloat(t);
  if (/^[+-]?\d{1,3}(,\d{3})+(\.\d+)?$/.test(t)) return parseFloat(t.replace(/,/g, ""));
  if ((m = /^([+-]?)\$\s?(\d[\d,]*\.?\d*|\.\d+)$/.exec(t))) { const n = parseFloat(m[2].replace(/,/g, "")); return m[1] === "-" ? -n : n; }
  if ((m = /^([+-]?(\d+\.?\d*|\.\d+))%$/.exec(t))) return parseFloat(m[1]) / 100;
  if (/^true$/i.test(t)) return true;
  if (/^false$/i.test(t)) return false;
  const d = parseDate(t); if (d != null) return d;
  return String(s);
}
function fmtGeneral(n) {
  if (!isFinite(n)) return "#NUM!";
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
  const a = Math.abs(n);
  if (a !== 0 && (a >= 1e15 || a < 1e-9)) return n.toExponential(5);
  return String(parseFloat(n.toPrecision(11)));
}
const nf2 = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
function fmtNum(n, f) {
  if (!isFinite(n)) return "#NUM!";
  switch (f) {
    case "num": return n.toLocaleString("en-US", nf2);
    case "cur": return (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString("en-US", nf2);
    case "pct": return (n * 100).toLocaleString("en-US", { maximumFractionDigits: 2 }) + "%";
    case "date": return fromSerial(n);
    default: return fmtGeneral(n);
  }
}
function autoFmt(raw) {
  const t = String(raw || "").trim();
  if (t[0] === "=") return /^=\s*(TODAY|DATE|NOW)\s*\(/i.test(t) ? "date" : "";
  if (/%$/.test(t)) return "pct";
  if (/^[+-]?\$/.test(t)) return "cur";
  if (parseDate(t) != null) return "date";
  return "";
}
const num = v => {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "boolean") return v ? 1 : 0;
  const l = literal(v);
  if (typeof l === "number") return l;
  if (l == null) return 0;
  return E("#VALUE!");
};
const str = v => v == null ? "" : typeof v === "boolean" ? (v ? "TRUE" : "FALSE") : typeof v === "number" ? fmtGeneral(v) : String(v);
const truthy = v => {
  if (v == null) return false;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (/^true$/i.test(v)) return true;
  if (/^false$/i.test(v)) return false;
  return E("#VALUE!");
};

/* ---------- formula engine ---------- */
const astCache = new Map();
let calcCache = new Map();
const calcStack = new Set();
const unq = n => n[0] === "'" ? n.slice(1, -1).replace(/''/g, "'") : n;
const sheetByName = n => { n = n.toLowerCase(); return sheets.find(s => s.name.toLowerCase() === n); };
const REF_RE = /^(?:('(?:[^']|'')+'|[A-Za-z_][A-Za-z0-9_.]*)!)?(\$?)([A-Za-z]{1,2})(\$?)(\d+)/;

function tokenize(src) {
  const out = []; let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (ch === '"') {
      let j = i + 1, s = "";
      while (j < src.length) { if (src[j] === '"') { if (src[j + 1] === '"') { s += '"'; j += 2; continue; } break; } s += src[j++]; }
      if (j >= src.length) E("#ERROR!");
      out.push({ t: "str", v: s }); i = j + 1; continue;
    }
    const rest = src.slice(i); let m;
    if ((m = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(rest))) { out.push({ t: "num", v: parseFloat(m[0]) }); i += m[0].length; continue; }
    if ((m = REF_RE.exec(rest))) {
      const after = rest[m[0].length];
      if (!after || !/[A-Za-z0-9_(]/.test(after)) {
        out.push({ t: "ref", sheet: m[1] ? unq(m[1]) : null, col: colIndex(m[3]), row: +m[5] - 1 });
        i += m[0].length; continue;
      }
    }
    if ((m = /^[A-Za-z_][A-Za-z0-9_.]*/.exec(rest))) {
      const name = m[0].toUpperCase(); i += m[0].length;
      while (src[i] === " ") i++;
      if (src[i] === "(") { out.push({ t: "fn", v: name }); i++; }
      else if (name === "TRUE" || name === "FALSE") out.push({ t: "bool", v: name === "TRUE" });
      else E("#NAME?");
      continue;
    }
    if ((m = /^(<=|>=|<>)/.exec(rest))) { out.push({ t: "op", v: m[0] }); i += 2; continue; }
    if ("+-*/^&=<>%".includes(ch)) { out.push({ t: "op", v: ch }); i++; continue; }
    if ("(),:;".includes(ch)) { out.push({ t: ch === ";" ? "," : ch }); i++; continue; }
    E("#ERROR!");
  }
  return out;
}
function parse(tokens) {
  let p = 0;
  const peek = () => tokens[p], next = () => tokens[p++];
  const isOp = v => peek() && peek().t === "op" && peek().v === v;
  const CMP = ["=", "<>", "<", ">", "<=", ">="];
  function cmp() { let l = cat(); while (peek() && peek().t === "op" && CMP.includes(peek().v)) { const o = next().v; l = { k: "bin", o, l, r: cat() }; } return l; }
  function cat() { let l = add(); while (isOp("&")) { next(); l = { k: "bin", o: "&", l, r: add() }; } return l; }
  function add() { let l = mul(); while (isOp("+") || isOp("-")) { const o = next().v; l = { k: "bin", o, l, r: mul() }; } return l; }
  function mul() { let l = pw(); while (isOp("*") || isOp("/")) { const o = next().v; l = { k: "bin", o, l, r: pw() }; } return l; }
  function pw() { let l = una(); while (isOp("^")) { next(); l = { k: "bin", o: "^", l, r: una() }; } return l; }
  function una() { if (isOp("-")) { next(); return { k: "neg", a: una() }; } if (isOp("+")) { next(); return una(); } return post(); }
  function post() { let a = prim(); while (isOp("%")) { next(); a = { k: "pct", a }; } return a; }
  function prim() {
    const t = next(); if (!t) E("#ERROR!");
    if (t.t === "num" || t.t === "str" || t.t === "bool") return { k: "lit", v: t.v };
    if (t.t === "ref") {
      if (peek() && peek().t === ":") {
        next(); const t2 = next(); if (!t2 || t2.t !== "ref") E("#ERROR!");
        return { k: "range", sheet: t.sheet, r1: Math.min(t.row, t2.row), c1: Math.min(t.col, t2.col), r2: Math.max(t.row, t2.row), c2: Math.max(t.col, t2.col) };
      }
      return { k: "ref", sheet: t.sheet, r: t.row, c: t.col };
    }
    if (t.t === "fn") {
      const args = [];
      if (peek() && peek().t === ")") next();
      else for (;;) {
        if (peek() && (peek().t === "," || peek().t === ")")) args.push({ k: "lit", v: null });
        else args.push(cmp());
        const n = next(); if (!n) E("#ERROR!");
        if (n.t === ")") break; if (n.t !== ",") E("#ERROR!");
      }
      return { k: "fn", name: t.v, args };
    }
    if (t.t === "(") { const e = cmp(); const n = next(); if (!n || n.t !== ")") E("#ERROR!"); return e; }
    if (t.t === "op" && t.v === "=" ) E("#ERROR!");
    return E("#ERROR!");
  }
  const e = cmp(); if (p < tokens.length) E("#ERROR!"); return e;
}
function cellValue(s, r, c) {
  if (r < 0 || c < 0 || c >= COLS) E("#REF!");
  const k = s.id + "|" + r + "|" + c;
  if (calcCache.has(k)) { const v = calcCache.get(k); if (v instanceof XErr) throw v; return v; }
  if (calcStack.has(k)) E("#CIRC!");
  const cell = s.cells[keyOf(r, c)];
  let v;
  if (!cell || cell.v === "" || cell.v == null) v = null;
  else if (String(cell.v)[0] === "=") {
    calcStack.add(k);
    try { v = evalFormula(cell.v, s); }
    catch (e) { v = e instanceof XErr ? e : new XErr("#ERROR!"); }
    finally { calcStack.delete(k); }
  } else v = literal(cell.v);
  calcCache.set(k, v);
  if (v instanceof XErr) throw v;
  return v;
}
function evalFormula(raw, s) {
  let ast = astCache.get(raw);
  if (!ast) {
    try { ast = parse(tokenize(raw.slice(1))); } catch (e) { ast = e instanceof XErr ? e : new XErr("#ERROR!"); }
    astCache.set(raw, ast);
  }
  if (ast instanceof XErr) throw ast;
  return sc(ev(ast, s));
}
const resolveSheet = (name, s) => { if (!name) return s; const t = sheetByName(name); if (!t) E("#REF!"); return t; };
function sc(v) {
  if (v && v.k === "rng") {
    if (v.r1 === v.r2 && v.c1 === v.c2) return cellValue(v.sh, v.r1, v.c1);
    return E("#VALUE!");
  }
  return v;
}
function cmpVals(a, b) {
  if (a == null) a = typeof b === "string" ? "" : typeof b === "boolean" ? false : 0;
  if (b == null) b = typeof a === "string" ? "" : typeof a === "boolean" ? false : 0;
  const rank = v => typeof v === "number" ? 0 : typeof v === "string" ? 1 : 2;
  if (rank(a) !== rank(b)) return rank(a) - rank(b);
  if (typeof a === "string") { a = a.toLowerCase(); b = b.toLowerCase(); }
  return a < b ? -1 : a > b ? 1 : 0;
}
function cmpOp(d, o) { return o === "=" ? d === 0 : o === "<>" ? d !== 0 : o === "<" ? d < 0 : o === ">" ? d > 0 : o === "<=" ? d <= 0 : d >= 0; }
function ev(n, s) {
  switch (n.k) {
    case "lit": return n.v;
    case "ref": return cellValue(resolveSheet(n.sheet, s), n.r, n.c);
    case "range": { const t = resolveSheet(n.sheet, s); if (n.c2 >= COLS) E("#REF!"); return { k: "rng", sh: t, r1: n.r1, c1: n.c1, r2: n.r2, c2: n.c2 }; }
    case "neg": return -num(sc(ev(n.a, s)));
    case "pct": return num(sc(ev(n.a, s))) / 100;
    case "bin": {
      const a = sc(ev(n.l, s)), b = sc(ev(n.r, s));
      switch (n.o) {
        case "+": return num(a) + num(b);
        case "-": return num(a) - num(b);
        case "*": return num(a) * num(b);
        case "/": { const d = num(b); if (d === 0) E("#DIV/0!"); return num(a) / d; }
        case "^": { const r = Math.pow(num(a), num(b)); if (!isFinite(r)) E("#NUM!"); return r; }
        case "&": return str(a) + str(b);
        default: return cmpOp(cmpVals(a, b), n.o);
      }
    }
    case "fn": {
      const f = FN[n.name]; if (!f) E("#NAME?");
      if (f.lazy) return f(n.args, s);
      return f(...n.args.map(a => ev(a, s)));
    }
  }
  E("#ERROR!");
}
/* range helpers */
function* cellsIn(g) { for (let r = g.r1; r <= g.r2; r++) for (let c = g.c1; c <= g.c2; c++) yield { r, c, v: cellValue(g.sh, r, c) }; }
function flat(args) { const out = []; for (const a of args) { if (a && a.k === "rng") for (const x of cellsIn(a)) out.push(x.v); else out.push(a); } return out; }
function nums(args) {
  const out = [];
  for (const a of args) {
    if (a && a.k === "rng") { for (const x of cellsIn(a)) if (typeof x.v === "number") out.push(x.v); }
    else if (a != null) out.push(num(a));
  }
  return out;
}
const isRng = a => a && a.k === "rng";
function matcher(c) {
  c = sc(c);
  if (typeof c === "number" || typeof c === "boolean") return v => v === c || (typeof v === "string" && literal(v) === c);
  const s = str(c);
  const m = /^(<=|>=|<>|<|>|=)?([\s\S]*)$/.exec(s);
  const op = m[1] || "=", rhsRaw = m[2], rhs = literal(rhsRaw);
  if (typeof rhs === "number") return v => typeof v === "number" ? cmpOp(cmpVals(v, rhs), op) : op === "<>";
  if (op === "=" || op === "<>") {
    const re = new RegExp("^" + rhsRaw.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[\\s\\S]*").replace(/\?/g, ".") + "$", "i");
    return v => { const ok = rhsRaw === "" ? (v == null || v === "") : re.test(str(v)); return op === "=" ? ok : !ok; };
  }
  return v => typeof v === "string" && cmpOp(cmpVals(v, rhsRaw), op);
}
function roundTo(x, d, mode) {
  const f = Math.pow(10, d);
  const y = x * f;
  const r = mode === "up" ? Math.sign(y) * Math.ceil(Math.abs(y) - 1e-9) : mode === "down" ? Math.sign(y) * Math.floor(Math.abs(y) + 1e-9) : Math.sign(y) * Math.round(Math.abs(y) + 1e-9);
  return r / f;
}
function ifRange(range, crit, sumRange, fn) {
  if (!isRng(range)) E("#VALUE!");
  const test = matcher(crit), target = isRng(sumRange) ? sumRange : range;
  for (let r = range.r1; r <= range.r2; r++) for (let c = range.c1; c <= range.c2; c++) {
    if (test(cellValue(range.sh, r, c))) fn(cellValue(target.sh, target.r1 + (r - range.r1), target.c1 + (c - range.c1)));
  }
}
const FN = {
  SUM: (...a) => nums(a).reduce((x, y) => x + y, 0),
  AVERAGE: (...a) => { const n = nums(a); if (!n.length) E("#DIV/0!"); return n.reduce((x, y) => x + y, 0) / n.length; },
  MIN: (...a) => { const n = nums(a); return n.length ? Math.min(...n) : 0; },
  MAX: (...a) => { const n = nums(a); return n.length ? Math.max(...n) : 0; },
  COUNT: (...a) => { let k = 0; for (const x of a) { if (isRng(x)) { for (const y of cellsIn(x)) if (typeof y.v === "number") k++; } else if (typeof literal(x) === "number") k++; } return k; },
  COUNTA: (...a) => flat(a).filter(v => v != null && v !== "").length,
  COUNTBLANK: (...a) => flat(a).filter(v => v == null || v === "").length,
  PRODUCT: (...a) => nums(a).reduce((x, y) => x * y, 1),
  ROUND: (x, d) => roundTo(num(sc(x)), num(sc(d))),
  ROUNDUP: (x, d) => roundTo(num(sc(x)), num(sc(d)), "up"),
  ROUNDDOWN: (x, d) => roundTo(num(sc(x)), num(sc(d)), "down"),
  ABS: x => Math.abs(num(sc(x))),
  SQRT: x => { const n = num(sc(x)); if (n < 0) E("#NUM!"); return Math.sqrt(n); },
  INT: x => Math.floor(num(sc(x))),
  MOD: (a, b) => { const d = num(sc(b)); if (d === 0) E("#DIV/0!"); const n = num(sc(a)); return n - d * Math.floor(n / d); },
  POWER: (a, b) => Math.pow(num(sc(a)), num(sc(b))),
  AND: (...a) => { const v = flat(a).filter(x => x != null); if (!v.length) E("#VALUE!"); return v.every(truthy); },
  OR: (...a) => { const v = flat(a).filter(x => x != null); if (!v.length) E("#VALUE!"); return v.some(truthy); },
  NOT: x => !truthy(sc(x)),
  CONCAT: (...a) => flat(a).map(str).join(""),
  LEN: x => str(sc(x)).length,
  UPPER: x => str(sc(x)).toUpperCase(),
  LOWER: x => str(sc(x)).toLowerCase(),
  PROPER: x => str(sc(x)).toLowerCase().replace(/(^|[^a-z])([a-z])/g, (m, a, b) => a + b.toUpperCase()),
  TRIM: x => str(sc(x)).trim().replace(/\s+/g, " "),
  LEFT: (x, n) => str(sc(x)).slice(0, n === undefined ? 1 : num(sc(n))),
  RIGHT: (x, n) => { const s = str(sc(x)), k = n === undefined ? 1 : num(sc(n)); return k <= 0 ? "" : s.slice(-k); },
  MID: (x, st, n) => { const s = str(sc(x)), a = num(sc(st)); return s.substr(a - 1, num(sc(n))); },
  TODAY: () => { const d = new Date(); return toSerial(d.getFullYear(), d.getMonth() + 1, d.getDate()); },
  NOW: () => { const d = new Date(); return toSerial(d.getFullYear(), d.getMonth() + 1, d.getDate()) + (d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()) / 86400; },
  DATE: (y, m, d) => { const dt = new Date(Date.UTC(num(sc(y)), num(sc(m)) - 1, num(sc(d)))); return Math.round((dt - EPOCH) / 864e5); },
  YEAR: x => serialParts(num(sc(x)))[0],
  MONTH: x => serialParts(num(sc(x)))[1],
  DAY: x => serialParts(num(sc(x)))[2],
  ISBLANK: x => { const v = sc(x); return v == null || v === ""; },
  ISNUMBER: x => typeof sc(x) === "number",
  ISTEXT: x => typeof sc(x) === "string",
  SUMIF: (rg, cr, sr) => { let t = 0; ifRange(rg, cr, sr, v => { if (typeof v === "number") t += v; }); return t; },
  COUNTIF: (rg, cr) => { let k = 0; ifRange(rg, cr, null, () => k++); return k; },
  AVERAGEIF: (rg, cr, sr) => { let t = 0, k = 0; ifRange(rg, cr, sr, v => { if (typeof v === "number") { t += v; k++; } }); if (!k) E("#DIV/0!"); return t / k; },
  VLOOKUP: (v, rg, col, approx) => {
    if (!isRng(rg)) E("#VALUE!");
    v = sc(v); const ci = num(sc(col));
    if (ci < 1 || rg.c1 + ci - 1 > rg.c2) E("#REF!");
    const exact = approx !== undefined && approx !== null && !truthy(sc(approx));
    let hit = -1;
    for (let r = rg.r1; r <= rg.r2; r++) {
      const k = cellValue(rg.sh, r, rg.c1), d = cmpVals(k, v);
      if (exact) { if (d === 0 && k != null) { hit = r; break; } }
      else { if (k == null) continue; if (d <= 0) hit = r; else break; }
    }
    if (hit < 0) E("#N/A");
    return cellValue(rg.sh, hit, rg.c1 + ci - 1);
  },
  MATCH: (v, rg, type) => {
    if (!isRng(rg)) E("#VALUE!");
    v = sc(v); const t = type === undefined || type === null ? 1 : num(sc(type));
    const list = [...cellsIn(rg)];
    let hit = -1;
    list.forEach((x, i) => {
      if (hit >= 0 && t === 0) return;
      const d = cmpVals(x.v, v);
      if (t === 0) { if (d === 0 && x.v != null) hit = i; }
      else if (t > 0) { if (x.v != null && d <= 0) hit = i; }
      else { if (x.v != null && d >= 0) hit = i; }
    });
    if (hit < 0) E("#N/A");
    return hit + 1;
  },
  INDEX: (rg, r, c) => {
    if (!isRng(rg)) E("#VALUE!");
    let ri = num(sc(r)), ci = c === undefined || c === null ? 1 : num(sc(c));
    if (rg.r1 === rg.r2 && (c === undefined || c === null)) { ci = ri; ri = 1; }
    const rr = rg.r1 + ri - 1, cc = rg.c1 + ci - 1;
    if (ri < 1 || ci < 1 || rr > rg.r2 || cc > rg.c2) E("#REF!");
    return cellValue(rg.sh, rr, cc);
  },
};
FN.CONCATENATE = FN.CONCAT;
FN.IF = Object.assign((args, s) => {
  if (!args.length) E("#ERROR!");
  const c = truthy(sc(ev(args[0], s)));
  if (c) return args.length > 1 ? sc(ev(args[1], s)) : true;
  return args.length > 2 ? sc(ev(args[2], s)) : false;
}, { lazy: true });
FN.IFERROR = Object.assign((args, s) => {
  try { return sc(ev(args[0], s)); }
  catch (e) { if (e instanceof XErr && e.code !== "#CIRC!") return args[1] ? sc(ev(args[1], s)) : ""; throw e; }
}, { lazy: true });

/* shift references for fill / paste */
const SHIFT_RE = /("(?:[^"]|"")*")|((?:(?:'(?:[^']|'')+'|[A-Za-z_][A-Za-z0-9_.]*)!)?)(\$?)([A-Za-z]{1,2})(\$?)(\d+)(?![A-Za-z0-9_(])/g;
function shiftFormula(raw, dr, dc) {
  if (typeof raw !== "string" || raw[0] !== "=" || (!dr && !dc)) return raw;
  return raw.replace(SHIFT_RE, (m, strl, sheet, d1, col, d2, row, off) => {
    if (strl) return m;
    const prev = off > 0 ? raw[off - 1] : "";
    if (/[A-Za-z0-9_$.]/.test(prev)) return m;
    let c = colIndex(col), r = +row - 1;
    if (!d1) c += dc; if (!d2) r += dr;
    if (c < 0 || r < 0 || c >= COLS) return "#REF!";
    return sheet + d1 + colName(c) + d2 + (r + 1);
  });
}
const quoteName = n => /^[A-Za-z_][A-Za-z0-9_.]*$/.test(n) && !/^[A-Za-z]{1,2}\d+$/.test(n) ? n : "'" + n.replace(/'/g, "''") + "'";

/* ---------- grid DOM ---------- */
const grid = $("grid"), wrap = $("wrap"), editor = $("editor"), fInput = $("fInput"), nameBox = $("nameBox");
let colEls = [], rendered = new Set();
const colW = (s, c) => s.colW[colName(c)] || DEF_W;
function buildGrid() {
  const s = sh();
  let h = `<colgroup><col style="width:${HEAD_W}px">`;
  for (let c = 0; c < COLS; c++) h += `<col style="width:${colW(s, c)}px">`;
  h += `</colgroup><thead><tr><th class="corner" title="Select all"></th>`;
  for (let c = 0; c < COLS; c++) h += `<th data-c="${c}">${colName(c)}<span class="rz" data-rz="${c}"></span></th>`;
  h += `</tr></thead><tbody>`;
  const tdRow = "<td></td>".repeat(COLS);
  for (let r = 0; r < s.rows; r++) h += `<tr><th data-r="${r}">${r + 1}</th>${tdRow}</tr>`;
  h += `</tbody>`;
  grid.innerHTML = h;
  grid.style.width = (HEAD_W + Array.from({ length: COLS }, (_, c) => colW(s, c)).reduce((a, b) => a + b, 0)) + "px";
  colEls = Array.from(grid.querySelectorAll("col"));
  rendered = new Set();
  $("moreRows").hidden = s.rows >= MAX_ROWS;
}
const tdAt = (r, c) => { const row = grid.tBodies[0] && grid.tBodies[0].rows[r]; return row ? row.cells[c + 1] : null; };
function paintCell(s, r, c) {
  const td = tdAt(r, c); if (!td) return;
  const cell = s.cells[keyOf(r, c)];
  if (!cell) { td.textContent = ""; td.className = ""; return; }
  let v;
  try { v = cellValue(s, r, c); } catch (e) { v = e instanceof XErr ? e : new XErr("#ERROR!"); }
  let text = "", isNum = false, isErr = false, ctr = false;
  if (v instanceof XErr) { text = v.code; isErr = true; }
  else if (v == null) text = "";
  else if (typeof v === "boolean") { text = v ? "TRUE" : "FALSE"; ctr = true; }
  else if (typeof v === "number") { text = fmtNum(v, cell.nf || autoFmt(cell.v)); isNum = true; }
  else text = v;
  td.textContent = text;
  const al = cell.a || (isErr || ctr ? "c" : isNum ? "r" : "l");
  let cls = "a-" + al;
  if (cell.b) cls += " b"; if (cell.i) cls += " i"; if (cell.fill) cls += " f-" + cell.fill; if (isErr) cls += " err";
  td.className = cls;
  td.title = isErr ? errHint(v.code) : "";
}
function errHint(c) {
  return { "#DIV/0!": "Division by zero", "#REF!": "Reference points outside the sheet or to a missing sheet", "#NAME?": "Unknown function or name", "#VALUE!": "Wrong kind of value, such as text where a number belongs", "#CIRC!": "Formula refers back to itself", "#N/A": "Lookup value not found", "#NUM!": "Number is out of range", "#ERROR!": "Formula can't be read" }[c] || "";
}
function render() {
  calcCache = new Map();
  const s = sh();
  const keys = new Set(Object.keys(s.cells));
  for (const k of rendered) keys.add(k);
  const now = new Set();
  for (const k of keys) {
    const m = /^([A-Z]+)(\d+)$/.exec(k); if (!m) continue;
    const r = +m[2] - 1, c = colIndex(m[1]);
    if (r >= s.rows || c >= COLS) continue;
    paintCell(s, r, c);
    if (s.cells[k]) now.add(k);
  }
  rendered = now;
  drawSelection(); syncBars(); renderTabs(); updateUndoBtns();
}

/* ---------- selection ---------- */
const selRect = () => ({ r1: Math.min(sel.ar, sel.fr), r2: Math.max(sel.ar, sel.fr), c1: Math.min(sel.ac, sel.fc), c2: Math.max(sel.ac, sel.fc) });
function boxFor(r1, c1, r2, c2) {
  const a = tdAt(r1, c1), b = tdAt(r2, c2); if (!a || !b) return null;
  const wr = wrap.getBoundingClientRect(), ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
  return { left: ra.left - wr.left + wrap.scrollLeft - wrap.clientLeft, top: ra.top - wr.top + wrap.scrollTop - wrap.clientTop, width: rb.right - ra.left, height: rb.bottom - ra.top };
}
function place(el, b) { if (!b) { el.hidden = true; return; } el.hidden = false; el.style.left = (b.left - 1) + "px"; el.style.top = (b.top - 1) + "px"; el.style.width = (b.width + 1) + "px"; el.style.height = (b.height + 1) + "px"; }
let hlEls = [];
function drawSelection() {
  const g = selRect();
  place($("selBox"), (g.r1 !== g.r2 || g.c1 !== g.c2) ? boxFor(g.r1, g.c1, g.r2, g.c2) : null);
  place($("curBox"), boxFor(sel.fr === sel.ar && sel.fc === sel.ac ? sel.ar : sel.ar, sel.ac, sel.ar, sel.ac));
  hlEls.forEach(e => e.classList.remove("hl")); hlEls = [];
  const ths = grid.tHead ? grid.tHead.rows[0].cells : [];
  for (let c = g.c1; c <= g.c2; c++) if (ths[c + 1]) { ths[c + 1].classList.add("hl"); hlEls.push(ths[c + 1]); }
  const body = grid.tBodies[0];
  if (body) for (let r = g.r1; r <= Math.min(g.r2, g.r1 + 400); r++) { const th = body.rows[r] && body.rows[r].cells[0]; if (th) { th.classList.add("hl"); hlEls.push(th); } }
  updateStats(); updateToolState();
}
function select(r, c, extend) {
  const s = sh();
  r = Math.max(0, Math.min(s.rows - 1, r)); c = Math.max(0, Math.min(COLS - 1, c));
  if (extend) { sel.fr = r; sel.fc = c; } else { sel = { ar: r, ac: c, fr: r, fc: c }; }
  drawSelection(); syncBars();
  scrollIntoView(extend ? r : sel.ar, extend ? c : sel.ac);
}
function scrollIntoView(r, c) {
  const td = tdAt(r, c); if (!td) return;
  const wr = wrap.getBoundingClientRect(), tr = td.getBoundingClientRect();
  const headH = grid.tHead.getBoundingClientRect().height;
  if (tr.top < wr.top + headH) wrap.scrollTop -= (wr.top + headH - tr.top);
  else if (tr.bottom > wr.bottom - 52) wrap.scrollTop += tr.bottom - wr.bottom + 52;
  if (tr.left < wr.left + HEAD_W) wrap.scrollLeft -= (wr.left + HEAD_W - tr.left);
  else if (tr.right > wr.right - 4) wrap.scrollLeft += tr.right - wr.right + 4;
}
function syncBars() {
  if (editing) return;
  const s = sh(), cell = s.cells[keyOf(sel.ar, sel.ac)];
  if (document.activeElement !== nameBox) {
    const g = selRect();
    nameBox.value = (g.r1 === g.r2 && g.c1 === g.c2) ? keyOf(sel.ar, sel.ac) : keyOf(g.r1, g.c1) + ":" + keyOf(g.r2, g.c2);
  }
  fInput.value = cell ? cell.v : "";
}
function updateStats() {
  const s = sh(), g = selRect(), out = $("stats");
  const n = (g.r2 - g.r1 + 1) * (g.c2 - g.c1 + 1);
  if (n < 2) { out.innerHTML = ""; return; }
  let cnt = 0, sum = 0, nn = 0, fmt = null;
  for (let r = g.r1; r <= g.r2; r++) for (let c = g.c1; c <= g.c2; c++) {
    const cell = s.cells[keyOf(r, c)]; if (!cell || cell.v === "") continue;
    let v; try { v = cellValue(s, r, c); } catch (e) { continue; }
    if (v == null) continue; cnt++;
    if (typeof v === "number") { sum += v; nn++; const f = cell.nf || autoFmt(cell.v); if (fmt === null) fmt = f; else if (fmt !== f) fmt = ""; }
  }
  const f = fmt === "date" ? "" : (fmt || "");
  out.innerHTML = nn ? `Average <b>${fmtNum(sum / nn, f)}</b> &nbsp; Count <b>${cnt}</b> &nbsp; Sum <b>${fmtNum(sum, f)}</b>` : (cnt ? `Count <b>${cnt}</b>` : "");
}
function updateToolState() {
  const s = sh(), cell = s.cells[keyOf(sel.ar, sel.ac)] || {};
  $("boldBtn").classList.toggle("on", !!cell.b);
  $("italBtn").classList.toggle("on", !!cell.i);
  document.querySelectorAll("[data-align]").forEach(b => b.classList.toggle("on", cell.a === b.dataset.align));
  $("fmtSel").value = cell.nf || "";
}

/* ---------- changes + undo ---------- */
const hasStyle = c => c && (c.b || c.i || c.a || c.nf || c.fill);
function setCellObj(s, k, obj) {
  if (!obj || ((obj.v === "" || obj.v == null) && !hasStyle(obj))) delete s.cells[k];
  else { const o = { v: obj.v == null ? "" : String(obj.v) }; ["b", "i", "a", "nf", "fill"].forEach(p => { if (obj[p]) o[p] = obj[p]; }); s.cells[k] = o; }
}
function applyChanges(s, changes, label) {
  const recs = [];
  for (const ch of changes) {
    const before = s.cells[ch.k] ? Object.assign({}, s.cells[ch.k]) : null;
    setCellObj(s, ch.k, ch.after);
    const after = s.cells[ch.k] ? Object.assign({}, s.cells[ch.k]) : null;
    if (JSON.stringify(before) !== JSON.stringify(after)) recs.push({ k: ch.k, before, after });
  }
  if (!recs.length) return;
  undoStack.push({ sid: s.id, recs }); if (undoStack.length > 200) undoStack.shift();
  redoStack = [];
  markDirty(s); render();
}
function patchSel(patchFn) {
  const s = sh(), g = selRect(), ch = [];
  for (let r = g.r1; r <= g.r2; r++) for (let c = g.c1; c <= g.c2; c++) {
    const k = keyOf(r, c), cur = s.cells[k] || { v: "" };
    ch.push({ k, after: patchFn(Object.assign({}, cur), r, c) });
  }
  applyChanges(s, ch);
}
function undoRedo(fromStack, toStack, dir) {
  const e = fromStack.pop(); if (!e) return;
  const s = sheets.find(x => x.id === e.sid); if (!s) return;
  if (s.id !== activeId) switchSheet(s.id);
  for (const r of e.recs) setCellObj(s, r.k, dir === "undo" ? r.before : r.after);
  toStack.push(e);
  const first = e.recs[0] && /^([A-Z]+)(\d+)$/.exec(e.recs[0].k);
  if (first) { sel = { ar: +first[2] - 1, ac: colIndex(first[1]), fr: +first[2] - 1, fc: colIndex(first[1]) }; }
  markDirty(s); render();
}
function updateUndoBtns() { $("undoBtn").disabled = !undoStack.length; $("redoBtn").disabled = !redoStack.length; $("undoBtn").style.opacity = undoStack.length ? 1 : .4; $("redoBtn").style.opacity = redoStack.length ? 1 : .4; }

/* ---------- editing ---------- */
let refIns = null;   // {input,start,len,r,c}
function startEdit(mode, initial) {
  const s = sh(), k = keyOf(sel.ar, sel.ac), cell = s.cells[k];
  editing = { r: sel.ar, c: sel.ac, mode, orig: cell ? cell.v : "" };
  const b = boxFor(sel.ar, sel.ac, sel.ar, sel.ac);
  if (b) {
    editor.style.left = (b.left - 1) + "px"; editor.style.top = (b.top - 1) + "px";
    editor.style.minWidth = (b.width + 2) + "px"; editor.style.width = Math.max(b.width + 2, 180) + "px"; editor.style.height = (b.height + 2) + "px";
  }
  editor.value = initial !== undefined ? initial : editing.orig;
  fInput.value = editor.value;
  editor.hidden = false;
  editor.focus();
  const L = editor.value.length; editor.setSelectionRange(L, L);
}
function commitEdit(moveR, moveC) {
  if (!editing) return;
  const { r, c } = editing; const val = editor.value;
  editing = null; editor.hidden = true; refIns = null; $("refBox").hidden = true;
  const s = sh(), k = keyOf(r, c), cur = s.cells[k] || {};
  applyChanges(s, [{ k, after: Object.assign({}, cur, { v: val }) }]);
  if (moveR || moveC) select(r + (moveR || 0), c + (moveC || 0));
  else { syncBars(); }
  wrap.focus({ preventScroll: true });
}
function cancelEdit() {
  if (!editing) return;
  editing = null; editor.hidden = true; refIns = null; $("refBox").hidden = true;
  syncBars(); wrap.focus({ preventScroll: true });
}
function activeInput() { return document.activeElement === fInput ? fInput : editor; }
function canInsertRef() {
  if (!editing) return false;
  const inp = activeInput(), v = inp.value;
  if (v[0] !== "=") return false;
  const before = v.slice(0, inp.selectionStart).replace(/\s+$/, "");
  return /[=(,+\-*/^&<>:;]$/.test(before);
}
function refText(r1, c1, r2, c2) { const a = keyOf(r1, c1); return (r1 === r2 && c1 === c2) ? a : a + ":" + keyOf(r2, c2); }
function writeRef(r1, c1, r2, c2) {
  const inp = refIns.input, v = inp.value, t = refText(Math.min(r1, r2), Math.min(c1, c2), Math.max(r1, r2), Math.max(c1, c2));
  inp.value = v.slice(0, refIns.start) + t + v.slice(refIns.start + refIns.len);
  refIns.len = t.length;
  const p = refIns.start + t.length; inp.setSelectionRange(p, p);
  (inp === editor ? fInput : editor).value = inp.value;
  place($("refBox"), boxFor(Math.min(r1, r2), Math.min(c1, c2), Math.max(r1, r2), Math.max(c1, c2)));
}
editor.addEventListener("input", () => { fInput.value = editor.value; refIns = null; $("refBox").hidden = true; });
fInput.addEventListener("focus", () => {
  if (!editing) { startEdit("edit"); fInput.focus(); }
});
fInput.addEventListener("input", () => { if (!editing) startEdit("edit", fInput.value), fInput.focus(); editor.value = fInput.value; refIns = null; $("refBox").hidden = true; });
function editKeys(e, inp) {
  if (["Enter", "Tab", "Escape"].includes(e.key) || /^Arrow/.test(e.key)) e.stopPropagation();
  if (e.key === "Enter") { e.preventDefault(); commitEdit(e.shiftKey ? -1 : 1, 0); }
  else if (e.key === "Tab") { e.preventDefault(); commitEdit(0, e.shiftKey ? -1 : 1); }
  else if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
  else if (editing && editing.mode === "enter" && inp === editor && /^Arrow/.test(e.key) && editor.value[0] !== "=") {
    e.preventDefault();
    const d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
    commitEdit(d[0], d[1]);
  }
}
editor.addEventListener("keydown", e => editKeys(e, editor));
fInput.addEventListener("keydown", e => editKeys(e, fInput));
editor.addEventListener("blur", () => setTimeout(() => {
  if (editing && document.activeElement !== editor && document.activeElement !== fInput && !mouseDown) commitEdit();
}, 0));
fInput.addEventListener("blur", () => setTimeout(() => {
  if (editing && document.activeElement !== editor && document.activeElement !== fInput && !mouseDown) commitEdit();
}, 0));

nameBox.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    const m = /^\s*([A-Za-z]{1,2})(\d+)(?::([A-Za-z]{1,2})(\d+))?\s*$/.exec(nameBox.value);
    if (m) {
      const c1 = colIndex(m[1]), r1 = +m[2] - 1;
      select(r1, c1);
      if (m[3]) select(+m[4] - 1, colIndex(m[3]), true);
      wrap.focus({ preventScroll: true });
    } else { flash("Type a cell like B7 or a range like A1:C9.", true); }
  } else if (e.key === "Escape") { syncBars(); wrap.focus(); }
});

/* ---------- mouse ---------- */
let mouseDown = false, dragMode = null;
function cellFromEvent(e) {
  const td = e.target.closest && e.target.closest("td"); if (!td || !grid.contains(td)) return null;
  return { r: td.parentElement.sectionRowIndex, c: td.cellIndex - 1 };
}
grid.addEventListener("mousedown", e => {
  if (e.button !== 0) return;
  const rz = e.target.closest("[data-rz]");
  if (rz) { startResize(e, +rz.dataset.rz); return; }
  const th = e.target.closest("th");
  if (th) {
    if (editing) commitEdit();
    const s = sh();
    if (th.classList.contains("corner")) { sel = { ar: 0, ac: 0, fr: s.rows - 1, fc: COLS - 1 }; drawSelection(); syncBars(); }
    else if (th.dataset.c !== undefined) { const c = +th.dataset.c; if (e.shiftKey) { sel.fc = c; sel.ar = 0; sel.fr = s.rows - 1; } else sel = { ar: 0, ac: c, fr: s.rows - 1, fc: c }; drawSelection(); syncBars(); mouseDown = true; dragMode = "col"; }
    else if (th.dataset.r !== undefined) { const r = +th.dataset.r; if (e.shiftKey) { sel.fr = r; sel.ac = 0; sel.fc = COLS - 1; } else sel = { ar: r, ac: 0, fr: r, fc: COLS - 1 }; drawSelection(); syncBars(); mouseDown = true; dragMode = "row"; }
    e.preventDefault(); wrap.focus({ preventScroll: true });
    return;
  }
  const p = cellFromEvent(e); if (!p) return;
  if (editing && canInsertRef()) {
    e.preventDefault();
    const inp = activeInput();
    refIns = { input: inp, start: inp.selectionStart, len: 0, r: p.r, c: p.c };
    writeRef(p.r, p.c, p.r, p.c);
    mouseDown = true; dragMode = "ref";
    return;
  }
  if (editing && refIns) {  // continuing to click while a ref was just inserted: replace it
    e.preventDefault();
    refIns.r = p.r; refIns.c = p.c; writeRef(p.r, p.c, p.r, p.c);
    mouseDown = true; dragMode = "ref"; return;
  }
  if (editing) commitEdit();
  e.preventDefault();
  select(p.r, p.c, e.shiftKey);
  mouseDown = true; dragMode = "sel";
  wrap.focus({ preventScroll: true });
});
grid.addEventListener("mouseover", e => {
  if (!mouseDown) return;
  const s = sh();
  if (dragMode === "col") { const th = e.target.closest("th[data-c]"); const p = cellFromEvent(e); const c = th ? +th.dataset.c : p ? p.c : null; if (c != null) { sel.fc = c; drawSelection(); syncBars(); } return; }
  if (dragMode === "row") { const th = e.target.closest("th[data-r]"); const p = cellFromEvent(e); const r = th ? +th.dataset.r : p ? p.r : null; if (r != null) { sel.fr = r; drawSelection(); syncBars(); } return; }
  const p = cellFromEvent(e); if (!p) return;
  if (dragMode === "ref" && refIns) writeRef(refIns.r, refIns.c, p.r, p.c);
  else if (dragMode === "sel") { sel.fr = p.r; sel.fc = p.c; drawSelection(); syncBars(); }
});
window.addEventListener("mouseup", () => { mouseDown = false; dragMode = null; });
grid.addEventListener("dblclick", e => {
  const p = cellFromEvent(e); if (!p || editing) return;
  select(p.r, p.c); startEdit("edit");
});
/* touch: tap selects, second tap on the active cell edits */
let lastTap = null;
grid.addEventListener("touchend", e => {
  const t = e.changedTouches[0]; const el = document.elementFromPoint(t.clientX, t.clientY);
  const td = el && el.closest && el.closest("td"); if (!td) return;
  const p = { r: td.parentElement.sectionRowIndex, c: td.cellIndex - 1 };
  if (editing) return;
  if (lastTap && lastTap.r === p.r && lastTap.c === p.c && sel.ar === p.r && sel.ac === p.c) { startEdit("edit"); lastTap = null; }
  else { select(p.r, p.c); lastTap = p; }
}, { passive: true });

/* column resize */
function startResize(e, c) {
  e.preventDefault(); e.stopPropagation();
  const s = sh(), x0 = e.clientX, w0 = colW(s, c);
  const move = ev => {
    const w = Math.max(36, Math.min(600, w0 + ev.clientX - x0));
    colEls[c + 1].style.width = w + "px"; s.colW[colName(c)] = w;
    grid.style.width = (HEAD_W + Array.from({ length: COLS }, (_, i) => colW(s, i)).reduce((a, b) => a + b, 0)) + "px";
    drawSelection();
  };
  const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); markDirty(s); };
  window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
}
wrap.addEventListener("scroll", () => { if (editing) { /* editor scrolls with content */ } }, { passive: true });

/* ---------- keyboard ---------- */
const typingTarget = el => el && (el.tagName === "INPUT" || el.tagName === "SELECT" || el.tagName === "TEXTAREA");
document.addEventListener("keydown", e => {
  if (!$("help").hidden) { if (e.key === "Escape") $("help").hidden = true; return; }
  if (editing || typingTarget(document.activeElement)) return;
  const mod = e.ctrlKey || e.metaKey, s = sh();
  const k = e.key.toLowerCase();
  if (mod && k === "z") { e.preventDefault(); e.shiftKey ? undoRedo(redoStack, undoStack, "redo") : undoRedo(undoStack, redoStack, "undo"); return; }
  if (mod && k === "y") { e.preventDefault(); undoRedo(redoStack, undoStack, "redo"); return; }
  if (mod && k === "b") { e.preventDefault(); toggleStyle("b"); return; }
  if (mod && k === "i") { e.preventDefault(); toggleStyle("i"); return; }
  if (mod && k === "d") { e.preventDefault(); fill("down"); return; }
  if (mod && k === "r") { e.preventDefault(); fill("right"); return; }
  if (mod && k === "a") { e.preventDefault(); sel = { ar: 0, ac: 0, fr: s.rows - 1, fc: COLS - 1 }; drawSelection(); syncBars(); return; }
  if (mod) return;
  const arrows = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
  if (arrows[e.key]) {
    e.preventDefault();
    const [dr, dc] = arrows[e.key];
    if (e.shiftKey) select(sel.fr + dr, sel.fc + dc, true); else select(sel.ar + dr, sel.ac + dc);
    return;
  }
  if (e.key === "Enter") { e.preventDefault(); select(sel.ar + (e.shiftKey ? -1 : 1), sel.ac); return; }
  if (e.key === "Tab") { e.preventDefault(); select(sel.ar, sel.ac + (e.shiftKey ? -1 : 1)); return; }
  if (e.key === "PageDown" || e.key === "PageUp") { e.preventDefault(); select(sel.ar + (e.key === "PageDown" ? 25 : -25), sel.ac); return; }
  if (e.key === "Home") { e.preventDefault(); select(sel.ar, 0); return; }
  if (e.key === "F2") { e.preventDefault(); startEdit("edit"); return; }
  if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); patchSel(c => Object.assign(c, { v: "" })); return; }
  if (e.key.length === 1 && !e.altKey) { e.preventDefault(); startEdit("enter", e.key); return; }
});

/* ---------- clipboard ---------- */
function selMatrix() {
  const s = sh(), g = selRect(), rows = [];
  for (let r = g.r1; r <= g.r2; r++) { const row = []; for (let c = g.c1; c <= g.c2; c++) row.push(s.cells[keyOf(r, c)] || null); rows.push(row); }
  return { g, rows };
}
function displayText(s, r, c) { const td = tdAt(r, c); return td ? td.textContent : ""; }
function toTSV() {
  const s = sh(), g = selRect(), lines = [];
  for (let r = g.r1; r <= g.r2; r++) { const row = []; for (let c = g.c1; c <= g.c2; c++) { let t = displayText(s, r, c); if (/[\t\n"]/.test(t)) t = '"' + t.replace(/"/g, '""') + '"'; row.push(t); } lines.push(row.join("\t")); }
  return lines.join("\n");
}
function parseTSV(text) {
  const rows = []; let row = [], cur = "", q = false;
  const sep = text.includes("\t") ? "\t" : (text.includes(",") && !text.includes("\n") ? "\t" : "\t");
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; continue; }
    if (ch === '"' && cur === "") { q = true; continue; }
    if (ch === sep) { row.push(cur); cur = ""; continue; }
    if (ch === "\r") continue;
    if (ch === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; continue; }
    cur += ch;
  }
  row.push(cur); rows.push(row);
  while (rows.length > 1 && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === "") rows.pop();
  return rows;
}
document.addEventListener("copy", e => {
  if (editing || typingTarget(document.activeElement)) return;
  const text = toTSV(); const m = selMatrix();
  internalClip = { text, rows: m.rows, r0: m.g.r1, c0: m.g.c1 };
  e.clipboardData.setData("text/plain", text); e.preventDefault();
  flash("Copied " + (m.rows.length * m.rows[0].length) + " cell" + (m.rows.length * m.rows[0].length > 1 ? "s" : ""));
});
document.addEventListener("cut", e => {
  if (editing || typingTarget(document.activeElement)) return;
  const text = toTSV(); const m = selMatrix();
  internalClip = { text, rows: m.rows, r0: m.g.r1, c0: m.g.c1 };
  e.clipboardData.setData("text/plain", text); e.preventDefault();
  patchSel(() => null);
});
document.addEventListener("paste", e => {
  if (editing || typingTarget(document.activeElement)) return;
  const text = e.clipboardData.getData("text/plain"); if (!text) return;
  e.preventDefault();
  const s = sh(), g = selRect(), ch = [];
  const norm = t => t.replace(/\r/g, "").replace(/\n$/, "");
  if (internalClip && norm(internalClip.text) === norm(text)) {
    const rows = internalClip.rows, H = rows.length, W = rows[0].length;
    const fitR = (g.r2 - g.r1 + 1) % H === 0 ? (g.r2 - g.r1 + 1) : H, fitC = (g.c2 - g.c1 + 1) % W === 0 ? (g.c2 - g.c1 + 1) : W;
    ensureRows(s, g.r1 + fitR);
    for (let i = 0; i < fitR; i++) for (let j = 0; j < fitC; j++) {
      const r = g.r1 + i, c = g.c1 + j; if (c >= COLS) continue;
      const src = rows[i % H][j % W];
      const sr = internalClip.r0 + (i % H), scc = internalClip.c0 + (j % W);
      ch.push({ k: keyOf(r, c), after: src ? Object.assign({}, src, { v: shiftFormula(src.v, r - sr, c - scc) }) : null });
    }
    sel = { ar: g.r1, ac: g.c1, fr: g.r1 + fitR - 1, fc: Math.min(COLS - 1, g.c1 + fitC - 1) };
  } else {
    const rows = parseTSV(text);
    if (rows.length === 1 && rows[0].length === 1) {
      for (let r = g.r1; r <= g.r2; r++) for (let c = g.c1; c <= g.c2; c++) ch.push({ k: keyOf(r, c), after: Object.assign({}, s.cells[keyOf(r, c)] || {}, { v: rows[0][0] }) });
    } else {
      ensureRows(s, g.r1 + rows.length);
      rows.forEach((row, i) => row.forEach((v, j) => {
        const r = g.r1 + i, c = g.c1 + j; if (c >= COLS) return;
        ch.push({ k: keyOf(r, c), after: Object.assign({}, s.cells[keyOf(r, c)] || {}, { v }) });
      }));
      sel = { ar: g.r1, ac: g.c1, fr: g.r1 + rows.length - 1, fc: Math.min(COLS - 1, g.c1 + Math.max(...rows.map(r => r.length)) - 1) };
    }
  }
  applyChanges(s, ch); drawSelection();
});
function ensureRows(s, n) {
  if (n > s.rows) { s.rows = Math.min(MAX_ROWS, Math.ceil(n / 100) * 100); buildGrid(); markDirty(s); }
}

/* ---------- commands ---------- */
function toggleStyle(p) {
  const s = sh(), cur = s.cells[keyOf(sel.ar, sel.ac)];
  const on = !(cur && cur[p]);
  patchSel(c => { c[p] = on ? true : undefined; return c; });
}
function fill(dir) {
  const s = sh(), g = selRect(), ch = [];
  if (dir === "down") {
    let src = g.r1, from = g.r1 + 1;
    if (g.r1 === g.r2) { if (g.r1 === 0) return; src = g.r1 - 1; from = g.r1; }
    for (let c = g.c1; c <= g.c2; c++) { const sc0 = s.cells[keyOf(src, c)]; for (let r = from; r <= g.r2; r++) ch.push({ k: keyOf(r, c), after: sc0 ? Object.assign({}, sc0, { v: shiftFormula(sc0.v, r - src, 0) }) : null }); }
  } else {
    let src = g.c1, from = g.c1 + 1;
    if (g.c1 === g.c2) { if (g.c1 === 0) return; src = g.c1 - 1; from = g.c1; }
    for (let r = g.r1; r <= g.r2; r++) { const sc0 = s.cells[keyOf(r, src)]; for (let c = from; c <= g.c2; c++) ch.push({ k: keyOf(r, c), after: sc0 ? Object.assign({}, sc0, { v: shiftFormula(sc0.v, 0, c - src) }) : null }); }
  }
  applyChanges(s, ch);
}
function autoSum() {
  const s = sh(); let r = sel.ar, c = sel.ac;
  const isNumAt = (rr, cc) => { if (rr < 0 || cc < 0) return false; try { return typeof cellValue(s, rr, cc) === "number"; } catch (e) { return false; } };
  let formula = null;
  if (isNumAt(r - 1, c)) { let t = r - 1; while (t > 0 && isNumAt(t - 1, c)) t--; formula = `=SUM(${keyOf(t, c)}:${keyOf(r - 1, c)})`; }
  else if (isNumAt(r, c - 1)) { let t = c - 1; while (t > 0 && isNumAt(r, t - 1)) t--; formula = `=SUM(${keyOf(r, t)}:${keyOf(r, c - 1)})`; }
  if (!formula) { startEdit("edit", "=SUM()"); editor.setSelectionRange(5, 5); return; }
  startEdit("edit", formula);
}
function sortSel(desc) {
  const s = sh(); let g = selRect();
  if (g.r1 === g.r2) { flash("Select the rows to sort first, then pick the column to sort by.", true); return; }
  const keyCol = sel.ac;
  const rows = [];
  for (let r = g.r1; r <= g.r2; r++) {
    let kv; try { kv = cellValue(s, r, keyCol); } catch (e) { kv = null; }
    const cells = []; for (let c = g.c1; c <= g.c2; c++) cells.push(s.cells[keyOf(r, c)] || null);
    rows.push({ r, kv, cells });
  }
  rows.sort((a, b) => { if (a.kv == null && b.kv == null) return 0; if (a.kv == null) return 1; if (b.kv == null) return -1; const d = cmpVals(a.kv, b.kv); return desc ? -d : d; });
  const ch = [];
  rows.forEach((row, i) => row.cells.forEach((cell, j) => {
    const r = g.r1 + i, c = g.c1 + j;
    ch.push({ k: keyOf(r, c), after: cell ? Object.assign({}, cell, { v: shiftFormula(cell.v, r - row.r, 0) }) : null });
  }));
  applyChanges(s, ch);
  flash("Sorted " + rows.length + " rows by column " + colName(keyCol));
}
$("undoBtn").onclick = () => undoRedo(undoStack, redoStack, "undo");
$("redoBtn").onclick = () => undoRedo(redoStack, undoStack, "redo");
$("boldBtn").onclick = () => toggleStyle("b");
$("italBtn").onclick = () => toggleStyle("i");
document.querySelectorAll("[data-align]").forEach(b => b.onclick = () => {
  const s = sh(), cur = s.cells[keyOf(sel.ar, sel.ac)], a = b.dataset.align;
  const val = cur && cur.a === a ? undefined : a;
  patchSel(c => { c.a = val; return c; });
});
$("fmtSel").onchange = e => { const v = e.target.value; patchSel(c => { c.nf = v || undefined; return c; }); wrap.focus({ preventScroll: true }); };
document.querySelectorAll("[data-fill]").forEach(b => b.onclick = () => { const f = b.dataset.fill; patchSel(c => { c.fill = f === "none" ? undefined : f; return c; }); });
$("sumBtn").onclick = autoSum;
$("sortAsc").onclick = () => sortSel(false);
$("sortDesc").onclick = () => sortSel(true);
$("moreRows").onclick = () => { const s = sh(); s.rows = Math.min(MAX_ROWS, s.rows + 100); buildGrid(); render(); markDirty(s); };
document.querySelectorAll(".tools button").forEach(b => b.addEventListener("mousedown", e => e.preventDefault()));

/* ---------- sheets ---------- */
let renaming = null, confirmDel = null;
function renderTabs() {
  const box = $("tabs");
  const ordered = [...sheets].sort((a, b) => a.order - b.order);
  box.innerHTML = "";
  for (const s of ordered) {
    if (confirmDel === s.id) {
      const d = document.createElement("div"); d.className = "confirm";
      d.innerHTML = `Delete “${esc(s.name)}”? <button class="danger" id="delYes">Delete</button><button id="delNo">Keep</button>`;
      box.appendChild(d);
      d.querySelector("#delYes").onclick = () => deleteSheet(s.id);
      d.querySelector("#delNo").onclick = () => { confirmDel = null; renderTabs(); };
      continue;
    }
    const t = document.createElement("div");
    t.className = "tab" + (s.id === activeId ? " on" : ""); t.setAttribute("role", "button"); t.tabIndex = 0;
    if (renaming === s.id) {
      const inp = document.createElement("input"); inp.value = s.name; inp.id = "renameIn"; inp.setAttribute("aria-label", "Sheet name");
      t.appendChild(inp);
      setTimeout(() => { inp.focus(); inp.select(); }, 0);
      const done = ok => { if (renaming !== s.id) return; renaming = null; if (ok) renameSheet(s, inp.value.trim()); renderTabs(); };
      inp.onkeydown = e => { e.stopPropagation(); if (e.key === "Enter") done(true); if (e.key === "Escape") done(false); e.stopPropagation(); };
      inp.onblur = () => done(true);
    } else {
      const lbl = document.createElement("span"); lbl.textContent = s.name; t.appendChild(lbl);
      t.title = "Double-click to rename";
      t.onclick = () => { if (s.id !== activeId) switchSheet(s.id); };
      t.ondblclick = () => { renaming = s.id; renderTabs(); };
      t.onkeydown = e => { if (e.key === "Enter") switchSheet(s.id); if (e.key === "F2") { renaming = s.id; renderTabs(); } };
      if (s.id === activeId && sheets.length > 1) {
        const x = document.createElement("button"); x.className = "x"; x.textContent = "×"; x.title = "Delete sheet"; x.setAttribute("aria-label", "Delete " + s.name);
        x.onclick = ev => { ev.stopPropagation(); confirmDel = s.id; renderTabs(); };
        t.appendChild(x);
      }
    }
    box.appendChild(t);
  }
  const add = document.createElement("button"); add.className = "addtab"; add.textContent = "+"; add.title = "Add sheet"; add.setAttribute("aria-label", "Add sheet");
  add.onclick = () => { const s = newSheet(uniqueName("Sheet" + (sheets.length + 1))); sheets.push(s); markDirty(s); switchSheet(s.id); };
  box.appendChild(add);
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function uniqueName(base) { let n = base, i = 2; while (sheetByName(n)) n = base + " " + i++; return n; }
function renameSheet(s, name) {
  if (!name || name === s.name) return;
  if (/[!]/.test(name)) { flash("Sheet names can't contain !", true); return; }
  const other = sheetByName(name); if (other && other !== s) { flash("Another sheet already has that name.", true); return; }
  const oldQ = [s.name, quoteName(s.name)].map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp("(^|[^A-Za-z0-9_.'])(" + oldQ.join("|") + ")!", "gi");
  const newQ = quoteName(name);
  for (const t of sheets) {
    let changed = false;
    for (const k in t.cells) { const v = t.cells[k].v; if (typeof v === "string" && v[0] === "=" && re.test(v)) { re.lastIndex = 0; t.cells[k].v = v.replace(re, (m, pre) => pre + newQ + "!"); changed = true; } re.lastIndex = 0; }
    if (changed) markDirty(t);
  }
  s.name = name; markDirty(s); astCache.clear(); render();
}
function deleteSheet(id) {
  const i = sheets.findIndex(s => s.id === id); if (i < 0 || sheets.length < 2) return;
  sheets.splice(i, 1); confirmDel = null;
  undoStack = undoStack.filter(e => e.sid !== id); redoStack = redoStack.filter(e => e.sid !== id);
  deleted.add(id); dirty.delete(id); scheduleSave();
  if (activeId === id) activeId = [...sheets].sort((a, b) => a.order - b.order)[0].id;
  switchSheet(activeId, true);
}
function switchSheet(id, force) {
  if (editing) commitEdit();
  if (id === activeId && !force) return;
  activeId = id; sel = { ar: 0, ac: 0, fr: 0, fc: 0 };
  buildGrid(); wrap.scrollTop = 0; wrap.scrollLeft = 0; render();
  saveLocal();
}

/* ---------- persistence (Supabase) ---------- */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://qiyjzukzhwklkmpdxmfl.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_wlKLDRgzNPEhy3sD92Htzg_5s7r-_QS";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "implicit", storageKey: "gb-gridbook-auth" },
});
const TABLE = "gridbook_sheets";
const WB_TABLE = "gridbook_workbooks";
let workbook = null, workbooks = [];
const MAX_SHEET_BYTES = 4_500_000;
let user = null, saving = false, saveTimer = null, loaded = false;
const dirty = new Set(), deleted = new Set(), failedIds = new Set(), failedDeletes = new Set();
const lsKey = () => "gridbook.cache." + (user ? user.id : "none") + "." + (workbook ? workbook.id : "none");
const lastWbKey = () => "gridbook.lastWorkbook." + (user ? user.id : "none");
const clampRows = n => Math.min(MAX_ROWS, Math.max(DEF_ROWS, +n || DEF_ROWS));
function toRow(s) {
  return { id: s.id, user_id: user.id, workbook_id: workbook.id, name: s.name, sort_order: s.order, row_count: s.rows, col_widths: s.colW, cells: s.cells };
}
function fromRow(r) {
  return {
    id: r.id, name: String(r.name || "Sheet"), order: +r.sort_order || 1, rows: clampRows(r.row_count),
    colW: r.col_widths && typeof r.col_widths === "object" ? r.col_widths : {},
    cells: r.cells && typeof r.cells === "object" ? r.cells : {},
  };
}
function saveLocal() {
  if (!user || !loaded) return;
  try { localStorage.setItem(lsKey(), JSON.stringify({ sheets, activeId, pending: [...dirty, ...failedIds], deleted: [...deleted, ...failedDeletes] })); } catch (e) { }
}
function loadLocal() {
  try { const j = JSON.parse(localStorage.getItem(lsKey()) || "null"); if (j && Array.isArray(j.sheets) && j.sheets.length) return j; } catch (e) { }
  return null;
}
function markDirty(s) { if (!loaded || !workbook) return; dirty.add(s.id); scheduleSave(); }
function scheduleSave() { setSave("pending"); clearTimeout(saveTimer); saveTimer = setTimeout(flush, 700); }
async function flush() {
  clearTimeout(saveTimer);
  saveLocal();
  if (!user || !loaded || !workbook) return;
  if (saving) { scheduleSave(); return; }
  saving = true; setSave("saving");
  let failed = false;
  try {
    if (deleted.size) {
      const ids = [...deleted]; deleted.clear();
      const { error } = await supabase.from(TABLE).delete().in("id", ids);
      if (error) { failed = true; ids.forEach(id => failedDeletes.add(id)); console.error("Gridbook delete failed", error); }
    }
    if (dirty.size) {
      const ids = [...dirty]; dirty.clear();
      const rows = [];
      for (const id of ids) {
        const s = sheets.find(x => x.id === id); if (!s) continue;
        const row = toRow(s);
        if (JSON.stringify(row.cells).length > MAX_SHEET_BYTES) {
          flash(`“${s.name}” is too large to save. Split it into smaller sheets.`, true);
          failed = true; failedIds.add(id); continue;
        }
        rows.push(row);
      }
      if (rows.length) {
        const { error } = await supabase.from(TABLE).upsert(rows);
        if (error) {
          failed = true; rows.forEach(r => failedIds.add(r.id));
          console.error("Gridbook save failed", error);
          if (/JWT|auth/i.test(error.message || "")) flash("Your sign-in expired. Sign in again to keep saving.", true);
        } else rows.forEach(r => failedIds.delete(r.id));
      }
    }
  } catch (e) {
    failed = true; console.error(e);
  } finally {
    saving = false;
    saveLocal();
    setSave(failed ? "error" : (dirty.size || deleted.size) ? "pending" : "saved");
    if (dirty.size || deleted.size) scheduleSave();
  }
}
function setSave(st) {
  const b = $("save"), t = $("saveText");
  b.dataset.s = st;
  t.textContent = { pending: "Unsaved changes", saving: "Saving…", saved: "All changes saved", error: "Couldn't save. Click to retry", loading: "Loading your sheets…" }[st] || "";
}
$("save").onclick = () => {
  if ($("save").dataset.s !== "error") return;
  failedIds.forEach(id => dirty.add(id)); failedIds.clear();
  failedDeletes.forEach(id => deleted.add(id)); failedDeletes.clear();
  flush();
};
window.addEventListener("beforeunload", e => {
  if (dirty.size || deleted.size || saving) { flush(); e.preventDefault(); e.returnValue = ""; }
});
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && (dirty.size || deleted.size)) flush(); });

/* ---------- auth ---------- */
const authEl = $("auth");
function showAuth(view, note) {
  authEl.hidden = false;
  if (view === "signin" && !$("authEmail").value) { try { $("authEmail").value = localStorage.getItem("gridbook.lastEmail") || ""; } catch (e) { } }
  document.querySelectorAll("[data-view]").forEach(v => { v.hidden = v.dataset.view !== view; });
  const n = $("authNote"); n.textContent = note || ""; n.classList.remove("bad");
  const first = authEl.querySelector(`[data-view="${view}"] input`);
  if (first) setTimeout(() => first.focus(), 0);
}
function authError(text) { const n = $("authNote"); n.textContent = text; n.classList.add("bad"); }
function busy(form, on) { form.querySelectorAll("button, input").forEach(el => { el.disabled = on; }); }
let lastEmail = "";
let pollTimer = null, pollUntil = 0;
const DEVICE_KEY = "gridbook.device";
function deviceFor(email) {
  try { const d = JSON.parse(localStorage.getItem(DEVICE_KEY) || "null"); return d && d.email === email ? d.token : null; } catch (e) { return null; }
}
async function rememberDevice(session) {
  const email = (session.user.email || "").toLowerCase();
  if (!email || deviceFor(email)) return;
  try {
    const r = await fetch("/api/gridbook-auth", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + session.access_token }, body: JSON.stringify({ action: "remember" }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.deviceToken) localStorage.setItem(DEVICE_KEY, JSON.stringify({ email, token: j.deviceToken }));
  } catch (e) { }
}
async function signInWithToken(tokenHash) {
  let { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "magiclink" });
  if (error && /type/i.test(error.message || "")) ({ error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "email" }));
  return error;
}
function stopPolling() { clearTimeout(pollTimer); pollTimer = null; }
function startPolling(pending, poll) {
  stopPolling(); pollUntil = Date.now() + 30 * 60_000;
  const tick = async () => {
    if (user || Date.now() > pollUntil || authEl.hidden) { stopPolling(); return; }
    try {
      const r = await fetch("/api/gridbook-auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "poll", pending, poll }) });
      const j = await r.json().catch(() => ({}));
      if (j.status === "approved" && j.token_hash) {
        stopPolling(); showAuth("verifying");
        const err = await signInWithToken(j.token_hash);
        if (err) { showAuth("signin"); authError("Couldn't finish signing in. Tap Sign up / Log in again."); }
        return;
      }
      if (j.status === "expired" || j.status === "used" || j.status === "unknown") { stopPolling(); return; }
    } catch (e) { }
    pollTimer = setTimeout(tick, document.visibilityState === "visible" ? 2500 : 6000);
  };
  pollTimer = setTimeout(tick, 2500);
}
async function sendLink(email) {
  const form = $("signinForm"); busy(form, true);
  let error = null, data = null;
  try {
    const r = await fetch("/api/gridbook-link", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, deviceToken: deviceFor(email) || undefined }) });
    data = await r.json().catch(() => ({}));
    if (!r.ok) error = data.error || "We couldn't send the email. Try again in a minute.";
  } catch (e) { error = "No connection. Check your internet and try again."; }
  busy(form, false);
  if (error) { authError(error); return false; }
  if (data.mode === "device" && data.token_hash) {
    showAuth("verifying");
    const err = await signInWithToken(data.token_hash);
    if (err) { showAuth("signin"); authError("Couldn't sign you in. Try again."); return false; }
    return true;
  }
  lastEmail = email;
  $("sentTo").textContent = email;
  showAuth("sent");
  if (data.pending && data.poll) startPolling(data.pending, data.poll);
  return true;
}
$("signinForm").addEventListener("submit", async e => {
  e.preventDefault();
  const email = $("authEmail").value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { authError("Enter a valid email address."); $("authEmail").focus(); return; }
  try { localStorage.setItem("gridbook.lastEmail", email); } catch (err) { }
  await sendLink(email);
});
$("resendBtn").addEventListener("click", async () => {
  if (!lastEmail) { showAuth("signin"); return; }
  const btn = $("resendBtn"); btn.disabled = true;
  await sendLink(lastEmail);
  btn.disabled = false;
  const n = $("authNote"); if (!n.classList.contains("bad")) n.textContent = "Sent another link.";
});
$("backBtn").addEventListener("click", () => showAuth("signin"));
$("signOut").addEventListener("click", async () => {
  if (dirty.size || deleted.size) await flush();
  await supabase.auth.signOut();
});

let entering = null;
async function enter(u) {
  if (user && user.id === u.id) return;
  if (entering) return entering;
  entering = (async () => {
    user = u; loaded = false; workbook = null;
    $("who").textContent = u.email || "";
    $("account").hidden = false;
    $("wbBar").hidden = false;
    authEl.hidden = true;
    setSave("loading");
    const list = await fetchWorkbooks();
    if (list === null) { setSave("error"); flash("Couldn't load your spreadsheets. Refresh to try again.", true); return; }
    if (!list.length) {
      const ex = exampleSheet();
      await createWorkbook("Example", [ex], { quiet: true });
      return;
    }
    let lastId = null; try { lastId = localStorage.getItem(lastWbKey()); } catch (e) { }
    await openWorkbook(list.find(w => w.id === lastId) || list[0]);
  })();
  try { await entering; } finally { entering = null; }
}
async function fetchWorkbooks() {
  const { data, error } = await supabase.from(WB_TABLE).select("id,name,updated_at,created_at").order("updated_at", { ascending: false });
  if (error) { console.error(error); return null; }
  workbooks = data;
  return data;
}
function showWorkbookName() {
  $("wbName").textContent = workbook ? workbook.name : "";
  document.title = (workbook ? workbook.name + " · " : "") + "Gridbook | Good Business";
}
async function openWorkbook(wb) {
  if (editing) commitEdit();
  if (loaded && (dirty.size || deleted.size || saving)) await flush();
  loaded = false; workbook = { id: wb.id, name: wb.name };
  dirty.clear(); deleted.clear(); failedIds.clear(); failedDeletes.clear();
  showWorkbookName();
  try { localStorage.setItem(lastWbKey(), wb.id); } catch (e) { }
  setSave("loading");
  const cache = loadLocal();
  if (cache) applySheets(cache.sheets, cache.activeId);
  const { data, error } = await supabase.from(TABLE).select("id,name,sort_order,row_count,col_widths,cells").eq("workbook_id", wb.id).order("sort_order", { ascending: true });
  if (workbook.id !== wb.id) return; // another open started meanwhile
  if (error) {
    console.error(error);
    loaded = !!cache;
    setSave("error");
    flash(cache ? "Couldn't reach the server. Showing the copy saved on this device." : "Couldn't load this spreadsheet. Refresh to try again.", true);
    return;
  }
  if (data.length) {
    let remote = data.map(fromRow);
    if (cache && (cache.pending || []).length) {
      const pend = new Set(cache.pending);
      const localById = new Map(cache.sheets.map(x => [x.id, x]));
      remote = remote.map(x => pend.has(x.id) && localById.has(x.id) ? localById.get(x.id) : x);
      for (const id of pend) if (!remote.find(x => x.id === id) && localById.has(id)) remote.push(localById.get(id));
      pend.forEach(id => dirty.add(id));
    }
    if (cache && (cache.deleted || []).length) { const del = new Set(cache.deleted); remote = remote.filter(x => !del.has(x.id)); del.forEach(id => deleted.add(id)); }
    if (!remote.length) { const blank = newSheet("Sheet1"); blank.order = 1; remote = [blank]; dirty.add(blank.id); }
    applySheets(remote, cache && remote.find(x => x.id === cache.activeId) ? cache.activeId : remote[0].id);
  } else if (cache && cache.sheets.length && (cache.pending || []).length) {
    applySheets(cache.sheets, cache.activeId);
    cache.sheets.forEach(x => dirty.add(x.id));
  } else {
    sheets = [];
    const blank = newSheet("Sheet1"); blank.order = 1;
    applySheets([blank], blank.id);
    dirty.add(blank.id);
  }
  loaded = true;
  saveLocal();
  wrap.focus({ preventScroll: true });
  if (dirty.size || deleted.size) flush(); else setSave("saved");
}
async function createWorkbook(name, sheetList, opts = {}) {
  if (editing) commitEdit();
  if (loaded && (dirty.size || deleted.size || saving)) await flush();
  const { data, error } = await supabase.from(WB_TABLE).insert({ user_id: user.id, name: name.slice(0, 120) || "Untitled spreadsheet" }).select("id,name,updated_at,created_at").single();
  if (error) { console.error(error); flash("Couldn't create the spreadsheet. Try again.", true); return null; }
  workbooks.unshift(data);
  loaded = false; workbook = { id: data.id, name: data.name };
  dirty.clear(); deleted.clear(); failedIds.clear(); failedDeletes.clear();
  showWorkbookName();
  try { localStorage.setItem(lastWbKey(), data.id); } catch (e) { }
  const list = sheetList && sheetList.length ? sheetList : [Object.assign(newSheet("Sheet1"), { order: 1 })];
  list.forEach((x, i) => { x.order = i + 1; });
  applySheets(list, list[0].id);
  loaded = true;
  list.forEach(x => dirty.add(x.id));
  await flush();
  if (!opts.quiet) flash(`Created “${data.name}”`);
  wrap.focus({ preventScroll: true });
  return data;
}
async function renameWorkbook(name) {
  name = name.trim().slice(0, 120);
  if (!workbook || !name || name === workbook.name) { showWorkbookName(); return; }
  const prev = workbook.name;
  workbook.name = name; showWorkbookName();
  const { error } = await supabase.from(WB_TABLE).update({ name }).eq("id", workbook.id);
  if (error) { workbook.name = prev; showWorkbookName(); flash("Couldn't rename. Try again.", true); return; }
  const w = workbooks.find(x => x.id === workbook.id); if (w) w.name = name;
}
async function deleteWorkbook(id) {
  const { error } = await supabase.from(WB_TABLE).delete().eq("id", id);
  if (error) { flash("Couldn't delete. Try again.", true); return false; }
  try { localStorage.removeItem("gridbook.cache." + user.id + "." + id); } catch (e) { }
  workbooks = workbooks.filter(w => w.id !== id);
  if (workbook && workbook.id === id) {
    dirty.clear(); deleted.clear(); loaded = false;
    if (workbooks.length) await openWorkbook(workbooks[0]);
    else await createWorkbook("Untitled spreadsheet", null, { quiet: true });
  }
  return true;
}

/* ---------- spreadsheets panel ---------- */
const filesEl = $("files");
let confirmWb = null;
function relTime(iso) {
  const d = new Date(iso), s = (Date.now() - d) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + " min ago";
  if (s < 86400) return Math.floor(s / 3600) + " hr ago";
  if (s < 86400 * 7) return Math.floor(s / 86400) + (Math.floor(s / 86400) === 1 ? " day ago" : " days ago");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: d.getFullYear() === new Date().getFullYear() ? undefined : "numeric" });
}
function renderFiles() {
  const q = $("fileSearch").value.trim().toLowerCase();
  const list = workbooks.filter(w => !q || w.name.toLowerCase().includes(q));
  const box = $("fileList");
  if (!list.length) { box.innerHTML = `<p class="empty">${q ? "No spreadsheets match that search." : "No spreadsheets yet."}</p>`; return; }
  box.innerHTML = "";
  for (const w of list) {
    const row = document.createElement("div");
    row.className = "file" + (workbook && w.id === workbook.id ? " on" : "");
    if (confirmWb === w.id) {
      row.innerHTML = `<span class="fname">Delete “${esc(w.name)}” and all its sheets?</span><span class="factions"><button class="btn danger" data-del-yes>Delete</button><button class="btn" data-del-no>Keep</button></span>`;
      row.querySelector("[data-del-yes]").onclick = async () => { confirmWb = null; if (await deleteWorkbook(w.id)) { flash("Deleted."); renderFiles(); } };
      row.querySelector("[data-del-no]").onclick = () => { confirmWb = null; renderFiles(); };
    } else {
      row.innerHTML = `<button class="fopen" data-open><span class="fname"></span><span class="fmeta"></span></button><button class="fdel" data-del title="Delete" aria-label="Delete"><svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg></button>`;
      row.querySelector(".fname").textContent = w.name;
      row.querySelector(".fmeta").textContent = (workbook && w.id === workbook.id ? "Open now · " : "") + "Edited " + relTime(w.updated_at);
      row.querySelector("[data-open]").onclick = async () => { filesEl.hidden = true; if (!workbook || w.id !== workbook.id) await openWorkbook(w); };
      row.querySelector("[data-del]").onclick = () => { confirmWb = w.id; renderFiles(); };
    }
    box.appendChild(row);
  }
}
async function showFiles() {
  confirmWb = null; $("fileSearch").value = "";
  filesEl.hidden = false; renderFiles();
  if (loaded && (dirty.size || deleted.size)) await flush();
  await fetchWorkbooks(); renderFiles();
  setTimeout(() => $("fileSearch").focus(), 0);
}
$("openBtn").onclick = showFiles;
$("filesClose").onclick = () => { filesEl.hidden = true; };
filesEl.addEventListener("click", e => { if (e.target === filesEl) filesEl.hidden = true; });
$("fileSearch").addEventListener("input", renderFiles);
$("fileSearch").addEventListener("keydown", e => { if (e.key === "Escape") filesEl.hidden = true; });
async function newWorkbook() { filesEl.hidden = true; await createWorkbook("Untitled spreadsheet"); startRename(); }
$("newBtn").onclick = newWorkbook;
$("filesNew").onclick = newWorkbook;
function startRename() {
  if (!workbook) return;
  const btn = $("wbName"), inp = $("wbNameIn");
  inp.value = workbook.name; btn.hidden = true; inp.hidden = false; inp.focus(); inp.select();
}
function endRename(save) {
  const btn = $("wbName"), inp = $("wbNameIn");
  if (inp.hidden) return;
  inp.hidden = true; btn.hidden = false;
  if (save) renameWorkbook(inp.value); else showWorkbookName();
}
$("wbName").onclick = startRename;
$("wbNameIn").addEventListener("keydown", e => { e.stopPropagation(); if (e.key === "Enter") endRename(true); if (e.key === "Escape") endRename(false); });
$("wbNameIn").addEventListener("blur", () => endRename(true));

function applySheets(list, active) {
  if (editing) cancelEdit();
  sheets = list.map(s => Object.assign({ colW: {}, cells: {}, order: 1 }, s, { rows: clampRows(s.rows) }));
  sheets.sort((a, b) => a.order - b.order);
  activeId = sheets.find(s => s.id === active) ? active : sheets[0].id;
  undoStack = []; redoStack = []; astCache.clear();
  sel = { ar: 0, ac: 0, fr: 0, fc: 0 };
  buildGrid(); render();
}
function leave() {
  user = null; loaded = false; workbook = null; workbooks = [];
  dirty.clear(); deleted.clear(); failedIds.clear(); failedDeletes.clear();
  $("account").hidden = true; $("wbBar").hidden = true; filesEl.hidden = true;
  showWorkbookName();
  const ex = exampleSheet(); applySheets([ex], ex.id);
  showAuth("signin");
}
function downloadBlob(data, filename) {
  const blob = data instanceof Blob ? data : new Blob([data]);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}

/* ---------- import / export ---------- */
let xlsxReady = null;
function loadXLSX() {
  if (window.XLSX) return Promise.resolve(window.XLSX);
  if (!xlsxReady) xlsxReady = new Promise((res, rej) => {
    const sc0 = document.createElement("script");
    sc0.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    sc0.onload = () => res(window.XLSX); sc0.onerror = () => { xlsxReady = null; rej(new Error("load")); };
    document.head.appendChild(sc0);
  });
  return xlsxReady;
}
$("importBtn").onclick = () => $("fileIn").click();
$("fileIn").onchange = async e => {
  const file = e.target.files[0]; e.target.value = ""; if (!file) return;
  flash("Reading " + file.name + "…");
  try {
    const X = await loadXLSX();
    const buf = await file.arrayBuffer();
    const wb = X.read(buf, { type: "array", cellFormula: true, cellDates: false, cellNF: true });
    let added = 0, clipped = false;
    const imported = [];
    const taken = new Set();
    const uniq = base => { let n = base || "Sheet", i = 2; while (taken.has(n.toLowerCase())) n = base + " " + i++; taken.add(n.toLowerCase()); return n; };
    for (const name of wb.SheetNames) {
      const ws = wb.Sheets[name]; if (!ws || !ws["!ref"]) continue;
      const base = /\.(csv|tsv)$/i.test(file.name) ? "Sheet1" : name;
      const s = { id: uid(), name: uniq(base.replace(/!/g, "").slice(0, 100)), order: imported.length + 1, rows: DEF_ROWS, colW: {}, cells: {} };
      const range = X.utils.decode_range(ws["!ref"]);
      for (let R = range.s.r; R <= range.e.r; R++) for (let C = range.s.c; C <= range.e.c; C++) {
        const addr = X.utils.encode_cell({ r: R, c: C }); const cell = ws[addr]; if (!cell) continue;
        if (C >= COLS || R >= MAX_ROWS) { clipped = true; continue; }
        let v, nf;
        if (cell.f) v = "=" + cell.f;
        else if (cell.t === "b") v = cell.v ? "TRUE" : "FALSE";
        else if (cell.t === "n") v = String(cell.v);
        else if (cell.t === "d") { const d = cell.v; v = String(toSerial(d.getFullYear(), d.getMonth() + 1, d.getDate())); nf = "date"; }
        else if (cell.t === "e") v = cell.w || "#ERROR!";
        else v = cell.v == null ? "" : String(cell.v);
        if (cell.t === "n" && cell.z) {
          const z = String(cell.z);
          if (/[dy]/i.test(z) && !/General/i.test(z) && !/0\.0/.test(z)) nf = "date";
          else if (/%/.test(z)) nf = "pct";
          else if (/\$/.test(z)) nf = "cur";
          else if (/#,##0\.00|0\.00/.test(z)) nf = "num";
        }
        const obj = { v }; if (nf) obj.nf = nf;
        s.cells[keyOf(R, C)] = obj;
        if (R + 1 > s.rows) s.rows = Math.min(MAX_ROWS, Math.ceil((R + 1) / 100) * 100);
      }
      if (ws["!cols"]) ws["!cols"].forEach((col, i) => { if (col && col.wpx && i < COLS) s.colW[colName(i)] = Math.round(Math.max(40, Math.min(400, col.wpx))); });
      if (JSON.stringify(s.cells).length > MAX_SHEET_BYTES) flash(`“${s.name}” is too large to save. Split it into smaller sheets.`, true);
      imported.push(s); added++;
    }
    if (!added) { flash("That file has no data to import.", true); return; }
    const made = await createWorkbook(file.name.replace(/\.[^.]+$/, "") || "Imported spreadsheet", imported, { quiet: true });
    if (made) flash(`Opened ${file.name} as a new spreadsheet` + (clipped ? ". Columns past Z were left out." : ""), clipped);
  } catch (err) { console.error("Gridbook import failed", err); flash("Couldn't read that file. Try .xlsx or .csv.", true); }
};
const exportMenu = $("exportMenu");
$("exportBtn").onclick = e => { e.stopPropagation(); exportMenu.hidden = !exportMenu.hidden; };
document.addEventListener("click", e => { if (!exportMenu.hidden && !exportMenu.contains(e.target)) exportMenu.hidden = true; });
exportMenu.querySelectorAll("[data-exp]").forEach(b => b.onclick = async () => {
  exportMenu.hidden = true;
  const dl = { save: async ({ filename, data }) => downloadBlob(data, filename) };
  try {
    const stamp = new Date().toISOString().slice(0, 10);
    if (b.dataset.exp === "csv") {
      const s = sh(); calcCache = new Map();
      let maxR = -1, maxC = -1;
      for (const k in s.cells) { const m = /^([A-Z]+)(\d+)$/.exec(k); if (m && s.cells[k].v !== "") { maxR = Math.max(maxR, +m[2] - 1); maxC = Math.max(maxC, colIndex(m[1])); } }
      const lines = [];
      for (let r = 0; r <= maxR; r++) { const row = []; for (let c = 0; c <= maxC; c++) { let t = displayText(s, r, c); if (/[",\n]/.test(t)) t = '"' + t.replace(/"/g, '""') + '"'; row.push(t); } lines.push(row.join(",")); }
      await dl.save({ filename: `${s.name}-${stamp}.csv`, data: new Blob([lines.join("\r\n")], { type: "text/csv" }) });
    } else {
      flash("Preparing workbook…");
      const X = await loadXLSX();
      const wb = X.utils.book_new(); calcCache = new Map();
      for (const s of [...sheets].sort((a, b) => a.order - b.order)) {
        const ws = {}; let maxR = 0, maxC = 0;
        for (const k in s.cells) {
          const m = /^([A-Z]+)(\d+)$/.exec(k); if (!m) continue;
          const cell = s.cells[k]; if (cell.v === "" || cell.v == null) continue;
          const r = +m[2] - 1, c = colIndex(m[1]); maxR = Math.max(maxR, r); maxC = Math.max(maxC, c);
          let val; try { val = cellValue(s, r, c); } catch (e) { val = e; }
          const out = {};
          if (String(cell.v)[0] === "=") out.f = String(cell.v).slice(1);
          if (val instanceof XErr) { out.t = "e"; out.v = 0x0F; out.w = val.code; }
          else if (typeof val === "number") { out.t = "n"; out.v = val; }
          else if (typeof val === "boolean") { out.t = "b"; out.v = val; }
          else { out.t = "s"; out.v = val == null ? "" : String(val); }
          const f = cell.nf || autoFmt(cell.v);
          if (out.t === "n" && f) out.z = { num: "#,##0.00", cur: '"$"#,##0.00', pct: "0.00%", date: "m/d/yyyy" }[f];
          ws[k] = out;
        }
        ws["!ref"] = X.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: maxR, c: maxC } });
        ws["!cols"] = Array.from({ length: maxC + 1 }, (_, c) => ({ wpx: colW(s, c) }));
        X.utils.book_append_sheet(wb, ws, s.name.slice(0, 31).replace(/[\\/?*[\]:]/g, "-"));
      }
      const arr = X.write(wb, { type: "array", bookType: "xlsx" });
      await dl.save({ filename: `${(workbook ? workbook.name : "Gridbook").replace(/[\\/:*?"<>|]+/g, "-")}-${stamp}.xlsx`, data: new Blob([arr], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }) });
    }
    flash("Downloaded.");
  } catch (err) {
    flash("Export didn't finish. Try again.", true);
  }
});

/* ---------- misc ---------- */
let flashTimer = null;
function flash(text, bad) { const m = $("msg"); m.textContent = text; m.classList.toggle("bad", !!bad); clearTimeout(flashTimer); flashTimer = setTimeout(() => { m.textContent = ""; }, bad ? 7000 : 3000); }
$("helpBtn").onclick = () => { $("help").hidden = false; $("helpClose").focus(); };
$("helpClose").onclick = () => { $("help").hidden = true; };
$("help").onclick = e => { if (e.target === $("help")) $("help").hidden = true; };
$("fnList").innerHTML = Object.keys(FN).sort().map(n => `<code>${n}</code>`).join("");
window.addEventListener("resize", () => drawSelection());

/* ---------- theme ---------- */
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
const currentTheme = () => document.documentElement.dataset.theme || (darkQuery.matches ? "dark" : "light");
function setThemeColor() { const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#050608"; }
document.querySelectorAll("[data-theme-toggle]").forEach(b => b.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("gridbook.theme", next); } catch (e) { }
  setThemeColor(); drawSelection();
}));
darkQuery.addEventListener?.("change", setThemeColor);
setThemeColor();

/* ---------- boot ---------- */
{ const ex = exampleSheet(); sheets = [ex]; activeId = ex.id; }
buildGrid(); render(); setSave("loading");
const urlParams = new URLSearchParams(location.search);
const tokenHash = urlParams.get("token_hash");
let linkFailed = null;
if (tokenHash) {
  history.replaceState(null, "", location.pathname);
  showAuth("verifying");
  (async () => {
    const error = await signInWithToken(tokenHash);
    if (error) {
      linkFailed = error;
      showAuth("signin");
      authError(/expired|invalid|not found/i.test(error.message || "") ? "That link expired or was already used. Enter your email for a new one." : error.message);
      return;
    }
    const pendingId = urlParams.get("p");
    if (pendingId) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) fetch("/api/gridbook-auth", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + session.access_token }, body: JSON.stringify({ action: "approve", pending: pendingId }) }).catch(() => null);
    }
  })();
}
const linkError = (() => { const h = new URLSearchParams(location.hash.slice(1)); const q = new URLSearchParams(location.search); return h.get("error_description") || q.get("error_description"); })();
if (linkError) history.replaceState(null, "", location.pathname);
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT") { setTimeout(leave, 0); return; }
  if (session && session.user) { stopPolling(); setTimeout(() => { enter(session.user); rememberDevice(session); }, 0); }
  else if (event === "INITIAL_SESSION" && !tokenHash) { showAuth("signin"); if (linkError) authError(/expired|invalid/i.test(linkError) ? "That link expired or was already used. Enter your email for a new one." : linkError); }
});
