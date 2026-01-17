document.addEventListener("DOMContentLoaded", () => {
  const containerVagas = document.getElementById("lista-vagas");
  const inputBusca = document.getElementById("busca-vaga");

  let vagas = [];


// Carrega e renderiza vagas abertas
  function carregarVagas() {
    vagas = getVagasAbertas(); // service
    renderListaVagas(vagas, containerVagas); // UI
  }

  // Filtra vagas por texto (título ou localização)
  function filtrarVagas(termo) {
    const termoLower = termo.toLowerCase();

    const vagasFiltradas = vagas.filter((vaga) =>
      vaga.titulo.toLowerCase().includes(termoLower) ||
      vaga.localizacao.toLowerCase().includes(termoLower)
    );

    renderListaVagas(vagasFiltradas, containerVagas);
  }

  // Eventos
  if (inputBusca) {
    inputBusca.addEventListener("input", (event) => {
      filtrarVagas(event.target.value);
    });
  }

  containerVagas.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-detalhes")) {
      const vagaId = event.target.dataset.id;
      window.location.href = `detalhe-vaga.html?id=${vagaId}`;
    }
  });

  // Inicialização
  carregarVagas();
});
