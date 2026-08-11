/* ---- Coordinators and default PINs. Change these before real use. ---- */
const COORD_PINS = {
  'Mrs.Lakmali': '3030',
  'Ms.Sajini': '6060',
  'Dinithi': '8080',
  'Tharusha': '5050',
  'Ruchira': '4040',
  'Nirmala': '1010',
  'Sumudu': '2020'
};
const VIEW_ONLY = ['Mrs.Lakmali', 'Ms.Sajini'];
const COORDS = Object.keys(COORD_PINS);
const ENTRY_COORDS = COORDS.filter(c => !VIEW_ONLY.includes(c));
const DEPTS = [
  'Accounts Theory',
  'Accounts Practical',
  'Accounts Course',
  'Tax 1day Workshop',
  'HR 5days Workshop',
  'Company Registration',
  'Form 39',
  'Form 12',
  'Form 13',
  'Form 6',
  'Form 3'
];

let currentUser = sessionStorage.getItem('mdt_user') || '';
let editingId = null;
let editingCoordinator = '';

function isViewer(){
  return VIEW_ONLY.includes(currentUser);
}

function fillSelect(id, arr){
  const sel = document.getElementById(id);
  arr.forEach(v=>{
    const o = document.createElement('option');
    o.value = v; o.textContent = v;
    sel.appendChild(o);
  });
}
fillSelect('loginCoord', COORDS);
fillSelect('coord', ENTRY_COORDS);
fillSelect('filterCoord', ENTRY_COORDS);
fillSelect('filterDept', DEPTS);

function applyRoleUI(){
  const viewer = isViewer();
  const formCard = document.getElementById('entryFormCard');
  const tabEntry = document.getElementById('tabEntry');
  const title = document.getElementById('teamDetailsTitle');
  const desc = document.getElementById('teamDetailsDesc');
  const headerSub = document.querySelector('.brand-row .sub');

  if(formCard) formCard.style.display = viewer ? 'none' : '';
  if(tabEntry) tabEntry.textContent = viewer ? 'Team Details' : 'Daily Entry';
  if(title) title.textContent = viewer ? 'Team Full Details' : 'My Entries';
  if(desc){
    desc.textContent = viewer
      ? 'Full details for Dinithi, Tharusha, Ruchira, Nirmala, and Sumudu.'
      : 'Your saved entries — stays after refresh.';
  }
  if(headerSub){
    headerSub.textContent = viewer
      ? 'View team numbers — dashboard updates for everyone.'
      : 'Log Daily Numbers — The Dashboard Updates for Everyone.';
  }
}

function showApp(){
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('whoamiName').textContent = currentUser;
  const avatar = document.getElementById('userAvatar');
  if(avatar) avatar.textContent = (currentUser || '?').charAt(0).toUpperCase();
  applyRoleUI();
  if(!isViewer()){
    document.getElementById('coord').value = currentUser;
    document.getElementById('entryDate').value = new Date().toISOString().slice(0,10);
  }
  loadRecent();
}

if(currentUser && COORD_PINS[currentUser]){
  showApp();
}

document.getElementById('loginBtn').addEventListener('click', ()=>{
  const name = document.getElementById('loginCoord').value;
  const pin = document.getElementById('loginPin').value.trim();
  const loginMsg = document.getElementById('loginMsg');
  if(!name){
    loginMsg.textContent = 'Please select your name.';
    loginMsg.style.display = 'block';
    return;
  }
  if(COORD_PINS[name] === pin){
    currentUser = name;
    sessionStorage.setItem('mdt_user', name);
    loginMsg.style.display = 'none';
    showApp();
  }else{
    loginMsg.textContent = 'Wrong PIN. Try again.';
    loginMsg.style.display = 'block';
  }
});

document.getElementById('logoutBtn').addEventListener('click', ()=>{
  sessionStorage.removeItem('mdt_user');
  currentUser = '';
  editingId = null;
  editingCoordinator = '';
  document.getElementById('app').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginPin').value = '';
  document.getElementById('loginCoord').value = '';
  applyRoleUI();
});

