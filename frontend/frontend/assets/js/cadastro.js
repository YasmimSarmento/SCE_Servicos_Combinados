document.getElementById("formCadastro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const resposta = await apiPost("/cadastro", formData);

  alert("Cadastro enviado!");
});