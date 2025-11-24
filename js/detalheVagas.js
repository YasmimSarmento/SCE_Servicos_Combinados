// detalheVaga.js
// Script responsável por carregar e exibir os detalhes da vaga selecionada.

// --------------------------
// Função utilitária
// --------------------------
function obterParametro(nome) {
    const url = new URL(window.location.href);
    return url.searchParams.get(nome);
}

// --------------------------
// Carregar vagas do localStorage
// --------------------------
function carregarVagas() {
    const vagas = localStorage.getItem("vagas");
    return vagas ? JSON.parse(vagas) : [];
}

// --------------------------
// Renderizar dados da vaga
// --------------------------
function exibirDetalhesVaga() {
    const vagaId = obterParametro("id");
    const vagas = carregarVagas();

    const container = document.getElementById("detalhe-vaga");

    if (!vagaId) {
        container.innerHTML = `
            <p class="erro">ID da vaga não foi encontrado na URL.</p>
        `;
        return;
    }

    const vaga = vagas.find(v => v.id == vagaId);

    if (!vaga) {
        container.innerHTML = `
            <p class="erro">Vaga não encontrada ou removida.</p>
        `;
        return;
    }

    // Renderização da vaga
    container.innerHTML = `
        <h1>${vaga.titulo}</h1>
        <p class="empresa">${vaga.empresa || "Empresa confidencial"}</p>

        <div class="info">
            <p><strong>Local:</strong> ${vaga.local}</p>
            <p><strong>Área:</strong> ${vaga.area}</p>
            <p><strong>Tipo:</strong> ${vaga.tipo}</p>
        </div>

        <h2>Descrição da vaga</h2>
        <p class="descricao">${vaga.descricao}</p>

        <h2>Requisitos</h2>
        <ul class="lista-requisitos">
            ${(vaga.requisitos || []).map(req => `<li>${req}</li>`).join("")}
        </ul>

        <h2>Benefícios</h2>
        <ul class="lista-beneficios">
            ${(vaga.beneficios || []).map(ben => `<li>${ben}</li>`).join("")}
        </ul>

        <a href="cadastro.html?vaga=${vaga.id}" class="btn-candidatar">
            Candidatar-se
        </a>
    `;
}

// --------------------------
// Inicialização
// --------------------------
document.addEventListener("DOMContentLoaded", exibirDetalhesVaga);
