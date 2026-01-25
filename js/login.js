document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (!form) return;

  const expectedRole = document.body?.dataset?.page || null;

  const usuarioEl = document.getElementById("usuario");
  const senhaEl = document.getElementById("senha");
  const errorBox = document.getElementById("login-error");
  const successBox = document.getElementById("login-success");
  const btnLogin = document.getElementById("btn-login");
  const rememberEl = document.getElementById("remember-user");

  // Preenche usuário salvo (se houver)
  try {
    const savedUser = localStorage.getItem("login_saved_user");
    if (usuarioEl && savedUser) usuarioEl.value = savedUser;
    if (rememberEl && savedUser) rememberEl.checked = true;
  } catch (_) {}

  // Toggle de senha (👁)
  document.querySelectorAll('[data-toggle="password"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!senhaEl) return;
      const isHidden = senhaEl.type === "password";
      senhaEl.type = isHidden ? "text" : "password";
      btn.setAttribute("aria-pressed", isHidden ? "true" : "false");
      btn.setAttribute("aria-label", isHidden ? "Ocultar senha" : "Mostrar senha");
    });
  });

  // Limpa mensagens ao digitar
  [usuarioEl, senhaEl].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", () => {
      hideError(errorBox);
      hideSuccess(successBox);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario = String(usuarioEl?.value || "").trim();
    const senha = String(senhaEl?.value || "").trim();

    hideError(errorBox);
    hideSuccess(successBox);

    if (!usuario || !senha) {
      showError(errorBox, "Preencha usuário/e-mail e senha.");
      return;
    }

    if (senha.length < 3) {
      showError(errorBox, "Sua senha parece curta demais. Verifique e tente novamente.");
      return;
    }

    setLoading(true, form, btnLogin);

    // Simula um pequeno atraso (melhor UX mesmo no protótipo)
    window.setTimeout(() => {
      const session = authenticate(usuario, senha);

      if (!session) {
        setLoading(false, form, btnLogin);
        showError(errorBox, "Usuário ou senha inválidos.");
        return;
      }

      if (expectedRole && session.role !== expectedRole) {
        setLoading(false, form, btnLogin);
        showError(
          errorBox,
          expectedRole === "candidato"
            ? "Este acesso é exclusivo para candidatos."
            : "Este acesso é exclusivo para recrutadores."
        );
        return;
      }

      // Lembrar usuário
      try {
        if (rememberEl?.checked) localStorage.setItem("login_saved_user", usuario);
        else localStorage.removeItem("login_saved_user");
      } catch (_) {}

      // Sessão padronizada (compatível com páginas antigas)
      const now = new Date().toISOString();
      const normalized = {
        role: session.role,
        id: session.id,
        name: session.name || (session.role === "empresa" ? "Empresa" : "Candidato"),
        email:
          session.email ||
          (usuario.includes("@") ? usuario : `${session.role}@sce.local`),
        createdAt: session.createdAt || now,
        lastLoginAt: now,
      };

      localStorage.setItem("session", JSON.stringify(normalized));
      localStorage.setItem("auth", normalized.role);

      showSuccess(
        successBox,
        normalized.role === "empresa" ? "Login realizado! Indo para o painel…" : "Bem-vindo! Abrindo seu painel…"
      );

      // Redireciona por papel
      window.setTimeout(() => {
        window.location.href =
          normalized.role === "empresa" ? "painel-empresa.html" : "painel-candidato.html";
      }, 600);
    }, 350);
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
      id: 2,
      name: "Empresa Teste",
      email: u.includes("@") ? u : "empresa@sce.local",
    };
  }

  // Se existir um cadastro salvo (projeto usa bancoTalentos em outros pontos)
  try {
    const bancoTalentos = JSON.parse(localStorage.getItem("bancoTalentos") || "[]");
    // Tentativa: achar por email/usuario e senha (se você já salva esses campos)
    const found = Array.isArray(bancoTalentos)
      ? bancoTalentos.find((c) => {
          const email = String(c.email || c.usuario || "").toLowerCase();
          const senha = String(c.senha || "");
          return email && email === u && senha && senha === p;
        })
      : null;

    if (found) {
      return {
        role: "candidato",
        id: found.id || 3,
        name: found.nome || "Candidato",
        email: found.email || u,
      };
    }
  } catch (_) {}

  return null;
}

/* =========================
   UI (mensagens / loading)
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

function showSuccess(box, message) {
  if (!box) return;
  box.textContent = message;
}

function hideSuccess(box) {
  if (!box) return;
  box.textContent = "";
}

function setLoading(isLoading, form, btn) {
  try {
    form?.classList.toggle("auth-loading", !!isLoading);
  } catch (_) {}

  if (btn) {
    btn.disabled = !!isLoading;
    btn.textContent = isLoading ? "Entrando…" : "Entrar";
  }
}
