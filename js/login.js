document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorBox = document.getElementById("login-error");

  // papel esperado vindo do HTML (login-candidato.html / login-empresa.html)
  const expectedRole = document.body?.dataset?.page || null;

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuarioEl = document.getElementById("usuario");
    const senhaEl = document.getElementById("senha");
    if (!usuarioEl || !senhaEl) return;

    const usuario = String(usuarioEl.value || "").trim();
    const senha = String(senhaEl.value || "").trim();

    hideError(errorBox);

    if (!usuario || !senha) {
      showError(errorBox, "Preencha usuário e senha.");
      return;
    }

    const session = authenticate(usuario, senha);

    if (!session) {
      showError(errorBox, "Usuário ou senha inválidos.");
      return;
    }

    // Se a página é de candidato/empresa, força coerência
    if (expectedRole && session.role !== expectedRole) {
      showError(
        errorBox,
        expectedRole === "candidato"
          ? "Este acesso é exclusivo para candidatos."
          : "Este acesso é exclusivo para recrutadores."
      );
      return;
    }

    // Salva sessão padronizada + compatibilidade com auth
    const now = new Date().toISOString();
    const normalized = {
      role: session.role,
      id: session.id,
      name: session.name || (session.role === "empresa" ? "Empresa" : "Candidato"),
      email: session.email || (usuario.includes("@") ? usuario : `${session.role}@sce.local`),
      createdAt: session.createdAt || now,
      lastLoginAt: now,
    };

    localStorage.setItem("session", JSON.stringify(normalized));
    localStorage.setItem("auth", normalized.role); // compatibilidade com páginas antigas

    // Redireciona por papel
    if (normalized.role === "empresa") {
      window.location.href = "painel-empresa.html";
    } else {
      window.location.href = "painel-candidato.html";
    }
  });
});

/* =========================
   AUTENTICAÇÃO (PROTÓTIPO)
   - Mantém contas de teste enquanto não existe backend
========================= */
function authenticate(user, pass) {
  const u = String(user || "").trim().toLowerCase();
  const p = String(pass || "").trim();

  // Contas de teste (padrão do projeto)
  if ((u === "candidato" || u.includes("candidato")) && p === "123") {
    return {
      role: "candidato",
      id: 1,
      name: "Candidato Teste",
      email: u.includes("@") ? u : "candidato@sce.local",
    };
  }

  if ((u === "empresa" || u.includes("empresa")) && p === "123") {
    return {
      role: "empresa",
      id: 100,
      name: "Empresa Teste",
      email: u.includes("@") ? u : "empresa@sce.local",
    };
  }

  return null;
}

/* =========================
   UI DE ERRO
========================= */
function showError(box, message) {
  if (!box) return;
  box.textContent = message;
  box.classList.add("ativo");
}

function hideError(box) {
  if (!box) return;
  box.textContent = "";
  box.classList.remove("ativo");
}
