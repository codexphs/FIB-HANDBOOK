/* =============================================
   HANDBOOK.JS — Section rendering & navigation
   ============================================= */

// ── Auth guard ────────────────────────────────
(function guard() {
  const session = getSession();
  if (!session) {
    window.location.href = '../index.html';
    return;
  }
  document.getElementById('current-user').textContent = session.ingame + ' (' + session.discord + ')';
})();

function doLogout() {
  clearSession();
  window.location.href = '../index.html';
}

// ── Section navigation ────────────────────────
function showSection(id, el) {
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-' + id).classList.add('active');

  document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
  if (el) el.classList.add('active');
  else {
    // find by onclick attribute
    const match = [...document.querySelectorAll('.sidebar-item')]
      .find(s => s.getAttribute('onclick') && s.getAttribute('onclick').includes("'" + id + "'"));
    if (match) match.classList.add('active');
  }

  document.querySelector('.content').scrollTop = 0;
  if (id === 'registry') renderRegistry();
  return false;
}

// ── Populate all data on load ─────────────────
window.addEventListener('DOMContentLoaded', () => {
  buildRadioCodes();
  buildForceMatrix();
  buildVehicleForce();
  buildRanks();
  buildDivisions();
  buildEquipment();
});

// ══════════════════════════════════════════════
//  RADIO CODES
// ══════════════════════════════════════════════
const TEN_CODES = [
  ['10-1','Poor transmission'],
  ['10-2','Clear transmission'],
  ['10-3','Cease transmission'],
  ['10-4','Message acknowledged'],
  ['10-6','Off-duty but available for emergencies'],
  ['10-7','Off-duty, not responding'],
  ['10-8','On-duty, responding to calls'],
  ['10-9','Repeat last message'],
  ['10-10','Logging off'],
  ['10-15','Male suspect in custody'],
  ['10-15f','Female suspect in custody'],
  ['10-15a','Most wanted suspect in custody'],
  ['10-16','Requesting a partner'],
  ['10-19','Returning to base'],
  ['10-20','Location'],
  ['10-21','Phone call'],
  ['10-22','Disregard last communication'],
  ['10-23','Stand by'],
  ['10-26','Traffic stop [location]'],
  ['10-26a','High-risk traffic stop [location]'],
  ['10-27','Licence check'],
  ['10-28','Vehicle registration check'],
  ['10-29','Wants / warrants check'],
  ['10-35','Current time'],
  ['10-44','Permission to leave'],
  ['10-62','Attempting a PIT manoeuvre'],
  ['10-66','Suspicious person or vehicle'],
  ['10-70','Prowler'],
  ['10-71','Shooting'],
  ['10-72','Gun involved'],
  ['10-76','En route to [location]'],
  ['10-77','Bomb threat'],
  ['10-78','Explosion'],
  ['10-80','Pursuit in progress'],
  ['10-84','Estimated Time of Arrival'],
  ['10-85','Area check'],
  ['10-86','Any radio traffic?'],
  ['10-87','Meet officer at [location]'],
  ['10-88','Requesting cover unit [location]'],
  ['10-96','Available for assignment'],
  ['10-97','Arrived on scene'],
  ['10-98','All units clear, resume patrol'],
  ['10-99','Situation concluded'],
];

const ELEVEN_CODES = [
  ['11-29','Clear record (no warrants)'],
  ['11-41','Ambulance needed [location]'],
  ['11-44','Coroner\'s case — dead on scene'],
  ['11-52','Status check'],
  ['11-54','Suspicious vehicle'],
  ['11-55','Officer being followed by auto'],
  ['11-56','11-55 with dangerous persons'],
  ['11-80','Accident — Major Injury'],
  ['11-78','Aircraft accident'],
  ['11-81','Accident — Minor Injury'],
  ['11-82','Accident — Property Damage Only'],
  ['11-83','Accident — No Details'],
  ['11-85','Tow truck needed'],
  ['11-98','Meet at location'],
  ['11-99','Officer in extreme danger'],
];

