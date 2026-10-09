let COORDS = [];
let ENTRY_COORDS = [];
const FALLBACK_USERS = [
  { name: 'Mrs.Lakmali', role: 'viewer' },
  { name: 'Ms.Sajini', role: 'viewer' },
  { name: 'Dinithi', role: 'entry' },
  { name: 'Tharusha', role: 'entry' },
  { name: 'Ruchira', role: 'entry' },
  { name: 'Nirmala', role: 'entry' },
  { name: 'Sumudu', role: 'entry' },
  { name: 'Minoshi', role: 'entry' },
  { name: 'Dilrukshi', role: 'entry' }
];
const FALLBACK_DEPTS = [
  'Accounts Course',
  'Accounts Theory',
  'Accounts Practical',
  'Tax 1day Workshop',
  'HR 5days Workshop',
  'PT & CT 7days Programme',
  'HR & Payroll',
  'HR 1day Workshop',
  'Entrepreneurship Event',
  'Company Registration',
  'BO Form',
  'Vacancies',
  'Form 15',
  'Bags'
];
let DEPTS = FALLBACK_DEPTS.slice();
const ADD_DEPT_VALUE = '__add_new__';

let currentUser = '';
let currentRole = '';
let editingId = null;
let editingCoordinator = '';
let callMetricsChart, resultsChart, coordChart, deptChart;
let personCharts = {};
let lastDeptBeforeAdd = '';

const pieColors = [
  '#a8881a',
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
  '#1e3a8a', /* Sumudu — navy blue */
  '#6b8e23', /* Minoshi — olive green */
  '#b45309'  /* Dilrukshi — brown */
];
/* NLSC / COMPANY colors — not used by coordinators */
const DEPT_COLORS = {
  'Accounts Theory': '#f97316',       /* orange */
  'Accounts Practical': '#06b6d4',    /* cyan */
  'Accounts Course': '#eab308',       /* yellow */
  'Tax 1day Workshop': '#a3e635',     /* lime yellow */
  'HR 5days Workshop': '#f9a8d4',     /* light pink */
  'PT & CT 7days Programme': '#2563eb', /* blue */
  'HR & Payroll': '#0d9488',          /* teal */
  'HR 1day Workshop': '#7c3aed',     /* purple */
  'Entrepreneurship Event': '#db2777', /* magenta */
  'Company Registration': '#ea580c',  /* orange */
  'BO Form': '#64748b',              /* slate */
  'Vacancies': '#ca8a04',            /* gold */
  'Form 39': '#fb7185',              /* coral */
  'Form 12': '#14b8a6',              /* teal */
  'Form 13': '#a16207',              /* brown */
  'Form 15': '#38bdf8',              /* sky blue */
  'Bags': '#8b5cf6',                 /* violet */
  'Form 6': '#22d3ee',               /* light cyan */
  'Form 3': '#78716c'                /* stone */
};
const EXTRA_DEPT_COLORS = [
  '#0ea5e9', '#84cc16', '#f59e0b', '#ef4444', '#8b5cf6',
  '#14b8a6', '#ec4899', '#6366f1', '#22c55e', '#d97706'
];

function colorsForDepts(labels){
  return labels.map((name, i) => DEPT_COLORS[name] || EXTRA_DEPT_COLORS[i % EXTRA_DEPT_COLORS.length] || '#9ca3af');
}

function isViewer(){
  return currentRole === 'viewer';
}

function apiFetch(url, opts){
  return fetch(url, Object.assign({ credentials: 'include' }, opts || {}));
}

function fillSelect(id, arr, keepPlaceholder){
  const sel = document.getElementById(id);
  if(!sel) return;
  const placeholder = keepPlaceholder ? sel.querySelector('option[value=""]') : null;
  sel.innerHTML = '';
  if(placeholder){
    sel.appendChild(placeholder);
  }else if(keepPlaceholder){
    const o = document.createElement('option');
    o.value = '';
    o.disabled = true;
    o.selected = true;
    o.hidden = true;
    sel.appendChild(o);
  }
  arr.forEach(v=>{
    const o = document.createElement('option');
    o.value = v; o.textContent = v;
    sel.appendChild(o);
  });
}