document.querySelectorAll('.tab').forEach(t=>{
  t.addEventListener('click', ()=>{
    document.querySelectorAll('.tab').forEach(x=>{
      x.classList.remove('active');
      x.setAttribute('aria-selected','false');
    });
    document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    t.setAttribute('aria-selected','true');
    document.getElementById('panel-'+t.dataset.tab).classList.add('active');
    if(t.dataset.tab==='dashboard') loadDashboard();
    if(t.dataset.tab==='entry') loadRecent();
  });
});

function resetForm(){
  editingId = null;
  editingCoordinator = '';
  document.getElementById('editBadge').style.display = 'none';
  document.getElementById('cancelEditBtn').style.display = 'none';
  document.getElementById('submitBtn').textContent = 'Save Entry';
  document.getElementById('entryDate').value = new Date().toISOString().slice(0,10);
  document.getElementById('dept').selectedIndex = 0;
  document.getElementById('coord').value = currentUser;
  ['f_leads','f_answer','f_na','f_pickup','f_payments','f_sure','f_followup','f_rejected'].forEach(id=>document.getElementById(id).value=0);
}

document.getElementById('cancelEditBtn').addEventListener('click', resetForm);

const API = '/api/entries';

async function saveEntry(){
  if(isViewer()){
    alert('View-only accounts cannot save entries.');
    return;
  }
  const id = editingId || ('e' + Date.now() + Math.random().toString(36).slice(2,7));
  const entry = {
    id: id,
    date: document.getElementById('entryDate').value,
    coordinator: editingCoordinator || currentUser,
    department: document.getElementById('dept').value,
    leads: Number(document.getElementById('f_leads').value)||0,
    answer: Number(document.getElementById('f_answer').value)||0,
    na: Number(document.getElementById('f_na').value)||0,
    pickup: Number(document.getElementById('f_pickup').value)||0,
    payments: Number(document.getElementById('f_payments').value)||0,
    sure: Number(document.getElementById('f_sure').value)||0,
    followup: Number(document.getElementById('f_followup').value)||0,
    rejected: Number(document.getElementById('f_rejected').value)||0
  };
  try{
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if(!res.ok) throw new Error('Save failed');
    document.getElementById('saveMsg').style.display='block';
    setTimeout(()=>document.getElementById('saveMsg').style.display='none', 2000);
    resetForm();
    loadRecent();
  }catch(e){
    console.error(e);
    alert('Could not save entry. Is the server running?');
  }
}
document.getElementById('submitBtn').addEventListener('click', saveEntry);

