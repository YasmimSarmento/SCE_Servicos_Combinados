document.addEventListener("DOMContentLoaded", () => {
  const session = getSession();
  const pageRole = document.body?.dataset?.page || null;

  // ✅ Protege SOMENTE páginas que declaram data-page
  // (assim páginas públicas não são forçadas pro login)
  if (pageRole && !session) {
    redirectToLogin(pageRole);
    return;
  }

  // 🔁 Bloqueio por papel (quando página exige role específico)
  if (pageRole && session?.role && session.role !== pageRole) {
    redirectByRole(session.role);
    return;
  }

  // 🚪 Logout (se existir botão)
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
function redirectToLogin(pageRole) {
  if (pageRole === "empresa") {
    window.location.href = "login-empresa.html";
  } else {
    window.location.href = "login-candidato.html";
  }
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
  const btn =
    document.getElementById("logout") ||
    document.getElementById("btnLogout") ||
    document.querySelector('[data-action="logout"]');

  if (!btn) return;

  btn.addEventListener("click", (e) => {
    // ✅ se for <a>, evita navegar antes de limpar
    if (btn.tagName?.toLowerCase() === "a") e.preventDefault();

    localStorage.removeItem("session");
    localStorage.removeItem("auth"); // compatibilidade com páginas antigas
    window.location.href = "index.html";
  });
}