function applyUsers(list){
  const users = Array.isArray(list) && list.length ? list : FALLBACK_USERS;
  COORDS = users.map(u => u.name);
  ENTRY_COORDS = users.filter(u => u.role === 'entry').map(u => u.name);
  fillSelect('loginCoord', COORDS, true);
  fillSelect('coord', ENTRY_COORDS, false);
}

function applyDepartments(list, selectName){
  DEPTS = Array.isArray(list) && list.length ? list.slice() : FALLBACK_DEPTS.slice();
  fillDeptSelect(selectName);
}

function fillDeptSelect(selectName){
  const sel = document.getElementById('dept');
  if(!sel) return;
  const keep = selectName && DEPTS.includes(selectName) ? selectName : (sel.value && DEPTS.includes(sel.value) ? sel.value : DEPTS[0]);
  sel.innerHTML = '';
  DEPTS.forEach(v => {
    const o = document.createElement('option');
    o.value = v;
    o.textContent = v;
    sel.appendChild(o);
  });
  const addOpt = document.createElement('option');
  addOpt.value = ADD_DEPT_VALUE;
  addOpt.textContent = '+ Add new option…';
  sel.appendChild(addOpt);
  sel.value = keep || DEPTS[0];
  hideDeptAddRow();
}

function showDeptAddRow(){
  const row = document.getElementById('deptAddRow');
  const msg = document.getElementById('deptMsg');
  if(row) row.hidden = false;
  if(msg) msg.style.display = 'none';
  const input = document.getElementById('newDeptName');
  if(input){
    input.value = '';
    input.focus();
  }
}

function hideDeptAddRow(){
  const row = document.getElementById('deptAddRow');
  const msg = document.getElementById('deptMsg');
  if(row) row.hidden = true;
  if(msg) msg.style.display = 'none';
  const input = document.getElementById('newDeptName');
  if(input) input.value = '';
}

async function loadDepartments(selectName){
  try{
    const res = await apiFetch('/api/departments');
    if(res.ok){
      applyDepartments(await res.json(), selectName);
      return;
    }
  }catch(e){
    console.error(e);
  }
  applyDepartments(FALLBACK_DEPTS, selectName);
}

function applyRoleUI(){
  const viewer = isViewer();
  const formCard = document.getElementById('entryFormCard');
  const accountsCard = document.getElementById('accountsCard');
  const tabEntry = document.getElementById('tabEntry');
  const title = document.getElementById('teamDetailsTitle');
  const desc = document.getElementById('teamDetailsDesc');
  const headerSub = document.querySelector('.brand-row .sub');
  const deleteMine = document.getElementById('deleteAccountBtn');

  if(formCard) formCard.style.display = viewer ? 'none' : '';
  if(accountsCard) accountsCard.style.display = viewer ? '' : 'none';
  if(deleteMine) deleteMine.style.display = '';
  if(tabEntry) tabEntry.textContent = viewer ? 'Team Details' : 'Daily Entry';
  if(title) title.textContent = viewer ? 'Team Full Details' : 'My Entries';
  if(desc){
    const names = ENTRY_COORDS.length
      ? ENTRY_COORDS.slice(0, -1).join(', ') + (ENTRY_COORDS.length > 1 ? ', and ' : '') + ENTRY_COORDS.slice(-1)
      : 'the team';
    desc.textContent = viewer
      ? `Full details for ${names}.`
      : 'Your saved entries — stays after refresh.';
  }
  if(headerSub){
    headerSub.textContent = viewer
      ? 'View team numbers — dashboard updates for everyone.'
      : 'Log Daily Numbers — The Dashboard Updates for Everyone.';
  }
  if(viewer) renderAccountsList();
}

function renderAccountsList(){
  const box = document.getElementById('accountsList');
  if(!box) return;
  const removable = ENTRY_COORDS.slice().sort((a,b)=>a.localeCompare(b));
  if(!removable.length){
    box.innerHTML = '<div class="empty">No staff accounts to remove.</div>';
    return;
  }
  box.innerHTML = removable.map(name => `
    <div class="account-row">
      <span class="account-name">${escapeHtml(name)}</span>
      <button type="button" class="btn-delete" data-remove-user="${escapeHtml(name)}">Remove</button>
    </div>
  `).join('');
}

