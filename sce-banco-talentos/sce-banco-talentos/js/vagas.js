const vagas = [
  {
    titulo: "Auxiliar Administrativo",
    local: "Belém - PA",
    tipo: "CLT",
    descricao: "Atuação em setor administrativo da SCE.",
  },
  {
    titulo: "Atendente de Ouvidoria",
    local: "Belém - PA",
    tipo: "CLT",
    descricao: "Atendimento ao público e registro de demandas.",
  },
];

function renderizarVagas(lista) {
  const container = document.getElementById("lista-vagas");
  container.innerHTML = "";

  if (lista.length === 0) {
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

renderizarVagas(vagas);
