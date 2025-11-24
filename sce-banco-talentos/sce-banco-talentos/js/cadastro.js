const form = document.getElementById("form-cadastro");
const mensagem = document.getElementById("mensagem-retorno");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // impede recarregar a página agora

  // Exemplo bem simples de validação
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const linkCv = document.getElementById("link-cv").value.trim();
  const lgpd = document.getElementById("lgpd").checked;

  if (!nome || !email || !linkCv || !lgpd) {
    mensagem.textContent =
      "Por favor, preencha todos os campos obrigatórios e aceite o termo.";
    mensagem.classList.add("erro");
    return;
  }

  // Aqui no futuro entra o fetch() para o back-end
  mensagem.textContent =
    "Currículo enviado com sucesso! Em breve a SCE poderá entrar em contato.";
  mensagem.classList.remove("erro");
  mensagem.classList.add("sucesso");

  form.reset();
});
