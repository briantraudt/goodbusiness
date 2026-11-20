const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

requestAnimationFrame(() => document.documentElement.classList.add('loaded'));

/* Header rule on scroll */
const header = document.querySelector('#site-header');
const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 12);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Spreadsheet-to-app demo (sample data, runs in the browser) ---------- */
const cash = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 });
const sum = (rows) => rows.reduce((total, row) => total + row.amount, 0);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

const ICONS = {
  back: '<path d="M15 6l-6 6 6 6"/>',
  forward: '<path d="M9 6l6 6-6 6"/>',
  reload: '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  home: '<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>',
  file: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.5M21 20a5 5 0 0 0-4-4.9"/>',
  card: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
  tag: '<path d="M4 4h7l9 9-7 7-9-9z"/><circle cx="8.5" cy="8.5" r="1.2"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
};
const svg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

const SHEETS = {
  invoices: {
    file: 'AR aging - USE THIS ONE.xlsx',
    outcome: 'Every overdue invoice chased, automatically',
    cols: ['Customer', 'Due', 'Status', 'Amount'],
    statuses: ['Sent', 'Overdue', 'Paid'],
    tones: { Sent: 'blue', Overdue: 'red', Paid: 'green' },
    ready: 'Overdue',
    title: 'Invoices',
    path: '/invoices',
    nav: [['home', 'Dashboard'], ['file', 'Invoices'], ['users', 'Customers'], ['card', 'Payments'], ['chart', 'Reports']],
    search: 'Ask about any invoice or customer',
    kpis: (all, ready) => [
      { label: 'Overdue', value: cash.format(sum(ready)), sub: plural(ready.length, 'invoice', 'invoices'), tone: 'red' },
      { label: 'Outstanding', value: cash.format(sum(all.filter((row) => row.status !== 'Paid'))), sub: 'Open balance' },
      { label: 'Collected', value: cash.format(sum(all.filter((row) => row.status === 'Paid'))), sub: 'This month', tone: 'green' },
    ],
    action: (n) => (n ? `Send ${plural(n, 'reminder', 'reminders')}` : 'No reminders due'),
    toast: (n) => `${plural(n, 'reminder', 'reminders')} sent, each with a pay link.`,
    rows: [
      ['Calloway Dental', 'Oct 28', 'Overdue', 4280],
      ['Tesoro Roofing', 'Nov 3', 'Overdue', 1950],
      ['Oakmont HOA', 'Nov 24', 'Sent', 6400],
      ['Whitlow Supply', 'Nov 10', 'Overdue', 2715],
      ['Lakemere Pediatrics', 'Nov 14', 'Paid', 3120],
    ],
  },
  quotes: {
    file: 'Quotes 2026 (edited).xlsx',
    outcome: 'No quote goes quiet',
    cols: ['Customer', 'Rep', 'Status', 'Value'],
    statuses: ['Sent', 'No reply', 'Won'],
    tones: { Sent: 'blue', 'No reply': 'amber', Won: 'green' },
    ready: 'No reply',
    title: 'Quotes',
    path: '/quotes',
    accent: '#0f766e',
    nav: [['home', 'Dashboard'], ['tag', 'Quotes'], ['users', 'Customers'], ['file', 'Jobs'], ['chart', 'Reports']],
    search: 'Ask about any quote or customer',
    kpis: (all, ready) => [
      { label: 'Gone quiet', value: cash.format(sum(ready)), sub: `${ready.length} to follow up`, tone: 'amber' },
      { label: 'Open pipeline', value: cash.format(sum(all.filter((row) => row.status !== 'Won'))), sub: 'Not yet decided' },
      { label: 'Won', value: cash.format(sum(all.filter((row) => row.status === 'Won'))), sub: 'This month', tone: 'green' },
    ],
    action: (n) => (n ? `Follow up on ${n}` : 'No follow-ups due'),
    toast: (n) => `${plural(n, 'follow-up', 'follow-ups')} sent. Replies go straight to the rep.`,
    rows: [
      ['Kessler Steel', 'Tina', 'No reply', 18400],
      ['Pecan Row Cafe', 'Marcus', 'Won', 6250],
      ['Gulfline Plastics', 'Tina', 'No reply', 31200],
      ['Red Fork Lumber', 'Dev', 'Sent', 9800],
      ['Lonehill Supply', 'Marcus', 'No reply', 12750],
    ],
  },
  hours: {
    file: 'Timesheets wk 47 FINAL.xlsx',
    outcome: 'Payroll ready by Friday noon',
    device: 'phone',
    cols: ['Employee', 'Role', 'Status', 'Hours'],
    statuses: ['Missing', 'Submitted', 'Approved'],
    tones: { Missing: 'red', Submitted: 'amber', Approved: 'green' },
    ready: 'Approved',
    title: 'Timesheets',
    sub: 'Week of Nov 16',
    hours: true,
    kpis: (all, ready) => [
      { label: 'Approved hours', value: `${Math.round(sum(ready) * 10) / 10}`, sub: 'Ready for payroll', tone: 'green' },
      { label: 'Timesheets', value: `${ready.length} of ${all.length}`, sub: 'Approved' },
    ],
    action: (n) => (n ? `Send ${n} to payroll` : 'Nothing approved yet'),
    toast: (n) => `${plural(n, 'timesheet', 'timesheets')} sent to payroll. No re-keying.`,
    rows: [
      ['Jenna M.', 'Front desk', 'Approved', 40],
      ['Marco D.', 'Technician', 'Approved', 44.5],
      ['Priya S.', 'Office', 'Submitted', 38],
      ['Sam T.', 'Technician', 'Missing', 0],
      ['Dana K.', 'Driver', 'Approved', 41],
    ],
  },
};

