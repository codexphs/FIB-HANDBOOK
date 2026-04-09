/* =============================================
   DB.JS — API-backed database helpers for auth and registry
   ============================================= */

const SESSION_KEY = 'nbi_session';
const API_ROOT = window.location.pathname.includes('/pages/') ? '../api' : 'api';

async function apiRequest(endpoint, method = 'GET', body = null) {
  const url = `${API_ROOT}/${endpoint}`;
  const options = { method, headers: {} };

  if (body !== null) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'API request failed.');
  }

  return data;
}

function setSession(agent) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    discord: agent.discord,
    ingame:  agent.ingame,
    role:    agent.role,
    status:  agent.status,
  }));
}

function getSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

async function getAgents() {
  const data = await apiRequest('agents.php?action=list');
  return data.agents || [];
}

async function clearAgentsApi() {
  const data = await apiRequest('agents.php?action=clear', 'POST');
  return data.success;
}
