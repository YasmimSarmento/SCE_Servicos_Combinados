(function () {

    const form = document.getElementById("form-cadastro");
    const mensagem = document.getElementById("mensagem-retorno");
    const btn = form.querySelector("button");

    const ler = chave => JSON.parse(localStorage.getItem(chave) || "[]");
    const gravar = (chave, valor) => localStorage.setItem(chave, JSON.stringify(valor));

    function validar(d) {
        if (!d.nome) return "Informe seu nome completo.";
        if (!d.email || !d.email.includes("@")) return "Informe um e-mail válido.";
        if (!d.telefone) return "Informe um telefone.";
        if (!d.cidade) return "Informe a cidade.";
        if (!d.estado || d.estado.length !== 2) return "Informe o estado corretamente.";
        if (!d.area) return "Selecione a área de interesse.";
        if (!d.arquivos.length && !d.linkCv) return "Envie um currículo ou informe um link.";
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
            arquivos: arquivosInfo(curriculo-arquivo.files),
            linkCv: curriculo-link.value.trim(),
            lgpd: lgpd.checked
        };

        const erro = validar(dados);
        if (erro) {
            feedback(erro, "erro");
            btn.disabled = false;
            btn.textContent = "Enviar Currículo";
            return;
        }

        await new Promise(r => setTimeout(r, 800));

        const lista = ler("bancoTalentos");
        lista.push(dados);
        gravar("bancoTalentos", lista);

        feedback(
            "Currículo cadastrado com sucesso! Caso seu perfil seja compatível com alguma oportunidade, entraremos em contato.",
            "sucesso"
        );

        form.reset();
        btn.disabled = false;
        btn.textContent = "Enviar Currículo";
    });

})();