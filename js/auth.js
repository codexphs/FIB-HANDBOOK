/* =============================================
   AUTH.JS — Login & Register logic
   ============================================= */

// ── Tab switch ────────────────────────────────
function switchTab(tab) {
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
  document.getElementById('form-login').classList.toggle('active', tab === 'login');
  document.getElementById('form-register').classList.toggle('active', tab === 'register');
  document.getElementById('login-msg').textContent = '';
  document.getElementById('reg-msg').textContent = '';
}

// ── Login ─────────────────────────────────────
async function doLogin() {
  const discord = document.getElementById('login-discord').value.trim();
  const pass    = document.getElementById('login-pass').value;
  const msg     = document.getElementById('login-msg');

  if (!discord || !pass) {
    setMsg(msg, 'Please fill in all fields.', 'error');
    return;
  }

  try {
    const response = await apiRequest('auth.php?action=login', 'POST', { discord, pass });
    setSession(response.user);
    setMsg(msg, '✓ Access granted. Loading secure portal...', 'success');

    setTimeout(() => {
      window.location.href = 'pages/handbook.html';
    }, 800);
  } catch (error) {
    setMsg(msg, error.message, 'error');
  }
}

// ── Register ──────────────────────────────────
async function doRegister() {
  const discord = document.getElementById('reg-discord').value.trim();
  const ingame  = document.getElementById('reg-ingame').value.trim();
  const pass    = document.getElementById('reg-pass').value;
  const pass2   = document.getElementById('reg-pass2').value;
  const msg     = document.getElementById('reg-msg');

  if (!discord || !ingame || !pass || !pass2) {
    setMsg(msg, 'All fields are required.', 'error');
    return;
  }

  if (pass.length < 6) {
    setMsg(msg, 'Password must be at least 6 characters.', 'error');
    return;
  }

  if (pass !== pass2) {
    setMsg(msg, 'Passwords do not match.', 'error');
    return;
  }

  try {
    await apiRequest('auth.php?action=register', 'POST', { discord, ingame, pass, pass2 });
    setMsg(msg, '✓ Application submitted. Awaiting Director approval. You may now sign in once approved.', 'success');

    document.getElementById('reg-discord').value = '';
    document.getElementById('reg-ingame').value  = '';
    document.getElementById('reg-pass').value    = '';
    document.getElementById('reg-pass2').value   = '';
  } catch (error) {
    setMsg(msg, error.message, 'error');
  }
}

// ── Utility ───────────────────────────────────
function setMsg(el, text, type) {
  el.textContent = text;
  el.className = 'auth-msg ' + type;
}

// ── Enter key support ─────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const loginActive = document.getElementById('form-login').classList.contains('active');
  if (loginActive) doLogin(); else doRegister();
});
