(function () {
  const form = document.getElementById("form-cadastro");
  const mensagem = document.getElementById("mensagem-retorno");

  if (!form) return;

  const btn = form.querySelector("button");

  const ler = (chave) => JSON.parse(localStorage.getItem(chave) || "[]");
  const gravar = (chave, valor) => localStorage.setItem(chave, JSON.stringify(valor));

  // Vaga selecionada (vem do detalhe-vaga.js)
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
    return Array.from(files || []).map((f) => ({
      nome: f.name,
      tipo: f.type,
      tamanho: f.size,
    }));
  }

  function feedback(texto, tipo = "sucesso") {
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
    mensagem.scrollIntoView({ behavior: "smooth" });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    btn.disabled = true;
    btn.textContent = "Enviando...";

    // Lê sessão (pra amarrar candidatura ao candidato logado)
    const session = JSON.parse(localStorage.getItem("session") || "null");

    // Se está vindo de uma vaga, exige login como candidato
    if (vagaSelecionada && (!session || session.role !== "candidato")) {
      feedback("Faça login como candidato para concluir a candidatura.", "erro");
      btn.disabled = false;
      btn.textContent = "Enviar Currículo";
      return;
    }

    // Inputs (mais seguro do que depender de variáveis globais)
    const nomeEl = document.getElementById("nome");
    const emailEl = document.getElementById("email");
    const telefoneEl = document.getElementById("telefone");
    const cidadeEl = document.getElementById("cidade");
    const estadoEl = document.getElementById("estado");
    const areaEl = document.getElementById("area");
    const tipoVagaEl = document.getElementById("tipo-vaga");
    const experienciaEl = document.getElementById("experiencia");
    const disponibilidadeEl = document.getElementById("disponibilidade");
    const especialidadesEl = document.getElementById("especialidades");
    const certificacoesEl = document.getElementById("certificacoes");
    const linkedinEl = document.getElementById("linkedin");
    const conhecimentosEl = document.getElementById("conhecimentos");
    const curriculoEl = document.getElementById("curriculo-arquivo");
    const lgpdEl = document.getElementById("lgpd");

    const dados = {
      id: Date.now(),
      data: new Date().toLocaleString(),
      nome: (nomeEl?.value || "").trim(),
      email: (emailEl?.value || "").trim(),
      telefone: (telefoneEl?.value || "").trim(),
      cidade: (cidadeEl?.value || "").trim(),
      estado: (estadoEl?.value || "").trim().toUpperCase(),
      area: areaEl?.value || "",
      tipoVaga: tipoVagaEl?.value || "",
      experiencia: experienciaEl?.value || "",
      disponibilidade: disponibilidadeEl?.value || "",
      especialidades: (especialidadesEl?.value || "").trim(),
      certificacoes: (certificacoesEl?.value || "").trim(),
      linkedin: (linkedinEl?.value || "").trim(),
      conhecimentos: (conhecimentosEl?.value || "").trim(),
      arquivos: arquivosInfo(curriculoEl?.files),
      lgpd: !!lgpdEl?.checked,
      vaga: vagaSelecionada || null, // 🔗 vínculo com a vaga (se existir)
    };

    const erro = validar(dados);
    if (erro) {
      feedback(erro, "erro");
      btn.disabled = false;
      btn.textContent = "Enviar Currículo";
      return;
    }

    await new Promise((r) => setTimeout(r, 800));

    // Banco geral de currículos
    const banco = ler("bancoTalentos");
    banco.push(dados);
    gravar("bancoTalentos", banco);

    // Banco de candidaturas (se houver vaga)
    if (vagaSelecionada) {
      const candidaturas = ler("candidaturas");

      candidaturas.push({
        id: Date.now(),
        userId: session?.id || null,          // ✅ dono da candidatura (pra aparecer no painel)
        emailSessao: session?.email || null,  // ✅ fallback/compatibilidade
        vaga: vagaSelecionada,
        candidato: {
          nome: dados.nome,
          email: dados.email,
          telefone: dados.telefone,
        },
        status: "Em análise",
        data: new Date().toLocaleString(),
        createdAt: new Date().toISOString(),
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
    
    // Se foi candidatura para uma vaga, leva para o painel do candidato
if (vagaSelecionada) {
  setTimeout(() => {
    window.location.href = "painel-candidato.html";
  }, 1200); // pequeno delay pra pessoa ler a mensagem
}

  });
})();
