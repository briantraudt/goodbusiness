const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

requestAnimationFrame(() => document.documentElement.classList.add('loaded'));

/* Header rule on scroll */
const header = document.querySelector('#site-header');
const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 12);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Paper-to-tool demo (sample data, runs in the browser) ---------- */
const FORMS = {
  workorder: {
    paper: 'Work order',
    title: 'Work order #1042',
    outcome: 'Invoiced before the truck leaves',
    send: 'Send invoice',
    toast: 'Invoice sent to the customer. Same day, no re-typing.',
    fields: [
      ['Customer', 'R. Alvarez'],
      ['Address', '412 Pecan St'],
      ['Job', 'AC not cooling'],
      ['Tech', 'Marcus'],
    ],
    items: [
      ['Labor (hrs)', 3.5, 95],
      ['Capacitor', 1, 48],
      ['Trip charge', 1, 65],
    ],
  },
  load: {
    paper: 'Load sheet',
    title: 'Load #88213',
    outcome: 'Billed the hour it delivers',
    send: 'Bill this load',
    toast: 'Load billed and paperwork attached. Nothing to chase.',
    fields: [
      ['Shipper', 'Lone Star Supply'],
      ['Lane', 'Austin to El Paso'],
      ['Driver', 'D. Whitaker'],
      ['Delivered', 'Thu 2:10 PM'],
    ],
    items: [
      ['Line haul (mi)', 576, 2.85],
      ['Fuel surcharge', 576, 0.42],
      ['Detention (hrs)', 2, 60],
    ],
  },
  daysheet: {
    paper: 'Day sheet',
    title: 'Front desk · Today',
    outcome: 'Closed out before the lights go off',
    send: 'Close the day',
    toast: 'Day closed. The owner already has the numbers.',
    fields: [
      ['Location', 'North clinic'],
      ['Date', 'Thursday'],
      ['Front desk', 'Jenna'],
      ['Providers in', '4'],
    ],
    items: [
      ['Sessions', 22, 120],
      ['Co-pays collected', 14, 30],
      ['Late cancel fees', 2, 45],
    ],
  },
};

const paperSheet = document.querySelector('#paper-sheet');
const toolBody = document.querySelector('#tool-body');
const toolTitle = document.querySelector('#tool-title');
const toolOutcome = document.querySelector('#tool-outcome');
const toolTotal = document.querySelector('#tool-total');
const toolSend = document.querySelector('#tool-send');
const toolToast = document.querySelector('#tool-toast');
const stage = document.querySelector('#demo-stage');
const tabs = [...document.querySelectorAll('.demo-tabs [role="tab"]')];
let current = 'workorder';
let runId = 0;
let toastTimer;

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function recalc() {
  let total = 0;
  toolBody.querySelectorAll('.item').forEach((row) => {
    const [qty, rate] = row.querySelectorAll('input');
    const line = (parseFloat(qty.value) || 0) * (parseFloat(rate.value) || 0);
    row.querySelector('output').textContent = money.format(line);
    if (row.classList.contains('in')) total += line;
  });
  toolTotal.textContent = money.format(total);
}

function build(key) {
  const form = FORMS[key];
  paperSheet.replaceChildren(el('p', 'paper-title', form.paper));
  toolBody.replaceChildren();
  toolTitle.textContent = form.title;
  toolOutcome.textContent = form.outcome;
  toolSend.textContent = form.send;
  toolSend.disabled = true;
  toolToast.classList.remove('show');
  toolToast.textContent = '';

  const grid = el('div', 'tool-grid');
  const pairs = [];

  form.fields.forEach(([label, value], index) => {
    const line = el('p', 'paper-line');
    line.append(el('small', '', label), document.createTextNode(value));
    paperSheet.append(line);

    const field = el('label', 'field');
    const input = el('input');
    input.type = 'text';
    input.value = value;
    input.name = `field-${index}`;
    field.append(el('span', '', label), input);
    grid.append(field);
    pairs.push([line, field]);
  });
  toolBody.append(grid);

  const head = el('div', 'item-head');
  ['Item', 'Qty', 'Rate', 'Amount'].forEach((text) => head.append(el('span', '', text)));
  toolBody.append(head);

  form.items.forEach(([label, qty, rate], index) => {
    const line = el('p', 'paper-line');
    line.append(el('small', '', label), document.createTextNode(`${qty} x ${rate}`));
    paperSheet.append(line);

    const row = el('div', 'item field');
    const qtyInput = el('input');
    const rateInput = el('input');
    [[qtyInput, qty, 'Quantity'], [rateInput, rate, 'Rate']].forEach(([input, value, name]) => {
      input.type = 'number';
      input.inputMode = 'decimal';
      input.step = 'any';
      input.min = '0';
      input.value = value;
      input.setAttribute('aria-label', `${label} ${name.toLowerCase()}`);
      input.name = `${name.toLowerCase()}-${index}`;
      input.addEventListener('input', recalc);
    });
    row.append(el('span', '', label), qtyInput, rateInput, el('output', '', '$0.00'));
    toolBody.append(row);
    pairs.push([line, row]);
  });

  recalc();
  return pairs;
}

async function play(key, instant = false) {
  const id = ++runId;
  current = key;
  const pairs = build(key);
  const step = instant || reducedMotion ? 0 : 230;
  if (step) await wait(350);
  for (const [line, field] of pairs) {
    if (id !== runId) return;
    line.classList.add('read');
    if (step) await wait(step);
    if (id !== runId) return;
    line.classList.add('done');
    field.classList.add('in');
    recalc();
  }
  toolSend.disabled = false;
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

if (paperSheet && toolBody) {
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
    toolToast.textContent = FORMS[current].toast;
    toolToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toolToast.classList.remove('show'), 4200);
  });

  // Show the paper first; convert it the first time the demo is on screen.
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
