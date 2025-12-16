/* =====================================================================
   cadastro.js — Envio e salvamento de candidaturas (localStorage)
   Projeto: SCE – Banco de Talentos
   - Salva cada candidatura em localStorage com a chave "candidaturas"
   - Mantém vínculo com a vaga (se houver)
===================================================================== */

(function () {
    // ----- Elementos do DOM (IDs conforme seu HTML enviado) -----
    const form = document.getElementById("form-cadastro");
    const mensagem = document.getElementById("mensagem-retorno");
    const btnEnviar = form ? form.querySelector("button[type='submit']") : null;

    // Se o form não existir, evita erros silenciosos
    if (!form) {
        console.error("Formulário não encontrado: id='form-cadastro'");
        return;
    }

    // ----- Helpers de localStorage (segurança) -----
    function lerLocalStorage(chave) {
        try {
            const raw = localStorage.getItem(chave);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error("Erro ao ler localStorage:", e);
            return null;
        }
    }

    function gravarLocalStorage(chave, valor) {
        try {
            localStorage.setItem(chave, JSON.stringify(valor));
            return true;
        } catch (e) {
            console.error("Erro ao gravar no localStorage:", e);
            return false;
        }
    }

    // ----- Obter vaga vinculada (URL ?vaga=ID ou vagaSelecionada no localStorage) -----
    function obterParametro(nome) {
        return new URLSearchParams(window.location.search).get(nome);
    }

    function obterVagaVinculada() {
        // 1) Preferir ?vaga=ID (caso o fluxo use essa abordagem)
        const vagaId = obterParametro("vaga");
        if (vagaId) {
            const vagas = lerLocalStorage("vagas") || [];
            const encontrada = vagas.find(v => String(v.id) === String(vagaId));
            if (encontrada) return encontrada;
        }

        // 2) Fallback para vagaSelecionada (fluxo atual)
        const vagaSel = lerLocalStorage("vagaSelecionada");
        if (vagaSel) return vagaSel;

        return null;
    }

    // ----- Validação simples (baseada nos campos do HTML) -----
    function validarDados(d) {
        if (!d.nome) return "Informe seu nome completo.";
        if (!d.email || !d.email.includes("@")) return "Forneça um e-mail válido.";
        if (!d.telefone) return "Informe um telefone (WhatsApp ou fixo).";
        if (!d.cidade) return "Informe sua cidade.";
        if (!d.estado || d.estado.length > 2) return "Informe o estado (UF) corretamente.";
        if (!d.area) return "Selecione a área de interesse.";
        if (!d.linkCv) return "Cole o link do seu currículo (Drive, PDF etc.).";
        if (!d.lgpd) return "Você precisa autorizar o uso dos dados (LGPD).";
        return null;
    }

    // ----- Criar objeto de candidatura e salvar em localStorage -----
    function salvarCandidatura(dados) {
        const chave = "candidaturas";
        const atuais = lerLocalStorage(chave) || [];

        // id simples baseado em timestamp (único e fácil)
        const candidato = Object.assign({}, dados, {
            id: Date.now(),
            criadoEm: new Date().toISOString()
        });

        atuais.push(candidato);
        const ok = gravarLocalStorage(chave, atuais);
        return ok ? candidato : null;
    }

    // ----- Manipular mensagens visuais -----
    function mostrarMensagem(texto, tipo = "sucesso") {
        if (!mensagem) return;
        mensagem.textContent = texto;
        mensagem.className = `mensagem ${tipo === "sucesso" ? "sucesso" : "erro"}`;
        // rolar para a mensagem em telas pequenas
        mensagem.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // ----- Envio (simulação + persistência) -----
    async function enviar(dados) {
        // Simulação de envio remoto (aqui você pode trocar por fetch)
        return new Promise(resolve => {
            setTimeout(() => resolve({ ok: true }), 900);
        });
    }

    // ----- Handler do formulário -----
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Desabilita botão (protege contra cliques repetidos)
        if (btnEnviar) {
            btnEnviar.disabled = true;
            btnEnviar.textContent = "Enviando...";
        }

        // Limpar mensagens antigas
        if (mensagem) {
            mensagem.textContent = "";
            mensagem.className = "mensagem";
        }

        // Ler campos (IDs do seu HTML)
        const dados = {
            nome: (document.getElementById("nome")?.value || "").trim(),
            email: (document.getElementById("email")?.value || "").trim(),
            telefone: (document.getElementById("telefone")?.value || "").trim(),
            cidade: (document.getElementById("cidade")?.value || "").trim(),
            estado: (document.getElementById("estado")?.value || "").trim(),
            area: (document.getElementById("area")?.value || "").trim(),
            tipoVaga: (document.getElementById("tipo-vaga")?.value || "").trim(),
            linkCv: (document.getElementById("link-cv")?.value || "").trim(),
            lgpd: !!document.getElementById("lgpd")?.checked,
            // vinculo com a vaga (id + titulo quando possível)
            vaga: null
        };

        const vagaVinculada = obterVagaVinculada();
        if (vagaVinculada) {
            dados.vaga = {
                id: vagaVinculada.id || null,
                titulo: vagaVinculada.titulo || (vagaVinculada.nome || "Vaga")
            };
        }

        // Validação
        const erro = validarDados(dados);
        if (erro) {
            mostrarMensagem(erro, "erro");
            if (btnEnviar) {
                btnEnviar.disabled = false;
                btnEnviar.textContent = "Enviar Currículo";
            }
            return;
        }

        try {
            // 1) Simula envio remoto (opcional)
            const resposta = await enviar(dados);
            if (!resposta || !resposta.ok) {
                throw new Error("Falha no envio remoto");
            }

            // 2) Salva localmente como backup / histórico
            const salvo = salvarCandidatura(dados);
            if (!salvo) {
                throw new Error("Falha ao salvar localmente");
            }

            // 3) Feedback ao usuário
            mostrarMensagem("Currículo enviado com sucesso! Agradecemos sua candidatura.", "sucesso");

            // zera formulário
            form.reset();

        } catch (err) {
            console.error(err);
            mostrarMensagem("Erro ao enviar candidatura. Tente novamente mais tarde.", "erro");
        } finally {
            if (btnEnviar) {
                btnEnviar.disabled = false;
                btnEnviar.textContent = "Enviar Currículo";
            }
        }
    });

    // ----- Expor utilitário (opcional) para debug no console -----
    window.__SCE = window.__SCE || {};
    window.__SCE.obterCandidaturas = () => lerLocalStorage("candidaturas") || [];

})();
