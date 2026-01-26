document.addEventListener("DOMContentLoaded", () => {
  const session = getSession();
  const pageRole = document.body?.dataset?.page || null;

  
  const currentPage = (window.location.pathname.split("/").pop() || "").toLowerCase();
  const isPublicAuthPage = ["login-candidato.html","login-empresa.html","recuperar-senha.html"].includes(currentPage);
// ✅ Protege SOMENTE páginas que declaram data-page
  // (páginas públicas como index.html ficam livres)
  if (pageRole && !session && !isPublicAuthPage) {
    redirectToLogin(pageRole);
    return;
  }

  // 🔁 Bloqueio por papel (role)
  // Ex: candidato tentando acessar painel de empresa
  if (pageRole && session?.role && session.role !== pageRole && !isPublicAuthPage) {
    redirectByRole(session.role);
    return;
  }

  // 🚪 Ativa logout, se existir botão na página
  bindLogout();
});

/* =========================
   CONTROLE DE SESSÃO
========================= */
function getSession() {
  try {
    const data = localStorage.getItem("session");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn("Erro ao ler sessão:", error);
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
    // padrão: candidato
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
    // ✅ Se for <a>, impede navegação antes de limpar sessão
    if (btn.tagName?.toLowerCase() === "a") {
      e.preventDefault();
    }

    localStorage.removeItem("session");
    localStorage.removeItem("auth"); // compatibilidade com versões antigas

    window.location.href = "index.html";
  });
}
