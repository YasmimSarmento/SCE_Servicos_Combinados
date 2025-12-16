/* =====================================================================
   cadastro.js — Formulário de cadastro e upload de currículos
   Projeto: SCE – Banco de Talentos
   - Permite enviar arquivos ou links de currículo
   - Salva cada candidatura no localStorage
   - Exibe histórico de candidaturas com arquivos e links
===================================================================== */

(function () {

    // ----- Elementos do DOM -----
    const form = document.getElementById("form-cadastro");
    const mensagem = document.getElementById("mensagem-retorno");
    const btnEnviar = form?.querySelector("button[type='submit']");
    const listaCandidaturas = document.getElementById("lista-candidaturas");

    if (!form) {
        console.error("Formulário não encontrado: id='form-cadastro'");
        return;
    }

    // ----- Helpers LocalStorage -----
    const lerLocalStorage = (chave) => {
        try {
            const raw = localStorage.getItem(chave);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Erro ao ler localStorage:", e);
            return [];
        }
    };

    const gravarLocalStorage = (chave, valor) => {
        try {
            localStorage.setItem(chave, JSON.stringify(valor));
            return true;
        } catch (e) {
            console.error("Erro ao gravar no localStorage:", e);
            return false;
        }
    };

    // ----- Obter vaga vinculada -----
    function obterVagaVinculada() {
        const vagaSel = lerLocalStorage("vagaSelecionada");
        return vagaSel || null;
    }

    // ----- Validação -----
    function validarDados(d) {
        if (!d.nome) return "Informe seu nome completo.";
        if (!d.email || !d.email.includes("@")) return "Forneça um e-mail válido.";
        if (!d.telefone) return "Informe um telefone.";
        if (!d.cidade) return "Informe sua cidade.";
        if (!d.estado || d.estado.length > 2) return "Informe o estado (UF) corretamente.";
        if (!d.area) return "Selecione a área de interesse.";
        if ((!d.arquivos || d.arquivos.length === 0) && !d.linkCv) return "Envie um arquivo ou cole o link do currículo.";
        if (!d.lgpd) return "Você precisa autorizar o uso dos dados (LGPD).";
        return null;
    }

    // ----- Ler arquivos do input -----
    function lerArquivos(fileList) {
        if (!fileList || fileList.length === 0) return [];
        const arquivos = [];
        for (let i = 0; i < fileList.length; i++) {
            const f = fileList[i];
            arquivos.push({
                nome: f.name,
                tamanho: f.size,
                tipo: f.type
            });
        }
        return arquivos;
    }

    // ----- Salvar candidatura -----
    function salvarCandidatura(dados) {
        const chave = "candidaturas";
        const atuais = lerLocalStorage(chave);
        const candidato = {
            id: Date.now(),
            criadoEm: new Date().toLocaleString(),
            ...dados
        };
        atuais.push(candidato);
        gravarLocalStorage(chave, atuais);
        return candidato;
    }

    // ----- Mostrar mensagem -----
    function mostrarMensagem(texto, tipo = "sucesso") {
        if (!mensagem) return;
        mensagem.textContent = texto;
        mensagem.className = `mensagem ${tipo === "sucesso" ? "sucesso" : "erro"}`;
        mensagem.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // ----- Exibir histórico de candidaturas -----
    function renderizarHistorico() {
        if (!listaCandidaturas) return;
        const candidatos = lerLocalStorage("candidaturas");
        listaCandidaturas.innerHTML = "";

        candidatos.forEach(c => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${c.nome}</strong> (${c.area}) - ${c.criadoEm} <br>
                Vaga: ${c.vaga ? c.vaga.titulo : "Não vinculada"} <br>
                ${c.linkCv ? `<a href="${c.linkCv}" target="_blank">Link do Currículo</a><br>` : ""}
                ${c.arquivos && c.arquivos.length > 0 ? "Arquivos: " + c.arquivos.map(a => a.nome).join(", ") : ""}
            `;
            listaCandidaturas.appendChild(li);
        });
    }

    // ----- Handler de envio do formulário -----
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Desabilita botão
        if (btnEnviar) {
            btnEnviar.disabled = true;
            btnEnviar.textContent = "Enviando...";
        }

        // Limpa mensagens
        if (mensagem) mensagem.textContent = "";

        // Ler dados
        const dados = {
            nome: (document.getElementById("nome")?.value || "").trim(),
            email: (document.getElementById("email")?.value || "").trim(),
            telefone: (document.getElementById("telefone")?.value || "").trim(),
            cidade: (document.getElementById("cidade")?.value || "").trim(),
            estado: (document.getElementById("estado")?.value || "").trim(),
            area: (document.getElementById("area")?.value || "").trim(),
            tipoVaga: (document.getElementById("tipo-vaga")?.value || "").trim(),
            arquivos: lerArquivos(document.getElementById("curriculo-arquivo")?.files),
            linkCv: (document.getElementById("curriculo-link")?.value || "").trim(),
            lgpd: !!document.getElementById("lgpd")?.checked,
            vaga: obterVagaVinculada()
        };

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

        // Simulação de envio remoto
        try {
            await new Promise(resolve => setTimeout(resolve, 900));

            // Salvar localmente
            salvarCandidatura(dados);

            // Feedback
            mostrarMensagem("Currículo enviado com sucesso!", "sucesso");

            // Reset do formulário
            form.reset();

            // Atualizar histórico
            renderizarHistorico();

        } catch (err) {
            console.error(err);
            mostrarMensagem("Erro ao enviar candidatura.", "erro");
        } finally {
            if (btnEnviar) {
                btnEnviar.disabled = false;
                btnEnviar.textContent = "Enviar Currículo";
            }
        }
    });

    // ----- Inicializar histórico ao carregar a página -----
    renderizarHistorico();

})();
