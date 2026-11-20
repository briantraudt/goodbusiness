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

// Icons are drawn for this page. Each company below has its own set and style.
const CHROME = {
  back: '<path d="M15 6l-6 6 6 6"/>',
  forward: '<path d="M9 6l6 6-6 6"/>',
  reload: '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  dots: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
};
const ICONS = {
  // Northside: solid, square, blunt
  nsMark: '<rect width="24" height="24" fill="#12233f"/><path d="M7 17.5V6.5l10 11v-11" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="miter"/>',
  nsOverdue: '<path d="M12 2.5l10.5 19h-21z" fill="currentColor"/><path d="M12 9.5v5.5" stroke="#fff" stroke-width="2.2"/><rect x="10.9" y="17" width="2.2" height="2.2" fill="#fff"/>',
  nsSent: '<rect x="3" y="3" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 16l8-8M10.5 8H16v5.5" fill="none" stroke="currentColor" stroke-width="2"/>',
  nsPaid: '<rect x="2.5" y="2.5" width="19" height="19" fill="currentColor"/><path d="M7 12.5l3.5 3.5L17.5 8" fill="none" stroke="#fff" stroke-width="2.4"/>',
  // Harlow & Pine: fine line, drawn by hand
  hpMark: '<rect width="24" height="24" rx="12" fill="#20302a"/><path d="M8 6.5v11M16 6.5v11M8 12c3-1.6 5-1.6 8 0" fill="none" stroke="#d9a27f" stroke-width="1.5" stroke-linecap="round"/>',
  hpOverview: '<path d="M3 18.5h18M6 18.5a6 6 0 0 1 12 0"/><path d="M12 6v2.6M5.6 9l1.9 1.9M18.4 9l-1.9 1.9"/>',
  hpQuotes: '<path d="M6.5 3.5h8.5l3.5 3.5v13.5h-12z"/><path d="M9.5 11.5h6M9.5 15h3.5"/><circle cx="16" cy="15.6" r="0.9" fill="currentColor" stroke="none"/>',
  hpClients: '<circle cx="9.2" cy="12" r="5.2"/><circle cx="14.8" cy="12" r="5.2"/>',
  hpJobs: '<path d="M4 19.5L19.5 4v15.5z"/><path d="M12.5 19.5v-2.8M16 19.5v-4.6"/>',
  hpReports: '<path d="M4 19.5h4v-4.5h4v-4.5h4V6h4"/>',
  hpQuiet: '<path d="M19 14.6A8 8 0 0 1 9.4 5 7.3 7.3 0 1 0 19 14.6z"/>',
  hpSent: '<path d="M4 11.5L20 5l-5.5 15.5-2.8-6.2z"/><path d="M11.7 14.3L20 5"/>',
  hpWon: '<path d="M4.5 13l4.8 4.8L19.5 6.5"/><circle cx="19.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
  // Ember & Oak: one flame, cut from a circle
  eoMark: '<rect width="24" height="24" rx="6" fill="#3ddc84"/><path d="M12 4.5c3.6 3 5.2 5.4 5.2 8.3a5.2 5.2 0 0 1-10.4 0c0-1.6.7-2.9 1.9-4 .2 1.6.9 2.5 1.9 2.9-.4-2.8.1-5.1 1.4-7.2z" fill="#0c1014"/>',
  // Bayline: heavy, square-cut
  blHome: '<path d="M4 11l8-7 8 7"/><path d="M7 10.5V20h10v-9.5"/>',
  blTime: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12h4"/>',
  blTeam: '<path d="M6 20v-5.5M12 20v-9M18 20v-5.5"/><rect x="4.6" y="8.2" width="2.8" height="2.8" fill="currentColor" stroke="none"/><rect x="10.6" y="3.6" width="2.8" height="2.8" fill="currentColor" stroke="none"/><rect x="16.6" y="8.2" width="2.8" height="2.8" fill="currentColor" stroke="none"/>',
  blMore: '<path d="M5 7h14M5 12h14M5 17h8"/>',
  blApproved: '<path d="M4 12.5l5 5L20 6"/>',
  blSubmitted: '<path d="M12 15V4.5M7 9l5-5 5 5M5 20h14"/>',
  blMissing: '<path d="M5 12h3M10.5 12h3M16 12h3"/>',
};
const svg = (name, set = ICONS) => `<svg viewBox="0 0 24 24" aria-hidden="true">${set[name]}</svg>`;

