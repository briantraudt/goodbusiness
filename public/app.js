const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

requestAnimationFrame(() => document.documentElement.classList.add('loaded'));

/* Header rule on scroll */
const header = document.querySelector('#site-header');
const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 12);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Spreadsheet-to-app demo (sample data, runs in the browser) ---------- */
const SHEETS = {
  invoices: {
    file: 'AR aging - USE THIS ONE.xlsx',
    title: 'Invoices',
    url: 'app.yourbusiness.com/invoices',
    insight: (ready, all) => (ready.length
      ? `${ready.length} invoice${ready.length === 1 ? ' is' : 's are'} overdue, ${money.format(sum(ready))} in total. Start with ${top(ready).name}: ${money.format(top(ready).amount)}, due ${top(ready).who}.`
      : 'Nothing is overdue. Every invoice is paid or still inside its terms.'),
    outcome: 'Every overdue invoice chased, automatically',
    cols: ['Customer', 'Due', 'Status', 'Amount'],
    statuses: ['Sent', 'Overdue', 'Paid'],
    ready: 'Overdue',
    statLabel: 'Overdue right now',
    countLabel: 'Invoices overdue',
    action: (n) => (n === 1 ? 'Send 1 payment reminder' : `Send ${n} payment reminders`),
    toast: (n) => `${n} reminder${n === 1 ? '' : 's'} sent, each with a pay link.`,
    rows: [
      ['Hill Country Dental', 'Oct 28', 'Overdue', 4280],
      ['Alvarez Roofing', 'Nov 3', 'Overdue', 1950],
      ['Oak Ridge HOA', 'Nov 24', 'Sent', 6400],
      ['Whitfield & Sons', 'Nov 10', 'Overdue', 2715],
      ['Lakeside Pediatrics', 'Nov 14', 'Paid', 3120],
    ],
  },
  quotes: {
    file: 'Quotes 2026 (edited).xlsx',
    title: 'Quotes',
    url: 'app.yourbusiness.com/quotes',
    insight: (ready, all) => (ready.length
      ? `${ready.length} quote${ready.length === 1 ? ' has' : 's have'} gone quiet, worth ${money.format(sum(ready))}. The biggest is ${top(ready).name} at ${money.format(top(ready).amount)}. ${top(ready).who} owns it.`
      : 'No quote is waiting on a follow-up.'),
    outcome: 'No quote goes quiet',
    cols: ['Customer', 'Rep', 'Status', 'Value'],
    statuses: ['Sent', 'No reply', 'Won'],
    ready: 'No reply',
    statLabel: 'Waiting on a follow-up',
    countLabel: 'Gone quiet',
    action: (n) => (n === 1 ? 'Follow up on 1 quiet quote' : `Follow up on ${n} quiet quotes`),
    toast: (n) => `${n} follow-up${n === 1 ? '' : 's'} sent. Replies go straight to the rep.`,
    rows: [
      ['Brazos Steel', 'Tina', 'No reply', 18400],
      ['Pecan Street Cafe', 'Marcus', 'Won', 6250],
      ['Gulf Plastics', 'Tina', 'No reply', 31200],
      ['Red River Lumber', 'Dev', 'Sent', 9800],
      ['Lone Star Supply', 'Marcus', 'No reply', 12750],
    ],
  },
  hours: {
    file: 'Timesheets wk 47 FINAL.xlsx',
    title: 'Timesheets',
    device: 'phone',
    insight: (ready, all) => {
      const missing = all.filter((row) => row.status === 'Missing').map((row) => row.name);
      const waiting = all.filter((row) => row.status === 'Submitted').map((row) => row.name);
      const parts = [`${ready.length} of ${all.length} timesheets are approved.`];
      if (waiting.length) parts.push(`${waiting.join(' and ')} ${waiting.length === 1 ? 'is' : 'are'} waiting on you.`);
      if (missing.length) parts.push(`${missing.join(' and ')} ${missing.length === 1 ? 'has' : 'have'} not turned one in.`);
      if (!waiting.length && !missing.length) parts.push('Payroll is ready to run.');
      return parts.join(' ');
    },
    outcome: 'Payroll ready by Friday noon',
    unit: 'hrs',
    cols: ['Employee', 'Role', 'Status', 'Hours'],
    statuses: ['Missing', 'Submitted', 'Approved'],
    ready: 'Approved',
    statLabel: 'Hours approved',
    countLabel: 'Timesheets approved',
    action: (n) => (n === 1 ? 'Send 1 timesheet to payroll' : `Send ${n} timesheets to payroll`),
    toast: (n) => `${n} timesheet${n === 1 ? '' : 's'} sent to payroll. No re-keying.`,
    rows: [
      ['Jenna M.', 'Front desk', 'Approved', 40],
      ['Marco D.', 'Technician', 'Approved', 44.5],
      ['Priya S.', 'Office manager', 'Submitted', 38],
      ['Sam T.', 'Technician', 'Missing', 0],
      ['Dana K.', 'Driver', 'Approved', 41],
    ],
  },
};

const sum = (rows) => rows.reduce((total, row) => total + row.amount, 0);
const top = (rows) => rows.reduce((best, row) => (row.amount > best.amount ? row : best), rows[0]);

