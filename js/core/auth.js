document.addEventListener("DOMContentLoaded", () => {
  const tipoUsuario = localStorage.getItem("auth");
  const pagina = document.body.dataset.page;

  // 🔒 Proteção de rota
  if (!tipoUsuario) {
    window.location.href = "login-candidato.html";
    return;
  }

  // 🔁 Impede acesso cruzado
  if (pagina !== tipoUsuario) {
    window.location.href =
      tipoUsuario === "empresa"
        ? "painel-empresa.html"
        : "painel-candidato.html";
    return;
  }

  // 🚪 Logout
  const btnLogout = document.getElementById("logout");

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("auth");
      window.location.href = "index.html";
    });
  }
});