const sheetGrid = document.querySelector('#sheet-grid');
const sheetFile = document.querySelector('#sheet-file');
const sheetFx = document.querySelector('#sheet-fx');
const toolWindow = document.querySelector('#tool-window');
const toolOutcome = document.querySelector('#tool-outcome');
const stage = document.querySelector('#demo-stage');
const tabs = [...document.querySelectorAll('.demo-tabs [role="tab"]')];
let current = 'invoices';
let runId = 0;
let playing = false;
let toastTimer;
let toolBody;
let toolSend;
let toolToast;
let toolKpis;
let toolCount;

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const initials = (name) => name.replace(/[^A-Za-z ]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase();

// Shell markup is built from the fixed config above, never from visitor input.
function shell(sheet) {
  if (sheet.device === 'phone') {
    return `
      <div class="ph-status" aria-hidden="true"><b>9:41</b><i></i><em></em></div>
      <div class="app ph">
        <header class="ph-head"><div><small>${sheet.sub}</small><h4>${sheet.title}</h4></div><i class="ph-avatar" aria-hidden="true">DK</i></header>
        <div class="ph-seg" aria-hidden="true"><span class="on">All</span><span>To review</span><span>Missing</span></div>
        <div class="app-kpis" data-kpis></div>
        <div class="ph-list" data-body></div>
        <div class="ph-cta"><button type="button" class="app-primary" data-send></button></div>
        <nav class="ph-tabs" aria-hidden="true"><span>${svg('home')}Home</span><span class="on">${svg('clock')}Time</span><span>${svg('users')}Team</span><span>${svg('more')}More</span></nav>
      </div>
      <p class="tool-toast" role="status" aria-live="polite" data-toast></p>`;
  }
  const nav = sheet.nav.map(([icon, label]) => `<span${label === sheet.title ? ' class="on"' : ''}>${svg(icon)}${label}</span>`).join('');
  return `
    <div class="br-top" aria-hidden="true"><span class="lights"><i></i><i></i><i></i></span><span class="br-tab"><i>N</i><span>${sheet.title} · Northside Mechanical</span><b>×</b></span><span class="br-plus">+</span></div>
    <div class="br-bar" aria-hidden="true"><span class="br-nav">${svg('back')}${svg('forward')}${svg('reload')}</span><span class="br-url">${svg('lock')}<em>northside.goodbusinesshq.com<span>${sheet.path}</span></em></span>${svg('more')}</div>
    <div class="app">
      <aside class="app-side" aria-hidden="true">
        <div class="app-brand"><i>N</i><b>Northside Mechanical</b></div>
        <nav>${nav}</nav>
        <div class="app-user"><i>DK</i><span><b>Dana Kim</b><small>Office manager</small></span></div>
      </aside>
      <div class="app-main">
        <header class="app-top"><h4>${sheet.title}</h4><span class="app-search" aria-hidden="true">${svg('spark')}<span>${sheet.search}</span></span><button type="button" class="app-primary" data-send></button></header>
        <div class="app-kpis" data-kpis></div>
        <div class="app-table">
          <div class="app-th">${sheet.cols.map((col) => `<span>${col}</span>`).join('')}</div>
          <div data-body></div>
          <div class="app-tf"><span data-count></span><span>Updated just now</span></div>
        </div>
      </div>
    </div>
    <p class="tool-toast" role="status" aria-live="polite" data-toast></p>`;
}

function snapshot() {
  return [...toolBody.querySelectorAll('.rec.in')].map((rec) => ({
    status: rec.querySelector('.badge').textContent,
    amount: Number(rec.dataset.amount),
  }));
}

function recalc() {
  const sheet = SHEETS[current];
  const all = snapshot();
  const ready = all.filter((row) => row.status === sheet.ready);
  toolKpis.replaceChildren(...sheet.kpis(all, ready).map((kpi) => {
    const card = el('div', `kpi ${kpi.tone || ''}`);
    card.append(el('span', '', kpi.label), el('b', '', kpi.value), el('small', '', kpi.sub));
    return card;
  }));
  if (toolCount) toolCount.textContent = `Showing ${all.length} of ${sheet.rows.length}`;
  toolSend.textContent = sheet.action(ready.length);
  toolSend.disabled = playing || ready.length === 0;
}

function build(key) {
  const sheet = SHEETS[key];
  current = key;
  sheetFile.textContent = sheet.file;
  sheetFx.textContent = `=SUMIF(C2:C${sheet.rows.length + 1},"${sheet.ready}",D2:D${sheet.rows.length + 1})`;
  toolOutcome.textContent = sheet.outcome;

  toolWindow.classList.toggle('is-phone', sheet.device === 'phone');
  toolWindow.style.setProperty('--accent', sheet.accent || '');
  if (!sheet.accent) toolWindow.style.removeProperty('--accent');
  toolWindow.innerHTML = shell(sheet);
  toolBody = toolWindow.querySelector('[data-body]');
  toolSend = toolWindow.querySelector('[data-send]');
  toolToast = toolWindow.querySelector('[data-toast]');
  toolKpis = toolWindow.querySelector('[data-kpis]');
  toolCount = toolWindow.querySelector('[data-count]');
  toolSend.addEventListener('click', () => {
    const count = snapshot().filter((row) => row.status === sheet.ready).length;
    toolToast.textContent = sheet.toast(count);
    toolToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toolToast.classList.remove('show'), 3800);
  });

  const letters = el('div', 'sheet-row sheet-letters');
  ['', 'A', 'B', 'C', 'D'].forEach((text) => letters.append(el('span', '', text)));
  const head = el('div', 'sheet-row sheet-head');
  ['1', ...sheet.cols].forEach((text) => head.append(el('span', '', text)));
  sheetGrid.replaceChildren(letters, head);

  const pairs = sheet.rows.map(([name, who, status, amount], index) => {
    const row = el('div', 'sheet-row');
    [String(index + 2), name, who, status, sheet.hours ? String(amount) : amount.toFixed(2)].forEach((text) => row.append(el('span', '', text)));
    sheetGrid.append(row);

    const rec = el('div', 'rec field');
    rec.dataset.amount = amount;
    const label = el('div', 'rec-name');
    const text = el('span');
    text.append(el('b', '', name), el('small', '', who));
    label.append(el('i', `av c${index % 5}`, initials(name)), text);
    const badge = el('button', `badge ${sheet.tones[status] || ''}`, status);
    badge.type = 'button';
    badge.setAttribute('aria-label', `${name}: ${status}. Click to change.`);
    badge.addEventListener('click', () => {
      const next = sheet.statuses[(sheet.statuses.indexOf(badge.textContent) + 1) % sheet.statuses.length];
      badge.textContent = next;
      badge.className = `badge ${sheet.tones[next] || ''}`;
      badge.setAttribute('aria-label', `${name}: ${next}. Click to change.`);
      recalc();
    });
    rec.append(label, el('span', 'rec-who', who), badge, el('span', 'rec-amt', sheet.hours ? String(amount) : cash.format(amount)));
    toolBody.append(rec);
    return [row, rec];
  });

  for (let n = sheet.rows.length + 2; n <= 26; n += 1) {
    const blank = el('div', 'sheet-row');
    [String(n), '', '', '', ''].forEach((cell) => blank.append(el('span', '', cell)));
    sheetGrid.append(blank);
  }

  recalc();
  return pairs;
}

