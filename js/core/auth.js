document.addEventListener("DOMContentLoaded", () => {
  const session = getSession();
  const pageRole = document.body.dataset.page;

  // 🔒 Proteção global
  if (!session) {
    redirectToLogin();
    return;
  }

  // 🔁 Bloqueio por papel
  if (pageRole && session.role !== pageRole) {
    redirectByRole(session.role);
    return;
  }

  // 🚪 Logout
  bindLogout();
});

/* =========================
   CONTROLE DE SESSÃO
========================= */

function getSession() {
  try {
    const data = localStorage.getItem("session");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/* =========================
   REDIRECIONAMENTOS
========================= */

function redirectToLogin() {
  window.location.href = "login.html";
}

function redirectByRole(role) {
  const routes = {
    candidato: "painel-candidato.html",
    empresa: "painel-empresa.html",
  };

  window.location.href = routes[role] || "index.html";
}

/* =========================
   LOGOUT
========================= */

function bindLogout() {
  const btn = document.getElementById("logout");

  if (!btn) return;

  btn.addEventListener("click", () => {
    localStorage.removeItem("session");
    window.location.href = "index.html";
  });
}
