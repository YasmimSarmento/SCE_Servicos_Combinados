(() => {
  const $ = (id) => document.getElementById(id);

  const PERFIL_KEY = "perfil_candidato";

  function getPerfil() {
    try {
      return JSON.parse(localStorage.getItem(PERFIL_KEY)) || {};
    } catch {
      return {};
    }
  }

  function setPerfil(p) {
    localStorage.setItem(PERFIL_KEY, JSON.stringify(p));
  }

  function updateTopo(perfil) {
    const nomeTopo = $("userNome");
    const resumoMini = $("resumoMini");
    const chip = $("chipCompleto");

    if (nomeTopo) nomeTopo.textContent = perfil.nomeCompleto || "Candidato";
    if (resumoMini) resumoMini.textContent = `${perfil.area || "Área"} • ${perfil.cargo || "Cargo"}`;
    if (chip) chip.textContent = "Perfil";
  }

  function preencherCampos(perfil) {
    const map = {
      userNomeCompleto: "nomeCompleto",
      userEmail: "email",
      userTelefone: "telefone",
      userDataNascimento: "dataNascimento",
      userRua: "rua",
      userNumero: "numero",
      userBairro: "bairro",
      userCidade: "cidade",
      userEstado: "estado",
      userCep: "cep",
      userCargo: "cargo",
      userArea: "area",
      userEscolaridade: "escolaridade",
      userExperiencia: "experiencia",
    };

    Object.keys(map).forEach((id) => {
      const el = $(id);
      if (!el) return;
      const key = map[id];
      el.value = perfil[key] || "";
    });
  }

  function renderProgresso(perfil) {
    const campos = [
      perfil.nomeCompleto,
      perfil.email,
      perfil.telefone,
      perfil.dataNascimento,
      perfil.cidade,
      perfil.estado,
      perfil.cep,
      perfil.cargo,
      perfil.area,
      perfil.escolaridade,
      perfil.experiencia
    ];

    const total = campos.length;
    const filled = campos.filter(v => (v || "").toString().trim().length > 0).length;
    const pct = Math.round((filled / total) * 100);

    const barra = $("barraProgresso");
    const pctEl = $("percentualProgresso");
    if (barra) barra.style.width = `${pct}%`;
    if (pctEl) pctEl.textContent = `${pct}%`;
  }

  function setStatus(texto, tipo = "ok") {
    const s = $("statusSalvo");
    const dot = $("statusDot");
    if (s) s.textContent = texto || "";

    if (dot) {
      if (tipo === "warn") dot.style.background = "rgba(245,124,0,.95)";
      else if (tipo === "error") dot.style.background = "rgba(211,47,47,.95)";
      else dot.style.background = "rgba(46,125,50,.85)";
    }
  }

  function setSaveButtonSavedState(saved) {
    const btnSalvar = $("btnSalvar");
    if (!btnSalvar) return;

    if (saved) {
      btnSalvar.classList.add("btn-saved");
      btnSalvar.innerHTML = `<i class="fa-solid fa-check"></i> Salvo`;
    } else {
      btnSalvar.classList.remove("btn-saved");
      btnSalvar.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Salvar alterações`;
    }
  }

  function setEditingMode(isEditing) {
    const inputs = document.querySelectorAll(".input-pro");
    inputs.forEach((el) => {
      el.disabled = !isEditing;
    });

    const btnSalvar = $("btnSalvar");
    if (btnSalvar) btnSalvar.disabled = !isEditing;

    const btnEditar = $("btnEditar");
    if (btnEditar) {
      btnEditar.innerHTML = isEditing
        ? `<i class="fa-solid fa-pen"></i> Editando`
        : `<i class="fa-solid fa-pen"></i> Editar`;
    }

    if (!isEditing) {
      setSaveButtonSavedState(true);
      setStatus("Tudo salvo.", "ok");
    } else {
      setSaveButtonSavedState(false);
      setStatus("Em edição", "warn");
    }
  }

  /* ===== Foto ===== */
  function initFoto() {
    const btnMenu = $("btnAvatarMenu");
    const menu = $("avatarMenu");
    const btnUpload = $("btnUploadFoto");
    const btnRemover = $("btnRemoverFoto");
    const inputFoto = $("inputFoto");
    const img = $("fotoUsuario");

    if (!btnMenu || !menu) return;

    function openMenu() {
      menu.classList.add("open");
      menu.setAttribute("aria-hidden", "false");
    }
    function closeMenu() {
      menu.classList.remove("open");
      menu.setAttribute("aria-hidden", "true");
    }

    btnMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      if (menu.classList.contains("open")) closeMenu();
      else openMenu();
    });

    document.addEventListener("click", () => closeMenu());

    btnUpload?.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();
      inputFoto?.click();
    });

    inputFoto?.addEventListener("change", () => {
      const file = inputFoto.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const perfil = getPerfil();
        perfil.foto = String(reader.result || "");
        setPerfil(perfil);

        if (img) img.src = perfil.foto;
        setStatus("Foto atualizada.", "ok");
        setSaveButtonSavedState(true);
      };
      reader.readAsDataURL(file);
    });

    btnRemover?.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();

      const perfil = getPerfil();
      delete perfil.foto;
      setPerfil(perfil);

      if (img) img.src = "https://via.placeholder.com/80";
      setStatus("Foto removida.", "ok");
      setSaveButtonSavedState(true);
    });

    // carrega foto salva
    const perfil = getPerfil();
    if (perfil.foto && img) img.src = perfil.foto;
  }

  /* ===== Tabs + Accordion + Expand/Recolher ===== */
  function initTabsAccordion() {
    const tabs = Array.from(document.querySelectorAll(".perfil-tab"));
    const sections = Array.from(document.querySelectorAll(".perfil-section"));

    if (!tabs.length || !sections.length) return;

    function setCollapsed(sec, collapsed) {
      sec.setAttribute("data-collapsed", collapsed ? "true" : "false");
      const toggle = sec.querySelector(".section-toggle");
      if (toggle) toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }

    function showSection(target) {
      sections.forEach(sec => {
        const isTarget = sec.getAttribute("data-section") === target;
        sec.style.display = isTarget ? "" : "none";
      });

      tabs.forEach(t => {
        const on = t.dataset.target === target;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
    }

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        showSection(tab.dataset.target);
      });
    });

    // toggles do accordion
    sections.forEach(sec => {
      const toggle = sec.querySelector(".section-toggle");
      if (!toggle) return;

      toggle.addEventListener("click", () => {
        const collapsed = sec.getAttribute("data-collapsed") === "true";
        setCollapsed(sec, !collapsed);
      });
    });

    // expandir / recolher
    $("btnExpandirTudo")?.addEventListener("click", () => {
      sections.forEach(sec => setCollapsed(sec, false));
    });

    $("btnRecolherTudo")?.addEventListener("click", () => {
      sections.forEach(sec => setCollapsed(sec, true));
    });

    // inicia na primeira aba visível
    showSection(tabs.find(t => t.classList.contains("active"))?.dataset.target || "pessoais");
  }

  /* ===== Data digitável dd/mm/aaaa ===== */
  function initDateTyping() {
    const input = $("userDataNascimento");
    if (!input) return;

    input.addEventListener("input", () => {
      let v = input.value.replace(/\D/g, "").slice(0, 8);
      if (v.length >= 5) v = v.replace(/^(\d{2})(\d{2})(\d{1,4}).*/, "$1/$2/$3");
      else if (v.length >= 3) v = v.replace(/^(\d{2})(\d{1,2}).*/, "$1/$2");
      input.value = v;
    });
  }

  /* ===== Editar / Salvar ===== */
  function initEditarSalvar() {
    const btnEditar = $("btnEditar");
    const btnSalvar = $("btnSalvar");

    let editing = false;

    btnEditar?.addEventListener("click", () => {
      editing = !editing;
      setEditingMode(editing);
    });

    btnSalvar?.addEventListener("click", () => {
      const perfil = getPerfil();

      const map = {
        userNomeCompleto: "nomeCompleto",
        userEmail: "email",
        userTelefone: "telefone",
        userDataNascimento: "dataNascimento",
        userRua: "rua",
        userNumero: "numero",
        userBairro: "bairro",
        userCidade: "cidade",
        userEstado: "estado",
        userCep: "cep",
        userCargo: "cargo",
        userArea: "area",
        userEscolaridade: "escolaridade",
        userExperiencia: "experiencia",
      };

      Object.keys(map).forEach((id) => {
        const el = $(id);
        if (!el) return;
        perfil[map[id]] = (el.value || "").trim();
      });

      setPerfil(perfil);
      updateTopo(perfil);
      renderProgresso(perfil);

      editing = false;
      setEditingMode(false);
    });
  }

  function initLogout() {
    const logout = $("logout");
    logout?.addEventListener("click", () => {
      localStorage.removeItem("session");
    });
  }

  /* ===== BOOT ===== */
  const perfil = getPerfil();
  updateTopo(perfil);
  preencherCampos(perfil);
  renderProgresso(perfil);

  initFoto();
  initTabsAccordion();
  initDateTyping();
  initEditarSalvar();
  initLogout();

  setEditingMode(false);
  setStatus("Tudo salvo.", "ok");
})();
