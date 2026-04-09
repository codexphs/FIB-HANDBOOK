# NBI Handbook Portal

A full multi-page web application for the National Bureau of Investigation handbook.
Built with plain HTML, CSS, and JavaScript — no frameworks required.

---

## 📁 Project Structure

```
nbi-handbook/
├── index.html              ← Login / Register page (entry point)
│
├── pages/
│   └── handbook.html       ← Main handbook dashboard (requires login)
│
├── css/
│   ├── global.css          ← Shared variables, components, utilities
│   ├── auth.css            ← Login & register page styles
│   └── handbook.css        ← Topbar, sidebar, layout styles
│
└── js/
    ├── db.js               ← localStorage database (shared by all pages)
    ├── auth.js             ← Login / Register logic
    └── handbook.js         ← Section rendering, navigation, data
```

---

## 🚀 How to Open

1. Open the **`nbi-handbook/`** folder in **VS Code**
2. Install the **Live Server** extension (by Ritwick Dey)
3. Right-click `index.html` → **"Open with Live Server"**
4. The portal will open at `http://127.0.0.1:5500`

> ⚠️ Do NOT open HTML files directly via `file://` — relative paths and session storage work correctly only when served via Live Server or a local server.

---

## 🔐 Default Admin Credentials

| Field    | Value       |
|----------|-------------|
| Discord  | `director`  |
| Password | `nbi1234`   |

---

## 📋 Registration Fields

When registering, agents provide:
- **Discord Name or ID** (e.g. `YourName#0001` or numeric ID)
- **In-Game Name** (e.g. `Juan dela Cruz`)
- **Password** (min. 6 characters)

New registrations are set to **Pending** status and must be approved before login is allowed.

---

## 📄 Handbook Sections

| # | Section |
|---|---------|
| 00 | Home Dashboard |
| 01 | Mission & Core Values |
| 02 | Rank Hierarchy (R0–R6) |
| 03 | NBI Divisions |
| 04 | Career & Hiring |
| 05 | Force Matrix (FM1–5) |
| 06 | Vehicle Force Matrix (VFM1–5) |
| 07 | Undercover Operations |
| 08 | Miranda Rights |
| 09 | Radio Codes (10-codes, 11-codes, Status) |
| 10 | Equipment & Vehicles |
| 11 | Agent Registry |

---

## 💾 Database

All data is stored in **`localStorage`** under the key `nbi_agents_v2`.
The session (logged-in agent) is stored in **`sessionStorage`** under `nbi_session`.

To reset all data, open the browser console and run:
```js
localStorage.clear();
sessionStorage.clear();
location.reload();
```
