(function () {

    const form = document.getElementById("form-cadastro");
    const mensagem = document.getElementById("mensagem-retorno");
    const btn = form.querySelector("button");

    const ler = chave => JSON.parse(localStorage.getItem(chave) || "[]");
    const gravar = (chave, valor) => localStorage.setItem(chave, JSON.stringify(valor));

    const vagaSelecionada = JSON.parse(localStorage.getItem("vagaSelecionada"));

    function validar(d) {
        if (!d.nome) return "Informe seu nome completo.";
        if (!d.email || !d.email.includes("@")) return "Informe um e-mail válido.";
        if (!d.telefone) return "Informe um telefone.";
        if (!d.cidade) return "Informe a cidade.";
        if (!d.estado || d.estado.length !== 2) return "Informe o estado corretamente.";
        if (!d.area) return "Selecione a área de interesse.";
        if (!d.experiencia) return "Selecione sua experiência.";
        if (!d.disponibilidade) return "Selecione a disponibilidade.";
        if (!d.especialidades) return "Informe suas especialidades.";
        if (!d.arquivos.length) return "Envie um currículo em PDF, DOC ou DOCX.";
        if (!d.lgpd) return "É necessário autorizar o uso dos dados.";
        return null;
    }

    function arquivosInfo(files) {
        return Array.from(files || []).map(f => ({
            nome: f.name,
            tipo: f.type,
            tamanho: f.size
        }));
    }

    function feedback(texto, tipo = "sucesso") {
        mensagem.textContent = texto;
        mensagem.className = `mensagem ${tipo}`;
        mensagem.scrollIntoView({ behavior: "smooth" });
    }

    form.addEventListener("submit", async e => {
        e.preventDefault();

        btn.disabled = true;
        btn.textContent = "Enviando...";

        const dados = {
            id: Date.now(),
            data: new Date().toLocaleString(),
            nome: nome.value.trim(),
            email: email.value.trim(),
            telefone: telefone.value.trim(),
            cidade: cidade.value.trim(),
            estado: estado.value.trim().toUpperCase(),
            area: area.value,
            tipoVaga: document.getElementById("tipo-vaga").value,
            experiencia: document.getElementById("experiencia").value,
            disponibilidade: document.getElementById("disponibilidade").value,
            especialidades: document.getElementById("especialidades").value.trim(),
            certificacoes: document.getElementById("certificacoes").value.trim(),
            linkedin: document.getElementById("linkedin").value.trim(),
            conhecimentos: document.getElementById("conhecimentos").value.trim(),
            arquivos: arquivosInfo(document.getElementById("curriculo-arquivo").files),
            lgpd: lgpd.checked,
            vaga: vagaSelecionada || null // 🔗 vínculo com a vaga
        };

        const erro = validar(dados);
        if (erro) {
            feedback(erro, "erro");
            btn.disabled = false;
            btn.textContent = "Enviar Currículo";
            return;
        }

        await new Promise(r => setTimeout(r, 800));

        // Banco geral de currículos
        const banco = ler("bancoTalentos");
        banco.push(dados);
        gravar("bancoTalentos", banco);

        // Banco de candidaturas (se houver vaga)
        if (vagaSelecionada) {
            const candidaturas = ler("candidaturas");
            candidaturas.push({
                id: Date.now(),
                vaga: vagaSelecionada,
                candidato: {
                    nome: dados.nome,
                    email: dados.email,
                    telefone: dados.telefone
                },
                data: new Date().toLocaleString()
            });
            gravar("candidaturas", candidaturas);

            // limpa a vaga após candidatura
            localStorage.removeItem("vagaSelecionada");
        }

        feedback(
            vagaSelecionada
                ? "Candidatura realizada com sucesso! Seu currículo foi enviado para esta vaga."
                : "Currículo cadastrado com sucesso! Caso seu perfil seja compatível, entraremos em contato.",
            "sucesso"
        );

        form.reset();
        btn.disabled = false;
        btn.textContent = "Enviar Currículo";
    });

})();
