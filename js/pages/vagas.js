/* =====================================================================
   vagas.js — Listagem e filtros de vagas
   Projeto: SCE – Banco de Talentos
===================================================================== */

(function () {

    /* -----------------------------------------------------------------
       DADOS (simulação de backend)
    ----------------------------------------------------------------- */
    const VAGAS = [
        {
            id: 1,
            titulo: "Auxiliar Administrativo",
            local: "Belém - PA",
            tipo: "CLT",
            area: "Administrativo",
            descricao: "Atuação em rotinas administrativas, organização de documentos e suporte ao setor.",
            salario: "R$ 1.412,00"
        },
        {
            id: 2,
            titulo: "Atendente de Ouvidoria",
            local: "Belém - PA",
            tipo: "CLT",
            area: "Atendimento",
            descricao: "Registro de demandas, orientação ao público e acompanhamento de solicitações.",
            salario: "R$ 1.500,00"
        },
        {
            id: 3,
            titulo: "Auxiliar de Serviços Gerais",
            local: "Ananindeua - PA",
            tipo: "Temporário",
            area: "Serviços Gerais",
            descricao: "Limpeza e manutenção de ambientes internos.",
            salario: "R$ 1.320,00"
        },
        {
            id: 4,
            titulo: "Estagiário de Administração",
            local: "Marituba - PA",
            tipo: "Estágio",
            area: "Administrativo",
            descricao: "Suporte às rotinas administrativas e controle de documentos.",
            salario: "Bolsa estágio"
        }
    ];

    const lista = document.getElementById("lista-vagas");

    /* -----------------------------------------------------------------
       AUTENTICAÇÃO
    ----------------------------------------------------------------- */
    function getAuth() {
        return localStorage.getItem("auth");
    }

    /* -----------------------------------------------------------------
       RENDERIZAÇÃO
    ----------------------------------------------------------------- */
    function renderizarVagas(vagas) {
        lista.innerHTML = "";

        if (!vagas.length) {
            lista.innerHTML = "<p>Nenhuma vaga encontrada.</p>";
            return;
        }

        vagas.forEach(vaga => {
            const card = document.createElement("article");
            card.className = "card-vaga";

            card.innerHTML = `
                <h2>${vaga.titulo}</h2>
                <p><strong>Área:</strong> ${vaga.area}</p>
                <p><strong>Local:</strong> ${vaga.local}</p>
                <p><strong>Tipo:</strong> ${vaga.tipo}</p>
                <p class="descricao">${vaga.descricao}</p>

                <div class="acoes">
                    <button class="btn btn-secundario">Ver detalhes</button>
                    <button class="btn">Candidatar-se</button>
                </div>
            `;

            const [btnDetalhes, btnCandidatar] = card.querySelectorAll("button");

            btnDetalhes.addEventListener("click", () => abrirDetalhes(vaga));
            btnCandidatar.addEventListener("click", () => candidatar(vaga));

            lista.appendChild(card);
        });
    }

    /* -----------------------------------------------------------------
       AÇÕES
    ----------------------------------------------------------------- */
    function abrirDetalhes(vaga) {
        localStorage.setItem("vagaSelecionada", JSON.stringify(vaga));
        window.location.href = "detalhe-vaga.html";
    }

    function candidatar(vaga) {
        const auth = getAuth();

        if (!auth) {
            alert("Para se candidatar, faça login como candidato.");
            window.location.href = "login-candidato.html";
            return;
        }

        if (auth !== "candidato") {
            alert("Apenas candidatos podem se candidatar a vagas.");
            return;
        }

        localStorage.setItem("vagaSelecionada", JSON.stringify(vaga));
        window.location.href = "cadastro.html";
    }

    /* -----------------------------------------------------------------
       FILTROS
    ----------------------------------------------------------------- */
    function aplicarFiltros() {
        const palavra = document.getElementById("filtro-palavra").value.toLowerCase();
        const local = document.getElementById("filtro-local").value;
        const tipo = document.getElementById("filtro-tipo").value;

        const filtradas = VAGAS.filter(v =>
            (v.titulo.toLowerCase().includes(palavra) ||
             v.area.toLowerCase().includes(palavra)) &&
            (local === "" || v.local === local) &&
            (tipo === "" || v.tipo === tipo)
        );

        renderizarVagas(filtradas);
    }

    document.getElementById("filtro-palavra").addEventListener("input", aplicarFiltros);
    document.getElementById("filtro-local").addEventListener("change", aplicarFiltros);
    document.getElementById("filtro-tipo").addEventListener("change", aplicarFiltros);

    /* -----------------------------------------------------------------
       INIT
    ----------------------------------------------------------------- */
    renderizarVagas(VAGAS);

})();
