(() => {
  /* =========================
     SESSÃO / PROTEÇÃO
  ========================= */
  function getSession() {
    try {
      return JSON.parse(localStorage.getItem("session"));
    } catch {
      return null;
    }
  }

  const session = getSession();
  if (!session) {
    window.location.href = "login-candidato.html";
    return;
  }

  if (session.role && session.role !== "candidato") {
    window.location.href = "index.html";
    return;
  }

  /* =========================
     HELPERS
  ========================= */
  const $ = (id) => document.getElementById(id);

  function getList(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      return [];
    }
  }

  function setList(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function setMsg(texto, tipo) {
    const box = $("msgPerfil");
    if (!box) return;
    box.textContent = texto || "";
    box.className = "msg-sucesso " + (tipo || "");
    if (texto) setTimeout(() => (box.textContent = ""), 3000);
  }

  /* =========================
     STICKY STATUS (SALVO / NÃO SALVO)
  ========================= */
  let dirty = false;

  function setStickyStatus(texto) {
    const el = $("stickyStatus");
    if (el) el.textContent = texto;
  }

  function markDirty() {
    if (dirty) return;
    dirty = true;
    setStickyStatus("Alterações não salvas.");
  }

  function markSaved() {
    dirty = false;
    setStickyStatus("Tudo salvo.");
  }

  /* =========================
     PERFIL BASE
  ========================= */
  function novoPerfilBase() {
    return {
      id: Date.now(),
      userId: session.id ?? null,
      nome: session.name || "",
      email: session.email || "",
      telefone: "",
      dataNascimento: "",
      documento: "",
      foto: "", // base64
      endereco: {
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: ""
      },
      areaInteresse: "",
      cargoDesejado: "",
      nivelExperiencia: "",
      habilidades: "",
      resumo: "",
      linkedin: "",
      documentos: [],
      arquivos: [] // compatível com cadastro.js
    };
  }

  function encontrarOuCriarPerfil() {
    const banco = getList("bancoTalentos");

    let idx = -1;

    // Prioridade 1: email
    if (session.email) {
      idx = banco.findIndex(
        (c) => (c?.email || "").toLowerCase() === session.email.toLowerCase()
      );
    }

    // Prioridade 2: userId
    if (idx < 0 && session.id != null) {
      idx = banco.findIndex((c) => c?.userId === session.id);
    }

    if (idx >= 0) return { banco, idx, perfil: banco[idx] };

    const perfil = novoPerfilBase();
    banco.push(perfil);
    setList("bancoTalentos", banco);
    return { banco, idx: banco.length - 1, perfil };
  }

  /* =========================
     PROGRESSO DO PERFIL
  ========================= */
  function calcularProgresso(perfil) {
    let pontos = 0;

    if (perfil.nome) pontos += 15;
    if (perfil.email) pontos += 10;
    if (perfil.telefone) pontos += 10;

    if (perfil.dataNascimento) pontos += 10;
    if (perfil.documento) pontos += 10;

    if (perfil.endereco?.cidade) pontos += 10;
    if (perfil.endereco?.estado) pontos += 5;
    if (perfil.endereco?.cep) pontos += 5;

    if (perfil.areaInteresse) pontos += 10;
    if (perfil.cargoDesejado) pontos += 5;
    if (perfil.nivelExperiencia) pontos += 5;
    if (perfil.habilidades) pontos += 5;
    if (perfil.resumo) pontos += 5;

    if (Array.isArray(perfil.arquivos) && perfil.arquivos.length) pontos += 5;

    if (pontos > 100) pontos = 100;
    return pontos;
  }

  function atualizarProgresso(perfil) {
    const pct = calcularProgresso(perfil);

    const bar = $("barraProgresso");
    const txt = $("percentualProgresso");

    if (bar) bar.style.width = pct + "%";
    if (txt) txt.textContent = pct + "%";
  }

  /* =========================
     UI (TOPO + FORM)
  ========================= */
  function atualizarTopo(perfil) {
    if ($("userNome")) $("userNome").textContent = perfil.nome || session.name || "Candidato";

    if ($("resumoMini")) {
      const a = perfil.areaInteresse || "Área";
      const c = perfil.cargoDesejado || "Cargo";
      $("resumoMini").textContent = `${a} • ${c}`;
    }

    const img = $("fotoUsuario");
    if (img) img.src = perfil.foto || "https://via.placeholder.com/80";
  }

  function preencherCampos(perfil) {
    if ($("userNomeCompleto")) $("userNomeCompleto").value = perfil.nome || "";
    if ($("userEmail")) $("userEmail").value = perfil.email || "";
    if ($("userTelefone")) $("userTelefone").value = perfil.telefone || "";
    if ($("userDataNascimento")) $("userDataNascimento").value = perfil.dataNascimento || "";
    if ($("userDocumento")) $("userDocumento").value = perfil.documento || "";

    if ($("userRua")) $("userRua").value = perfil.endereco?.rua || "";
    if ($("userNumero")) $("userNumero").value = perfil.endereco?.numero || "";
    if ($("userBairro")) $("userBairro").value = perfil.endereco?.bairro || "";
    if ($("userCidade")) $("userCidade").value = perfil.endereco?.cidade || "";
    if ($("userEstado")) $("userEstado").value = perfil.endereco?.estado || "";
    if ($("userCEP")) $("userCEP").value = perfil.endereco?.cep || "";

    if ($("areaInteresse")) $("areaInteresse").value = perfil.areaInteresse || "";
    if ($("cargoDesejado")) $("cargoDesejado").value = perfil.cargoDesejado || "";
    if ($("nivelExperiencia")) $("nivelExperiencia").value = perfil.nivelExperiencia || "";
    if ($("habilidades")) $("habilidades").value = perfil.habilidades || "";
    if ($("resumoProfissional")) $("resumoProfissional").value = perfil.resumo || "";

    atualizarTopo(perfil);
    atualizarProgresso(perfil);
  }

  function lerCampos(perfilAntigo) {
    const perfil = JSON.parse(JSON.stringify(perfilAntigo));

    perfil.nome = ($("userNomeCompleto")?.value || "").trim();
    perfil.email = ($("userEmail")?.value || "").trim();
    perfil.telefone = ($("userTelefone")?.value || "").trim();
    perfil.dataNascimento = $("userDataNascimento")?.value || "";
    perfil.documento = ($("userDocumento")?.value || "").trim();

    perfil.endereco = perfil.endereco || {};
    perfil.endereco.rua = ($("userRua")?.value || "").trim();
    perfil.endereco.numero = ($("userNumero")?.value || "").trim();
    perfil.endereco.bairro = ($("userBairro")?.value || "").trim();
    perfil.endereco.cidade = ($("userCidade")?.value || "").trim();
    perfil.endereco.estado = ($("userEstado")?.value || "").trim().toUpperCase();
    perfil.endereco.cep = ($("userCEP")?.value || "").trim();

    perfil.areaInteresse = ($("areaInteresse")?.value || "").trim();
    perfil.cargoDesejado = ($("cargoDesejado")?.value || "").trim();
    perfil.nivelExperiencia = $("nivelExperiencia")?.value || "";
    perfil.habilidades = ($("habilidades")?.value || "").trim();
    perfil.resumo = ($("resumoProfissional")?.value || "").trim();

    return perfil;
  }

  /* =========================
     SALVAR (FUNÇÃO ÚNICA - USADA PELOS 2 BOTÕES)
  ========================= */
  function salvarPerfil(ctx) {
    const atualizado = lerCampos(ctx.perfil);

    if (!atualizado.nome) {
      setMsg("Informe seu nome completo.", "error");
      return false;
    }
    if (!atualizado.email || !atualizado.email.includes("@")) {
      setMsg("Informe um e-mail válido.", "error");
      return false;
    }

    ctx.banco[ctx.idx] = atualizado;
    setList("bancoTalentos", ctx.banco);

    // Mantém a sessão coerente
    const novaSession = { ...session, name: atualizado.nome, email: atualizado.email };
    localStorage.setItem("session", JSON.stringify(novaSession));

    ctx.perfil = atualizado;
    preencherCampos(atualizado);

    setMsg("Perfil atualizado com sucesso!", "success");
    markSaved();
    return true;
  }

  function setupSalvar(ctx) {
    const btnForm = $("btnSalvar");
    const btnSticky = $("btnSalvarSticky");
    const btnTopo = $("btnTopo");

    if (btnForm) btnForm.addEventListener("click", () => salvarPerfil(ctx));
    if (btnSticky) btnSticky.addEventListener("click", () => salvarPerfil(ctx));

    if (btnTopo) {
      btnTopo.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // progresso + marcação "não salvo" em tempo real
    const ids = [
      "userNomeCompleto","userEmail","userTelefone","userDataNascimento","userDocumento",
      "userRua","userNumero","userBairro","userCidade","userEstado","userCEP",
      "areaInteresse","cargoDesejado","nivelExperiencia","habilidades","resumoProfissional"
    ];

    ids.forEach((id) => {
      const el = $(id);
      if (!el) return;

      const handle = () => {
        markDirty();
        const preview = lerCampos(ctx.perfil);
        atualizarTopo(preview);
        atualizarProgresso(preview);
      };

      el.addEventListener("input", handle);
      el.addEventListener("change", handle);
    });
  }

  /* =========================
     FOTO DE PERFIL (MENU)
  ========================= */
  function setupFoto(ctx) {
    const input = $("uploadFoto");
    const img = $("fotoUsuario");
    const menu = $("avatarMenu");
    const btnMenu = $("btnAvatarMenu");
    const btnUpload = $("btnUploadFoto");
    const btnRemover = $("btnRemoverFoto");

    if (!input || !img || !menu || !btnMenu || !btnUpload || !btnRemover) return;

    function abrirFecharMenu(force) {
      if (typeof force === "boolean") {
        menu.classList.toggle("open", force);
        return;
      }
      menu.classList.toggle("open");
    }

    btnMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      abrirFecharMenu();
    });

    img.addEventListener("click", (e) => {
      e.stopPropagation();
      abrirFecharMenu();
    });

    document.addEventListener("click", () => abrirFecharMenu(false));
    menu.addEventListener("click", (e) => e.stopPropagation());

    btnUpload.addEventListener("click", () => {
      abrirFecharMenu(false);
      input.click();
    });

    input.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setMsg("Envie uma imagem válida (JPG/PNG).", "error");
        input.value = "";
        return;
      }

      const max = 2 * 1024 * 1024; // 2MB
      if (file.size > max) {
        setMsg("Imagem muito grande. Use até 2MB.", "error");
        input.value = "";
        return;
      }

      markDirty();

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = String(reader.result || "");

        ctx.perfil.foto = base64;
        ctx.banco[ctx.idx] = ctx.perfil;
        setList("bancoTalentos", ctx.banco);

        img.src = base64;
        setMsg("Foto atualizada!", "success");
        input.value = "";
        markSaved();
      };

      reader.readAsDataURL(file);
    });

    btnRemover.addEventListener("click", () => {
      abrirFecharMenu(false);
      markDirty();

      ctx.perfil.foto = "";
      ctx.banco[ctx.idx] = ctx.perfil;
      setList("bancoTalentos", ctx.banco);

      img.src = "https://via.placeholder.com/80";
      setMsg("Foto removida.", "success");
      markSaved();
    });
  }

  /* =========================
     LOGOUT
  ========================= */
  function setupLogout() {
    const btn = $("btnLogout");
    if (!btn) return;

    btn.addEventListener("click", () => {
      localStorage.removeItem("session");
      localStorage.removeItem("auth");
      window.location.href = "index.html";
    });
  }

  /* =========================
     INIT
  ========================= */
  function init() {
    setupLogout();

    const ctx = encontrarOuCriarPerfil();
    preencherCampos(ctx.perfil);

    // estado inicial do sticky
    markSaved();

    setupSalvar(ctx);
    setupFoto(ctx);
  }

  init();
})();