const STATUS_CODES = [
  ['Code 0','System crash / game crash'],
  ['Code 1','Routine response'],
  ['Code 2','Urgent — no lights or siren'],
  ['Code 3','Lights and siren required'],
  ['Code 4','No further assistance needed'],
  ['Code 5','Stakeout'],
  ['Code 6','Stay out of area'],
  ['Code 10','SWAT pre-call up'],
  ['Code 11','SWAT call up'],
  ['Code 37','Subject / Property wanted'],
];

function buildRadioCodes() {
  const rows = (arr) => arr.map(([c, m]) => `<tr><td>${c}</td><td>${m}</td></tr>`).join('');
  document.getElementById('ten-tbody').innerHTML    = rows(TEN_CODES);
  document.getElementById('eleven-tbody').innerHTML = rows(ELEVEN_CODES);
  document.getElementById('status-tbody').innerHTML = rows(STATUS_CODES);
}

// ══════════════════════════════════════════════
//  FORCE MATRIX
// ══════════════════════════════════════════════
const FORCE_DATA = [
  {
    tag: 'VERBAL',
    title: 'Force Matrix Level 1 — Verbal Aggression',
    bullets: [
      'Suspect may be verbally aggressive or using foul language',
      'Suspect may be taunting or showing aggression in tone',
      'Suspect is showing general disrespect toward LEOs',
    ],
    action: 'Issue verbal warnings or gestures to calm them down. No physical contact may occur at this stage.',
  },
  {
    tag: 'CONTACT',
    title: 'Force Matrix Level 2 — Disobeying Orders',
    bullets: [
      'Suspect is disobeying orders from a LEO',
      'Suspect is hinting at violent actions or making aggressive gestures',
      'Suspect may be preparing for physical contact',
    ],
    action: 'Call backup if needed. Move to a hands-on approach using voice commands and light gestures to escort the suspect. Do not use secondary equipment. Call Code 2.',
  },
  {
    tag: 'NON-LETHAL',
    title: 'Force Matrix Level 3 — Physical Threat',
    bullets: [
      'Suspect has committed a crime',
      'Suspect may be making physical contact or using a non-lethal weapon',
      'Suspect may be involved in a physical fight',
    ],
    action: 'You may use a Taser, Mace Pepper Spray, or Nightstick. Call Code 3 backup if necessary. Do NOT withdraw a firearm at this level.',
  },
  {
    tag: 'ARMED',
    title: 'Force Matrix Level 4 — Illegal Firearm',
    bullets: [
      'Suspect is brandishing an illegal firearm (Deagle, SPAS, MP5, AK47, M4, Katana)',
      'Suspect may be actively aiming or has vehicularly assaulted you',
      'Suspect has placed lives in danger',
      'If suspect aimed a legal gun at a civilian — treat as FM4 with illegal weapon',
    ],
    action: 'Unholster and aim your firearm. Ask suspect to drop weapon and put hands up. If compliant — take into custody. Do NOT fire unless reaching Level 5. Issue up to five warnings.',
  },
  {
    tag: 'LETHAL',
    title: 'Force Matrix Level 5 — Active Threat',
    bullets: [
      'Suspect is actively firing at you or civilians',
      'Suspect is in a vehicle attempting to hit you or civilians',
      'Suspect may be fleeing after three warnings were issued',
      'Suspect may have a hostage',
    ],
    action: 'You may open fire. Shoot to kill if necessary. If escaping in a vehicle, shoot out their tires. If the car begins to smoke — cease fire and attempt PIT maneuvers only. Once threat is neutralized, escort to hospital, then process arrest.',
  },
];

function buildForceMatrix() {
  document.getElementById('force-list').innerHTML = FORCE_DATA.map((f, i) =>
    `<div class="force-item">
      <div>
        <div class="force-num">${i + 1}</div>
        <div class="force-level-tag">${f.tag}</div>
      </div>
      <div class="force-body">
        <h3>${f.title}</h3>
        <ul>${f.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
        <div class="force-action"><strong>Your actions:</strong> ${f.action}</div>
      </div>
    </div>`
  ).join('');
}