function escapeHtml(s){
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

async function refreshUsersFromServer(){
  try{
    const usersRes = await apiFetch('/api/users');
    if(usersRes.ok) applyUsers(await usersRes.json());
  }catch(e){
    console.error(e);
  }
  applyRoleUI();
}

async function removeAccount(name){
  const res = await apiFetch('/api/users/' + encodeURIComponent(name), { method: 'DELETE' });
  const data = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.error || 'Could not remove account.');
  return data;
}

async function forceLogoutLocal(){
  currentUser = '';
  currentRole = '';
  editingId = null;
  editingCoordinator = '';
  document.getElementById('app').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginPin').value = '';
  document.getElementById('loginCoord').value = '';
  showSignIn();
  await refreshUsersFromServer();
}

function showApp(){
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('whoamiName').textContent = currentUser;
  const avatar = document.getElementById('userAvatar');
  if(avatar) avatar.textContent = (currentUser || '?').charAt(0).toUpperCase();
  applyRoleUI();
  const dateFilter = document.getElementById('entriesDateFilter');
  if(dateFilter){
    dateFilter.value = todayISO();
    dateFilter.dataset.ready = '1';
  }
  if(!isViewer()){
    document.getElementById('coord').value = currentUser;
    document.getElementById('entryDate').value = todayISO();
  }
  loadRecent();
}

async function restoreSession(){
  applyUsers(FALLBACK_USERS);
  applyDepartments(FALLBACK_DEPTS);
  try{
    const usersRes = await apiFetch('/api/users');
    if(usersRes.ok) applyUsers(await usersRes.json());
  }catch(e){
    console.error(e);
  }
  await loadDepartments();
  try{
    const meRes = await apiFetch('/api/me');
    if(!meRes.ok) return;
    const me = await meRes.json();
    currentUser = me.name || '';
    currentRole = me.role || '';
    showApp();
  }catch(e){
    console.error(e);
  }
}

restoreSession();

document.getElementById('dept').addEventListener('change', ()=>{
  const sel = document.getElementById('dept');
  if(sel.value === ADD_DEPT_VALUE){
    lastDeptBeforeAdd = DEPTS[0] || '';
    showDeptAddRow();
    return;
  }
  lastDeptBeforeAdd = sel.value;
  hideDeptAddRow();
});

document.getElementById('cancelDeptBtn').addEventListener('click', ()=>{
  const sel = document.getElementById('dept');
  sel.value = lastDeptBeforeAdd && DEPTS.includes(lastDeptBeforeAdd) ? lastDeptBeforeAdd : DEPTS[0];
  hideDeptAddRow();
});

document.getElementById('addDeptBtn').addEventListener('click', async ()=>{
  const input = document.getElementById('newDeptName');
  const msg = document.getElementById('deptMsg');
  const name = (input.value || '').trim();
  if(!name){
    msg.textContent = 'Enter a name for the new option.';
    msg.style.display = 'block';
    return;
  }
  try{
    const res = await apiFetch('/api/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const data = await res.json().catch(()=>({}));
    if(!res.ok){
      msg.textContent = data.error || 'Could not add option.';
      msg.style.display = 'block';
      return;
    }
    applyDepartments(data.departments || DEPTS, data.name);
    lastDeptBeforeAdd = data.name;
  }catch(e){
    console.error(e);
    msg.textContent = 'Could not add option. Is the server running?';
    msg.style.display = 'block';
  }
});

document.getElementById('newDeptName').addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){
    e.preventDefault();
    document.getElementById('addDeptBtn').click();
  }
});

function showSignIn(){
  document.getElementById('signInCard').style.display = '';
  document.getElementById('registerCard').style.display = 'none';
  const msg = document.getElementById('registerMsg');
  if(msg) msg.style.display = 'none';
}

function showRegister(){
  document.getElementById('signInCard').style.display = 'none';
  document.getElementById('registerCard').style.display = '';
  const msg = document.getElementById('loginMsg');
  if(msg) msg.style.display = 'none';
  document.getElementById('regName').focus();
}