const pct = (part, whole) => (whole ? Math.round((part / whole) * 100) : 0);

const SHEETS = {
  locations: {
    kind: 'dash',
    outcome: 'Every location\'s profit, every morning',
    leftCap: 'Three systems that don\'t talk to each other',
    sources: [
      { type: 'pos', title: 'Point of sale', note: 'Sales by location', head: ['Location', 'Net sales'], key: 'sales' },
      { type: 'csv', title: 'payroll_export_nov.csv', note: 'Payroll provider', head: ['location', 'gross_pay'], key: 'labor' },
      { type: 'xls', title: 'Rent and overhead (v4).xlsx', note: 'Spreadsheet', head: ['Location', 'Overhead'], key: 'overhead' },
    ],
    rows: [
      { name: 'Downtown', sales: 184200, labor: 62600, overhead: 71900 },
      { name: 'Riverside', sales: 156800, labor: 56400, overhead: 66300 },
      { name: 'Northgate', sales: 131500, labor: 51300, overhead: 61800 },
      { name: 'Lakeline', sales: 98400, labor: 45300, overhead: 49200 },
    ],
  },
  invoices: {
    kind: 'ledger',
    source: 'db',
    leftCap: 'A database query someone runs every Monday',
    outcome: 'Every overdue invoice chased, automatically',
    cols: ['Customer', 'Due', 'Status', 'Amount'],
    statuses: ['Sent', 'Overdue', 'Paid'],
    tones: { Sent: 'blue', Overdue: 'red', Paid: 'green' },
    icons: { Sent: 'nsSent', Overdue: 'nsOverdue', Paid: 'nsPaid' },
    ready: 'Overdue',
    kpis: (all, ready) => [
      { label: 'Overdue', value: cash.format(sum(ready)), sub: plural(ready.length, 'invoice', 'invoices'), tone: 'red' },
      { label: 'Not yet due', value: cash.format(sum(all.filter((row) => row.status === 'Sent'))), sub: 'Inside terms' },
      { label: 'Collected', value: cash.format(sum(all.filter((row) => row.status === 'Paid'))), sub: 'This month' },
    ],
    bar: (all) => [
      { label: 'Overdue', value: sum(all.filter((row) => row.status === 'Overdue')), color: '#c22a1f' },
      { label: 'Not yet due', value: sum(all.filter((row) => row.status === 'Sent')), color: '#12233f' },
      { label: 'Collected', value: sum(all.filter((row) => row.status === 'Paid')), color: '#aab2bd' },
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
    kind: 'studio',
    source: 'mail',
    leftCap: 'Follow-ups tracked by scrolling the Sent folder',
    mail: ['Sent Nov 6 · no reply', 'Nov 12 · "Let\'s go ahead"', 'Sent Oct 30 · no reply', 'Sent yesterday', 'Sent Nov 3 · no reply'],
    outcome: 'No quote goes quiet',
    cols: ['Client', 'Designer', 'Status', 'Value'],
    statuses: ['Sent', 'No reply', 'Won'],
    tones: { Sent: '', 'No reply': 'amber', Won: 'green' },
    icons: { Sent: 'hpSent', 'No reply': 'hpQuiet', Won: 'hpWon' },
    ready: 'No reply',
    kpis: (all, ready) => [
      { label: `gone quiet across ${plural(ready.length, 'quote', 'quotes')}`, value: cash.format(sum(ready)) },
      { label: 'still open', value: cash.format(sum(all.filter((row) => row.status !== 'Won'))) },
      { label: 'won this month', value: cash.format(sum(all.filter((row) => row.status === 'Won'))) },
    ],
    action: (n) => (n ? `Follow up on ${n}` : 'Nothing to chase'),
    toast: (n) => `${plural(n, 'follow-up', 'follow-ups')} sent. Replies go straight to the designer.`,
    rows: [
      ['The Marsh kitchen', 'Tina', 'No reply', 18400],
      ['Pecan Row Cafe bar', 'Marcus', 'Won', 6250],
      ['Ellery library wall', 'Tina', 'No reply', 31200],
      ['Fenn mudroom', 'Dev', 'Sent', 9800],
      ['Okoro primary bath', 'Marcus', 'No reply', 12750],
    ],
  },
  hours: {
    kind: 'phone',
    source: 'chat',
    leftCap: 'Hours texted in to a group chat',
    chat: ['40 this week', '44.5. Had the Laredo run Thursday', '38 I think? Will confirm', null, '41'],
    outcome: 'Payroll ready by Friday noon',
    cols: ['Employee', 'Role', 'Status', 'Hours'],
    statuses: ['Missing', 'Submitted', 'Approved'],
    tones: { Missing: 'red', Submitted: '', Approved: 'green' },
    icons: { Missing: 'blMissing', Submitted: 'blSubmitted', Approved: 'blApproved' },
    ready: 'Approved',
    hours: true,
    kpis: (all, ready) => [
      { label: 'hours approved this week', value: `${Math.round(sum(ready) * 10) / 10}` },
    ],
    action: (n) => (n ? `Send ${n} to payroll` : 'Nothing approved yet'),
    toast: (n) => `${plural(n, 'timesheet', 'timesheets')} sent to payroll. No re-keying.`,
    rows: [
      ['Jenna M.', 'Dispatch', 'Approved', 40],
      ['Marco D.', 'Driver', 'Approved', 44.5],
      ['Priya S.', 'Dock lead', 'Submitted', 38],
      ['Sam T.', 'Driver', 'Missing', 0],
      ['Dana K.', 'Driver', 'Approved', 41],
    ],
  },
};

// Shell markup is built from the fixed config above, never from visitor input.
const browser = (mark, title, host, path) => `
    <div class="br-top" aria-hidden="true"><span class="lights"><i></i><i></i><i></i></span><span class="br-tab">${svg(mark)}<span>${title}</span><b>×</b></span><span class="br-plus">+</span></div>
    <div class="br-bar" aria-hidden="true"><span class="br-nav">${svg('back', CHROME)}${svg('forward', CHROME)}${svg('reload', CHROME)}</span><span class="br-url">${svg('lock', CHROME)}<em>${host}<span>${path}</span></em></span>${svg('dots', CHROME)}</div>`;

const SHELLS = {
  dash: () => `${browser('eoMark', 'Locations · Ember & Oak', 'emberandoak.goodbusinesshq.com', '/locations')}
    <div class="app">
      <div class="db-top"><span class="db-brand">${svg('eoMark')}Ember &amp; Oak Kitchens</span><span class="db-range">NOV 1 – 20 · 4 LOCATIONS</span></div>
      <div class="db-main">
        <div class="db-head"><h4 data-title>All locations</h4><small>Sales, payroll and overhead in one view</small></div>
        <div class="app-kpis" data-kpis></div>
        <div>
          <div class="db-legend"><b>Where each dollar goes</b><span><i style="background:var(--labor)"></i>Labor</span><span><i style="background:var(--over)"></i>Overhead</span><span><i style="background:var(--profit)"></i>Profit</span></div>
          <div data-body></div>
        </div>
        <p class="db-note" data-note></p>
      </div>
    </div>`,
  ledger: (sheet) => `${browser('nsMark', 'Receivables | Northside Mechanical', 'northside.goodbusinesshq.com', '/receivables')}
    <div class="app">
      <div class="lg-top"><span class="lg-brand">${svg('nsMark')}Northside Mechanical</span><span class="lg-nav" aria-hidden="true"><span>Jobs</span><span class="on">Receivables</span><span>Customers</span><span>Reports</span></span><span class="lg-user" aria-hidden="true">Dana Kim</span></div>
      <div class="lg-main">
        <div class="lg-head"><div><h4>Receivables</h4><small>All open invoices, as of today</small></div><button type="button" class="app-primary" data-send></button></div>
        <div class="app-kpis" data-kpis></div>
        <div class="app-bar" data-bar></div>
        <div>
          <div class="app-th">${sheet.cols.map((col) => `<span>${col}</span>`).join('')}</div>
          <div data-body></div>
        </div>
        <div class="lg-foot"><span data-count></span><span>Synced from accounting 2 min ago</span></div>
      </div>
    </div>`,
  studio: (sheet) => `${browser('hpMark', 'Quotes · Harlow & Pine', 'harlowpine.goodbusinesshq.com', '/quotes')}
    <div class="app">
      <aside class="st-side" aria-hidden="true">
        <div class="st-word">Harlow <em>&amp;</em> Pine</div>
        <nav><span>${svg('hpOverview')}Overview</span><span class="on">${svg('hpQuotes')}Quotes</span><span>${svg('hpClients')}Clients</span><span>${svg('hpJobs')}Shop jobs</span><span>${svg('hpReports')}Reports</span></nav>
        <div class="st-user"><b>Tina Okafor</b>Lead designer</div>
      </aside>
      <div class="st-main">
        <div class="st-head"><div><h4>Quotes</h4><small>Custom cabinetry and millwork</small></div><button type="button" class="app-primary" data-send></button></div>
        <div class="app-kpis" data-kpis></div>
        <div data-body></div>
        <div class="st-foot" data-count></div>
      </div>
    </div>`,
  phone: () => `
    <div class="ph-status" aria-hidden="true"><b>9:41</b><i></i><em></em></div>
    <div class="app">
      <div class="ph-head">Bayline Freight<span>Week of Nov 16</span></div>
      <div class="app-kpis" data-kpis></div>
      <div class="ph-prog" data-prog aria-hidden="true"></div>
      <div class="ph-progtext" data-count></div>
      <div class="ph-list" data-body></div>
      <div class="ph-cta"><button type="button" class="app-primary" data-send></button></div>
      <nav class="ph-tabs" aria-hidden="true"><span>${svg('blHome')}Home</span><span class="on">${svg('blTime')}Hours</span><span>${svg('blTeam')}Crew</span><span>${svg('blMore')}More</span></nav>
    </div>`,
};
const shell = (sheet) => `${SHELLS[sheet.kind](sheet)}<p class="tool-toast" role="status" aria-live="polite" data-toast></p>`;

const sheetCap = document.querySelector('#sheet-cap');
const sourcesBox = document.querySelector('#sources');
const toolWindow = document.querySelector('#tool-window');
const toolOutcome = document.querySelector('#tool-outcome');
const stage = document.querySelector('#demo-stage');
const tabs = [...document.querySelectorAll('.demo-tabs [role="tab"]')];
let current = 'locations';
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
let dashSelected = -1;

function recalcDash() {
  const sheet = SHEETS[current];
  const recs = [...toolBody.querySelectorAll('.db-row')];
  const shown = sheet.rows.filter((_, index) => recs[index].classList.contains('in'));
  recs.forEach((rec, index) => {
    rec.classList.toggle('sel', index === dashSelected);
    rec.classList.toggle('dim', dashSelected >= 0 && index !== dashSelected);
    rec.setAttribute('aria-pressed', String(index === dashSelected));
  });
  const scope = dashSelected >= 0 ? [sheet.rows[dashSelected]] : shown;
  const total = (key) => scope.reduce((value, row) => value + row[key], 0);
  const sales = total('sales');
  const profit = sales - total('labor') - total('overhead');
  toolWindow.querySelector('[data-title]').textContent = dashSelected >= 0 ? sheet.rows[dashSelected].name : 'All locations';
  toolKpis.replaceChildren(...[
    { label: 'Sales', value: cash.format(sales), sub: 'From point of sale' },
    { label: 'Labor', value: `${pct(total('labor'), sales)}%`, sub: 'Of sales · payroll' },
    { label: 'Overhead', value: `${pct(total('overhead'), sales)}%`, sub: 'Of sales · sheet' },
    { label: 'Profit', value: cash.format(profit), sub: `${pct(profit, sales)}% margin`, tone: 'green' },
  ].map((kpi) => {
    const card = el('div', `kpi ${kpi.tone || ''}`);
    card.append(el('span', '', kpi.label), el('b', '', kpi.value), el('small', '', kpi.sub));
    return card;
  }));

  const note = toolWindow.querySelector('[data-note]');
  if (shown.length < sheet.rows.length) {
    note.textContent = 'Matching each location across the three systems…';
    return;
  }
  const margin = (row) => pct(row.sales - row.labor - row.overhead, row.sales);
  const groupLabor = pct(sheet.rows.reduce((v, r) => v + r.labor, 0), sheet.rows.reduce((v, r) => v + r.sales, 0));
  const focus = dashSelected >= 0 ? sheet.rows[dashSelected] : sheet.rows.reduce((low, row) => (margin(row) < margin(low) ? row : low));
  const labor = pct(focus.labor, focus.sales);
  const gap = labor - groupLabor;
  note.replaceChildren(
    el('b', '', `${focus.name} keeps ${margin(focus)}¢ of every dollar it sells. `),
    document.createTextNode(gap > 0
      ? `Labor there runs at ${labor}% of sales, ${plural(gap, 'point', 'points')} above the group.`
      : `Labor there runs at ${labor}% of sales, ${gap === 0 ? 'level with' : `${plural(-gap, 'point', 'points')} below`} the group.`),
  );
}

function buildDash(sheet) {
  dashSelected = -1;
  const maxSales = Math.max(...sheet.rows.map((row) => row.sales));
  const sourceRows = sheet.rows.map(() => []);
  sourcesBox.replaceChildren(...sheet.sources.map((source) => {
    const box = el('div', `src src-${source.type}`);
    const bar = el('div', 'src-bar');
    bar.append(el('b', '', source.title), el('span', '', source.note));
    const rows = el('div', 'src-rows');
    const line = (cells, className) => {
      const row = el('div', `src-row ${className}`);
      if (source.type === 'csv') row.textContent = cells.join(',');
      else cells.forEach((cell) => row.append(el('span', '', cell)));
      rows.append(row);
      return row;
    };
    line(source.head, 'src-head');
    sheet.rows.forEach((data, index) => {
      const value = source.type === 'pos' ? cash.format(data[source.key]) : data[source.key].toFixed(2);
      sourceRows[index].push(line([data.name, value], ''));
    });
    box.append(bar, rows);
    return box;
  }));

  return sheet.rows.map((data, index) => {
    const profit = data.sales - data.labor - data.overhead;
    const rec = el('button', 'db-row field');
    rec.type = 'button';
    const track = el('span', 'db-track');
    const fill = el('span', 'db-fill');
    [['labor', data.labor], ['over', data.overhead], ['profit', profit]].forEach(([name, value]) => {
      const part = el('i');
      part.style.width = `${(value / data.sales) * 100}%`;
      part.style.background = `var(--${name})`;
      fill.append(part);
    });
    fill.dataset.width = `${(data.sales / maxSales) * 100}%`;
    track.append(fill);
    rec.append(el('b', '', data.name), track, el('span', 'db-val', cash.format(profit)), el('span', 'db-pct', `${pct(profit, data.sales)}%`));
    rec.addEventListener('click', () => {
      dashSelected = dashSelected === index ? -1 : index;
      recalcDash();
    });
    toolBody.append(rec);
    return [sourceRows[index], rec];
  });
}

// Left side: where this data lives today. One renderer per kind of source.
function renderSource(sheet) {
  const box = el('div', `src src-${sheet.source}`);
  const rows = [];
  if (sheet.source === 'db') {
    const bar = el('div', 'src-bar');
    bar.append(el('b', '', 'office_db · Query1'), el('span', '', 'Database'));
    const sql = el('pre', 'db-sql');
    sql.innerHTML = '<i>SELECT</i> customer, due_date, status, balance\n<i>FROM</i> invoices\n<i>WHERE</i> balance &gt; 0 <i>OR</i> paid_on &gt;= \'2026-11-01\'\n<i>ORDER BY</i> invoice_id;';
    const grid = el('div', 'db-grid');
    const line = (cells, className) => {
      const row = el('div', `src-row ${className}`);
      cells.forEach((cell) => row.append(el('span', '', cell)));
      grid.append(row);
      return row;
    };
    line(['customer', 'due_date', 'status', 'balance'], 'src-head');
    sheet.rows.forEach(([name, due, status, amount]) => {
      const month = due.startsWith('Oct') ? '10' : '11';
      rows.push(line([name.toUpperCase(), `2026-${month}-${due.split(' ')[1].padStart(2, '0')}`, status.toUpperCase().slice(0, 4), amount.toFixed(2)], ''));
    });
    box.append(bar, sql, grid, el('div', 'db-foot', `${sheet.rows.length} rows returned · 0.02 sec`));
  } else if (sheet.source === 'mail') {
    const bar = el('div', 'src-bar');
    bar.append(el('b', '', 'Sent'), el('span', '', 'Email'));
    const list = el('div', 'mail-list');
    sheet.rows.forEach(([name, who, , amount], index) => {
      const row = el('div', 'src-row');
      const text = el('div');
      text.append(el('b', '', `Quote: ${name}`), el('small', '', `${who} sent a quote for ${cash.format(amount)}. "Let me know if you have any questions…"`));
      row.append(text, el('span', '', sheet.mail[index]));
      list.append(row);
      rows.push(row);
    });
    box.append(bar, list);
  } else {
    const bar = el('div', 'src-bar');
    bar.append(el('b', '', 'Crew hours'), el('span', '', 'Group text · 6 people'));
    const thread = el('div', 'chat-thread');
    thread.append(el('p', 'chat-me', 'Need everyone\'s hours by noon for payroll'));
    sheet.rows.forEach(([name], index) => {
      const said = sheet.chat[index];
      const row = el('div', `src-row ${said ? '' : 'chat-mine'}`);
      if (said) row.append(el('small', '', name), el('p', '', said));
      else row.append(el('p', 'chat-me', `${name.split(' ')[0]}, still need yours`));
      thread.append(row);
      rows.push(row);
    });
    box.append(bar, thread);
  }
  sourcesBox.replaceChildren(box);
  return rows;
}

function snapshot() {
  return [...toolBody.querySelectorAll('.rec.in')].map((rec) => ({
    status: rec.querySelector('.badge').dataset.status,
    amount: Number(rec.dataset.amount),
  }));
}

function recalc() {
  const sheet = SHEETS[current];
  if (sheet.kind === 'dash') { recalcDash(); return; }
  const all = snapshot();
  const ready = all.filter((row) => row.status === sheet.ready);
  toolKpis.replaceChildren(...sheet.kpis(all, ready).map((kpi) => {
    const card = el('div', `kpi ${kpi.tone || ''}`);
    card.append(el('span', '', kpi.label), el('b', '', kpi.value), el('small', '', kpi.sub));
    return card;
  }));
  if (toolCount) {
    toolCount.textContent = sheet.kind === 'phone'
      ? `${ready.length} of ${all.length} timesheets approved`
      : `${plural(all.length, sheet.kind === 'studio' ? 'quote' : 'invoice', sheet.kind === 'studio' ? 'quotes' : 'invoices')} shown`;
  }
  const bar = toolWindow.querySelector('[data-bar]');
  if (bar && sheet.bar) {
    const parts = sheet.bar(all);
    const track = el('div');
    const legend = el('p');
    parts.forEach((part) => {
      const segment = el('i');
      segment.style.flexGrow = String(part.value);
      segment.style.background = part.color;
      track.append(segment);
      const item = el('span');
      const swatch = el('i');
      swatch.style.background = part.color;
      item.append(swatch, document.createTextNode(`${part.label} ${cash.format(part.value)}`));
      legend.append(item);
    });
    bar.replaceChildren(track, legend);
  }
  const prog = toolWindow.querySelector('[data-prog]');
  if (prog) prog.replaceChildren(...sheet.rows.map((_, index) => el('i', index < ready.length ? 'on' : '')));
  toolSend.textContent = sheet.action(ready.length);
  toolSend.disabled = playing || ready.length === 0;
}

function build(key) {
  const sheet = SHEETS[key];
  current = key;
  const isDash = sheet.kind === 'dash';
  sheetCap.textContent = sheet.leftCap;
  toolOutcome.textContent = sheet.outcome;

  toolWindow.className = `tool-window k-${sheet.kind}${sheet.kind === 'phone' ? ' is-phone' : ''}`;
  toolWindow.innerHTML = shell(sheet);
  toolBody = toolWindow.querySelector('[data-body]');
  toolSend = toolWindow.querySelector('[data-send]');
  toolToast = toolWindow.querySelector('[data-toast]');
  toolKpis = toolWindow.querySelector('[data-kpis]');
  toolCount = toolWindow.querySelector('[data-count]');
  if (isDash) {
    const dashPairs = buildDash(sheet);
    recalc();
    return dashPairs;
  }
  toolSend.addEventListener('click', () => {
    const count = snapshot().filter((row) => row.status === sheet.ready).length;
    toolToast.textContent = sheet.toast(count);
    toolToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toolToast.classList.remove('show'), 3800);
  });

  const sourceRows = renderSource(sheet);

  const pairs = sheet.rows.map(([name, who, status, amount], index) => {
    const row = sourceRows[index];

    const rec = el('div', 'rec field');
    rec.dataset.amount = amount;
    const label = el('div', 'rec-name');
    label.append(el('b', '', name), el('small', '', who));
    const badge = el('button', `badge ${sheet.tones[status] || ''}`);
    badge.type = 'button';
    const paint = (value) => {
      badge.className = `badge ${sheet.tones[value] || ''}`;
      badge.dataset.status = value;
      badge.innerHTML = svg(sheet.icons[value]);
      badge.append(el('span', '', value));
      badge.setAttribute('aria-label', `${name}: ${value}. Click to change.`);
    };
    paint(status);
    badge.addEventListener('click', () => {
      paint(sheet.statuses[(sheet.statuses.indexOf(badge.dataset.status) + 1) % sheet.statuses.length]);
      recalc();
    });
    rec.append(label, el('span', 'rec-who', who), badge, el('span', 'rec-amt', sheet.hours ? String(amount) : cash.format(amount)));
    toolBody.append(rec);
    return [row, rec];
  });

  recalc();
  return pairs;
}

async function play(key, instant = false) {
  const id = ++runId;
  playing = true;
  const pairs = build(key);
  const step = instant || reducedMotion ? 0 : 280;
  if (step) await wait(350);
  for (const [source, rec] of pairs) {
    const rows = [].concat(source);
    if (id !== runId) return;
    rows.forEach((row) => row.classList.add('read'));
    if (step) await wait(rows.length > 1 ? step * 1.6 : step);
    if (id !== runId) return;
    rows.forEach((row) => { row.classList.remove('read'); row.classList.add('done'); });
    rec.classList.add('in');
    const fill = rec.querySelector('.db-fill');
    if (fill) requestAnimationFrame(() => { fill.style.width = fill.dataset.width; });
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

if (sourcesBox && toolWindow) {
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

  // Show the source first; convert it the first time the demo is on screen.
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
    formNote.textContent = 'Thanks. I’ll reply within one business day to set up a call.';
  } catch (error) {
    formNote.textContent = error instanceof Error && error.message ? error.message : fallback;
  } finally {
    label.textContent = original;
    submitButton.disabled = false;
  }
});
