// Lista de vagas cadastradas no sistema (por enquanto estática)
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

// Função responsável por exibir as vagas na tela
function renderizarVagas(lista) {
  const container = document.getElementById("lista-vagas");
  container.innerHTML = ""; // Limpa o conteúdo antes de preencher

  // Caso não tenha nenhuma vaga correspondente ao filtro
  if (lista.length === 0) {
    container.innerHTML = "<p>Nenhuma vaga encontrada.</p>";
    return;
  }

  // Cria um card para cada vaga
  lista.forEach((vaga) => {
    const card = document.createElement("article");
    card.classList.add("card-vaga");

    // Monta o conteúdo interno do card
    card.innerHTML = `
      <h2>${vaga.titulo}</h2>
      <p><strong>Local:</strong> ${vaga.local}</p>
      <p><strong>Tipo:</strong> ${vaga.tipo}</p>
      <p>${vaga.descricao}</p>
      <a href="cadastro.html" class="btn btn-secundario">Candidatar-se</a>
    `;

    container.appendChild(card); // Adiciona o card na página
  });
}

// Renderiza todas as vagas ao carregar a página
renderizarVagas(vagas);