const sheetGrid = document.querySelector('#sheet-grid');
const toolWindow = document.querySelector('#tool-window');
const toolUrl = document.querySelector('#tool-url');
const toolInsight = document.querySelector('#tool-insight');
const sheetFile = document.querySelector('#sheet-file');
const sheetFx = document.querySelector('#sheet-fx');
const toolBody = document.querySelector('#tool-body');
const toolTitle = document.querySelector('#tool-title');
const toolOutcome = document.querySelector('#tool-outcome');
const statLabel = document.querySelector('#stat-label');
const statTotal = document.querySelector('#stat-total');
const statCountLabel = document.querySelector('#stat-count-label');
const statCount = document.querySelector('#stat-count');
const toolSend = document.querySelector('#tool-send');
const toolToast = document.querySelector('#tool-toast');
const stage = document.querySelector('#demo-stage');
const tabs = [...document.querySelectorAll('.demo-tabs [role="tab"]')];
let current = 'invoices';
let runId = 0;
let playing = false;
let toastTimer;

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function readyCount() {
  return toolBody.querySelectorAll('.rec.in .status.ready').length;
}

function recalc() {
  const sheet = SHEETS[current];
  const all = [...toolBody.querySelectorAll('.rec.in')].map((rec) => ({
    name: rec.querySelector('.rec-name b').textContent,
    who: rec.querySelector('.rec-name small').textContent,
    status: rec.querySelector('.status').textContent,
    amount: parseFloat(rec.querySelector('input').value) || 0,
  }));
  const ready = all.filter((row) => row.status === sheet.ready);
  const total = sum(ready);
  statTotal.textContent = sheet.unit ? `${Math.round(total * 10) / 10} ${sheet.unit}` : money.format(total);
  statCount.textContent = `${ready.length} of ${all.length}`;
  toolInsight.textContent = all.length ? sheet.insight(ready, all) : 'Reading your spreadsheet…';
  toolSend.textContent = sheet.action(ready.length);
  toolSend.disabled = playing || ready.length === 0;
}

function build(key) {
  const sheet = SHEETS[key];
  current = key;
  sheetFile.textContent = sheet.file;
  sheetFx.textContent = `=SUMIF(C2:C${sheet.rows.length + 1},"${sheet.ready}",D2:D${sheet.rows.length + 1})`;
  toolTitle.textContent = sheet.title;
  toolUrl.textContent = sheet.url || '';
  toolWindow.classList.toggle('is-phone', sheet.device === 'phone');
  toolOutcome.textContent = sheet.outcome;
  statLabel.textContent = sheet.statLabel;
  statCountLabel.textContent = sheet.countLabel;
  toolToast.classList.remove('show');
  toolToast.textContent = '';

  const letters = el('div', 'sheet-row sheet-letters');
  ['', 'A', 'B', 'C', 'D'].forEach((text) => letters.append(el('span', '', text)));
  const head = el('div', 'sheet-row sheet-head');
  ['1', ...sheet.cols].forEach((text) => head.append(el('span', '', text)));
  sheetGrid.replaceChildren(letters, head);
  toolBody.replaceChildren();

  const pairs = sheet.rows.map(([name, who, status, amount], index) => {
    const row = el('div', 'sheet-row');
    [String(index + 2), name, who, status, sheet.unit ? String(amount) : amount.toFixed(2)].forEach((text) => row.append(el('span', '', text)));
    sheetGrid.append(row);

    const rec = el('div', 'rec field');
    const label = el('div', 'rec-name');
    label.append(el('b', '', name), el('small', '', who));
    const statusButton = el('button', 'status', status);
    statusButton.type = 'button';
    statusButton.classList.toggle('ready', status === sheet.ready);
    statusButton.setAttribute('aria-label', `${name} status: ${status}. Tap to change.`);
    statusButton.addEventListener('click', () => {
      const next = sheet.statuses[(sheet.statuses.indexOf(statusButton.textContent) + 1) % sheet.statuses.length];
      statusButton.textContent = next;
      statusButton.classList.toggle('ready', next === sheet.ready);
      statusButton.setAttribute('aria-label', `${name} status: ${next}. Tap to change.`);
      recalc();
    });
    const input = el('input');
    input.type = 'number';
    input.inputMode = 'decimal';
    input.step = 'any';
    input.min = '0';
    input.value = amount;
    input.name = `amount-${index}`;
    input.setAttribute('aria-label', `${name} ${sheet.cols[3].toLowerCase()}`);
    input.addEventListener('input', recalc);
    rec.append(label, statusButton, input);
    toolBody.append(rec);
    return [row, rec];
  });

  for (let n = sheet.rows.length + 2; n <= 9; n += 1) {
    const blank = el('div', 'sheet-row');
    [String(n), '', '', '', ''].forEach((text) => blank.append(el('span', '', text)));
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

if (sheetGrid && toolBody) {
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

  toolSend.addEventListener('click', () => {
    toolToast.textContent = SHEETS[current].toast(readyCount());
    toolToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toolToast.classList.remove('show'), 4200);
  });

  // Show the spreadsheet first; convert it the first time the demo is on screen.
  build(current);
  if ('IntersectionObserver' in window) {
    const demoObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        demoObserver.disconnect();
        play(current);
      }
    }, { threshold: 0.35 });
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
