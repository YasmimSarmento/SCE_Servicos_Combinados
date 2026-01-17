 // Renderiza a lista de vagas em um container

function renderListaVagas(vagas, container) {
  container.innerHTML = "";

  if (!vagas || vagas.length === 0) {
    container.innerHTML = `
      <p class="vagas-vazias">
        Nenhuma vaga disponível no momento.
      </p>
    `;
    return;
  }

  vagas.forEach((vaga) => {
    const card = document.createElement("div");
    card.classList.add("vaga-card");

    card.innerHTML = `
      <h3>${vaga.titulo}</h3>
      <p class="vaga-localizacao">${vaga.localizacao}</p>
      <p class="vaga-tipo">${vaga.tipo}</p>

      <button 
        class="btn-detalhes" 
        data-id="${vaga.id}">
        Ver detalhes
      </button>
    `;

    container.appendChild(card);
  });
}

// Renderiza uma vaga específica (detalhe)
function renderDetalheVaga(vaga, container) {
  if (!vaga) {
    container.innerHTML = "<p>Vaga não encontrada.</p>";
    return;
  }

  container.innerHTML = `
    <h2>${vaga.titulo}</h2>

    <p><strong>Localização:</strong> ${vaga.localizacao}</p>
    <p><strong>Tipo:</strong> ${vaga.tipo}</p>

    <section>
      <h3>Descrição</h3>
      <p>${vaga.descricao}</p>
    </section>

    <section>
      <h3>Requisitos</h3>
      <p>${vaga.requisitos}</p>
    </section>

    <button class="btn-candidatar">
      Candidatar-se
    </button>
  `;
}
