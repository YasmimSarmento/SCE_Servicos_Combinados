document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const tipo = params.get("tipo");

  const btnVoltar = document.getElementById("btn-voltar");

  if (!btnVoltar) return;

  if (tipo === "empresa") {
    btnVoltar.href = "login-empresa.html";
  } else {
    btnVoltar.href = "login-candidato.html";
  }
});
