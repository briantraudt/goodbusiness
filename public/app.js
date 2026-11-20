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
  jobs: {
    file: 'Jobs_FINAL_v3 (2).xlsx',
    title: 'Jobs',
    outcome: 'Every finished job invoiced the same day',
    cols: ['Customer', 'Tech', 'Status', 'Amount'],
    statuses: ['Scheduled', 'In progress', 'Done'],
    ready: 'Done',
    statLabel: 'Ready to invoice',
    countLabel: 'Jobs done',
    action: (n) => (n === 1 ? 'Invoice 1 finished job' : `Invoice ${n} finished jobs`),
    toast: (n) => `${n} invoice${n === 1 ? '' : 's'} sent. Nobody opened the spreadsheet.`,
    rows: [
      ['R. Alvarez', 'Marcus', 'Done', 445.5],
      ['Hill Country Dental', 'Tina', 'Done', 1280],
      ['J. Whitfield', 'Marcus', 'Scheduled', 310],
      ['Oak Ridge HOA', 'Dev', 'Done', 2150],
      ['S. Nguyen', 'Tina', 'In progress', 675],
    ],
  },
  loads: {
    file: 'Loads Nov - Copy.xlsx',
    title: 'Loads',
    outcome: 'Billed the hour it delivers',
    cols: ['Shipper', 'Driver', 'Status', 'Amount'],
    statuses: ['Booked', 'In transit', 'Delivered'],
    ready: 'Delivered',
    statLabel: 'Ready to bill',
    countLabel: 'Delivered',
    action: (n) => (n === 1 ? 'Bill 1 delivered load' : `Bill ${n} delivered loads`),
    toast: (n) => `${n} load${n === 1 ? '' : 's'} billed with paperwork attached.`,
    rows: [
      ['Lone Star Supply', 'Whitaker', 'Delivered', 2003.5],
      ['Brazos Steel', 'Okafor', 'In transit', 1640],
      ['Pecos Feed Co', 'Ramirez', 'Delivered', 1185],
      ['Gulf Plastics', 'Whitaker', 'Booked', 2420],
      ['Red River Lumber', 'Tran', 'Delivered', 1760],
    ],
  },
  locations: {
    file: 'Locations weekly (old).xlsx',
    title: 'Locations · Today',
    outcome: 'The owner sees every location before dinner',
    cols: ['Location', 'Manager', 'Status', 'Collected'],
    statuses: ['Open', 'Closed'],
    ready: 'Closed',
    statLabel: 'Collected today',
    countLabel: 'Closed out',
    action: (n) => (n === 1 ? 'Send 1 location to the owner' : `Send ${n} locations to the owner`),
    toast: (n) => `Numbers for ${n} location${n === 1 ? '' : 's'} sent to the owner.`,
    rows: [
      ['North', 'Jenna', 'Closed', 3060],
      ['Downtown', 'Priya', 'Closed', 4215],
      ['Lakeside', 'Marco', 'Open', 2380],
      ['West', 'Dana', 'Closed', 1975],
      ['Round Rock', 'Sam', 'Open', 2840],
    ],
  },
};

const sheetGrid = document.querySelector('#sheet-grid');
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
let current = 'jobs';
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
  const shown = toolBody.querySelectorAll('.rec.in');
  let total = 0;
  shown.forEach((rec) => {
    if (rec.querySelector('.status').classList.contains('ready')) {
      total += parseFloat(rec.querySelector('input').value) || 0;
    }
  });
  const count = readyCount();
  statTotal.textContent = money.format(total);
  statCount.textContent = `${count} of ${shown.length}`;
  toolSend.textContent = sheet.action(count);
  toolSend.disabled = playing || count === 0;
}

function build(key) {
  const sheet = SHEETS[key];
  current = key;
  sheetFile.textContent = sheet.file;
  sheetFx.textContent = `=SUMIF(C2:C${sheet.rows.length + 1},"${sheet.ready}",D2:D${sheet.rows.length + 1})`;
  toolTitle.textContent = sheet.title;
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
    [String(index + 2), name, who, status, amount.toFixed(2)].forEach((text) => row.append(el('span', '', text)));
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
