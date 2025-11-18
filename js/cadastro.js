// Seleciona o formulário e o elemento onde será exibida a mensagem de retorno
const form = document.getElementById("form-cadastro");
const mensagem = document.getElementById("mensagem-retorno");

// Adiciona evento de envio do formulário
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Impede o recarregamento da página

  // Captura os valores dos campos necessários
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const linkCv = document.getElementById("link-cv").value.trim();
  const lgpd = document.getElementById("lgpd").checked;

  // Validação simples: verifica se os campos obrigatórios foram preenchidos
  if (!nome || !email || !linkCv || !lgpd) {
    mensagem.textContent =
      "Por favor, preencha todos os campos obrigatórios e aceite o termo.";
    mensagem.classList.add("erro");
    return;
  }

  // Aqui futuramente entra a parte que envia os dados para o back-end (ex: fetch)
  mensagem.textContent =
    "Currículo enviado com sucesso! Em breve a SCE poderá entrar em contato.";
  mensagem.classList.remove("erro");
  mensagem.classList.add("sucesso");

  // Limpa os campos do formulário após o envio
  form.reset();
});
