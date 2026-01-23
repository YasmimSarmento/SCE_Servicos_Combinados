(function () {
  const form = document.getElementById("form-cadastro");
  const mensagem = document.getElementById("mensagem-retorno");
  if (!form) return;

  // Botão submit (seu HTML original usa .btn; versão nova usa #btnEnviarCurriculo)
  const btn =
    document.getElementById("btnEnviarCurriculo") ||
    form.querySelector('button[type="submit"]') ||
    form.querySelector("button");

  // Upload UI (seu HTML original: input simples; versão nova: upload-box com status)
  const curriculoEl = document.getElementById("curriculo-arquivo");
  const curriculoDrop = document.getElementById("curriculoDrop"); // opcional (HTML melhorado)
  const curriculoStatus = document.getElementById("curriculoStatus"); // opcional
  const curriculoNome = document.getElementById("curriculoNome"); // opcional
  const curriculoMeta = document.getElementById("curriculoMeta"); // opcional
  const btnRemoverCurriculo = document.getElementById("btnRemoverCurriculo"); // opcional

  // Box da vaga (HTML já tem)
  const vagaBox = document.getElementById("vagaSelecionadaBox");
  const vagaTituloEl = document.getElementById("cadastroVagaTitulo");
  const vagaAreaEl = document.getElementById("cadastroVagaArea");
  const vagaLocalEl = document.getElementById("cadastroVagaLocal");
  const vagaTipoEl = document.getElementById("cadastroVagaTipo");

  const ler = (chave) => JSON.parse(localStorage.getItem(chave) || "[]");
  const gravar = (chave, valor) => localStorage.setItem(chave, JSON.stringify(valor));

  // Vaga selecionada (vem do vagas/detalhe)
  const vagaSelecionada = JSON.parse(localStorage.getItem("vagaSelecionada") || "null");

  // =========================
  // Helpers UI
  // =========================
  function feedback(texto, tipo = "sucesso") {
    if (!mensagem) return;
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
    mensagem.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearFieldError(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  }

  function setFieldError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg || "";
  }

  function formatFileSize(bytes) {
    if (!bytes && bytes !== 0) return "";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
    const val = bytes / Math.pow(1024, i);
    return `${val.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
  }

  function getNiceFileType(file) {
    const t = (file.type || "").toLowerCase();
    if (t.includes("pdf")) return "PDF";
    if (t.includes("word") || t.includes("doc")) return "DOC";
    const ext = (file.name.split(".").pop() || "Arquivo").toUpperCase();
    return ext;
  }

  function setCurriculoUI(file) {
    if (!curriculoStatus || !curriculoNome || !curriculoMeta) return;
    curriculoNome.textContent = file.name;
    curriculoMeta.textContent = `${getNiceFileType(file)} • ${formatFileSize(file.size)}`;
    curriculoStatus.style.display = "flex";
    if (curriculoDrop) curriculoDrop.classList.add("has-file");
  }

  function clearCurriculoUI() {
    if (curriculoStatus) curriculoStatus.style.display = "none";
    if (curriculoNome) curriculoNome.textContent = "";
    if (curriculoMeta) curriculoMeta.textContent = "";
    if (curriculoDrop) curriculoDrop.classList.remove("has-file");
    if (curriculoEl) curriculoEl.value = "";
  }

  // =========================
  // Preencher box da vaga
  // =========================
  function renderVagaSelecionada() {
    if (!vagaBox) return;

    if (!vagaSelecionada) {
      vagaBox.style.display = "none";
      return;
    }

    vagaBox.style.display = "block";

    if (vagaTituloEl) vagaTituloEl.textContent = vagaSelecionada.titulo || "Vaga";
    if (vagaAreaEl) vagaAreaEl.textContent = vagaSelecionada.area || "-";
    if (vagaLocalEl) vagaLocalEl.textContent = vagaSelecionada.local || "-";
    if (vagaTipoEl) vagaTipoEl.textContent = vagaSelecionada.tipo || "-";
  }

  renderVagaSelecionada();

  // =========================
  // Máscaras/normalizações simples
  // =========================
  const estadoEl = document.getElementById("estado");
  if (estadoEl) {
    estadoEl.addEventListener("input", () => {
      estadoEl.value = String(estadoEl.value || "")
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 2)
        .toUpperCase();
      updateSubmitState();
    });
  }

  const telefoneEl = document.getElementById("telefone");
  if (telefoneEl) {
    telefoneEl.addEventListener("input", () => {
      // mantém só números, mas deixa o usuário digitar normal
      const digits = String(telefoneEl.value || "").replace(/\D/g, "").slice(0, 11);
      // máscara simples BR
      let out = digits;
      if (digits.length >= 2) out = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      if (digits.length >= 7) out = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
      telefoneEl.value = out;
      updateSubmitState();
    });
  }

  // =========================
  // Validação (campo a campo)
  // =========================
  function getSession() {
    try {
      return JSON.parse(localStorage.getItem("session") || "null");
    } catch {
      return null;
    }
  }

  function isValidEmail(email) {
    const v = String(email || "").trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function getDataFromForm() {
    const nomeEl = document.getElementById("nome");
    const emailEl = document.getElementById("email");
    const cidadeEl = document.getElementById("cidade");
    const areaEl = document.getElementById("area");
    const tipoVagaEl = document.getElementById("tipo-vaga");
    const experienciaEl = document.getElementById("experiencia");
    const disponibilidadeEl = document.getElementById("disponibilidade");
    const especialidadesEl = document.getElementById("especialidades");
    const certificacoesEl = document.getElementById("certificacoes");
    const linkedinEl = document.getElementById("linkedin");
    const conhecimentosEl = document.getElementById("conhecimentos");
    const lgpdEl = document.getElementById("lgpd");

    return {
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
      arquivos: Array.from(curriculoEl?.files || []),
      lgpd: !!lgpdEl?.checked,
    };
  }

  function validateAll(showErrors = false) {
    // limpa erros
    const errorIds = [
      "erro-nome",
      "erro-email",
      "erro-telefone",
      "erro-cidade",
      "erro-estado",
      "erro-area",
      "erro-experiencia",
      "erro-disponibilidade",
      "erro-especialidades",
      "erro-curriculo",
      "erro-lgpd",
    ];
    errorIds.forEach(clearFieldError);

    const d = getDataFromForm();
    let ok = true;

    if (!d.nome) {
      ok = false;
      if (showErrors) setFieldError("erro-nome", "Informe seu nome completo.");
    }

    if (!d.email || !isValidEmail(d.email)) {
      ok = false;
      if (showErrors) setFieldError("erro-email", "Informe um e-mail válido.");
    }

    if (!d.telefone || d.telefone.replace(/\D/g, "").length < 10) {
      ok = false;
      if (showErrors) setFieldError("erro-telefone", "Informe um telefone válido.");
    }

    if (!d.cidade) {
      ok = false;
      if (showErrors) setFieldError("erro-cidade", "Informe a cidade.");
    }

    if (!d.estado || d.estado.length !== 2) {
      ok = false;
      if (showErrors) setFieldError("erro-estado", "Informe o estado (UF) com 2 letras.");
    }

    if (!d.area) {
      ok = false;
      if (showErrors) setFieldError("erro-area", "Selecione a área de interesse.");
    }

    if (!d.experiencia) {
      ok = false;
      if (showErrors) setFieldError("erro-experiencia", "Selecione sua experiência.");
    }

    if (!d.disponibilidade) {
      ok = false;
      if (showErrors) setFieldError("erro-disponibilidade", "Selecione a disponibilidade.");
    }

    if (!d.especialidades) {
      ok = false;
      if (showErrors) setFieldError("erro-especialidades", "Informe suas competências principais.");
    }

    if (!d.arquivos.length) {
      ok = false;
      if (showErrors) setFieldError("erro-curriculo", "Anexe seu currículo (PDF/DOC/DOCX).");
    } else {
      // valida extensão
      const file = d.arquivos[0];
      const name = (file?.name || "").toLowerCase();
      const okExt = name.endsWith(".pdf") || name.endsWith(".doc") || name.endsWith(".docx");
      if (!okExt) {
        ok = false;
        if (showErrors) setFieldError("erro-curriculo", "Formato inválido. Use PDF, DOC ou DOCX.");
      }
      const max = 4 * 1024 * 1024;
      if (file.size > max) {
        ok = false;
        if (showErrors) setFieldError("erro-curriculo", "Arquivo muito grande. Use até 4MB.");
      }
    }

    if (!d.lgpd) {
      ok = false;
      if (showErrors) setFieldError("erro-lgpd", "Você precisa autorizar o uso dos seus dados.");
    }

    return ok;
  }

  // =========================
  // Controle do botão submit
  // =========================
  function updateSubmitState() {
    if (!btn) return;
    const ok = validateAll(false);
    btn.disabled = !ok;
    btn.classList.toggle("is-disabled", !ok);
  }

  // listeners para habilitar botão conforme preenche
  const watchIds = [
    "nome",
    "email",
    "telefone",
    "cidade",
    "estado",
    "area",
    "tipo-vaga",
    "experiencia",
    "disponibilidade",
    "especialidades",
    "certificacoes",
    "linkedin",
    "conhecimentos",
    "lgpd",
  ];

  watchIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const evt = el.type === "checkbox" ? "change" : "input";
    el.addEventListener(evt, updateSubmitState);
  });

  // =========================
  // Upload: input change + remover + drag&drop (se existir)
  // =========================
  if (curriculoEl) {
    curriculoEl.addEventListener("change", () => {
      const file = curriculoEl.files?.[0];
      if (file) {
        setCurriculoUI(file);
        setFieldError("erro-curriculo", "");
      } else {
        clearCurriculoUI();
      }
      updateSubmitState();
    });
  }

  if (btnRemoverCurriculo) {
    btnRemoverCurriculo.addEventListener("click", () => {
      clearCurriculoUI();
      updateSubmitState();
    });
  }

  if (curriculoDrop) {
    curriculoDrop.addEventListener("click", () => curriculoEl && curriculoEl.click());
    curriculoDrop.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        curriculoEl && curriculoEl.click();
      }
    });

    curriculoDrop.addEventListener("dragover", (e) => {
      e.preventDefault();
      curriculoDrop.classList.add("ativo");
    });

    curriculoDrop.addEventListener("dragleave", (e) => {
      e.preventDefault();
      curriculoDrop.classList.remove("ativo");
    });

    curriculoDrop.addEventListener("drop", (e) => {
      e.preventDefault();
      curriculoDrop.classList.remove("ativo");
      const file = e.dataTransfer?.files?.[0];
      if (file && curriculoEl) {
        curriculoEl.files = e.dataTransfer.files;
        setCurriculoUI(file);
        setFieldError("erro-curriculo", "");
      }
      updateSubmitState();
    });
  }

  // estado inicial
  updateSubmitState();

  // =========================
  // Submit
  // =========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Se existe vaga selecionada, exige login como candidato
    const session = getSession();
    if (vagaSelecionada && (!session || session.role !== "candidato")) {
      feedback("Faça login como candidato para concluir a candidatura.", "erro");
      return;
    }

    const ok = validateAll(true);
    if (!ok) {
      feedback("Revise os campos destacados e tente novamente.", "erro");
      updateSubmitState();
      return;
    }

    // UI enviar
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Enviando...";
    }

    const d = getDataFromForm();
    const arquivo = d.arquivos[0];

    const dados = {
      id: Date.now(),
      data: new Date().toLocaleString(),
      nome: d.nome,
      email: d.email,
      telefone: d.telefone,
      cidade: d.cidade,
      estado: d.estado,
      area: d.area,
      tipoVaga: d.tipoVaga,
      experiencia: d.experiencia,
      disponibilidade: d.disponibilidade,
      especialidades: d.especialidades,
      certificacoes: d.certificacoes,
      linkedin: d.linkedin,
      conhecimentos: d.conhecimentos,
      arquivos: [
        { nome: arquivo.name, tipo: arquivo.type, tamanho: arquivo.size }
      ],
      lgpd: d.lgpd,
      vaga: vagaSelecionada || null,
      createdAt: new Date().toISOString(),
    };

    // simula envio
    await new Promise((r) => setTimeout(r, 700));

    // Banco geral de currículos
    const banco = ler("bancoTalentos");
    banco.push(dados);
    gravar("bancoTalentos", banco);

    // Candidaturas (se houver vaga)
    if (vagaSelecionada) {
      const candidaturas = ler("candidaturas");

      candidaturas.push({
        id: Date.now(),
        userId: session?.id || null,
        emailSessao: session?.email || null,
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
      localStorage.removeItem("vagaSelecionada");
    }

    feedback(
      vagaSelecionada
        ? "Candidatura realizada com sucesso! Seu currículo foi enviado para esta vaga."
        : "Currículo cadastrado com sucesso! Caso seu perfil seja compatível, entraremos em contato.",
      "sucesso"
    );

    form.reset();
    clearCurriculoUI();
    updateSubmitState();

    if (btn) btn.textContent = "Enviar Currículo";

    // Se foi candidatura, manda pro painel
    if (vagaSelecionada) {
      setTimeout(() => {
        window.location.href = "painel-candidato.html";
      }, 1200);
    }
  });
})();
