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
            descricao: "Rotinas administrativas, organização de documentos, apoio ao setor e atendimento interno.",
            salario: "R$ 1.412,00",
            requisitos: [
                "Ensino médio completo",
                "Noções de Excel e organização de arquivos",
                "Boa comunicação e pontualidade"
            ],
            beneficios: [
                "Vale-transporte",
                "Vale-alimentação",
                "Plano de saúde (coparticipação)"
            ]
        },
        {
            id: 2,
            titulo: "Atendente de Ouvidoria",
            local: "Belém - PA",
            tipo: "CLT",
            area: "Atendimento",
            descricao: "Atendimento ao público, registro de manifestações, encaminhamentos e acompanhamento de demandas.",
            salario: "R$ 1.550,00",
            requisitos: [
                "Ensino médio completo",
                "Boa escrita e digitação",
                "Experiência com atendimento (desejável)"
            ],
            beneficios: [
                "Vale-transporte",
                "Vale-refeição",
                "Seguro de vida"
            ]
        },
        {
            id: 3,
            titulo: "Jovem Aprendiz (Administrativo)",
            local: "Ananindeua - PA",
            tipo: "Aprendiz",
            area: "Geral",
            descricao: "Auxílio em rotinas administrativas, atendimento e organização de materiais. Ideal para primeiro emprego.",
            salario: "R$ 850,00",
            requisitos: [
                "Ter entre 14 e 24 anos (conforme lei)",
                "Estar estudando ou ter concluído o ensino médio",
                "Conhecimento básico de informática"
            ],
            beneficios: [
                "Vale-transporte",
                "Carga horária reduzida",
                "Treinamento e desenvolvimento"
            ]
        },
        {
            id: 4,
            titulo: "Auxiliar de Serviços Gerais",
            local: "Belém - PA",
            tipo: "CLT",
            area: "Serviços Gerais",
            descricao: "Limpeza, organização do ambiente, apoio operacional e reposição de materiais.",
            salario: "R$ 1.412,00",
            requisitos: [
                "Ensino fundamental completo",
                "Disponibilidade de horário",
                "Compromisso com rotinas e qualidade"
            ],
            beneficios: [
                "Vale-transporte",
                "Vale-alimentação",
                "Adicional (quando aplicável)"
            ]
        },

        /* =========================
           VAGAS DE SEGURANÇA
        ========================= */

        {
            id: 5,
            titulo: "Vigilante Patrimonial (Reciclagem em dia)",
            local: "Belém - PA",
            tipo: "CLT",
            area: "Segurança",
            descricao: "Rondas, controle de acesso, prevenção de perdas e registro de ocorrências em unidade patrimonial.",
            salario: "R$ 2.050,00",
            requisitos: [
                "Curso de Vigilante (formação) com reciclagem em dia",
                "Disponibilidade para escala 12x36",
                "Boa postura e atenção a procedimentos"
            ],
            beneficios: [
                "Vale-transporte",
                "Vale-alimentação",
                "Adicional noturno (quando aplicável)",
                "Plano odontológico"
            ]
        },
        {
            id: 6,
            titulo: "Porteiro / Controlador de Acesso",
            local: "Belém - PA",
            tipo: "CLT",
            area: "Segurança",
            descricao: "Controle de entrada e saída de pessoas e veículos, identificação, registro e apoio na segurança do local.",
            salario: "R$ 1.620,00",
            requisitos: [
                "Ensino médio completo",
                "Experiência em portaria/controle de acesso (desejável)",
                "Noções de informática para registros"
            ],
            beneficios: [
                "Vale-transporte",
                "Vale-refeição",
                "Seguro de vida"
            ]
        },
        {
            id: 7,
            titulo: "Técnico de Segurança do Trabalho",
            local: "Ananindeua - PA",
            tipo: "CLT",
            area: "Segurança do Trabalho",
            descricao: "Inspeções, treinamentos, orientação de EPIs, relatórios e integração conforme normas de SST.",
            salario: "R$ 2.800,00",
            requisitos: [
                "Curso Técnico em Segurança do Trabalho completo",
                "Conhecimento de NR's (NR-06, NR-35, NR-10 como diferencial)",
                "Organização para relatórios e checklists"
            ],
            beneficios: [
                "Vale-transporte",
                "Vale-alimentação",
                "Plano de saúde",
                "Day off no aniversário"
            ]
        },
        {
            id: 8,
            titulo: "Eletricista Predial (NR-10 obrigatória)",
            local: "Belém - PA",
            tipo: "CLT",
            area: "Manutenção / Segurança",
            descricao: "Manutenção elétrica predial, inspeções e correções com foco em segurança e conformidade.",
            salario: "R$ 2.450,00",
            requisitos: [
                "Experiência com elétrica predial",
                "Certificado NR-10 (obrigatório)",
                "Desejável NR-35 para trabalho em altura",
                "Boa leitura de diagramas básicos"
            ],
            beneficios: [
                "Vale-transporte",
                "Vale-refeição",
                "Adicional de periculosidade (quando aplicável)"
            ]
        },
        {
            id: 9,
            titulo: "Trabalhador em Altura (NR-35) — Apoio Operacional",
            local: "Marituba - PA",
            tipo: "Temporário",
            area: "Segurança / Operações",
            descricao: "Apoio em atividades com trabalho em altura, organização de equipamentos e cumprimento de procedimentos.",
            salario: "R$ 1.980,00",
            requisitos: [
                "Certificado NR-35 (obrigatório)",
                "Aptidão para atividades operacionais",
                "Compromisso com procedimentos de segurança"
            ],
            beneficios: [
                "Vale-transporte",
                "Vale-alimentação",
                "Seguro de vida"
            ]
        },

        /* =========================
           VAGAS DE TI (PCD)
        ========================= */

        {
            id: 10,
            titulo: "Assistente de Suporte TI (PCD)",
            local: "Belém - PA",
            tipo: "CLT",
            area: "TI (PCD)",
            descricao: "Suporte N1: atendimento a usuários, chamados, instalações e apoio básico de redes.",
            salario: "R$ 2.100,00",
            requisitos: [
                "Vaga afirmativa para PCD (necessário laudo médico)",
                "Conhecimentos básicos: Windows, Office e impressoras",
                "Noções de redes (Wi-Fi, cabo, IP)",
                "Boa comunicação e organização"
            ],
            beneficios: [
                "Vale-transporte",
                "Vale-refeição",
                "Plano de saúde",
                "Ambiente acessível e inclusivo"
            ]
        },
        {
            id: 11,
            titulo: "Desenvolvedor(a) Front-end Júnior (PCD)",
            local: "Remoto / Belém - PA",
            tipo: "Estágio",
            area: "TI (PCD)",
            descricao: "Manutenção de telas e pequenas features com HTML/CSS/JavaScript. Desejável noções de Git.",
            salario: "R$ 3.200,00",
            requisitos: [
                "Vaga afirmativa para PCD (necessário laudo médico)",
                "HTML, CSS e JavaScript básico/intermediário",
                "Desejável noções de Git e responsividade",
                "Portfólio/projetos ajudam muito"
            ],
            beneficios: [
                "Auxílio home office",
                "Plano de saúde",
                "Vale-refeição",
                "Treinamento e mentoria"
            ]
        }
    ];

    /* -----------------------------------------------------------------
       SESSÃO / ROLE (PADRÃO)
    ----------------------------------------------------------------- */
    function getSession() {
        try {
            return JSON.parse(localStorage.getItem("session") || "null");
        } catch {
            return null;
        }
    }

    function getRole() {
        const session = getSession();
        if (session?.role) return session.role;
        return localStorage.getItem("auth"); // fallback
    }

    /* -----------------------------------------------------------------
       RENDER
    ----------------------------------------------------------------- */
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
        const session = getSession();
        const role = getRole();

        // ✅ exige login de candidato antes de iniciar cadastro para a vaga
        if (!session?.role) {
            alert("Faça login como candidato para se candidatar.");
            window.location.href = "login-candidato.html";
            return;
        }

        if (role !== "candidato") {
            alert("Apenas candidatos podem se candidatar a vagas.");
            return;
        }

        // ✅ guarda vaga selecionada e manda pro cadastro
        localStorage.setItem("vagaSelecionada", JSON.stringify(vaga));
        window.location.href = "cadastro.html";
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
            (v.titulo.toLowerCase().includes(palavra) || v.area.toLowerCase().includes(palavra)) &&
            (local === "" || v.local === local) &&
            (tipo === "" || v.tipo === tipo)
        );

        renderizarVagas(filtradas);
    }

    if (filtroPalavraEl) filtroPalavraEl.addEventListener("input", aplicarFiltros);
    if (filtroLocalEl) filtroLocalEl.addEventListener("change", aplicarFiltros);
    if (filtroTipoEl) filtroTipoEl.addEventListener("change", aplicarFiltros);

    /* -----------------------------------------------------------------
       INIT
    ----------------------------------------------------------------- */
    renderizarVagas(VAGAS);

})();
