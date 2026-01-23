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
            descricao: "Atendimento ao público, registro de manifestações e encaminhamentos.",
            salario: "R$ 1.550,00"
        },
        {
            id: 3,
            titulo: "Jovem Aprendiz",
            local: "Ananindeua - PA",
            tipo: "Aprendiz",
            area: "Geral",
            descricao: "Auxílio em rotinas administrativas e atendimento.",
            salario: "R$ 850,00"
        },
        {
            id: 4,
            titulo: "Auxiliar de Serviços Gerais",
            local: "Belém - PA",
            tipo: "CLT",
            area: "Serviços Gerais",
            descricao: "Limpeza e organização do ambiente, suporte operacional.",
            salario: "R$ 1.412,00"
        }
    ];

    /* -----------------------------------------------------------------
       HELPERS
    ----------------------------------------------------------------- */
    function getAuth() {
        // Mantém compatibilidade: alguns lugares usam "session", outros "auth"
        const session = JSON.parse(localStorage.getItem("session") || "null");
        if (session && session.role) return session.role;
        return localStorage.getItem("auth"); // "candidato" ou "empresa"
    }

    function renderizarVagas(listaVagas) {
        const lista = document.getElementById("lista-vagas");
        if (!lista) return;

        lista.innerHTML = "";

        if (!listaVagas.length) {
            lista.innerHTML = `<p class="empty">Nenhuma vaga encontrada.</p>`;
            return;
        }

        listaVagas.forEach(vaga => {
            const card = document.createElement("div");
            card.className = "card-vaga";

            card.innerHTML = `
                <h3>${vaga.titulo}</h3>
                <p><strong>Local:</strong> ${vaga.local}</p>
                <p><strong>Tipo:</strong> ${vaga.tipo}</p>
                <p><strong>Área:</strong> ${vaga.area}</p>
                <p class="descricao">${vaga.descricao}</p>

                <div class="acoes">
                    <button class="btn-sec" data-action="detalhes">Ver detalhes</button>
                    <button class="btn-pri" data-action="candidatar">Candidatar-se</button>
                </div>
            `;

            const btnDetalhes = card.querySelector('[data-action="detalhes"]');
            const btnCandidatar = card.querySelector('[data-action="candidatar"]');

            if (btnDetalhes) btnDetalhes.addEventListener("click", () => abrirDetalhes(vaga));
            if (btnCandidatar) btnCandidatar.addEventListener("click", () => candidatar(vaga));

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
            alert("Faça login como candidato para se candidatar.");
            window.location.href = "login-candidato.html";
            return;
        }

        if (auth !== "candidato") {
            alert("Apenas candidatos podem se candidatar a vagas.");
            return;
        }

        const session = JSON.parse(localStorage.getItem("session") || "null");
        const email = session?.email || "anon";

        const candidaturas = JSON.parse(localStorage.getItem("candidaturas") || "[]");

        // evita candidatura duplicada do mesmo usuário na mesma vaga
        const jaExiste = candidaturas.some(c => c.vagaId === vaga.id && c.email === email);
        if (jaExiste) {
            alert("Você já se candidatou a esta vaga.");
            return;
        }

        candidaturas.push({
            vagaId: vaga.id,
            titulo: vaga.titulo,
            local: vaga.local,
            tipo: vaga.tipo,
            area: vaga.area,
            data: new Date().toISOString(),
            email
        });

        localStorage.setItem("candidaturas", JSON.stringify(candidaturas));
        alert("Candidatura enviada com sucesso!");
    }

    /* -----------------------------------------------------------------
       FILTROS
    ----------------------------------------------------------------- */
    const filtroPalavraEl = document.getElementById("filtro-palavra");
    const filtroLocalEl = document.getElementById("filtro-local");
    const filtroTipoEl = document.getElementById("filtro-tipo");

    function aplicarFiltros() {
        const palavra = (filtroPalavraEl?.value || "").toLowerCase();
        const local = filtroLocalEl?.value || "";
        const tipo = filtroTipoEl?.value || "";

        const filtradas = VAGAS.filter(v =>
            (v.titulo.toLowerCase().includes(palavra) ||
             v.area.toLowerCase().includes(palavra)) &&
            (local === "" || v.local === local) &&
            (tipo === "" || v.tipo === tipo)
        );

        renderizarVagas(filtradas);
    }

    // Se os filtros não existirem (script incluído em outra página), não quebra.
    if (filtroPalavraEl) filtroPalavraEl.addEventListener("input", aplicarFiltros);
    if (filtroLocalEl) filtroLocalEl.addEventListener("change", aplicarFiltros);
    if (filtroTipoEl) filtroTipoEl.addEventListener("change", aplicarFiltros);

    /* -----------------------------------------------------------------
       INIT
    ----------------------------------------------------------------- */
    renderizarVagas(VAGAS);

})();