// ══════════════════════════════════════════════
//  VEHICLE FORCE MATRIX
// ══════════════════════════════════════════════
const VFM_DATA = [
  {
    tag: 'TRAFFIC',
    title: 'VFM Level 1 — Traffic Violation',
    bullets: ['Suspect is speeding, driving recklessly, or on the wrong side of the road'],
    action: 'Pull suspect over on the right side using your megaphone ((/po)) and conduct a 10-26 traffic stop.',
  },
  {
    tag: 'PURSUIT',
    title: 'VFM Level 2 — Failure to Stop',
    bullets: ['Suspect failed to pull over after being instructed'],
    action: 'Call Code 3 backup and execute a 10-80 pursuit.',
  },
  {
    tag: 'PIT',
    title: 'VFM Level 3 — PIT Maneuver',
    bullets: ['Backup has arrived and suspect continues to flee'],
    action: 'Execute a PIT Maneuver (10-62). If unsuccessful and lead chaser is thrown, backup unit advances to maintain sight and continue the 10-80.',
  },
  {
    tag: 'BLOCKS',
    title: 'VFM Level 4 — Property Damage',
    bullets: ['Driver has damaged government properties'],
    action: 'Deploy spike traps and vehicle blocks to neutralize the threat.',
  },
  {
    tag: 'SHOOT',
    title: 'VFM Level 5 — Threat to Civilians',
    bullets: [
      'Civilians have been threatened and/or injured by the vehicle',
      'Most Wanted suspects automatically qualify as VFM5 upon entering any vehicle',
    ],
    action: 'You may use your firearm to blow out the tires of the vehicle to neutralize the threat.',
  },
];

function buildVehicleForce() {
  document.getElementById('vforce-list').innerHTML = VFM_DATA.map((f, i) =>
    `<div class="force-item">
      <div>
        <div class="force-num">${i + 1}</div>
        <div class="force-level-tag">${f.tag}</div>
      </div>
      <div class="force-body">
        <h3>${f.title}</h3>
        <ul>${f.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
        <div class="force-action"><strong>Your actions:</strong> ${f.action}</div>
      </div>
    </div>`
  ).join('');
}