async function deleteEntry(id){
  if(isViewer()) return;
  if(!confirm('Delete this entry?')) return;
  try{
    const res = await fetch(`${API}/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if(!res.ok) throw new Error('Delete failed');
    loadRecent();
  }catch(e){
    console.error(e);
    alert('Could not delete entry.');
  }
}

function editEntry(e){
  if(isViewer()) return;
  if(e.coordinator && e.coordinator !== currentUser) return;
  editingId = e.id;
  editingCoordinator = e.coordinator || currentUser;
  document.getElementById('editBadge').style.display = 'inline-block';
  document.getElementById('cancelEditBtn').style.display = 'block';
  document.getElementById('submitBtn').textContent = 'Update entry';
  document.getElementById('coord').value = editingCoordinator;
  document.getElementById('entryDate').value = e.date || '';
  document.getElementById('dept').value = e.department || DEPTS[0];
  document.getElementById('f_leads').value = e.leads || 0;
  document.getElementById('f_answer').value = e.answer || 0;
  document.getElementById('f_na').value = e.na || 0;
  document.getElementById('f_pickup').value = e.pickup || 0;
  document.getElementById('f_payments').value = e.payments || 0;
  document.getElementById('f_sure').value = e.sure || 0;
  document.getElementById('f_followup').value = e.followup || 0;
  document.getElementById('f_rejected').value = e.rejected || 0;
  document.querySelector('[data-tab="entry"]').click();
  window.scrollTo({top:0, behavior:'smooth'});
}

async function getAllEntries(){
  try{
    const res = await fetch(API);
    if(!res.ok) throw new Error('Load failed');
    const entries = await res.json();
    return Array.isArray(entries) ? entries : [];
  }catch(e){
    console.error(e);
    return [];
  }
}

function staffEntriesOnly(entries){
  return entries.filter(e => ENTRY_COORDS.includes(e.coordinator));
}

async function loadRecent(){
  const box = document.getElementById('recentList');
  box.innerHTML = '<div class="empty">Loading...</div>';
  const all = await getAllEntries();
  const staff = staffEntriesOnly(all);
  const viewer = isViewer();
  /* Staff see only their own rows; viewers see all 5 coordinators */
  const entries = viewer
    ? staff
    : staff.filter(e => e.coordinator === currentUser);

  if(entries.length===0){
    box.innerHTML = `<div class="empty">${viewer ? 'No team entries yet.' : 'No entries yet. Add today\'s numbers above.'}</div>`;
    return;
  }

  const names = viewer
    ? ENTRY_COORDS.filter(name => entries.some(e => e.coordinator === name))
    : [currentUser];

  let html = '';
  names.forEach(name=>{
    const rows = entries
      .filter(e => e.coordinator === name)
      .slice()
      .sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    if(rows.length === 0) return;
    html += `<div class="coord-block">
      <p class="coord-block-name">${name}</p>
      <div class="table-scroll">
      <table>
        <tr>
          <th>Date</th><th>NLSC / COMPANY</th><th>Leads</th><th>Pickup</th>
          <th>Answer</th><th>N/A</th><th>Payments</th><th>Sure</th><th>Follow up</th><th>Rejected</th>
          ${viewer ? '' : '<th></th>'}
        </tr>`;
    rows.forEach(e=>{
      html += `<tr>
        <td>${e.date||''}</td>
        <td>${e.department||''}</td>
        <td>${e.leads||0}</td>
        <td>${e.pickup||0}</td>
        <td>${e.answer||0}</td>
        <td>${e.na||0}</td>
        <td>${e.payments||0}</td>
        <td>${e.sure||0}</td>
        <td>${e.followup||0}</td>
        <td>${e.rejected||0}</td>
        ${viewer ? '' : `<td>
          <div class="row-actions">
            <button type="button" class="btn-edit" data-edit="${e.id}">Edit</button>
            <button type="button" class="btn-delete" data-del="${e.id}">Delete</button>
          </div>
        </td>`}
      </tr>`;
    });
    html += `</table></div></div>`;
  });

  box.innerHTML = html || `<div class="empty">${viewer ? 'No team entries yet.' : 'No entries yet. Add today\'s numbers above.'}</div>`;
  if(!viewer){
    box.querySelectorAll('[data-edit]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const found = entries.find(x=>x.id===btn.dataset.edit);
        if(found) editEntry(found);
      });
    });
    box.querySelectorAll('[data-del]').forEach(btn=>{
      btn.addEventListener('click', ()=> deleteEntry(btn.dataset.del));
    });
  }
}

let callMetricsChart, resultsChart, coordChart;
/* Black / white / gold — high contrast, easy to tell apart */
const pieColors = [
  '#a8881a', /* deep gold — was black */
  '#c9a227',
  '#f0d56b',
  '#6b6b6b',
  '#8a7018',
  '#d9d2c0',
  '#3d3d3d',
  '#b8921f'
];
const coordPieColors = [
  '#7c3aed', /* Dinithi — purple */
  '#dc2626', /* Tharusha — red */
  '#16a34a', /* Ruchira — green */
  '#e11d8f', /* Nirmala — rose */
  '#1e3a8a'  /* Sumudu — navy blue */
];

function renderCounts(containerId, labels, values, colors){
  const box = document.getElementById(containerId);
  if(!box) return;
  box.innerHTML = labels.map((label, i) => `
    <div class="chart-count-row">
      <span class="chart-count-label">
        <span class="chart-count-dot" style="background:${colors[i % colors.length]}"></span>
        ${label}
      </span>
      <span class="chart-count-val">${(values[i]||0).toLocaleString()}</span>
    </div>
  `).join('');
}

function buildPie(existing, canvasId, labels, values, colors){
  if(existing) existing.destroy();
  const el = document.getElementById(canvasId);
  if(!el) return null;
  const palette = colors || pieColors;
  const hasData = values.some(v => v > 0);
  return new Chart(el, {
    type: 'pie',
    data: {
      labels: hasData ? labels : ['No data'],
      datasets: [{
        data: hasData ? values : [1],
        backgroundColor: hasData ? labels.map((_, i) => palette[i % palette.length]) : ['#d0d0d0'],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(ctx){
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0) || 1;
              const value = ctx.raw || 0;
              const pct = Math.round((value / total) * 100);
              return `${labels[ctx.dataIndex] || ctx.label}: ${value} (${pct}%)`;
            }
          }
        }
      }
    }
  });
}

async function loadDashboard(){
  const all = await getAllEntries();
  const entries = staffEntriesOnly(all);
  const fc = document.getElementById('filterCoord').value;
  const fd = document.getElementById('filterDept').value;
  const ff = document.getElementById('filterFrom').value;
  const ft = document.getElementById('filterTo').value;
  const filtered = entries.filter(e =>
    (!fc || e.coordinator===fc) &&
    (!fd || e.department===fd) &&
    (!ff || (e.date||'') >= ff) &&
    (!ft || (e.date||'') <= ft)
  );

  let totLeads=0, totPickup=0, totAnswer=0, totNa=0, totPayments=0, totSure=0, totFollowup=0, totRejected=0;
  const byCoord = {};
  filtered.forEach(e=>{
    totLeads += e.leads||0;
    totPickup += e.pickup||0;
    totAnswer += e.answer||0;
    totNa += e.na||0;
    totPayments += e.payments||0;
    totSure += e.sure||0;
    totFollowup += e.followup||0;
    totRejected += e.rejected||0;

    const name = e.coordinator || 'Unknown';
    if(!byCoord[name]){
      byCoord[name] = {
        name, entries:0, leads:0, pickup:0, answer:0, na:0,
        payments:0, sure:0, followup:0, rejected:0
      };
    }
    const c = byCoord[name];
    c.entries += 1;
    c.leads += e.leads||0;
    c.pickup += e.pickup||0;
    c.answer += e.answer||0;
    c.na += e.na||0;
    c.payments += e.payments||0;
    c.sure += e.sure||0;
    c.followup += e.followup||0;
    c.rejected += e.rejected||0;
  });

  document.getElementById('m_leads').textContent = totLeads.toLocaleString();

  const callLabels = ['Leads','Pickup Calls','Answer Calls','N/A Calls'];
  const callValues = [totLeads, totPickup, totAnswer, totNa];
  const resultLabels = ['Payments Received','Sure Count','Follow up','Rejected Calls'];
  const resultValues = [totPayments, totSure, totFollowup, totRejected];
  const coordRows = ENTRY_COORDS
    .map(name => byCoord[name])
    .filter(Boolean);
  const coordLabels = coordRows.map(c => c.name);
  const coordValues = coordRows.map(c => c.leads);
  const coordColors = coordRows.map(c => {
    const idx = ENTRY_COORDS.indexOf(c.name);
    return coordPieColors[(idx >= 0 ? idx : 0) % coordPieColors.length];
  });

  renderCounts('countsCallMetrics', callLabels, callValues, pieColors);
  renderCounts('countsResults', resultLabels, resultValues, pieColors);
  renderCounts(
    'countsCoord',
    coordLabels.length ? coordLabels : ['No data'],
    coordLabels.length ? coordValues : [0],
    coordLabels.length ? coordColors : coordPieColors
  );

  callMetricsChart = buildPie(callMetricsChart, 'chartCallMetrics', callLabels, callValues, pieColors);
  resultsChart = buildPie(resultsChart, 'chartResults', resultLabels, resultValues, pieColors);
  coordChart = buildPie(coordChart, 'chartCoord', coordLabels, coordValues, coordLabels.length ? coordColors : coordPieColors);
}

document.getElementById('refreshBtn').addEventListener('click', loadDashboard);
document.getElementById('filterCoord').addEventListener('change', loadDashboard);
document.getElementById('filterDept').addEventListener('change', loadDashboard);
document.getElementById('filterFrom').addEventListener('change', loadDashboard);
document.getElementById('filterTo').addEventListener('change', loadDashboard);