async function play(key, instant = false) {
  const id = ++runId;
  playing = true;
  const pairs = build(key);
  const step = instant || reducedMotion ? 0 : 280;
  if (step) await wait(350);
  for (const [row, rec] of pairs) {
    if (id !== runId) return;
    row.classList.add('read');
    if (step) await wait(step);
    if (id !== runId) return;
    row.classList.remove('read');
    row.classList.add('done');
    rec.classList.add('in');
    recalc();
  }
  playing = false;
  recalc();
}

function selectTab(tab, focus = false) {
  tabs.forEach((item) => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  stage.setAttribute('aria-labelledby', tab.id);
  if (focus) tab.focus();
  play(tab.dataset.form);
}

if (sheetGrid && toolWindow) {
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      selectTab(next, true);
    });
  });

  document.querySelector('#demo-replay')?.addEventListener('click', () => play(current));

  // Show the spreadsheet first; convert it the first time the demo is on screen.
  build(current);
  if ('IntersectionObserver' in window) {
    const demoObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        demoObserver.disconnect();
        play(current);
      }
    }, { threshold: 0.3 });
    demoObserver.observe(stage);
  } else {
    play(current, true);
  }
}

/* ---------- Scroll reveals: ledger rows and work visuals ---------- */
const ledgerRows = document.querySelectorAll('.ledger-row:not(.ledger-head)');
ledgerRows.forEach((row) => {
  const before = row.firstElementChild;
  const strike = el('span', 'strike', before.textContent);
  before.replaceChildren(strike);
});
const seenTargets = [...ledgerRows, ...document.querySelectorAll('.story')];
if ('IntersectionObserver' in window && !reducedMotion) {
  const seenObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('seen');
        seenObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6, rootMargin: '0px 0px -8% 0px' });
  seenTargets.forEach((target) => seenObserver.observe(target));
} else {
  seenTargets.forEach((target) => target.classList.add('seen'));
}

/* ---------- Contact form ---------- */
const contactForm = document.querySelector('#contact-form');
const formNote = document.querySelector('.form-note');
const submitButton = contactForm?.querySelector('button[type="submit"]');
const fallback = 'That didn’t send. Please email info@goodbusinesshq.com.';

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (submitButton.disabled) return;
  if (!contactForm.checkValidity()) {
    formNote.textContent = 'Please fill in every field with a valid email.';
    contactForm.querySelector(':invalid')?.focus();
    return;
  }
  const data = Object.fromEntries(new FormData(contactForm));
  const label = submitButton.querySelector('span');
  const original = label.textContent;
  submitButton.disabled = true;
  label.textContent = 'Sending…';
  formNote.textContent = '';
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || fallback);
    contactForm.reset();
    formNote.textContent = 'Thanks. I’ll reply within one business day.';
  } catch (error) {
    formNote.textContent = error instanceof Error && error.message ? error.message : fallback;
  } finally {
    label.textContent = original;
    submitButton.disabled = false;
  }
});
