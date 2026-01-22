document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorBox = document.getElementById("login-error");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario");
    const senha = document.getElementById("senha");

    if (!usuario || !senha) return;

    // limpa erro anterior
    errorBox.classList.remove("ativo");
    errorBox.textContent = "";

    if (usuario.value === "candidato" && senha.value === "123") {
      localStorage.setItem("auth", "candidato");
      window.location.href = "painel-candidato.html";
      return;
    }

    if (usuario.value === "empresa" && senha.value === "123") {
      localStorage.setItem("auth", "empresa");
      window.location.href = "painel-empresa.html";
      return;
    }

    // erro de login
    errorBox.textContent = "Usuário ou senha inválidos.";
    errorBox.classList.add("ativo");
  });
});
