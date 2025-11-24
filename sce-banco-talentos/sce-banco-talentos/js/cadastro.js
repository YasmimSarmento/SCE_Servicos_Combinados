const form = document.getElementById("form-cadastro");
const mensagem = document.getElementById("mensagem-retorno");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const estado = document.getElementById("estado").value.trim();
  const area = document.getElementById("area").value;
  const tipoVaga = document.getElementById("tipo-vaga").value;
  const linkCv = document.getElementById("link-cv").value.trim();
  const lgpd = document.getElementById("lgpd").checked;

  console.log("Dados coletados:", {
    nome,
    email,
    telefone,
    cidade,
    estado,
    area,
    tipoVaga,
    linkCv,
    lgpd,
  });

  if (
    !nome ||
    !email ||
    !telefone ||
    !cidade ||
    !estado ||
    !area ||
    !linkCv ||
    !lgpd
  ) {
    mensagem.textContent =
      "Por favor, preencha todos os campos obrigatórios e aceite o termo.";
    mensagem.classList.add("erro");
    return;
  }

  try {
    const dadosParaEnviar = {
      nome,
      email,
      telefone,
      cidade,
      estado,
      area_interesse: area,
      tipo_vaga: tipoVaga,
      link_cv: linkCv,
    };

    console.log("Enviando para API:", dadosParaEnviar);

    const resposta = await fetch("http://localhost:3000/curriculos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosParaEnviar),
    });

    console.log("Status da resposta:", resposta.status);
    console.log("Resposta OK?", resposta.ok);

    // Tente ler a resposta de erro do servidor
    const respostaTexto = await resposta.text();
    console.log("Resposta completa:", respostaTexto);

    if (!resposta.ok) {
      let erroMsg = "Falha no envio";
      try {
        const respostaJSON = JSON.parse(respostaTexto);
        erroMsg = respostaJSON.error || respostaJSON.details || erroMsg;
      } catch (e) {
        erroMsg = respostaTexto || erroMsg;
      }
      throw new Error(`Erro ${resposta.status}: ${erroMsg}`);
    }

    // Se chegou aqui, foi sucesso
    const dadosSucesso = JSON.parse(respostaTexto);
    console.log("Sucesso:", dadosSucesso);

    mensagem.textContent =
      "Currículo enviado com sucesso! Em breve a SCE poderá entrar em contato.";
    mensagem.classList.remove("erro");
    mensagem.classList.add("sucesso");

    form.reset();
  } catch (erro) {
    console.error("Erro completo:", erro);
    mensagem.textContent = `Erro ao enviar currículo: ${erro.message}`;
    mensagem.classList.add("erro");
  }
});
