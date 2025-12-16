/* =====================================================================
   vagas.js — Listagem e filtros de vagas
   Projeto: SCE – Banco de Talentos
===================================================================== */

/* ---------------------------------------------------------------------
   1. Lista de vagas (simulação de banco de dados)
--------------------------------------------------------------------- */
const vagas = [
    {
        id: 1,
        titulo: "Auxiliar Administrativo",
        local: "Belém - PA",
        tipo: "CLT",
        area: "Administrativo",
        descricao: "Atuação em rotinas administrativas, organização de documentos e suporte ao setor.",
        requisitos: [
            "Ensino médio completo",
            "Conhecimento básico em informática"
        ],
        beneficios: [
            "Vale transporte",
            "Vale alimentação"
        ],
        salario: "R$ 1.412,00"
    },
    {
        id: 2,
        titulo: "Atendente de Ouvidoria",
        local: "Belém - PA",
        tipo: "CLT",
        area: "Atendimento",
        descricao: "Registro de demandas, orientação ao público e acompanhamento de solicitações.",
        requisitos: [
            "Boa comunicação",
            "Ensino médio completo"
        ],
        beneficios: [
            "Vale transporte"
        ],
        salario: "R$ 1.500,00"
    },
    {
        id: 3,
        titulo: "Auxiliar de Serviços Gerais",
        local: "Ananindeua - PA",
        tipo: "Temporário",
        area: "Serviços Gerais",
        descricao: "Limpeza e manutenção de ambientes internos.",
        requisitos: [
            "Ensino fundamental"
        ],
        beneficios: [
            "Vale transporte"
        ],
        salario: "R$ 1.320,00"
    },
    {
        id: 4,
        titulo: "Estagiário de Administração",
        local: "Marituba - PA",
        tipo: "Estágio",
        area: "Administrativo",
        descricao: "Suporte às rotinas administrativas e controle de documentos.",
        requisitos: [
            "Cursando Administração"
        ],
        beneficios: [
            "Auxílio transporte"
        ],
        salario: "Bolsa estágio"
    }
];

/* ---------------------------------------------------------------------
   2. Renderização das vagas
--------------------------------------------------------------------- */
function renderizarVagas(lista) {
    const container = document.getElementById("lista-vagas");
    container.innerHTML = "";

    if (!lista.length) {
        container.innerHTML = "<p>Nenhuma vaga encontrada.</p>";
        return;
    }

    lista.forEach(vaga => {
        const card = document.createElement("article");
        card.className = "card-vaga";

        card.innerHTML = `
            <h2>${vaga.titulo}</h2>
            <p><strong>Área:</strong> ${vaga.area}</p>
            <p><strong>Local:</strong> ${vaga.local}</p>
            <p><strong>Tipo:</strong> ${vaga.tipo}</p>
            <p>${vaga.descricao}</p>
            <button class="btn btn-secundario">Ver detalhes</button>
        `;

        card.querySelector("button").addEventListener("click", () => {
            selecionarVaga(vaga);
        });

        container.appendChild(card);
    });
}

/* ---------------------------------------------------------------------
   3. Selecionar vaga
--------------------------------------------------------------------- */
function selecionarVaga(vaga) {
    localStorage.setItem("vagaSelecionada", JSON.stringify(vaga));
    window.location.href = "detalhe-vaga.html";
}

/* ---------------------------------------------------------------------
   4. Filtros
--------------------------------------------------------------------- */
function aplicarFiltros() {
    const palavra = document.getElementById("filtro-palavra").value.toLowerCase();
    const local = document.getElementById("filtro-local").value;
    const tipo = document.getElementById("filtro-tipo").value;

    const filtradas = vagas.filter(vaga =>
        (vaga.titulo.toLowerCase().includes(palavra) ||
         vaga.area.toLowerCase().includes(palavra)) &&
        (local === "" || vaga.local === local) &&
        (tipo === "" || vaga.tipo === tipo)
    );

    renderizarVagas(filtradas);
}

/* ---------------------------------------------------------------------
   5. Eventos dos filtros
--------------------------------------------------------------------- */
document.getElementById("filtro-palavra").addEventListener("input", aplicarFiltros);
document.getElementById("filtro-local").addEventListener("change", aplicarFiltros);
document.getElementById("filtro-tipo").addEventListener("change", aplicarFiltros);

/* ---------------------------------------------------------------------
   6. Inicialização
--------------------------------------------------------------------- */
renderizarVagas(vagas);
