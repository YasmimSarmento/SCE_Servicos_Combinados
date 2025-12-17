document.addEventListener("DOMContentLoaded", function () {
  // Pega os elementos do DOM
  const btnLogin = document.getElementById("btn-login-nav");
  const modal = document.getElementById("modal-login");
  const btnFechar = document.getElementById("fechar-login");

  // Verifica se os elementos chave existem
  if (!modal || !btnLogin) {
    console.error(
      "ERRO: Modal (#modal-login) ou Botão de Login (#btn-login-nav) não foram encontrados no DOM. Verifique a ordem do script."
    );
    return;
  }

  // Pega os elementos do formulário (dentro do modal)
  const formLogin = modal.querySelector(".form-login");
  const inputEmail = formLogin
    ? formLogin.querySelector('input[type="email"]')
    : null;
  const inputSenha = formLogin
    ? formLogin.querySelector('input[type="password"]')
    : null;

  let erroDisplay = null; // Variável para armazenar o elemento de erro dinâmico

  // ==========================================================
  // FUNÇÃO PRINCIPAL DE VALIDAÇÃO
  // ==========================================================

  function validarLogin(e) {
    e.preventDefault();

    if (!inputEmail || !inputSenha) {
      console.error(
        "Campos de e-mail ou senha não encontrados para validação."
      );
      return;
    }

    const email = inputEmail.value.trim();
    const senha = inputSenha.value.trim();
    let erros = [];

    // Limpa mensagens de erro antigas e cria o elemento se necessário
    if (!erroDisplay && modal.querySelector(".modal-box")) {
      // Cria o elemento de erro e o insere no modal
      erroDisplay = document.createElement("p");
      erroDisplay.id = "login-erro-msg";
      modal.querySelector(".modal-box").prepend(erroDisplay);
    }

    if (erroDisplay) {
      // Remove as classes de estilo dinâmicas caso elas não estejam no CSS
      erroDisplay.style.display = "none";
    }

    // --- 1. Validação de Campos Vazios ---
    if (email === "") {
      erros.push("O E-mail é obrigatório.");
    }
    if (senha === "") {
      erros.push("A Senha é obrigatória.");
    }

    // --- 2. Validação de Formato do E-mail (Regex) ---
    // Padrão: algo@algo.algo
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== "" && !regexEmail.test(email)) {
      erros.push("Insira um endereço de e-mail válido.");
    }

    // --- 3. Validação de Tamanho Mínimo da Senha ---
    const MIN_SENHA = 6;
    if (senha !== "" && senha.length < MIN_SENHA) {
      erros.push(`A senha deve ter pelo menos ${MIN_SENHA} caracteres.`);
    }

    // ==========================================================
    // EXIBIÇÃO DE ERROS
    // ==========================================================
    if (erros.length > 0) {
      if (erroDisplay) {
        // O estilo para #login-erro-msg está no seu login.css
        erroDisplay.textContent = "⚠️ Por favor, corrija: " + erros.join(" ");
        erroDisplay.style.display = "block";
      }
      return false;
    }

    // ==========================================================
    // SUCESSO (Simulação)
    // ==========================================================

    alert("Login realizado com sucesso! Redirecionando...");
    modal.classList.remove("aberto");
    inputEmail.value = "";
    inputSenha.value = "";
  }

  // ==========================================================
  // LISTENERS DE AÇÃO (Abrir/Fechar)
  // ==========================================================

  // Abre o modal ao clicar no botão do menu
  btnLogin.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("aberto");
  });

  // Fecha o modal ao clicar no X
  if (btnFechar) {
    btnFechar.addEventListener("click", () => {
      modal.classList.remove("aberto");
    });
  }

  // Fecha se clicar fora da caixinha branca
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("aberto");
    }
  });

  // Adiciona o listener para a submissão do formulário (validação)
  if (formLogin) {
    formLogin.addEventListener("submit", validarLogin);
  }
});