document.getElementById('showRegisterBtn').addEventListener('click', showRegister);
document.getElementById('showSignInBtn').addEventListener('click', showSignIn);

document.getElementById('loginBtn').addEventListener('click', async ()=>{
  const name = document.getElementById('loginCoord').value;
  const pin = document.getElementById('loginPin').value.trim();
  const loginMsg = document.getElementById('loginMsg');
  if(!name){
    loginMsg.textContent = 'Please select your name.';
    loginMsg.style.display = 'block';
    return;
  }
  try{
    const res = await apiFetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, pin })
    });
    const data = await res.json().catch(()=>({}));
    if(!res.ok){
      loginMsg.textContent = data.error || 'Wrong PIN. Try again.';
      loginMsg.style.display = 'block';
      return;
    }
    currentUser = data.name;
    currentRole = data.role || '';
    loginMsg.style.display = 'none';
    document.getElementById('loginPin').value = '';
    showApp();
  }catch(e){
    console.error(e);
    loginMsg.textContent = 'Could not log in. Is the server running?';
    loginMsg.style.display = 'block';
  }
});

document.getElementById('registerBtn').addEventListener('click', async ()=>{
  const name = document.getElementById('regName').value.trim();
  const pin = document.getElementById('regPin').value.trim();
  const pin2 = document.getElementById('regPin2').value.trim();
  const msg = document.getElementById('registerMsg');
  if(!name){
    msg.textContent = 'Please enter your name.';
    msg.style.display = 'block';
    return;
  }
  if(!/^\d{4}$/.test(pin)){
    msg.textContent = 'PIN must be exactly 4 digits.';
    msg.style.display = 'block';
    return;
  }
  if(pin !== pin2){
    msg.textContent = 'PINs do not match.';
    msg.style.display = 'block';
    return;
  }
  try{
    const res = await apiFetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, pin })
    });
    const data = await res.json().catch(()=>({}));
    if(!res.ok){
      msg.textContent = data.error || 'Could not create account.';
      msg.style.display = 'block';
      return;
    }
    try{
      const usersRes = await apiFetch('/api/users');
      if(usersRes.ok) applyUsers(await usersRes.json());
    }catch(e){}
    currentUser = data.name;
    currentRole = data.role || 'entry';
    msg.style.display = 'none';
    document.getElementById('regName').value = '';
    document.getElementById('regPin').value = '';
    document.getElementById('regPin2').value = '';
    showSignIn();
    showApp();
  }catch(e){
    console.error(e);
    msg.textContent = 'Could not create account. Is the server running?';
    msg.style.display = 'block';
  }
});

document.getElementById('loginPin').addEventListener('keydown', (e)=>{
  if(e.key === 'Enter') document.getElementById('loginBtn').click();
});
['regName','regPin','regPin2'].forEach(id=>{
  document.getElementById(id).addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') document.getElementById('registerBtn').click();
  });
});

document.getElementById('logoutBtn').addEventListener('click', async ()=>{
  try{ await apiFetch('/api/logout', { method: 'POST' }); }catch(e){}
  await forceLogoutLocal();
});

document.getElementById('deleteAccountBtn').addEventListener('click', async ()=>{
  if(!currentUser) return;
  if(!confirm(`Delete account "${currentUser}"? You will be logged out and removed from the login list.`)) return;
  try{
    await removeAccount(currentUser);
    await forceLogoutLocal();
  }catch(e){
    alert(e.message || 'Could not delete account.');
  }
});