// ══════════════════════════════════════════════
//  RANKS
// ══════════════════════════════════════════════
const RANKS = [
  {
    rank: 'R0', code: 'INTERN', name: 'Trainee / Intern', cls: '',
    desc: 'New recruits undergoing training at the NBI National Training Center. Required to pass the final examination to advance. Must follow instructions from Agents and above.',
    perms: [
      { label: 'Major Crimes Division', allow: true },
      { label: 'Deploy Barricades', allow: true },
      { label: 'Emergency Radio', allow: true },
      { label: 'FBI Rancher — R4 Required', allow: false },
      { label: 'No Cones / Flares', allow: false },
    ],
  },
  {
    rank: 'R1', code: 'AGENT', name: 'Agent', cls: '',
    desc: 'Promoted from Intern after completing training and initial evaluations. On 3-day probation. Qualified for all basic situations. Can join MCD and CID.',
    perms: [
      { label: 'MCD + CID Access', allow: true },
      { label: 'NRG-500', allow: true },
      { label: 'Deploy Barricades', allow: true },
      { label: 'Department Radio', allow: true },
      { label: 'No Cones / Flares', allow: false },
    ],
  },
  {
    rank: 'R2', code: 'SPECIAL', name: 'Special Agent', cls: '',
    desc: 'Has proved trustworthiness and may take command if no superior agents are available. Eligible for Internal Affairs.',
    perms: [
      { label: 'MCD + CID + Internal Affairs', allow: true },
      { label: 'Sultan / Buffalo', allow: true },
      { label: 'Maverick', allow: true },
      { label: 'No Cones / Flares', allow: false },
    ],
  },
  {
    rank: 'R3', code: 'SENIOR', name: 'Senior Agent', cls: '',
    desc: 'Highest non-command rank. Must pass the Supervisor Exam with at least 12 days of service. Cannot be promoted further without becoming Division Director.',
    perms: [
      { label: 'All Divisions', allow: true },
      { label: 'Cones & Flares', allow: true },
      { label: 'Enforcer / FBI Rancher', allow: true },
      { label: 'Cheetah', allow: true },
      { label: 'Sniper Rifle', allow: true },
    ],
  },
  {
    rank: 'R4', code: 'SUPERVISORY', name: 'Supervisory Agent', cls: 'command',
    desc: 'Has proven leadership qualities. May only be achieved after being assigned Division Director. May direct any division. Cannot be promoted without becoming Deputy Director.',
    perms: [
      { label: 'Direct All Divisions', allow: true },
      { label: 'Full Vehicle Access', allow: true },
      { label: 'LVPD Cruiser', allow: true },
      { label: 'Authorize R0 Vehicle Use', allow: true },
    ],
  },
  {
    rank: 'R4', code: 'HEAD', name: 'Head Agent', cls: 'command',
    desc: 'Leads a division and serves as Assistant Director. Requires appointment by the Division Director. Access to Cargobob for long-distance and training operations.',
    perms: [
      { label: 'Division Leadership', allow: true },
      { label: 'Cargobob Access', allow: true },
      { label: 'Complete Access', allow: true },
    ],
  },
  {
    rank: 'R5', code: 'EXEC', name: 'Executive Assistant Agent', cls: 'command',
    desc: 'Appointed by the NBI Director to oversee specific divisions. Senior management position. Issues promotion and demotion letters with Director approval.',
    perms: [
      { label: 'Issue Promotion Letters', allow: true },
      { label: 'Complete Access', allow: true },
    ],
  },
  {
    rank: 'R5', code: 'DEPUTY', name: 'Deputy Director', cls: 'director',
    desc: 'Assists in leading the NBI. Appointed by the Director. May take temporary charge if Director and Assistant Director are unavailable. Not eligible for further promotion without a change in Director position.',
    perms: [
      { label: 'Complete Access', allow: true },
      { label: 'Temporary Command', allow: true },
    ],
  },
  {
    rank: 'R6', code: 'DIRECTOR', name: 'Director', cls: 'director',
    desc: 'The highest-ranking position responsible for the overall leadership and strategic direction of the NBI. Takes charge of all operations. Appointed by the President.',
    perms: [
      { label: 'Complete Access', allow: true },
      { label: 'Full Command Authority', allow: true },
    ],
  },
];

function buildRanks() {
  document.getElementById('rank-list').innerHTML = RANKS.map(r =>
    `<div class="rank-item ${r.cls}">
      <div>
        <div class="rank-badge" style="${r.cls === 'director' ? 'color:var(--gold)' : r.cls === 'command' ? 'color:var(--red)' : ''}">${r.rank}</div>
        <div class="rank-code">${r.code}</div>
      </div>
      <div class="rank-info">
        <h3>${r.name}</h3>
        <p>${r.desc}</p>
        <div class="perm-tags">
          ${r.perms.map(p => `<span class="perm-tag ${p.allow ? 'allow' : 'deny'}">${p.label}</span>`).join('')}
        </div>
      </div>
    </div>`
  ).join('');
}

// ══════════════════════════════════════════════
//  DIVISIONS
// ══════════════════════════════════════════════
const DIVISIONS = [
  { tag: 'Division 01 · Entry Level', name: 'Major Crimes Division', desc: 'Prevention of significant disruptions of public order through Case Files. All Interns are allocated to MCD upon joining. Authorized to investigate homicide, firearms, narcotics, and organized crime.' },
  { tag: 'Division 02 · Agent+', name: 'Criminal Investigation Division', desc: 'Focuses on apprehending criminals investigated by MCD. Agents must complete Intern training before joining. Authorized to arrest individuals that MCD has Case Filed. Performs raids on criminal organizations.' },
  { tag: 'Division 03 · Special Agent+', name: 'Internal Affairs', desc: 'Investigates Law Enforcement Agencies for corruption. Investigates LSPD, NBI, and government personnel. Produces Case Files for corruption within agencies.' },
  { tag: 'Division 04 · Advanced', name: 'Critical Incident Response Group', desc: 'Specialized support during high-stakes incidents: terrorism, hostage situations, and large-scale emergencies. Integrates Hostage Rescue Team (HRT) and Behavioral Analysis Unit (BAU).' },
  { tag: 'Division 05 · Training', name: 'National Academy', desc: 'Advanced training for law enforcement professionals. Offers courses on investigative techniques, leadership, and management. Fosters international cooperation and promotes best practices.' },
  { tag: 'Division HQ', name: 'Office of the Director', desc: 'Oversees overall operations and strategic direction. Responsible for high-level decision-making, coordination with federal and international agencies, and providing leadership across all divisions.' },
];

