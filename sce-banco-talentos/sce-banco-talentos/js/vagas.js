async function carregarVagas() {
  try {
    const resposta = await fetch("http://localhost:3000/vagas");

    if (!resposta.ok) {
      throw new Error("Erro ao carregar vagas do servidor");
    }

    const vagas = await resposta.json();
    renderizarVagas(vagas);
  } catch (erro) {
    console.error("Erro ao carregar vagas:", erro);
    const container = document.getElementById("lista-vagas");
    container.innerHTML =
      "<p>Erro ao carregar vagas. Tente novamente mais tarde.</p>";
  }
}

function renderizarVagas(lista) {
  const container = document.getElementById("lista-vagas");
  container.innerHTML = "";

  if (!lista || lista.length === 0) {
    container.innerHTML = "<p>Nenhuma vaga encontrada.</p>";
    return;
  }

  lista.forEach((vaga) => {
    const card = document.createElement("article");
    card.classList.add("card-vaga");

    card.innerHTML = `
      <h2>${vaga.titulo}</h2>
      <p><strong>Local:</strong> ${vaga.local}</p>
      <p><strong>Tipo:</strong> ${vaga.tipo}</p>
      <p>${vaga.descricao}</p>
      <a href="cadastro.html" class="btn btn-secundario">Candidatar-se</a>
    `;

    container.appendChild(card);
  });
}

// Executa ao carregar a página
carregarVagas();
