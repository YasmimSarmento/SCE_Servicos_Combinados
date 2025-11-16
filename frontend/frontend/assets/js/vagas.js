async function carregarVagas() {
  const vagas = await apiGet("/vagas");

  const container = document.getElementById("lista-vagas");
  container.innerHTML = "";

  vagas.forEach(v => {
    container.innerHTML += `
      <div class="card">
        <h3>${v.titulo}</h3>
        <p>${v.descricao}</p>
        <button class="btn">Detalhes</button>
      </div>
    `;
  });
}

carregarVagas();