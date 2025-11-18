/* =====================================================================
   vagas.js — Sistema de listagem e filtro de vagas (Frontend)
   Projeto: SCE – Banco de Talentos
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. Base de dados (temporária)
   Em produção, isso vai virar uma chamada API:
   fetch("https://api.sce.com/vagas")
--------------------------------------------------------------------- */
const vagas = [
    {
        id: 1,
        titulo: "Assistente Administrativo",
        area: "Administração",
        local: "Belém - PA",
        descricao: "Auxiliar em rotinas administrativas, organização de documentos e atendimento interno."
    },
    {
        id: 2,
        titulo: "Atendente de Loja",
        area: "Varejo",
        local: "Ananindeua - PA",
        descricao: "Atendimento ao cliente, organização de estoque e operação de caixa."
    },
    {
        id: 3,
        titulo: "Auxiliar de Logística",
        area: "Logística",
        local: "Belém - PA",
        descricao: "Separação de pedidos, conferência de cargas e apoio no setor de distribuição."
    }
];


/* ---------------------------------------------------------------------
   2. Elementos do DOM
--------------------------------------------------------------------- */
const listaVagas = document.getElementById("lista-vagas");
const inputBusca = document.getElementById("filtro-palavra");
const selectLocal = document.getElementById("filtro-local");


/* ---------------------------------------------------------------------
   3. Exibir vagas na tela
--------------------------------------------------------------------- */
function renderizarVagas(lista) {
    listaVagas.innerHTML = "";

    if (lista.length === 0) {
        listaVagas.innerHTML = `
            <p class="nenhum-resultado">
                Nenhuma vaga encontrada. Tente alterar os filtros.
            </p>
        `;
        return;
    }

    lista.forEach(vaga => {
        const card = document.createElement("div");
        card.classList.add("vaga-card");

        card.innerHTML = `
            <h2>${vaga.titulo}</h2>
            <p><strong>Área:</strong> ${vaga.area}</p>
            <p><strong>Local:</strong> ${vaga.local}</p>
            <p class="descricao">${vaga.descricao}</p>
            <button class="btn-candidatar">Candidatar-se</button>
        `;

        listaVagas.appendChild(card);
    });
}


/* ---------------------------------------------------------------------
   4. Sistema de Filtros
--------------------------------------------------------------------- */
function filtrarVagas() {
    const texto = inputBusca.value.toLowerCase().trim();
    const local = selectLocal.value;

    const filtradas = vagas.filter(vaga => {
        const combinaTexto =
            vaga.titulo.toLowerCase().includes(texto) ||
            vaga.area.toLowerCase().includes(texto);

        const combinaLocal =
            !local || vaga.local === local;

        return combinaTexto && combinaLocal;
    });

    renderizarVagas(filtradas);
}


/* ---------------------------------------------------------------------
   5. Eventos
--------------------------------------------------------------------- */
inputBusca.addEventListener("input", filtrarVagas);
selectLocal.addEventListener("change", filtrarVagas);


/* ---------------------------------------------------------------------
   6. Inicialização da página
--------------------------------------------------------------------- */
renderizarVagas(vagas);