function buildDivisions() {
  document.getElementById('divisions-grid').innerHTML = DIVISIONS.map(d =>
    `<div class="card">
      <div class="card-tag">${d.tag}</div>
      <h3>${d.name}</h3>
      <p>${d.desc}</p>
    </div>`
  ).join('');
}

// ══════════════════════════════════════════════
//  EQUIPMENT
// ══════════════════════════════════════════════
const WEAPONS = [
  ['🔫','Desert Eagle','Intern and above'],
  ['🔫','MP5','Intern and above'],
  ['🔫','Remington 870','Intern and above'],
  ['🔫','SPAS-12 Shotgun','Intern and above'],
  ['🔫','M4 / M4A1','Special Agent+'],
  ['🎯','Sniper Rifle','Senior Agent+'],
  ['💨','Tear Gas Grenade','Intern (raids)'],
  ['🥊','Nightstick','Intern and above'],
  ['💦','Mace Pepper Spray','Intern and above'],
  ['📷','Camera','Intern and above'],
  ['📻','Portable Radio','Intern and above'],
  ['🔵','Listening Bug','All agents'],
];

const VEHICLES = [
  ['🚗','Premier','Intern and above'],
  ['🚗','LVPD Cruiser','Intern and above'],
  ['🏍️','NRG-500','Agents'],
  ['🚙','Sultan','Special Agent+'],
  ['🚗','Buffalo','Special Agent+'],
  ['🚁','Police Maverick','Special Agent+'],
  ['🏎️','Cheetah','Senior Agent+'],
  ['🚐','Enforcer','Senior Agent+'],
  ['🚙','FBI Rancher','Senior Agent+'],
  ['🚐','Buritto (Tactical)','Senior Agents'],
  ['🚙','Huntley (Escort)','Supervisory Agent+'],
  ['🚁','Cargobob','Head Agent+'],
  ['🔒','Secret / Undercover Vehicle','Agent+ (Garage)'],
];

function buildEquipment() {
  const grid = (arr) => arr.map(([icon, name, access]) =>
    `<div class="equip-item">
      <div class="equip-icon">${icon}</div>
      <div class="equip-name">${name}</div>
      <div class="equip-access">${access}</div>
    </div>`
  ).join('');
  document.getElementById('weapons-grid').innerHTML  = grid(WEAPONS);
  document.getElementById('vehicles-grid').innerHTML = grid(VEHICLES);
}

// ══════════════════════════════════════════════
//  AGENT REGISTRY
// ══════════════════════════════════════════════
async function renderRegistry() {
  const tbody = document.getElementById('registry-tbody');
  try {
    const agents = await getAgents();

    if (!agents.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-dim);padding:32px">No agents registered.</td></tr>`;
      return;
    }

    tbody.innerHTML = agents.map((a, i) =>
      `<tr>
        <td>${i + 1}</td>
        <td>${a.discord}</td>
        <td>${a.ingame}</td>
        <td><span class="badge ${a.status}">${a.status.toUpperCase()}</span></td>
        <td>${a.registeredAt}</td>
      </tr>`
    ).join('');
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-dim);padding:32px">Unable to load registry. ${error.message}</td></tr>`;
  }
}

async function clearAgents() {
  if (!confirm('Clear all agents except the default Director? This cannot be undone.')) return;
  try {
    await clearAgentsApi();
    renderRegistry();
  } catch (error) {
    alert('Unable to clear registry: ' + error.message);
  }
}
