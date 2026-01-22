document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorBox = document.getElementById("login-error");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario");
    const senha = document.getElementById("senha");

    if (!usuario || !senha) return;

    // limpa erro
    hideError(errorBox);

    const session = authenticate(usuario.value.trim(), senha.value);

    if (!session) {
      showError(errorBox, "Usuário ou senha inválidos.");
      return;
    }

    // completa a sessão com o usuário digitado (usado depois nas candidaturas)
    session.email = usuario.value.trim();

    // cria sessão
    localStorage.setItem("session", JSON.stringify(session));

    // compatibilidade com páginas que ainda usam "auth"
    localStorage.setItem("auth", session.role);

    // redireciona direto para o painel correto
    if (session.role === "candidato") {
      window.location.href = "painel-candidato.html";
    } else if (session.role === "empresa") {
      window.location.href = "painel-empresa.html";
    } else {
      window.location.href = "index.html";
    }
  });
});

/* =========================
   AUTENTICAÇÃO SIMULADA
========================= */

function authenticate(user, pass) {
  if (user === "candidato" && pass === "123") {
    return {
      role: "candidato",
      id: 1,
      name: "Candidato Teste",
    };
  }

  if (user === "empresa" && pass === "123") {
    return {
      role: "empresa",
      id: 100,
      name: "Empresa Teste",
    };
  }

  return null;
}

/* =========================
   UI DE ERRO
========================= */

function showError(box, message) {
  box.textContent = message;
  box.classList.add("ativo");
}

function hideError(box) {
  box.textContent = "";
  box.classList.remove("ativo");
}