document.getElementById('accountsList').addEventListener('click', async (e)=>{
  const btn = e.target.closest('[data-remove-user]');
  if(!btn) return;
  const name = btn.getAttribute('data-remove-user');
  if(!name) return;
  if(!confirm(`Remove "${name}" from the app? They will no longer appear in the login list.`)) return;
  btn.disabled = true;
  try{
    await removeAccount(name);
    await refreshUsersFromServer();
    if(typeof loadRecent === 'function') loadRecent();
  }catch(err){
    alert(err.message || 'Could not remove account.');
    btn.disabled = false;
  }
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
  fillDeptSelect(DEPTS[0]);
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
  const department = document.getElementById('dept').value;
  if(!department || department === ADD_DEPT_VALUE){
    alert('Please select or add an NLSC / COMPANY option first.');
    return;
  }
  const id = editingId || ('e' + Date.now() + Math.random().toString(36).slice(2,7));
  const entry = {
    id: id,
    date: document.getElementById('entryDate').value,
    coordinator: editingCoordinator || currentUser,
    department,
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
    const res = await apiFetch(API, {
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
    const res = await apiFetch(`${API}/${encodeURIComponent(id)}`, { method: 'DELETE' });
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
  const deptName = e.department || DEPTS[0];
  if(deptName && !DEPTS.includes(deptName)){
    applyDepartments([...DEPTS, deptName], deptName);
  }else{
    fillDeptSelect(deptName);
  }
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
    const res = await apiFetch(API);
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

function destroyPersonCharts(){
  Object.keys(personCharts).forEach(key=>{
    try{ personCharts[key].destroy(); }catch(e){}
  });
  personCharts = {};
}

function sumPersonRows(rows){
  let totLeads=0, totPickup=0, totPayments=0, totSure=0;
  const byDept = {};
  rows.forEach(e=>{
    totLeads += e.leads||0;
    totPickup += e.pickup||0;
    totPayments += e.payments||0;
    totSure += e.sure||0;
    const dept = e.department || 'Other';
    byDept[dept] = (byDept[dept]||0) + (e.leads||0);
  });
  return { totLeads, totPickup, totPayments, totSure, byDept };
}

function safeChartId(name){
  return String(name).replace(/[^a-zA-Z0-9]/g, '_');
}

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

function todayISO(){
  return new Date().toISOString().slice(0,10);
}

function ensureEntriesDateFilter(){
  const el = document.getElementById('entriesDateFilter');
  if(!el) return '';
  if(!el.dataset.ready){
    el.value = todayISO();
    el.dataset.ready = '1';
  }
  return el.value || '';
}

async function loadRecent(){
  const box = document.getElementById('recentList');
  box.innerHTML = '<div class="empty">Loading...</div>';
  destroyPersonCharts();

  const filterDate = ensureEntriesDateFilter();
  const all = await getAllEntries();
  const staff = staffEntriesOnly(all);
  const viewer = isViewer();
  let entries = viewer
    ? staff
    : staff.filter(e => e.coordinator === currentUser);

  if(filterDate){
    entries = entries.filter(e => (e.date || '') === filterDate);
  }

  if(entries.length===0){
    const emptyMsg = filterDate
      ? (viewer ? `No team entries for ${filterDate}.` : `No entries for ${filterDate}.`)
      : (viewer ? 'No team entries yet.' : 'No entries yet. Add today\'s numbers above.');
    box.innerHTML = `<div class="empty">${emptyMsg}</div>`;
    return;
  }

  const names = viewer
    ? ENTRY_COORDS.filter(name => entries.some(e => e.coordinator === name))
    : [currentUser];

  const chartMetas = [];
  let html = '';

  names.forEach(name=>{
    const rows = entries
      .filter(e => e.coordinator === name)
      .slice()
      .sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    if(rows.length === 0) return;

    const { totLeads, totPickup, totPayments, totSure, byDept } = sumPersonRows(rows);
    const cid = safeChartId(name);
    const labels = Object.keys(byDept);
    const values = labels.map(k => byDept[k]);
    chartMetas.push({ cid, name, labels, values });

    html += `<div class="coord-block">
      <p class="coord-block-name">${name}</p>
      <div class="metrics entries-summary">
        <div class="metric"><div class="lbl">Total Leads</div><div class="val">${totLeads.toLocaleString()}</div></div>
        <div class="metric"><div class="lbl">Total Pickup</div><div class="val">${totPickup.toLocaleString()}</div></div>
        <div class="metric"><div class="lbl">Payments</div><div class="val">${totPayments.toLocaleString()}</div></div>
        <div class="metric"><div class="lbl">Sure Count</div><div class="val">${totSure.toLocaleString()}</div></div>
      </div>
      <div class="entries-chart-block">
        <p class="group-label">Leads by NLSC / COMPANY</p>
        <div class="chart-with-counts">
          <div class="chart-wrap"><canvas id="chartPerson_${cid}"></canvas></div>
          <div class="chart-counts" id="countsPerson_${cid}"></div>
        </div>
      </div>
      <div class="table-scroll">
      <table class="entries-by-date">
        <tr>
          <th>NLSC / COMPANY</th><th>Leads</th><th>Pickup</th>
          <th>Answer</th><th>N/A</th><th>Payments</th><th>Sure</th><th>Follow up</th><th>Rejected</th>
          ${viewer ? '' : '<th></th>'}
        </tr>`;

    let lastDate = null;
    rows.forEach(e=>{
      const d = e.date || 'No date';
      if(d !== lastDate){
        lastDate = d;
        const colSpan = viewer ? 9 : 10;
        html += `<tr class="date-group-row"><td colspan="${colSpan}"><span class="date-group-label">${d}</span></td></tr>`;
      }
      html += `<tr class="date-entry-row">
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

  chartMetas.forEach(meta=>{
    if(!document.getElementById('chartPerson_'+meta.cid)) return;
    const colors = colorsForDepts(meta.labels);
    renderCounts(
      'countsPerson_'+meta.cid,
      meta.labels.length ? meta.labels : ['No data'],
      meta.labels.length ? meta.values : [0],
      colors.length ? colors : pieColors
    );
    personCharts[meta.cid] = buildPie(null, 'chartPerson_'+meta.cid, meta.labels, meta.values, colors.length ? colors : pieColors);
  });

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

document.getElementById('entriesDateFilter').addEventListener('change', loadRecent);
document.getElementById('entriesDateTodayBtn').addEventListener('click', ()=>{
  const el = document.getElementById('entriesDateFilter');
  el.value = todayISO();
  el.dataset.ready = '1';
  loadRecent();
});
document.getElementById('entriesDateAllBtn').addEventListener('click', ()=>{
  const el = document.getElementById('entriesDateFilter');
  el.value = '';
  el.dataset.ready = '1';
  loadRecent();
});

async function loadDashboard(){
  const all = await getAllEntries();
  const entries = staffEntriesOnly(all);
  const ff = document.getElementById('filterFrom').value;
  const ft = document.getElementById('filterTo').value;
  const filtered = entries.filter(e =>
    (!ff || (e.date||'') >= ff) &&
    (!ft || (e.date||'') <= ft)
  );

  let totLeads=0, totPickup=0, totAnswer=0, totNa=0, totPayments=0, totSure=0, totFollowup=0, totRejected=0;
  const byCoord = {};
  const byDept = {};
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

    const dept = e.department || 'Other';
    byDept[dept] = (byDept[dept]||0) + (e.leads||0);
  });

  document.getElementById('m_leads').textContent = totLeads.toLocaleString();
  document.getElementById('m_pickup').textContent = totPickup.toLocaleString();

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

  const deptLabels = Object.keys(byDept);
  const deptValues = deptLabels.map(k => byDept[k]);
  const deptColors = colorsForDepts(deptLabels);

  renderCounts('countsCallMetrics', callLabels, callValues, pieColors);
  renderCounts('countsResults', resultLabels, resultValues, pieColors);
  renderCounts(
    'countsCoord',
    coordLabels.length ? coordLabels : ['No data'],
    coordLabels.length ? coordValues : [0],
    coordLabels.length ? coordColors : coordPieColors
  );
  renderCounts(
    'countsDept',
    deptLabels.length ? deptLabels : ['No data'],
    deptLabels.length ? deptValues : [0],
    deptLabels.length ? deptColors : pieColors
  );

  callMetricsChart = buildPie(callMetricsChart, 'chartCallMetrics', callLabels, callValues, pieColors);
  resultsChart = buildPie(resultsChart, 'chartResults', resultLabels, resultValues, pieColors);
  coordChart = buildPie(coordChart, 'chartCoord', coordLabels, coordValues, coordLabels.length ? coordColors : coordPieColors);
  deptChart = buildPie(deptChart, 'chartDept', deptLabels, deptValues, deptLabels.length ? deptColors : pieColors);
}

document.getElementById('refreshBtn').addEventListener('click', loadDashboard);
document.getElementById('filterFrom').addEventListener('change', loadDashboard);
document.getElementById('filterTo').addEventListener('change', loadDashboard);
