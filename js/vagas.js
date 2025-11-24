// =======================================================
// LISTA DE VAGAS (SIMULAÇÃO DE BANCO DE DADOS)
// =======================================================
const vagas = [
    {
        titulo: "Auxiliar Administrativo",
        local: "Belém - PA",
        tipo: "CLT",
        area: "Administrativo",
        descricao: "Atuação em rotinas administrativas, organização de documentos e suporte ao setor."
    },
    {
        titulo: "Atendente de Ouvidoria",
        local: "Belém - PA",
        tipo: "CLT",
        area: "Atendimento",
        descricao: "Responsável por registrar demandas, orientar o público e acompanhar solicitações."
    },
    {
        titulo: "Auxiliar de Serviços Gerais",
        local: "Ananindeua - PA",
        tipo: "Temporário",
        area: "Serviços Gerais",
        descricao: "Responsável pela limpeza e manutenção de ambientes internos."
    },
    {
        titulo: "Estagiário de Administração",
        local: "Marituba - PA",
        tipo: "Estágio",
        area: "Administrativo",
        descricao: "Suporte às rotinas administrativas e auxílio no controle de documentos."
    }
];


// =======================================================
// FUNÇÃO PARA RENDERIZAR AS VAGAS NA TELA
// =======================================================
function renderizarVagas(lista) {
    const container = document.getElementById("lista-vagas");
    container.innerHTML = "";

    if (lista.length === 0) {
        container.innerHTML = "<p>Nenhuma vaga encontrada.</p>";
        return;
    }

    lista.forEach(vaga => {
        const card = document.createElement("article");
        card.classList.add("card-vaga");

        card.innerHTML = `
            <h2>${vaga.titulo}</h2>
            <p><strong>Área:</strong> ${vaga.area}</p>
            <p><strong>Local:</strong> ${vaga.local}</p>
            <p><strong>Tipo:</strong> ${vaga.tipo}</p>
            <p>${vaga.descricao}</p>
            <a href="cadastro.html" class="btn btn-secundario">Candidatar-se</a>
        `;

        container.appendChild(card);
    });
}


// =======================================================
// FILTROS
// =======================================================
function aplicarFiltros() {
    const palavra = document.getElementById("filtro-palavra").value.toLowerCase();
    const local = document.getElementById("filtro-local").value;
    const tipo = document.getElementById("filtro-tipo")?.value || "";

    const filtradas = vagas.filter(vaga => {
        const matchPalavra =
            vaga.titulo.toLowerCase().includes(palavra) ||
            vaga.area.toLowerCase().includes(palavra);

        const matchLocal = local === "" || vaga.local === local;
        const matchTipo = tipo === "" || vaga.tipo === tipo;

        return matchPalavra && matchLocal && matchTipo;
    });

    renderizarVagas(filtradas);
}


// =======================================================
// EVENTOS DOS FILTROS
// =======================================================
document.getElementById("filtro-palavra")
    .addEventListener("input", aplicarFiltros);

document.getElementById("filtro-local")
    .addEventListener("change", aplicarFiltros);

if (document.getElementById("filtro-tipo")) {
    document.getElementById("filtro-tipo")
        .addEventListener("change", aplicarFiltros);
}


// =======================================================
// INICIALIZAÇÃO
// =======================================================
renderizarVagas(vagas);
